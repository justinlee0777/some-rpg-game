import { OngoingEffectType } from 'rpg-game-engine';
import { hideAnimation } from './ongoing-effect-animations';

import { OngoingEffectAnimation } from './ongoing-effect-animations/ongoing-effect-animation.interface';

export namespace Animations {
    export function get(
        ongoingEffectType: OngoingEffectType
    ): OngoingEffectAnimation {
        switch (ongoingEffectType) {
            case OngoingEffectType.HIDE:
                return hideAnimation;
        }
    }
}
