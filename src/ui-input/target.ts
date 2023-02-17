import { htmlStringToElement } from '../sprites/html-string-to-element';

const targetTemplate = `
<div class="target"></div>
`;

export function createTarget(): HTMLElement {
    return htmlStringToElement(targetTemplate);
}
