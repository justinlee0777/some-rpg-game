import { Character, SkillAnimation } from 'rpg-game-engine';

import { CharacterType } from '../characters';
import { CharacterSpriteMapInstance } from '../character-sprite-map-impl';

export function attackAnimation(source: Character): SkillAnimation {
    return {
        beforeEffect: () => {
            const sprite = CharacterSpriteMapInstance.get(
                source.constructor as CharacterType
            );

            sprite.setStamina(source.current.stamina.toString());
            return Promise.resolve();
        },
        runEffect: () => {
            const sprite = CharacterSpriteMapInstance.get(
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
