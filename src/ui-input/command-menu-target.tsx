import * as React from 'react';

import { GameOngoingEffect } from '../ongoing-effects';
import { Animation } from '../animations';
import { GameCharacter } from '../characters/game-character';
import { Command } from 'rpg-game-engine';

export interface CommandMenuTargetProps {
    command: Command;
    target: GameCharacter;
}

export function CommandMenuTarget({
    command,
    target,
}: CommandMenuTargetProps): JSX.Element {
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
                .map(
                    (ongoingEffect: GameOngoingEffect) =>
                        ongoingEffect.ui.animation
                )
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
        <div className="target-roulette-slot selected" key={target.type}>
            <img className="avatar" src={target.ui.avatar} ref={loop} />
            {damageIcon}
        </div>
    );
}
