import { CommandDescription } from 'commands/command-description-factory';
import { Character } from 'rpg-game-engine';

import { getCharacterSpriteAvatar } from '../sprites/character-sprite';
import { htmlStringToElement } from '../sprites/html-string-to-element';

const commandMenuTemplate = `
<div id="commands">
    <div id="commands-player-roulette"></div>
    <div id="commands-roulette"></div>
    <div id="commands-target-roulette"></div>
</div>
`;

const commandMenuPlayerSlotTemplate = `
<div class="player-roulette-slot">
    <img/>
</div>
`;

const commandMenuButtonTemplate = `
<button class="command-roulette-slot"></button>
`;

const commandMenuTargetSlotTemplate = `
<div class="target-roulette-slot">
    <img/>
</div>
`;

export function getCommandMenu(): HTMLElement {
    return document.getElementById('commands');
}

export function createCommandMenu(): HTMLElement {
    const commandMenuElement = htmlStringToElement(commandMenuTemplate);

    return commandMenuElement;
}

export function resetCommandMenu(): void {
    document.getElementById('commands-roulette').innerHTML = '';
    document.getElementById('commands-target-roulette').innerHTML = '';
}

export function getCommandMenuPlayerRouletteId(player: Character): string {
    return `player-roulette-slot-${player.constructor}`;
}

export function createCommandMenuPlayerRoulette(
    players: Array<Character>,
    commandMenu?: HTMLElement
): void {
    !commandMenu && (commandMenu = getCommandMenu());
    const roulette = document.getElementById('commands-player-roulette');

    players.forEach((player) => {
        const playerSlot = htmlStringToElement(commandMenuPlayerSlotTemplate);
        playerSlot.id = getCommandMenuPlayerRouletteId(player);

        const image = playerSlot.querySelector('img');

        const originalAvatar = getCharacterSpriteAvatar(player);

        image.src = originalAvatar.src;

        roulette.appendChild(playerSlot);
    });
}

export function createCommandMenuRoulette(
    commands: Array<CommandDescription>,
    commandMenu?: HTMLElement
): void {
    !commandMenu && (commandMenu = getCommandMenu());
    const roulette = document.getElementById('commands-roulette');

    commands.forEach((command) => {
        const commandMenuButton = createCommandMenuButton(command);

        roulette.appendChild(commandMenuButton);
    });
}

export function createCommandMenuButton(
    command: CommandDescription
): HTMLElement {
    const commandMenuButtonElement = htmlStringToElement(
        commandMenuButtonTemplate
    );

    commandMenuButtonElement.textContent = command.displayName;

    commandMenuButtonElement.id = command.htmlId;

    return commandMenuButtonElement;
}

export function getCommandMenuTargetRouletteId(player: Character): string {
    return `target-roulette-slot-${player.constructor}`;
}

export function createCommandMenuTargetRoulette(
    characters: Array<Character>,
    commandMenu?: HTMLElement
): void {
    !commandMenu && (commandMenu = getCommandMenu());
    const roulette = document.getElementById('commands-target-roulette');

    characters.forEach((character) => {
        const playerSlot = htmlStringToElement(commandMenuPlayerSlotTemplate);
        playerSlot.id = getCommandMenuTargetRouletteId(character);

        const image = playerSlot.querySelector('img');

        const originalAvatar = getCharacterSpriteAvatar(character);

        image.src = originalAvatar.src;

        roulette.appendChild(playerSlot);
    });
}

export function setUpCommandMenuListeners<T>(
    options: Array<T>,
    getOptionId: (option: T) => string
): Promise<T> {
    return new Promise((resolve) => {
        let index = 0;

        const updateTarget = () => {
            const selectedClass = 'selected';

            options.forEach((option, i) => {
                const currentId = getOptionId(option);
                const current = document.getElementById(currentId);

                if (i === index) {
                    current.classList.add(selectedClass);

                    setTimeout(() => {
                        // Broken for Chrome.
                        current.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start',
                            inline: 'nearest',
                        });
                    }, 0);
                } else {
                    current.classList.remove(selectedClass);
                }
            });
        };

        const endIndex = options.length - 1;

        const listenToKeyboardEvents = (event: KeyboardEvent) => {
            switch (event.code) {
                case 'ArrowUp':
                    index = index <= 0 ? endIndex : index - 1;
                    updateTarget();
                    break;
                case 'ArrowDown':
                    index = index >= endIndex ? 0 : index + 1;
                    updateTarget();
                    break;
                case 'Enter':
                case 'Space':
                    document.removeEventListener(
                        'keydown',
                        listenToKeyboardEvents
                    );
                    resolve(options[index]);
                    break;
            }
        };

        updateTarget();
        document.addEventListener('keydown', listenToKeyboardEvents);
    });
}
