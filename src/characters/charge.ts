import { Command, Stats } from 'rpg-game-engine';

import { Charge as ChargeSkill, ChargeBurst } from '../commands/index';
import { CharacterType } from './character-type';
import { GameCharacter, GameCharacterUI } from './game-character';

export class Charge implements GameCharacter {
    readonly initial: Readonly<Stats>;
    readonly commands: Array<Command>;
    readonly ui: GameCharacterUI;

    current: Stats;

    type = CharacterType.CHARGE;

    constructor() {
        this.initial = {
            health: 50,
            stamina: 50,
            staminaRegen: 1,
        };
        this.current = { ...this.initial };
        this.commands = [new ChargeSkill(), new ChargeBurst()];

        this.ui = {
            avatar: 'assets/battery.png',
        };
    }
}
