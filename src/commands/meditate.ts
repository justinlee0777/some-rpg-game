import { Priority } from 'rpg-game-engine';

import { defaultAnimation } from '../animations';
import { GameCommand } from './game-command';
import { ActType } from './types';

export class Meditate implements GameCommand {
    priority = Priority.DELIBERATIVE;

    stamina = 0;

    type = ActType.MEDITATE;

    ui = {
        animation: () => defaultAnimation,
    };
}
