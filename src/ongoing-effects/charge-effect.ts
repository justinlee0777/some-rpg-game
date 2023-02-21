import { Character, OngoingEffectTriggerType } from 'rpg-game-engine';

import { chargingAnimation } from '../animations/ongoing-effect-animations';
import { GameOngoingEffect } from './game-ongoing-effect';
import { OngoingEffectType } from './ongoing-effect-type';

export class ChargeEffect implements GameOngoingEffect {
    type = OngoingEffectType.CHARGE;
    turnDuration = 2;
    trigger: {
        type: OngoingEffectTriggerType.IMMEDIATE;
    };

    ui = {
        animation: chargingAnimation,
    };

    damageMultipler = 2.5;

    apply(character: Character): ChargeEffect {
        const currentlyCharging = character.current.ongoingEffects?.find(
            (effect) => effect.type === OngoingEffectType.CHARGE
        ) as ChargeEffect;

        const chargeEffect = new ChargeEffect();

        if (currentlyCharging) {
            chargeEffect.damageMultipler =
                currentlyCharging.damageMultipler * 2.5;
        }

        return chargeEffect;
    }
}
