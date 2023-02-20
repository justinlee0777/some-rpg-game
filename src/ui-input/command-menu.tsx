import * as React from 'react';
import { Action, Engine, Puzzle } from 'rpg-game-engine';

import { BaseCommandMenuProps } from './base-command-menu-props';
import { CommandMenuAction } from './command-menu-action';

export interface CommandMenuProps extends BaseCommandMenuProps {
    engine: Engine;

    endUserInputPhase?: (puzzle: Puzzle, actions: Array<Action>) => boolean;
    onActionsDetermined?: (actions: Array<Action>) => void;
}

export function CommandMenu(props: CommandMenuProps): JSX.Element {
    const [actions, setActions] = React.useState<Array<Action>>([]);
    const [submitted, setSubmitted] = React.useState<boolean>(false);

    const { endUserInputPhase, onActionsDetermined } = props;

    let submitButton: JSX.Element;

    if (submitted) {
        return <></>;
    }

    let currentActions = [...actions];
    let incompleteMenu: JSX.Element;

    if (endUserInputPhase?.(props.puzzle, actions)) {
        const { keydownInterceptor, engine } = props;

        currentActions = engine.orderActions(currentActions);

        keydownInterceptor.enter = keydownInterceptor.space = () => {
            keydownInterceptor.clear();
            setSubmitted(true);
            onActionsDetermined?.(actions);
        };

        keydownInterceptor.escape = () => {
            keydownInterceptor.clear();
            setActions([]);
        };

        submitButton = <button>Confirm</button>;
    } else {
        incompleteMenu = (
            <CommandMenuAction
                onActionDetermined={(action) =>
                    setActions(actions.concat(action))
                }
                onUndoLastAction={() =>
                    setActions(actions.slice(0, actions.length - 1))
                }
                {...props}
                key={actions.length}
            />
        );
    }

    const menus = currentActions.map((action) => (
        <CommandMenuAction
            {...props}
            savedAction={action}
            key={createKey(action)}
        />
    ));

    return (
        <div className="commands">
            {menus}
            {incompleteMenu}
            {submitButton}
        </div>
    );
}

function createKey(action: Action): string {
    return `${action.source[0].constructor.toString()}-${
        action.command.type
    }-${action.targets[0].constructor.toString()}`;
}
