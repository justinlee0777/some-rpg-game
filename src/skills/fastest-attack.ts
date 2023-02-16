import { CommandType, Priority, Skill, SkillType } from 'rpg-game-engine';

/**
 * TODO
 */
export class FastestAttack implements Skill {
    damage = 5;

    stamina = 15;

    priority = Priority.IMMEDIATE;

    type = CommandType.SKILL;
    skillType = SkillType.FASTEST_ATTACK;
}
