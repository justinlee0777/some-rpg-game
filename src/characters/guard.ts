import { Command, Stats } from 'rpg-game-engine';

import { CharacterType } from './character-type';
import { GameCharacter, GameCharacterUI } from './game-character';

export class Guard implements GameCharacter {
    readonly initial: Readonly<Stats>;
    readonly commands: Array<Command>;
    readonly ui: GameCharacterUI;

    current: Stats;

    type = CharacterType.GUARD;

    constructor() {
        this.initial = {
            health: 50,
            stamina: 50,
            staminaRegen: 1,
        };
        this.current = { ...this.initial };
        this.commands = [];

        this.ui = {
            avatar: 'assets/helmet.png',
        };
    }
}
