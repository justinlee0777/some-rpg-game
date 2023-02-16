import { Character } from 'rpg-game-engine';
import { ReactElement, RefObject } from 'react';

/**
 * Arguments for character sprite which contain useful information to manipulate the sprite.
 */
export interface Sprite {
    /** Character metadata. */
    character: Character;

    /** Resolves when the sprite is done drawing. */
    doneDrawing: Promise<void>;

    /** Graphical representation of character. */
    avatar: RefObject<HTMLElement>;
    /** Graphical representation of hitpoints. */
    hitpoints: RefObject<HTMLElement>;
    /** Graphical representation of stamina. */
    stamina: RefObject<HTMLElement>;

    /** Resolve function for the 'doneDrawing' promise. */
    resolve(): void;
}

/**
 * An instantiated sprite.
 */
export interface SpriteElement {
    sprite: Sprite;
    reactElement: ReactElement;
}
