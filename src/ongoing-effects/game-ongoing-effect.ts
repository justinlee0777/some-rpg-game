import { OngoingEffect } from 'rpg-game-engine';

import { OngoingEffectAnimation } from '../animations/ongoing-effect-animations/ongoing-effect-animation.interface';

export interface GameOngoingEffect extends OngoingEffect {
    ui: {
        animation: OngoingEffectAnimation;
    };
}
