import { Action, Character } from 'rpg-game-engine';

/**
 * Function that listens for user's input and determines actions out of them.
 */
export interface ListenForUserInput {
    /**
     * @param players the user controls in a game
     * @param enemies the user is battling in a game
     */
    (players: Array<Character>, enemies: Array<Character>): Promise<
        Array<Action>
    >;
}
