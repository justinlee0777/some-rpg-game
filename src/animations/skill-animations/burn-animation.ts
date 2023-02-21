import { Character } from 'rpg-game-engine';

import { setCharacterSpriteStamina } from '../../sprites/character-sprite';
import { SkillAnimation } from '../skill-animation.interface';
import { animateCharacterSprite } from '../../sprites/character-sprite';

export function burnAnimation(source: Character): SkillAnimation {
    return {
        beforeEffect: () => {
            return Promise.resolve();
        },
        runEffect: () => {
            setCharacterSpriteStamina(source);

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
