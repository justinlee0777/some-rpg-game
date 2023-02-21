import { AI, Action, Puzzle, Command, Character } from 'rpg-game-engine';

import { Charge as ChargeSkill, ChargeBurst } from '../commands/skills';
import { Charge, Guard } from '../characters';
import { ChargeEffect, OngoingEffectType } from '../ongoing-effects';

/**
 * Test AI.
 */
export class TestAI implements AI {
    characters = [new Charge(), new Guard()];

    getActions(puzzle: Puzzle): Array<Action> {
        let command: Command;
        let targets: Array<Character>;

        const charged = this.characters[0].current.ongoingEffects?.find(
            (effect) => effect.type === OngoingEffectType.CHARGE
        ) as ChargeEffect;

        if (charged?.damageMultipler > 5) {
            command = new ChargeBurst();
            targets = [puzzle.players[0]];
        } else {
            command = new ChargeSkill();
            targets = [this.characters[0]];
        }

        return [
            {
                command,
                source: [this.characters[0]],
                targets,
            },
        ];
    }
}
