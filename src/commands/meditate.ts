import { Command, Priority } from 'rpg-game-engine';
import { ActType } from './types';

export class Meditate implements Command {
    priority = Priority.DELIBERATIVE;

    stamina = 0;

    type = ActType.MEDITATE;
}
