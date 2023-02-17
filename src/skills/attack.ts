import { Command, Priority } from 'rpg-game-engine';

import { SkillType } from './types';

/**
 * TODO
 * A basic attack that every character possesses.
 * This is for prototype purposes. The more I think about it, the more
 * it seems counter to the design of the game.
 */
export class Attack implements Command {
    damage = 5;

    stamina = 5;

    priority = Priority.EAGER;

    type = SkillType.ATTACK;
}
