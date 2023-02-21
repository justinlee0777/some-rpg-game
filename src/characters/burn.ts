import { Command, Stats } from 'rpg-game-engine';

import { Attack } from '../skills';
import { CharacterType } from './character-type';
import { GameCharacter, GameCharacterUI } from './game-character';

export class Burn implements GameCharacter {
    readonly initial: Readonly<Stats>;
    readonly commands: Array<Command>;
    readonly ui: GameCharacterUI;

    current: Stats;

    type = CharacterType.BURN;

    constructor() {
        this.initial = {
            health: 50,
            stamina: 50,
            staminaRegen: 1,
        };
        this.current = { ...this.initial };
        this.commands = [new Attack()];

        this.ui = {
            avatar: 'assets/matchbox.png',
        };
    }
}
