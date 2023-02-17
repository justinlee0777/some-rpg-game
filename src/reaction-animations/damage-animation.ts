import { Character } from 'rpg-game-engine';
import { ReactionAnimation } from 'rpg-game-engine/ui';

import { CharacterSpriteMap } from '../character-sprite-map';
import { CharacterType } from '../characters';

export function damageAnimation(
    target: Character,
    characterSpriteMap: CharacterSpriteMap
): ReactionAnimation {
    return () => {
        const element = characterSpriteMap.get(
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
