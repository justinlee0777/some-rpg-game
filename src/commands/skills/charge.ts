import { Priority } from 'rpg-game-engine';

import { chargeAnimation } from '../../animations/skill-animations';
import { ChargeEffect } from '../../ongoing-effects/charge-effect';
import { GameCommand } from '../game-command';
import { SkillType } from './types';

export class Charge implements GameCommand {
    stamina = 2;

    priority = Priority.EAGER;

    ongoingEffects = [new ChargeEffect()];

    type = SkillType.CHARGE;

    ui = {
        displayName: 'Charge',
        animation: chargeAnimation,
    };
}
