import { OngoingEffectAnimation } from './ongoing-effect-animation.interface';

export const burningAnimation: OngoingEffectAnimation = {
    applied: (element) => {
        return () => {
            const burning = document.createElement('div');
            burning.classList.add('burning');
            element.parentElement.appendChild(burning);

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
