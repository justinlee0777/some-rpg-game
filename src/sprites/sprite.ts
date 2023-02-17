import { Character } from 'rpg-game-engine';
import { ReactElement, RefObject } from 'react';

/**
 * Arguments for character sprite which contain useful information to manipulate the sprite.
 */
export interface Sprite {
    /** Character metadata. */
    character: Character;

    /** Graphical representation of character. */
    avatar: RefObject<HTMLImageElement>;
    /** Graphical representation of hitpoints. */
    hitpoints: RefObject<HTMLElement>;
    /** Graphical representation of stamina. */
    stamina: RefObject<HTMLElement>;
}

/**
 * An instantiated sprite.
 */
export interface SpriteElement {
    sprite: Sprite;
    reactElement: ReactElement;
}
