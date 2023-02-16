import { CommandType, Priority, Skill, SkillType } from 'rpg-game-engine';

/**
 * TODO
 * A basic attack that every character possesses.
 * This is for prototype purposes. The more I think about it, the more
 * it seems counter to the design of the game.
 */
export class Attack implements Skill {
    damage = 5;

    stamina = 5;

    priority = Priority.EAGER;

    type = CommandType.SKILL;
    skillType = SkillType.ATTACK;
}
