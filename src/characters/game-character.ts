import { Character } from 'rpg-game-engine';

export interface GameCharacterUI {
    avatar: string;
}

export interface GameCharacter extends Character {
    ui: GameCharacterUI;
}
