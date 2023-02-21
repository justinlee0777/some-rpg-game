import { OngoingEffectTriggerType } from 'rpg-game-engine';

import { burningAnimation } from '../animations';
import { GameOngoingEffect } from './game-ongoing-effect';
import { OngoingEffectType } from './ongoing-effect-type';

export class BurningEffect implements GameOngoingEffect {
    type = OngoingEffectType.BURN;
    turnDuration = 3;
    trigger: {
        type: OngoingEffectTriggerType.IMMEDIATE;
    };

    ui = {
        animation: burningAnimation,
    };

    causeDamage = {
        endOfTurn: () => 5,
    };

    apply(): BurningEffect {
        return new BurningEffect();
    }
}
