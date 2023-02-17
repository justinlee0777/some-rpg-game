import {
    CharacterConfig,
    SpriteDrawer,
} from './sprites/sprite-drawer.interface';
import { Sprite } from './sprites/sprite';

export class SpriteDrawerImpl implements SpriteDrawer<Sprite> {
    private playerContainer: HTMLElement;
    private enemyContainer: HTMLElement;

    constructor() {
        this.playerContainer = document.getElementById('players');
        this.enemyContainer = document.getElementById('enemies');
    }

    draw(element: Sprite, config: CharacterConfig): void {
        if (config.player) {
            this.playerContainer.appendChild(element.htmlElement);
        } else {
            this.enemyContainer.appendChild(element.htmlElement);
        }
    }
}
