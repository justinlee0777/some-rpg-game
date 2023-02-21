import * as React from 'react';
import { Action, Command } from 'rpg-game-engine';

import { GameCommand } from '../commands/game-command';
import { GameCharacter } from '../characters/game-character';
import { BaseCommandMenuProps } from './base-command-menu-props';
import { CommandMenuTarget } from './command-menu-target';

interface CommandMenuActionProps extends BaseCommandMenuProps {
    savedAction?: Action;

    onActionDetermined?: (action: Action) => void;
    onUndoLastAction?: () => void;
}

export function CommandMenuAction({
    keydownInterceptor,
    puzzle,

    savedAction,
    onActionDetermined,
    onUndoLastAction,
}: CommandMenuActionProps): JSX.Element {
    const completed = Boolean(savedAction);

    const [selectedPlayer, setSelectedPlayer] = React.useState<GameCharacter>(
        (savedAction?.source[0] || puzzle.players[0]) as GameCharacter
    );
    const [selectedCommand, setSelectedCommand] = React.useState<Command>(
        savedAction?.command
    );
    const [selectedTarget, setSelectedTarget] = React.useState<GameCharacter>(
        savedAction?.targets[0] as GameCharacter
    );

    const [playerChosen, setPlayerChosen] = React.useState<boolean>(completed);
    const [commandChosen, setCommandChosen] =
        React.useState<boolean>(completed);

    let playerRoulette: JSX.Element,
        commandRoulette: JSX.Element,
        targetRoulette: JSX.Element;

    const slots = puzzle.players.map((player: GameCharacter) => (
        <div
            className={
                'player-roulette-slot' +
                (player === selectedPlayer ? ' selected' : '')
            }
            key={player.constructor.toString()}
        >
            <img src={player.ui.avatar} />
        </div>
    ));

    const scrollPlayerIntoView = (element: HTMLElement) => {
        const playerIndex = puzzle.players.findIndex(
            (player) => player === selectedPlayer
        );
        element && (element.scrollTop = playerIndex * 50);
    };

    playerRoulette = (
        <div className="commands-player-roulette" ref={scrollPlayerIntoView}>
            {slots}
        </div>
    );

    if (playerChosen) {
        const commandButtons = selectedPlayer.commands.map(
            (command: GameCommand) => {
                return (
                    <button
                        className={
                            'command-roulette-slot' +
                            (command.type === selectedCommand.type
                                ? ' selected'
                                : '')
                        }
                        key={command.ui.displayName}
                    >
                        {command.ui.displayName}
                    </button>
                );
            }
        );

        const scrollCommandIntoView = (element: HTMLElement) => {
            const commandIndex = selectedPlayer.commands.findIndex(
                (command) => command.type === selectedCommand.type
            );
            element && (element.scrollTop = commandIndex * 50);
        };

        commandRoulette = (
            <div className="commands-roulette" ref={scrollCommandIntoView}>
                {commandButtons}
            </div>
        );
    }

    if (commandChosen) {
        const targets = [...puzzle.players, ...puzzle.enemies.characters];

        const slots = targets.map((target: GameCharacter) => {
            if (target === selectedTarget && completed) {
                return (
                    <CommandMenuTarget
                        target={target}
                        command={savedAction.command}
                        source={[selectedPlayer]}
                        key={target.constructor.toString()}
                    />
                );
            } else {
                return (
                    <div
                        className={
                            'target-roulette-slot' +
                            (target === selectedTarget ? ' selected' : '')
                        }
                        key={target.constructor.toString()}
                    >
                        <img src={target.ui.avatar} />
                    </div>
                );
            }
        });

        const scrollTargetIntoView = (element: HTMLElement) => {
            const targetIndex = targets.findIndex(
                (target) => target === selectedTarget
            );
            element && (element.scrollTop = targetIndex * 50);
        };

        targetRoulette = (
            <div
                className="commands-target-roulette"
                ref={scrollTargetIntoView}
            >
                {slots}
            </div>
        );
    }

    if (!completed) {
        let options: Array<unknown>,
            selectedOption: unknown,
            select: (option: unknown) => void,
            choose: () => void,
            undo: () => void;

        if (commandChosen) {
            options = [...puzzle.players, ...puzzle.enemies.characters];
            selectedOption = selectedTarget;
            select = setSelectedTarget;
            choose = () => {
                keydownInterceptor.clear();

                onActionDetermined({
                    source: [selectedPlayer],
                    command: selectedCommand,
                    targets: [selectedTarget],
                });
            };
            undo = () => {
                setCommandChosen(false);
                setSelectedTarget(null);
            };
        } else if (playerChosen) {
            keydownInterceptor.clear();

            options = selectedPlayer.commands;
            selectedOption = selectedCommand;
            select = setSelectedCommand;
            choose = () => {
                setCommandChosen(true);
                setSelectedTarget(puzzle.players[0] as GameCharacter);
            };
            undo = () => {
                setPlayerChosen(false);
                setSelectedCommand(null);
            };
        } else {
            keydownInterceptor.clear();

            options = puzzle.players;
            selectedOption = selectedPlayer;
            select = setSelectedPlayer;
            choose = () => {
                setPlayerChosen(true);
                setSelectedCommand(selectedPlayer.commands[0]);
            };
            undo = () => onUndoLastAction?.();
        }

        keydownInterceptor.arrowUp = () => {
            const index = options.findIndex(
                (option) => option === selectedOption
            );
            const newIndex = index === 0 ? options.length - 1 : index - 1;
            select(options[newIndex]);
        };

        keydownInterceptor.arrowDown = () => {
            const index = options.findIndex(
                (option) => option === selectedOption
            );
            const newIndex = index === options.length - 1 ? 0 : index + 1;
            select(options[newIndex]);
        };

        keydownInterceptor.enter = keydownInterceptor.space = choose;

        keydownInterceptor.escape = undo;
    }

    return (
        <div
            className={'command-menu-action' + (savedAction ? ' disabled' : '')}
        >
            {playerRoulette}
            {commandRoulette}
            {targetRoulette}
        </div>
    );
}
