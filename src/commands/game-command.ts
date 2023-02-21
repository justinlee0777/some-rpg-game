import { Character, Command } from 'rpg-game-engine';

import { SkillAnimation } from '../animations';

export interface GameCommand extends Command {
    ui: {
        animation: (character: Character) => SkillAnimation;
    };
}
