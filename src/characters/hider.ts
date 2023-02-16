import { Character, Command, Stats } from 'rpg-game-engine';

import { Attack } from '../skills';

export class Hider implements Character {
    readonly initial: Readonly<Stats>;
    readonly commands: Array<Command>;

    current: Stats;

    constructor() {
        this.initial = {
            health: 50,
            stamina: 50,
            staminaRegen: 1,
        };
        this.current = { ...this.initial };
        this.commands = [new Attack()];
    }
}
