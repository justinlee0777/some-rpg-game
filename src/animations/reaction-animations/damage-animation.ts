import { Character } from 'rpg-game-engine';

import {
    animateCharacterSprite,
    setCharacterSpriteHitpoints,
} from '../../sprites/character-sprite';
import { ReactionAnimation } from '../reaction-animation.interface';

export function damageAnimation(target: Character): ReactionAnimation {
    return () => {
        const animation = animateCharacterSprite(
            target,
            [{ filter: 'saturate(3)' }, { filter: 'none' }],
            333
        );
        setCharacterSpriteHitpoints(target);

        return animation.finished.then();
    };
}
