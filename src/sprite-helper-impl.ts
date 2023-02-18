import { Character } from 'rpg-game-engine';

import { createSprite, Sprite } from './sprites/sprite';
import { SpriteHelper } from './sprites/sprite-helper.interface';
import { Burn, Charge, Guard, Hider, Test } from './characters';

export class SpriteHelperImpl implements SpriteHelper<Sprite> {
    get(character: Character): Sprite {
        switch (character.constructor) {
            case Hider:
            case Test:
                return createSprite(character, 'assets/garbage-can.png');
            case Burn:
                return createSprite(character, 'assets/matchbox.png');
            case Charge:
                return createSprite(character, 'assets/battery.png');
            case Guard:
                return createSprite(character, 'assets/helmet.png');
        }
    }
}
