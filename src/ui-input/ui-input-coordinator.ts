import { Action, Character } from 'rpg-game-engine';

import { CharacterType } from '../characters';
import { CharacterSpriteMap } from '../character-sprite-map';
import { createTarget } from './target';
import { Sprite } from '../sprites/sprite';
import { CommandDescriptionFactory } from 'commands/command-description-factory';
import { createCommandMenu } from './command-menu';

type ChosenAction = Omit<Action, 'targets'>;

interface InputContext {
    player: Character | null;
    chosenAction: ChosenAction | null;
}

export class UIInputCoordinator {
    private userInterfaceElement: HTMLElement;

    private context: InputContext = {
        player: null,
        chosenAction: null,
    };

    constructor(
        private characterSpriteMap: CharacterSpriteMap,
        private commandDescriptionFactory: CommandDescriptionFactory
    ) {
        this.userInterfaceElement = document.getElementById('user-interface');
    }

    async listenForUserInput(
        players: Array<Character>,
        enemies: Array<Character>
    ): Promise<Array<Action>> {
        const actions = [];

        while (!this.endUserInputPhase(players, actions)) {
            await this.getInput(players, enemies);
        }

        return Promise.resolve(actions);
    }

    /**
     * @returns true if every player is mapped to an action.
     */
    private endUserInputPhase(
        players: Array<Character>,
        actions: Array<Action>
    ): boolean {
        return players.every((player) => {
            return actions.some((action) => action.source.includes(player));
        });
    }

    private getInput(
        players: Array<Character>,
        enemies: Array<Character>
    ): Promise<void> {
        if (!this.context.player) {
            return this.pickPlayer(players).then((player) => {
                this.context.player = player;
                return undefined;
            });
        } else if (!this.context.chosenAction) {
            return this.pickAction().then((chosenAction) => {
                this.context.chosenAction = chosenAction;
                return undefined;
            });
        }
    }

    private pickPlayer(players: Array<Character>): Promise<Character> {
        return new Promise((resolve) => {
            let index = 0;
            let currentPlayer: Sprite, currentTarget: HTMLElement;

            const updateTarget = () => {
                if (currentTarget) {
                    currentPlayer.htmlElement.removeChild(currentTarget);
                }

                const player = this.characterSpriteMap.get(
                    players[index].constructor as CharacterType
                );

                currentPlayer = player;
                currentTarget = createTarget();
                currentPlayer.htmlElement.appendChild(currentTarget);
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
                        resolve(currentPlayer.character);
                        break;
                }
            };

            updateTarget();
            document.addEventListener('keydown', listenToKeyboardEvents);
        });
    }

    private pickAction(): Promise<ChosenAction> {
        return new Promise((resolve) => {
            const commands = this.context.player.commands.map((command) =>
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

                currentAction = commandMenu.querySelector(
                    `.${commands[index].htmlId}`
                );
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
                            command: this.context.player.commands[index],
                            source: [this.context.player],
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
