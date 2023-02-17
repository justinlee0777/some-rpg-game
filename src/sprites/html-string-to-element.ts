export function htmlStringToElement(htmlString: string): HTMLElement {
    const template = document.createElement('template');
    htmlString = htmlString.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = htmlString;
    return template.content.firstChild as HTMLElement;
}

export function htmlStringToList(htmlString): Array<HTMLElement> {
    const template = document.createElement('template');
    htmlString = htmlString.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = htmlString;
    return [...template.content.childNodes] as Array<HTMLElement>;
}
