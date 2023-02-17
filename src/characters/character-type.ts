import { Burn } from './burn';
import { Hider } from './hider';
import { Test } from './test';

/**
 * Using the uniqueness of the constructor function to determine who the character is.
 */
export type CharacterType = typeof Hider | typeof Test | typeof Burn;
