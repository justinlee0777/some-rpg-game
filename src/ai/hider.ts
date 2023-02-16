import { AI, Action, Puzzle } from 'rpg-game-engine';

import { Attack } from '../skills';
import { Test } from '../characters/test';

/**
 * Test AI.
 */
export class HiderAI implements AI {
    characters = [new Test()];

    getActions(puzzle: Puzzle): Array<Action> {
        return [
            {
                command: new Attack(),
                source: this.characters,
                targets: [puzzle.players[0]],
            },
        ];
    }
}
