import { AnimatorImpl } from './animator-impl';
import { CharacterSpriteMapInstance } from './character-sprite-map-impl';
import { SpriteDrawerImpl } from './sprite-drawer-impl';
import { SpriteHelperImpl } from './sprite-helper-impl';
import { listenForUserInputFactory } from './ui-input-impl';

export namespace UIImpl {
    export const Animator = new AnimatorImpl();

    export const CharacterSpriteMap = CharacterSpriteMapInstance;

    export const SpriteDrawer = new SpriteDrawerImpl();

    export const SpriteHelper = new SpriteHelperImpl();

    export const listenForUserInput = listenForUserInputFactory();
}
