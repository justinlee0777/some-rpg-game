import { getCharacterSpriteOngoingEffects } from '../../sprites/character-sprite';
import { OngoingEffectAnimation } from './ongoing-effect-animation.interface';

export const chargingAnimation: OngoingEffectAnimation = {
    applied: (character) => {
        return () => {
            const element = getCharacterSpriteOngoingEffects(character);

            const charging = document.createElement('div');
            charging.classList.add('charging');
            element.appendChild(charging);

            return Promise.resolve();
        };
    },
    removed: (character) => {
        return () => {
            const element = getCharacterSpriteOngoingEffects(character);
            const charging = element.querySelector('.charging');
            element.removeChild(charging);

            return Promise.resolve();
        };
    },
};
