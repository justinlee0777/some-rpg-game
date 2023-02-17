import { Character } from 'rpg-game-engine';
import { ReactionAnimation } from 'rpg-game-engine/ui';

import { CharacterSpriteMapInstance } from '../character-sprite-map-impl';
import { CharacterType } from '../characters';

export function damageAnimation(target: Character): ReactionAnimation {
    return () => {
        const element = CharacterSpriteMapInstance.get(
            target.constructor as CharacterType
        );

        const animation = element.animateAvatar(
            [{ filter: 'saturate(3)' }, { filter: 'none' }],
            333
        );
        element.setHitpoints(target.current.health.toString());

        return animation.finished.then();
    };
}
