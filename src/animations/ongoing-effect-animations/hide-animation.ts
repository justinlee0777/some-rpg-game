import { getCharacterSpriteAvatar } from '../../sprites/character-sprite';
import { OngoingEffectAnimation } from './ongoing-effect-animation.interface';

export const hideAnimation: OngoingEffectAnimation = {
    applied: (source) => {
        return () => {
            const element = getCharacterSpriteAvatar(source);
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
            const element = getCharacterSpriteAvatar(source);
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
