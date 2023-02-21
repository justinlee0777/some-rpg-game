import { Character, Command } from 'rpg-game-engine';

import { SkillAnimation } from '../animations';

export interface GameCommand extends Command {
    ui: {
        displayName: string;
        description: string;
        animation: (character: Character) => SkillAnimation;
    };
}
