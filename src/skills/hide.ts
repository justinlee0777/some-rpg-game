import {
    CommandType,
    OngoingEffectTriggerType,
    OngoingEffectType,
    Priority,
    Skill,
    SkillType,
} from 'rpg-game-engine';

export class Hide implements Skill {
    stamina = 5;

    /** TODO: for now IMMEDIATE for testing */
    priority = Priority.IMMEDIATE;

    ongoingEffects = [
        {
            type: OngoingEffectType.HIDE,
            turnDuration: 1,
            trigger: {
                type: OngoingEffectTriggerType.IMMEDIATE,
            },
        },
    ];

    skillType = SkillType.HIDE;

    type = CommandType.SKILL;
}
