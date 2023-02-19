import { Character } from 'rpg-game-engine';

import { Animation } from '../animation.interface';

export interface OngoingEffectAnimation {
    /** Triggered when the ongoing effect is first applied. */
    applied(character: Character): Animation;

    /** TODO: Triggered when the ongoing effect persists at the end of the turn. */

    /** Triggered when the ongoing effect is removed. */
    removed(character: Character): Animation;
}
