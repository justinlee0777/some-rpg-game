import { Priority } from 'rpg-game-engine';

import { GameCommand } from '../game-command';
import { HidingEffect } from '../../ongoing-effects';
import { SkillType } from './types';
import { defaultAnimation } from '../../animations/index';

export class Hide implements GameCommand {
    stamina = 5;

    priority = Priority.EAGER;

    ongoingEffects = [new HidingEffect()];

    type = SkillType.HIDE;

    ui = {
        displayName: 'Hide',
        description: 'For this turn only, a target will not take damage.',
        animation: () => defaultAnimation,
    };
}
