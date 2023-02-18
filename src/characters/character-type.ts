import { Burn } from './burn';
import { Charge } from './charge';
import { Guard } from './guard';
import { Hider } from './hider';
import { Test } from './test';

/**
 * Using the uniqueness of the constructor function to determine who the character is.
 */
export type CharacterType =
    | typeof Hider
    | typeof Test
    | typeof Burn
    | typeof Charge
    | typeof Guard;
