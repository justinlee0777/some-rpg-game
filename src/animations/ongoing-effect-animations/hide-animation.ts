import { getCharacterSpriteAvatar } from '../../sprites/character-sprite';
import { OngoingEffectAnimation } from './ongoing-effect-animation.interface';

export const hideAnimation: OngoingEffectAnimation = {
    applied: (character) => {
        return () => {
            const element = getCharacterSpriteAvatar(character);
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
    removed: (character) => {
        return () => {
            const element = getCharacterSpriteAvatar(character);
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
