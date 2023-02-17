import { Character } from 'rpg-game-engine';
import { Animation } from 'rpg-game-engine/ui';

import { CharacterSpriteMap } from '../character-sprite-map';

export interface OngoingEffectAnimation {
    /** Triggered when the ongoing effect is first applied. */
    applied(
        character: Character,
        characterSpriteMap: CharacterSpriteMap
    ): Animation;

    /** TODO: Triggered when the ongoing effect persists at the end of the turn. */

    /** Triggered when the ongoing effect is removed. */
    removed(
        character: Character,
        characterSpriteMap: CharacterSpriteMap
    ): Animation;
}
