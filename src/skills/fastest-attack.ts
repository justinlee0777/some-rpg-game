import { Command, Priority } from 'rpg-game-engine';

import { SkillType } from './types';

/**
 * TODO
 */
export class FastestAttack implements Command {
    damage = 5;

    stamina = 15;

    priority = Priority.IMMEDIATE;

    type = SkillType.FASTEST_ATTACK;
}
