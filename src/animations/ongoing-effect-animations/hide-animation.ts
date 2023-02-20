import { OngoingEffectAnimation } from './ongoing-effect-animation.interface';

export const hideAnimation: OngoingEffectAnimation = {
    applied: (element) => {
        return () => {
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
    removed: (element) => {
        return () => {
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
