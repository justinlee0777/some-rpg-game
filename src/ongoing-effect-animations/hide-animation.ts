import { CharacterType } from 'rpg-game-engine';
import { OngoingEffectAnimation } from 'packages/engine/ui/animations/ongoing-effect-animation.interface';

import { CharacterSpriteMapInstance } from '../character-sprite-map-impl';

export const hideAnimation: OngoingEffectAnimation = {
    applied: (source) => {
        return () => {
            const sprite = CharacterSpriteMapInstance.get(
                source.constructor as CharacterType
            );

            const element = sprite.avatar.current;
            element.classList.add('hidden');

            return new Promise((resolve) => {
                element.addEventListener('transitionend', () => resolve(), {
                    once: true,
                });
            });
        };
    },
    removed: (source) => {
        return () => {
            const sprite = CharacterSpriteMapInstance.get(
                source.constructor as CharacterType
            );

            const element = sprite.avatar.current;
            element.classList.remove('hidden');

            return new Promise((resolve) => {
                element.addEventListener('transitionend', () => resolve(), {
                    once: true,
                });
            });
        };
    },
};
