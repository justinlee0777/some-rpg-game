import { Priority } from 'rpg-game-engine';

import { GameCommand } from '../game-command';
import { HidingEffect } from '../../ongoing-effects/hiding-effect';
import { SkillType } from './types';
import { defaultAnimation } from '../../animations/index';

export class Hide implements GameCommand {
    stamina = 5;

    priority = Priority.EAGER;

    ongoingEffects = [new HidingEffect()];

    type = SkillType.HIDE;

    ui = {
        animation: () => defaultAnimation,
    };
}
