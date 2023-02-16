import { CommandType, Priority, Skill, SkillType } from 'rpg-game-engine';

/**
 * TODO
 */
export class FasterAttack implements Skill {
    damage = 5;

    stamina = 10;

    priority = Priority.QUICK;

    type = CommandType.SKILL;
    skillType = SkillType.FASTER_ATTACK;
}
