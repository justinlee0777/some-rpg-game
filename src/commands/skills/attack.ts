import { Priority } from 'rpg-game-engine';

import { attackAnimation } from '../../animations';
import { GameCommand } from '../game-command';
import { SkillType } from './types';

/**
 * TODO
 * A basic attack that every character possesses.
 * This is for prototype purposes. The more I think about it, the more
 * it seems counter to the design of the game.
 */
export class Attack implements GameCommand {
    damage = () => 5;

    stamina = 5;

    priority = Priority.EAGER;

    type = SkillType.ATTACK;

    ui = {
        displayName: 'Attack',
        animation: attackAnimation,
    };
}
