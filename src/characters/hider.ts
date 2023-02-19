import { Command, Stats } from 'rpg-game-engine';

import { Meditate } from '../commands';
import { Hide } from '../skills';
import { GameCharacter, GameCharacterUI } from './game-character';

export class Hider implements GameCharacter {
    readonly initial: Readonly<Stats>;
    readonly commands: Array<Command>;
    readonly ui: GameCharacterUI;

    current: Stats;

    constructor() {
        this.initial = {
            health: 50,
            stamina: 50,
            staminaRegen: 1,
        };
        this.current = { ...this.initial };
        this.commands = [new Hide(), new Meditate()];

        this.ui = {
            avatar: 'assets/garbage-can.png',
        };
    }
}
