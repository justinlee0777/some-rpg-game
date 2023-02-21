import { Action, Engine, Puzzle } from 'rpg-game-engine';
import * as React from 'react';
import { createRoot, Root } from 'react-dom/client';

import { CommandMenu } from './command-menu';
import { KeydownInterceptor } from './keydown-interceptor';

export class UIInputCoordinator {
    private keydownInterceptor: KeydownInterceptor;

    private userInterfaceElement: Root;

    private loop = 0;

    constructor(private puzzle: Puzzle, private engine: Engine) {
        this.keydownInterceptor = new KeydownInterceptor();

        this.userInterfaceElement = createRoot(
            document.getElementById('user-interface')
        );
    }

    async listenForUserInput(): Promise<Array<Action>> {
        return new Promise((resolve) => {
            function onActionsDetermined(actions: Array<Action>): void {
                resolve(actions);
            }

            this.userInterfaceElement.render(
                <CommandMenu
                    key={++this.loop}
                    keydownInterceptor={this.keydownInterceptor}
                    engine={this.engine}
                    puzzle={this.puzzle}
                    endUserInputPhase={this.endUserInputPhase}
                    onActionsDetermined={onActionsDetermined}
                />
            );
        });
    }

    /**
     * @returns true if every player is mapped to an action.
     */
    private endUserInputPhase(puzzle: Puzzle, actions: Array<Action>): boolean {
        return puzzle.players.every((player) => {
            return actions.some((action) => action.source.includes(player));
        });
    }
}
