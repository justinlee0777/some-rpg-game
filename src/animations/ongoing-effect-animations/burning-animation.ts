import { OngoingEffectAnimation } from './ongoing-effect-animation.interface';

export const burningAnimation: OngoingEffectAnimation = {
    applied: (element) => {
        return () => {
            return element
                .animate([{ filter: 'brightness(2)' }, { filter: 'none' }], 333)
                .finished.then();
        };
    },
    removed: (element) => {
        return () => {
            return Promise.resolve();
        };
    },
};
