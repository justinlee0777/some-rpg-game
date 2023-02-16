import { Root, createRoot } from 'react-dom/client';

import {
    CharacterConfig,
    SpriteDrawer,
} from './sprites/sprite-drawer.interface';
import { SpriteElement } from './sprites/sprite';

export class SpriteDrawerImpl implements SpriteDrawer<SpriteElement> {
    private playerContainer: Root;
    private enemyContainer: Root;

    constructor() {
        this.playerContainer = createRoot(document.getElementById('players'));
        this.enemyContainer = createRoot(document.getElementById('enemies'));
    }

    draw(element: SpriteElement, config: CharacterConfig): void {
        if (config.player) {
            this.playerContainer.render(element.reactElement);
        } else {
            this.enemyContainer.render(element.reactElement);
        }
    }
}
