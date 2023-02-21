import { OngoingEffect, OngoingEffectTriggerType } from 'rpg-game-engine';

import { hideAnimation } from '../animations';
import { GameOngoingEffect } from './game-ongoing-effect';
import { OngoingEffectType } from './ongoing-effect-type';

export class HidingEffect implements GameOngoingEffect {
    type = OngoingEffectType.HIDE;
    turnDuration = 1;
    trigger: {
        type: OngoingEffectTriggerType.IMMEDIATE;
    };

    ui = {
        animation: hideAnimation,
    };

    changeDamage(): number {
        return 0;
    }

    apply(): OngoingEffect {
        return new HidingEffect();
    }
}
