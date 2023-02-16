import { Character } from 'rpg-game-engine';

/**
 * Configuration for how the sprite should be drawn.
 */
export interface CharacterConfig {
    /** Character metadata. */
    character: Character;
    /** Whether the character belongs to the player's party. */
    player: boolean;
}

/**
 * Contract for drawing sprites onto the HTML page.
 */
export interface SpriteDrawer<T = HTMLElement> {
    draw(element: T, config: CharacterConfig): void;
}
