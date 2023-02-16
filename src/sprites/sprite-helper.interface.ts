import { Character } from 'rpg-game-engine';

/**
 * Contract for fetching the specific UI element for a character.
 */
export interface SpriteHelper<T = HTMLElement> {
    /**
     * Create the specific sprite for a specific character.
     * @returns the created sprite
     */
    get(character: Character): T;
}
