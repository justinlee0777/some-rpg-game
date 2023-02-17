import { Character } from 'rpg-game-engine';
import { htmlStringToElement } from './html-string-to-element';

export interface Sprite {
    character: Character;

    htmlElement: HTMLElement;

    avatar: HTMLElement;

    animateAvatar(
        keyframes: Array<Keyframe>,
        options: KeyframeAnimationOptions | number
    ): Animation;

    setHitpoints(hitpoints: string): void;

    setStamina(stamina: string): void;
}

const spriteTemplate = `
<div class="character">
    <img class="avatar" />
    <span class="health"></span>
    <span class="stamina"></span>
</div>
`;

export function createSprite(character: Character, imgSrc: string): Sprite {
    const html = htmlStringToElement(spriteTemplate);

    const avatar = html.querySelector('.avatar') as HTMLImageElement;
    avatar.src = imgSrc;

    const health = html.querySelector('.health');

    const setHitpoints = (healthString: string) =>
        (health.textContent = healthString);

    setHitpoints(character.current.health.toString());

    const stamina = html.querySelector('.stamina');

    const setStamina = (staminaString: string) =>
        (stamina.textContent = staminaString);

    setStamina(character.current.stamina.toString());

    return {
        character,
        htmlElement: html,
        avatar,
        animateAvatar: (
            keyframes: Array<Keyframe>,
            options: KeyframeAnimationOptions | number
        ) => {
            return avatar.animate(keyframes, options);
        },
        setHitpoints,
        setStamina,
    };
}
