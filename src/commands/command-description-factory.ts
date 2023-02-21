import { Command } from 'rpg-game-engine';

import { SkillType } from './skills/types';
import { ActType } from './types';

export interface CommandDescription extends Command {
    displayName: string;
    htmlId: string;
}

export class CommandDescriptionFactory {
    get(command: Command): CommandDescription {
        switch (command.type) {
            case ActType.MEDITATE:
                return {
                    ...command,
                    htmlId: 'meditate-act',
                    displayName: 'Meditate',
                };
            case SkillType.ATTACK:
                return {
                    ...command,
                    htmlId: 'attack-skill',
                    displayName: 'Attack',
                };
            case SkillType.HIDE:
                return {
                    ...command,
                    htmlId: 'hide-skill',
                    displayName: 'Hide',
                };
        }
    }
}
