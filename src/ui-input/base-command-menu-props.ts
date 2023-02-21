import { Puzzle } from 'rpg-game-engine';

import { KeydownInterceptor } from './keydown-interceptor';

export interface BaseCommandMenuProps {
    keydownInterceptor: KeydownInterceptor;

    puzzle?: Puzzle;
}
