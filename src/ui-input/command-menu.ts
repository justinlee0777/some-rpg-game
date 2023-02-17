import { CommandDescription } from 'commands/command-description-factory';

import { htmlStringToElement } from '../sprites/html-string-to-element';

const commandMenuTemplate = `
<div class="commands"></div>
`;

const commandMenuButtonTemplate = `
<button></button>
`;

export function createCommandMenu(
    commands: Array<CommandDescription>
): HTMLElement {
    const commandMenuElement = htmlStringToElement(commandMenuTemplate);

    commands.forEach((command) => {
        const commandMenuButton = createCommandMenuButton(command);

        commandMenuElement.appendChild(commandMenuButton);
    });

    return commandMenuElement;
}

export function createCommandMenuButton(
    command: CommandDescription
): HTMLElement {
    const commandMenuButtonElement = htmlStringToElement(
        commandMenuButtonTemplate
    );

    commandMenuButtonElement.textContent = command.displayName;

    commandMenuButtonElement.className = command.htmlId;

    return commandMenuButtonElement;
}
