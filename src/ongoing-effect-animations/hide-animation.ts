import { OngoingEffectAnimation } from 'rpg-game-engine/ui';

import { CharacterType } from '../characters';
import { CharacterSpriteMapInstance } from '../character-sprite-map-impl';

export const hideAnimation: OngoingEffectAnimation = {
    applied: (source) => {
        return () => {
            const sprite = CharacterSpriteMapInstance.get(
                source.constructor as CharacterType
            );

            const element = sprite.avatar;
            element.classList.add('hidden');

            return new Promise((resolve) => {
                element.addEventListener(
                    'transitionend',
                    () => resolve(undefined),
                    {
                        once: true,
                    }
                );
            });
        };
    },
    removed: (source) => {
        return () => {
            const sprite = CharacterSpriteMapInstance.get(
                source.constructor as CharacterType
            );

            const element = sprite.avatar;
            element.classList.remove('hidden');

            return new Promise((resolve) => {
                element.addEventListener(
                    'transitionend',
                    () => resolve(undefined),
                    {
                        once: true,
                    }
                );
            });
        };
    },
};
