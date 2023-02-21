import { GameCharacter } from '../../characters/game-character';
import { Animation } from '../animation.interface';

export interface OngoingEffectAnimation {
    /** Triggered when the ongoing effect is first applied. */
    applied(character: GameCharacter): Animation;

    /** TODO: Triggered when the ongoing effect persists at the end of the turn. */

    /** Triggered when the ongoing effect is removed. */
    removed(character: GameCharacter): Animation;
}
