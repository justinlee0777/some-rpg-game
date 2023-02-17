import { CharacterType } from '../characters';
import { OngoingEffectAnimation } from './ongoing-effect-animation.interface';

export const hideAnimation: OngoingEffectAnimation = {
    applied: (source, characterSpriteMap) => {
        return () => {
            const sprite = characterSpriteMap.get(
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
    removed: (source, characterSpriteMap) => {
        return () => {
            const sprite = characterSpriteMap.get(
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
