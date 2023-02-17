import { Action, Character } from 'rpg-game-engine';

import { UIImpl } from '../ui-impl';

/**
 * Function that listens for user's input and determines actions out of them.
 */
export interface ListenForUserInput {
    /**
     * @param players the user controls in a game
     * @param enemies the user is battling in a game
     */
    (
        players: Array<Character>,
        enemies: Array<Character>,
        uiImpl: UIImpl
    ): Promise<Array<Action>>;
}
