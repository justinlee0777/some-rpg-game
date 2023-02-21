import { Character, OngoingEffectTriggerType } from 'rpg-game-engine';

import { burningAnimation } from '../animations';
import { GameOngoingEffect } from './game-ongoing-effect';
import { OngoingEffectType } from './ongoing-effect-type';

export class BurningEffect implements GameOngoingEffect {
    type = OngoingEffectType.BURN;
    turnDuration = 2;
    trigger: {
        type: OngoingEffectTriggerType.IMMEDIATE;
    };

    ui = {
        animation: burningAnimation,
    };

    damage = 5;

    causeDamage = {
        endOfTurn: () => this.damage,
    };

    apply(character: Character): BurningEffect {
        const currentlyBurning = character.current.ongoingEffects?.find(
            (effect) => effect.type === OngoingEffectType.BURN
        ) as BurningEffect;

        const burningEffect = new BurningEffect();

        if (currentlyBurning) {
            burningEffect.damage = currentlyBurning.damage + 3;
        }

        return burningEffect;
    }
}
