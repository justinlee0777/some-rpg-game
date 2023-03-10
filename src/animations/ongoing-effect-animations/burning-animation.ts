import { getCharacterSpriteOngoingEffects } from '../../sprites/character-sprite';
import { OngoingEffectAnimation } from './ongoing-effect-animation.interface';

export const burningAnimation: OngoingEffectAnimation = {
    applied: (character) => {
        return () => {
            const element = getCharacterSpriteOngoingEffects(character);

            const burning = document.createElement('div');
            burning.classList.add('burning');
            element.appendChild(burning);

            return element
                .animate([{ filter: 'brightness(2)' }, { filter: 'none' }], 333)
                .finished.then();
        };
    },
    removed: (character) => {
        return () => {
            const element = getCharacterSpriteOngoingEffects(character);

            const burningIcon = element.querySelector('.burning');
            element.removeChild(burningIcon);
            return Promise.resolve();
        };
    },
};
