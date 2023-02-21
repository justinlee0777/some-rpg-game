import { Character, Priority } from 'rpg-game-engine';

import { ChargeEffect, OngoingEffectType } from '../../ongoing-effects';
import { chargeBurstAnimation } from '../../animations/skill-animations';
import { GameCommand } from '../game-command';
import { SkillType } from './types';

export class ChargeBurst implements GameCommand {
    stamina = 2;

    priority = Priority.EAGER;

    type = SkillType.CHARGE;

    ui = {
        displayName: 'Charge Burst',
        description:
            'A fairly weak attack that increases in damage dramatically with stacks of Charge.',
        animation: chargeBurstAnimation,
    };

    damage(source: Array<Character>): number {
        // For now, supporting only one character...
        let chargeEffect: ChargeEffect;

        for (const character of source) {
            if (chargeEffect) {
                break;
            }

            const effects = character.current.ongoingEffects ?? [];

            for (const effect of effects) {
                if (effect.type === OngoingEffectType.CHARGE) {
                    chargeEffect = effect as ChargeEffect;
                    break;
                }
            }
        }

        const multiplier = chargeEffect?.damageMultipler ?? 1;

        return Math.floor(3 * multiplier);
    }
}
