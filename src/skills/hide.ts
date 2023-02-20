import { Command, Priority } from 'rpg-game-engine';

import { HidingEffect } from '../ongoing-effects/hiding-effect';
import { SkillType } from './types';

export class Hide implements Command {
    stamina = 5;

    priority = Priority.EAGER;

    ongoingEffects = [new HidingEffect()];

    type = SkillType.HIDE;
}
