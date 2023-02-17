import {
    Command,
    OngoingEffectTriggerType,
    OngoingEffectType,
    Priority,
} from 'rpg-game-engine';

import { SkillType } from './types';

export class Hide implements Command {
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

    type = SkillType.HIDE;
}
