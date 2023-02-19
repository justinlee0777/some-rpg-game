export class KeydownInterceptor {
    arrowUp: Function;
    arrowDown: Function;
    enter: Function;
    space: Function;

    constructor() {
        // TODO: remember to destroy (though would we ever need to?)
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            switch (event.code) {
                case 'ArrowUp':
                    this.arrowUp?.();
                    break;
                case 'ArrowDown':
                    this.arrowDown?.();
                    break;
                case 'Enter':
                    this.enter?.();
                    break;
                case 'Space':
                    this.space?.();
                    break;
            }
        });
    }

    clear(): void {
        this.arrowUp = null;
        this.arrowDown = null;
        this.enter = null;
        this.space = null;
    }
}
