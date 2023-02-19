import { Action, Character, Puzzle } from 'rpg-game-engine';

import {
    CommandDescription,
    CommandDescriptionFactory,
} from '../commands/command-description-factory';
import {
    createCommandMenu,
    createCommandMenuPlayerRoulette,
    createCommandMenuRoulette,
    createCommandMenuTargetRoulette,
    getCommandMenuPlayerRouletteId,
    getCommandMenuTargetRouletteId,
    resetCommandMenu,
    setUpCommandMenuListeners,
} from './command-menu';
import { getCharacterSprite } from '../sprites/character-sprite';

type ChosenAction = Omit<Action, 'targets'>;

interface InputContext {
    players: Array<Character> | null;
    chosenAction: ChosenAction | null;
}

export class UIInputCoordinator {
    private commandDescriptionFactory: CommandDescriptionFactory;

    private userInterfaceElement: HTMLElement;

    private commandMenuElement: HTMLElement;

    private context: InputContext = {
        players: null,
        chosenAction: null,
    };

    private actions: Array<Action> = [];

    constructor(private puzzle: Puzzle) {
        this.commandDescriptionFactory = new CommandDescriptionFactory();

        this.userInterfaceElement = document.getElementById('user-interface');
    }

    async listenForUserInput(): Promise<Array<Action>> {
        this.commandMenuElement = createCommandMenu();
        this.userInterfaceElement.appendChild(this.commandMenuElement);

        while (!this.endUserInputPhase()) {
            await this.getInput();
        }

        this.userInterfaceElement.removeChild(this.commandMenuElement);

        const actions = this.actions;
        this.actions = [];
        return Promise.resolve(actions);
    }

    /**
     * @returns true if every player is mapped to an action.
     */
    private endUserInputPhase(): boolean {
        return this.puzzle.players.every((player) => {
            return this.actions.some((action) =>
                action.source.includes(player)
            );
        });
    }

    private getInput(): Promise<void> {
        if (!this.context.players) {
            return this.pickSource(this.puzzle.players).then((players) => {
                this.context.players = players;
                return undefined;
            });
        } else if (!this.context.chosenAction) {
            return this.pickAction().then((command) => {
                this.context.chosenAction = {
                    source: this.context.players,
                    command,
                };
                return undefined;
            });
        } else {
            return this.pickTarget([
                ...this.puzzle.players,
                ...this.puzzle.enemies.characters,
            ]).then((target) => {
                this.actions.push({
                    ...this.context.chosenAction,
                    targets: [target],
                });
                this.context = {
                    players: null,
                    chosenAction: null,
                };
                resetCommandMenu();
                return undefined;
            });
        }
    }

    private pickSource(players: Array<Character>): Promise<Array<Character>> {
        createCommandMenuPlayerRoulette(players);

        return setUpCommandMenuListeners(
            players,
            getCommandMenuPlayerRouletteId
        ).then((player) => [player]);
    }

    private pickTarget(characters: Array<Character>): Promise<Character> {
        createCommandMenuTargetRoulette(characters);

        return setUpCommandMenuListeners(
            characters,
            getCommandMenuTargetRouletteId
        );
    }

    private pickAction(): Promise<CommandDescription> {
        const [player] = this.context.players;
        const commands = player.commands.map((command) =>
            this.commandDescriptionFactory.get(command)
        );

        createCommandMenuRoulette(commands);

        return setUpCommandMenuListeners(commands, (command) => command.htmlId);
    }
}
