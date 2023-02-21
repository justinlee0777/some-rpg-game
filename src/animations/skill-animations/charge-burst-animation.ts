import { Character } from 'rpg-game-engine';

import { setCharacterSpriteStamina } from '../../sprites/character-sprite';
import { SkillAnimation } from '../skill-animation.interface';
import { animateCharacterSprite } from '../../sprites/character-sprite';

export function chargeBurstAnimation(source: Character): SkillAnimation {
    return {
        beforeEffect: () => {
            return Promise.resolve();
        },
        runEffect: () => {
            setCharacterSpriteStamina(source);

            const animation = animateCharacterSprite(
                source,
                [
                    { filter: 'blur(5px)' },
                    { transform: 'rotate(360deg)', filter: 'blur(0)' },
                ],
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
