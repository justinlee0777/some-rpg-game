import * as React from 'react';
import { Action, Command, Puzzle } from 'rpg-game-engine';

import { CommandDescriptionFactory } from '../commands/command-description-factory';
import { GameCharacter } from '../characters/game-character';
import { KeydownInterceptor } from './keydown-interceptor';

interface BaseCommandMenuProps {
    keydownInterceptor: KeydownInterceptor;
    commandDescriptionFactory: CommandDescriptionFactory;

    puzzle?: Puzzle;
}

export interface CommandMenuProps extends BaseCommandMenuProps {
    endUserInputPhase?: (puzzle: Puzzle, actions: Array<Action>) => boolean;
    onActionsDetermined?: (actions: Array<Action>) => void;
}

export function CommandMenu(props: CommandMenuProps): JSX.Element {
    const [actions, setActions] = React.useState<Array<Action>>([]);

    const { endUserInputPhase, onActionsDetermined } = props;

    if (endUserInputPhase?.(props.puzzle, actions)) {
        onActionsDetermined?.(actions);
        return <></>;
    }

    const previousMenus = actions.map((action, index) => (
        <CommandMenuAction {...props} savedAction={action} key={index} />
    ));

    return (
        <div className="commands">
            {previousMenus}
            <CommandMenuAction
                onActionDetermined={(action) =>
                    setActions(actions.concat(action))
                }
                {...props}
                key={actions.length}
            />
        </div>
    );
}

interface CommandMenuActionProps extends BaseCommandMenuProps {
    savedAction?: Action;

    onActionDetermined?: (action: Action) => void;
}

export function CommandMenuAction({
    keydownInterceptor,
    commandDescriptionFactory,
    puzzle,

    savedAction,
    onActionDetermined,
}: CommandMenuActionProps): JSX.Element {
    // const playerRouletteRef = React.useRef<HTMLDivElement>(null);
    // const commandRouletteRef = React.useRef<HTMLDivElement>(null);
    // const targetRouletteRef = React.useRef<HTMLDivElement>(null);

    const [selectedPlayer, setSelectedPlayer] = React.useState<GameCharacter>(
        (savedAction?.source[0] || puzzle.players[0]) as GameCharacter
    );
    const [selectedCommand, setSelectedCommand] = React.useState<Command>(
        savedAction?.command
    );
    const [selectedTarget, setSelectedTarget] = React.useState<GameCharacter>(
        savedAction?.targets[0] as GameCharacter
    );

    const [playerChosen, setPlayerChosen] = React.useState<boolean>(
        Boolean(savedAction)
    );
    const [commandChosen, setCommandChosen] = React.useState<boolean>(
        Boolean(savedAction)
    );

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
        const commandButtons = selectedPlayer.commands.map((command) => {
            const commandDescription = commandDescriptionFactory.get(command);

            return (
                <button
                    className={
                        'command-roulette-slot' +
                        (command.type === selectedCommand.type
                            ? ' selected'
                            : '')
                    }
                    key={commandDescription.displayName}
                >
                    {commandDescription.displayName}
                </button>
            );
        });

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

        const slots = targets.map((target: GameCharacter) => (
            <div
                className={
                    'target-roulette-slot' +
                    (target === selectedTarget ? ' selected' : '')
                }
                key={target.constructor.toString()}
            >
                <img src={target.ui.avatar} />
            </div>
        ));

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

    let options: Array<unknown>,
        selectedOption: unknown,
        select: (option: unknown) => void,
        choose: () => void;

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
    } else if (playerChosen) {
        options = selectedPlayer.commands;
        selectedOption = selectedCommand;
        select = setSelectedCommand;
        choose = () => {
            setCommandChosen(true);
            setSelectedTarget(puzzle.players[0] as GameCharacter);
        };
    } else {
        options = puzzle.players;
        selectedOption = selectedPlayer;
        select = setSelectedPlayer;
        choose = () => {
            setPlayerChosen(true);
            setSelectedCommand(selectedPlayer.commands[0]);
        };
    }

    keydownInterceptor.arrowUp = () => {
        const index = options.findIndex((option) => option === selectedOption);
        const newIndex = index === 0 ? options.length - 1 : index - 1;
        select(options[newIndex]);
    };

    keydownInterceptor.arrowDown = () => {
        const index = options.findIndex((option) => option === selectedOption);
        const newIndex = index === options.length - 1 ? 0 : index + 1;
        select(options[newIndex]);
    };

    keydownInterceptor.enter = keydownInterceptor.space = choose;

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
