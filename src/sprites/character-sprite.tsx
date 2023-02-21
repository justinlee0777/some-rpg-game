import * as React from 'react';

import { GameCharacter } from '../characters/game-character';
import { Character } from 'rpg-game-engine';

function getCharacterSpriteId(character: Character): string {
    return `character-${character.type}`;
}

export function getCharacterSprite(character: Character): HTMLElement {
    const htmlId = getCharacterSpriteId(character);
    return document.getElementById(htmlId);
}

export function getCharacterSpriteAvatar(
    character: Character,
    sprite?: HTMLElement
): HTMLImageElement {
    !sprite && (sprite = getCharacterSprite(character));
    return sprite.querySelector('.avatar') as HTMLImageElement;
}

export function animateCharacterSprite(
    character: Character,
    keyframes: Array<Keyframe>,
    options: KeyframeAnimationOptions | number,
    sprite?: HTMLElement
): Animation {
    const avatar = getCharacterSpriteAvatar(character, sprite);

    return avatar.animate(keyframes, options);
}

export function setCharacterSpriteHitpoints(
    character: Character,
    sprite?: HTMLElement
): void {
    !sprite && (sprite = getCharacterSprite(character));
    const health = sprite.querySelector('.health');

    health.textContent = character.current.health.toString();
}

export function setCharacterSpriteStamina(
    character: Character,
    sprite?: HTMLElement
): void {
    !sprite && (sprite = getCharacterSprite(character));
    const stamina = sprite.querySelector('.stamina');

    stamina.textContent = character.current.stamina.toString();
}

export function CharacterSprite({
    character,
}: {
    character: GameCharacter;
}): JSX.Element {
    return (
        <div className="character" id={getCharacterSpriteId(character)}>
            <img className="avatar" src={character.ui.avatar} />
            <span className="health">{character.current.health}</span>
            <span className="stamina">{character.current.stamina}</span>
        </div>
    );
}
