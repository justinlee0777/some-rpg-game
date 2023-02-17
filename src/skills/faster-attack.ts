import { Command, Priority } from 'rpg-game-engine';

import { SkillType } from './types';

/**
 * TODO
 */
export class FasterAttack implements Command {
    damage = 5;

    stamina = 10;

    priority = Priority.QUICK;

    type = SkillType.FASTER_ATTACK;
}
