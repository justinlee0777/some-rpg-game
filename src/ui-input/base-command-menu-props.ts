import { Puzzle } from 'rpg-game-engine';

import { CommandDescriptionFactory } from '../commands/command-description-factory';
import { KeydownInterceptor } from './keydown-interceptor';

export interface BaseCommandMenuProps {
    keydownInterceptor: KeydownInterceptor;
    commandDescriptionFactory: CommandDescriptionFactory;

    puzzle?: Puzzle;
}
