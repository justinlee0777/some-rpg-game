import { Character } from 'rpg-game-engine';

import { createCharacterSprite } from './character-sprite';
import { Burn, Charge, Guard, Hider, Test } from '../characters';

export class SpriteHelper {
    get(character: Character): HTMLElement {
        switch (character.constructor) {
            case Hider:
            case Test:
                return createCharacterSprite(
                    character,
                    'assets/garbage-can.png'
                );
            case Burn:
                return createCharacterSprite(character, 'assets/matchbox.png');
            case Charge:
                return createCharacterSprite(character, 'assets/battery.png');
            case Guard:
                return createCharacterSprite(character, 'assets/helmet.png');
        }
    }
}
