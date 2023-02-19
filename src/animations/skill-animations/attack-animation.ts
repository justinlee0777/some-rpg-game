import { Character } from 'rpg-game-engine';

import { setCharacterSpriteStamina } from '../../sprites/character-sprite';
import { SkillAnimation } from '../skill-animation.interface';
import { animateCharacterSprite } from '../../sprites/character-sprite';

export function attackAnimation(source: Character): SkillAnimation {
    return {
        beforeEffect: () => {
            setCharacterSpriteStamina(source);
            return Promise.resolve();
        },
        runEffect: () => {
            const animation = animateCharacterSprite(
                source,
                [{ transform: 'rotate(360deg)' }],
                {
                    duration: 600,
                    iterations: 1,
                }
            );

            return animation.finished.then();
        },
        afterEffect: () => Promise.resolve(),
    };
}
