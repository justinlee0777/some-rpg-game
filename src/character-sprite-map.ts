import { CharacterType } from './characters';
import { Sprite } from './sprites/sprite';

export type CharacterSpriteMap = Map<CharacterType, Sprite>;

export function characterSpriteMapFactory(): CharacterSpriteMap {
    return new Map<CharacterType, Sprite>();
}
