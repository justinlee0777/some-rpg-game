import { Character, SkillAnimation } from 'rpg-game-engine';

import { CharacterType } from '../characters';
import { CharacterSpriteMap } from '../character-sprite-map';

export function attackAnimation(
    source: Character,
    characterSpriteMap: CharacterSpriteMap
): SkillAnimation {
    return {
        beforeEffect: () => {
            const sprite = characterSpriteMap.get(
                source.constructor as CharacterType
            );

            sprite.setStamina(source.current.stamina.toString());
            return Promise.resolve();
        },
        runEffect: () => {
            const sprite = characterSpriteMap.get(
                source.constructor as CharacterType
            );
            const animation = sprite.animateAvatar(
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
