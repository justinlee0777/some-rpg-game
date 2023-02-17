import { UIInputCoordinator } from './ui-input/ui-input-coordinator';
import { AnimatorImpl } from './animator-impl';
import { characterSpriteMapFactory } from './character-sprite-map';
import { SpriteDrawerImpl } from './sprite-drawer-impl';
import { SpriteHelperImpl } from './sprite-helper-impl';
import { CommandDescriptionFactory } from './commands/command-description-factory';

export class UIImpl {
    CharacterSpriteMap = characterSpriteMapFactory();

    Animator = new AnimatorImpl(this.CharacterSpriteMap);

    SpriteDrawer = new SpriteDrawerImpl();

    SpriteHelper = new SpriteHelperImpl();

    UIInputCoordinator = new UIInputCoordinator(
        this.CharacterSpriteMap,
        new CommandDescriptionFactory()
    );
}
