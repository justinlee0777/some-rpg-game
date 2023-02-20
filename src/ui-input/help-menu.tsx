import * as React from 'react';

export function HelpMenu(): JSX.Element {
    const [expanded, setExpanded] = React.useState(false);

    let description: JSX.Element;

    if (expanded) {
        description = (
            <>
                <p>
                    The game is played entirely on the keyboard. Only this help
                    icon is clickable.
                </p>
                <p>
                    {String.fromCharCode(8593)}/{String.fromCharCode(8595)} to
                    cycle options.
                </p>
                <p>Enter/Space to select.</p>
                <p>Esc. to undo commands.</p>
            </>
        );
    }

    return (
        <div className="help-menu">
            <button
                className="help-menu-trigger"
                onClick={() => setExpanded(!expanded)}
            >
                ?
            </button>
            {description}
        </div>
    );
}
