import { Action, Character, Puzzle } from 'rpg-game-engine';

import { createTarget } from './target';
import { CommandDescriptionFactory } from '../commands/command-description-factory';
import { createCommandMenu } from './command-menu';
import { getCharacterSprite } from '../sprites/character-sprite';

type ChosenAction = Omit<Action, 'targets'>;

interface InputContext {
    players: Array<Character> | null;
    chosenAction: ChosenAction | null;
}

export class UIInputCoordinator {
    private commandDescriptionFactory: CommandDescriptionFactory;

    private userInterfaceElement: HTMLElement;

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
        while (!this.endUserInputPhase()) {
            await this.getInput();
        }

        return Promise.resolve(this.actions);
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
            return this.pickTarget(this.puzzle.players).then((players) => {
                this.context.players = players;
                return undefined;
            });
        } else if (!this.context.chosenAction) {
            return this.pickAction().then((chosenAction) => {
                this.context.chosenAction = chosenAction;
                return undefined;
            });
        } else {
            return this.pickTarget(this.puzzle.enemies.characters).then(
                (targets) => {
                    this.actions.push({
                        ...this.context.chosenAction,
                        targets,
                    });
                    return undefined;
                }
            );
        }
    }

    private pickTarget(players: Array<Character>): Promise<Array<Character>> {
        return new Promise((resolve) => {
            let index = 0;
            let currentCharacter: HTMLElement, currentTarget: HTMLElement;

            const updateTarget = () => {
                if (currentTarget) {
                    currentCharacter.removeChild(currentTarget);
                }

                currentCharacter = getCharacterSprite(players[index]);
                currentTarget = createTarget();
                currentCharacter.appendChild(currentTarget);
            };

            const endIndex = players.length - 1;

            const listenToKeyboardEvents = (event: KeyboardEvent) => {
                switch (event.code) {
                    case 'ArrowLeft':
                        index = index <= 0 ? endIndex : index - 1;
                        updateTarget();
                        break;
                    case 'ArrowRight':
                        index = index >= endIndex ? 0 : index + 1;
                        updateTarget();
                        break;
                    case 'Enter':
                        document.removeEventListener(
                            'keydown',
                            listenToKeyboardEvents
                        );
                        currentTarget.classList.add('locked');
                        resolve([players[index]]);
                        break;
                }
            };

            updateTarget();
            document.addEventListener('keydown', listenToKeyboardEvents);
        });
    }

    private pickAction(): Promise<ChosenAction> {
        return new Promise((resolve) => {
            const [player] = this.context.players;
            const commands = player.commands.map((command) =>
                this.commandDescriptionFactory.get(command)
            );
            const commandMenu = createCommandMenu(commands);

            const selectedButtonClass = 'selected';
            let index = 0;
            let currentAction: HTMLElement;

            const updateAction = () => {
                if (currentAction) {
                    currentAction.classList.remove(selectedButtonClass);
                }

                currentAction = document.getElementById(commands[index].htmlId);
                currentAction.classList.add(selectedButtonClass);
            };

            const endIndex = commands.length - 1;

            const listenToKeyboardEvents = (event: KeyboardEvent) => {
                switch (event.code) {
                    case 'ArrowLeft':
                    case 'ArrowUp':
                        index = index <= 0 ? endIndex : index - 1;
                        updateAction();
                        break;
                    case 'ArrowRight':
                    case 'ArrowDown':
                        index = index >= endIndex ? 0 : index + 1;
                        updateAction();
                        break;
                    case 'Enter':
                        document.removeEventListener(
                            'keydown',
                            listenToKeyboardEvents
                        );
                        resolve({
                            command: player.commands[index],
                            source: [player],
                        });
                        break;
                }
            };

            this.userInterfaceElement.appendChild(commandMenu);
            updateAction();
            document.addEventListener('keydown', listenToKeyboardEvents);
        });
    }
}
