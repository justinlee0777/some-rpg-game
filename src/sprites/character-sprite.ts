import { Character } from 'rpg-game-engine';
import { htmlStringToElement } from './html-string-to-element';

const spriteTemplate = `
<div class="character">
    <img class="avatar" />
    <span class="health"></span>
    <span class="stamina"></span>
</div>
`;

function getCharacterSpriteId(character: Character): string {
    return `character-${character.constructor}`;
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

export function createCharacterSprite(
    character: Character,
    imgSrc: string
): HTMLElement {
    const html = htmlStringToElement(spriteTemplate);
    html.id = getCharacterSpriteId(character);

    const avatar = html.querySelector('.avatar') as HTMLImageElement;
    avatar.src = imgSrc;

    setCharacterSpriteHitpoints(character, html);

    setCharacterSpriteStamina(character, html);

    return html;
}
