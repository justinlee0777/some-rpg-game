import { Priority } from 'rpg-game-engine';

import { burnAnimation } from '../../animations';
import { BurningEffect } from '../../ongoing-effects';
import { GameCommand } from '../game-command';
import { SkillType } from './types';

export class Burn implements GameCommand {
    damage = () => 1;

    stamina = 5;

    priority = Priority.DELIBERATIVE;

    ongoingEffects = [new BurningEffect()];

    type = SkillType.BURN;

    ui = {
        displayName: 'Burn',
        animation: burnAnimation,
    };
}
