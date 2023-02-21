import { AI, Action, Puzzle } from 'rpg-game-engine';

import { Attack } from '../commands/skills';
import { Charge, Guard } from '../characters';

/**
 * Test AI.
 */
export class HiderAI implements AI {
    characters = [new Charge(), new Guard()];

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
