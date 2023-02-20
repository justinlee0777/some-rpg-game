import * as React from 'react';
import { Action } from 'rpg-game-engine';

import { Animation, Animations } from '../animations';
import { GameCharacter } from '../characters/game-character';
import { CommandDescription } from '../commands/command-description-factory';

export interface CommandMenuTargetInterface {
    command: CommandDescription;
    target: GameCharacter;
}

export function CommandMenuTarget({
    command,
    target,
}: CommandMenuTargetInterface): JSX.Element {
    let damageIcon: JSX.Element;

    if (command.damage) {
        damageIcon = (
            <div className="target-roulette-slot-icon">-{command.damage}</div>
        );
    }
    let endLoop = false;
    const loop = async (element: HTMLElement) => {
        if (!element || !command.ongoingEffects?.length) {
            return;
        }

        let index = 0;
        const animations: Array<Animation> =
            command.ongoingEffects
                .map((ongoingEffect) => Animations.get(ongoingEffect.type))
                .reduce((allAnimations, animation) => {
                    return allAnimations.concat(
                        animation.applied(element),
                        animation.removed(element)
                    );
                }, []) ?? [];

        while (!endLoop) {
            if (index >= animations.length) {
                index = 0;
            }

            await animations[index]();
            index++;
        }
    };

    React.useEffect(() => () => {
        endLoop = true;
    });

    return (
        <div
            className="target-roulette-slot selected"
            key={target.constructor.toString()}
        >
            <img className="avatar" src={target.ui.avatar} ref={loop} />
            {damageIcon}
        </div>
    );
}