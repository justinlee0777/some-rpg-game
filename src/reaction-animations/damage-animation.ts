import { Character, CharacterType, ReactionAnimation } from 'rpg-game-engine';

import { CharacterSpriteMapInstance } from '../character-sprite-map-impl';

export function damageAnimation(target: Character): ReactionAnimation {
    return () => {
        const element = CharacterSpriteMapInstance.get(
            target.constructor as CharacterType
        );

        const animation = element.avatar.current.animate(
            [{ filter: 'saturate(3)' }, { filter: 'none' }],
            333
        );
        element.hitpoints.current.textContent =
            target.current.health.toString();

        return animation.finished.then();
    };
}
