import { Action, Character } from 'rpg-game-engine';

import { CharacterType } from '../characters';
import { CharacterSpriteMap } from '../character-sprite-map';
import { createTarget } from './target';
import { Sprite } from '../sprites/sprite';
import { CommandDescriptionFactory } from 'commands/command-description-factory';
import { createCommandMenu } from './command-menu';

type ChosenAction = Omit<Action, 'targets'>;

interface InputContext {
    players: Array<Character> | null;
    chosenAction: ChosenAction | null;
}

export class UIInputCoordinator {
    private userInterfaceElement: HTMLElement;

    private context: InputContext = {
        players: null,
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
            await this.getInput(players, enemies, actions);
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
        enemies: Array<Character>,
        actions: Array<Action>
    ): Promise<void> {
        if (!this.context.players) {
            return this.pickTarget(players).then((players) => {
                this.context.players = players;
                return undefined;
            });
        } else if (!this.context.chosenAction) {
            return this.pickAction().then((chosenAction) => {
                this.context.chosenAction = chosenAction;
                return undefined;
            });
        } else {
            return this.pickTarget(enemies).then((targets) => {
                actions.push({
                    ...this.context.chosenAction,
                    targets,
                });
                return undefined;
            });
        }
    }

    private pickTarget(players: Array<Character>): Promise<Array<Character>> {
        return new Promise((resolve) => {
            let index = 0;
            let currentCharacter: Sprite, currentTarget: HTMLElement;

            const updateTarget = () => {
                if (currentTarget) {
                    currentCharacter.htmlElement.removeChild(currentTarget);
                }

                const player = this.characterSpriteMap.get(
                    players[index].constructor as CharacterType
                );

                currentCharacter = player;
                currentTarget = createTarget();
                currentCharacter.htmlElement.appendChild(currentTarget);
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
                        resolve([currentCharacter.character]);
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
