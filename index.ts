import './index.scss';

import { Engine, Puzzle } from 'rpg-game-engine';

import { HiderAI } from './src/ai';
import { Burn, Hider } from './src/characters';
import { UIInputCoordinator } from './src/ui-input/ui-input-coordinator';
import { Animator } from './src/animator';

document.addEventListener(
    'DOMContentLoaded',
    async () => {
        const puzzle: Puzzle = {
            players: [new Hider(), new Burn()],
            enemies: new HiderAI(),
            victoryConditions: [
                (enemies) => enemies.every((e) => e.current.health <= 0),
            ],
            loseConditions: [
                (players) => players.every((e) => e.current.health <= 0),
            ],
        };

        const uiInputCoordinator = new UIInputCoordinator(puzzle);
        const engine = new Engine(puzzle);
        const animator = new Animator(puzzle);

        animator.draw();

        while (true) {
            const inputs = await uiInputCoordinator.listenForUserInput();
            const events = await engine.getResults(inputs);
            const animations = await animator.animateEvents(events);

            for (const animation of animations) {
                await animation;
            }
        }

        /*
        const uiImpl = new UIImpl();

        const actionCoordinator = new ActionCoordinator(uiImpl);
        const players = [new Hider(), new Burn()];
        const enemies = new HiderAI();

        const setMap = (character: Character) => {
            const constructorFn = character.constructor as CharacterType;

            const element = uiImpl.SpriteHelper.get(character);
            uiImpl.CharacterSpriteMap.set(constructorFn, element);

            return element;
        };

        players.forEach((player) => {
            const element = setMap(player);
            uiImpl.SpriteDrawer.draw(element, {
                character: player,
                player: true,
            });
        });

        enemies.characters.forEach((enemy) => {
            const element = setMap(enemy);
            uiImpl.SpriteDrawer.draw(element, {
                character: enemy,
                player: false,
            });
        });

        const puzzle: Puzzle = {
            players,
            enemies,
            victoryConditions: [
                (enemyCharacters) =>
                    enemyCharacters.every((e) => e.current.health <= 0),
            ],
            loseConditions: [
                (playerCharacters) =>
                    playerCharacters.every((p) => p.current.health <= 0),
            ],
        };

        const gameEnd = () => {
            const win = puzzle.victoryConditions.some((victoryCondition) =>
                victoryCondition(enemies.characters)
            );
            const lose = puzzle.loseConditions.some((loseCondition) =>
                loseCondition(players)
            );

            return win || lose;
        };

        while (!gameEnd()) {
            const actions = await uiImpl.UIInputCoordinator.listenForUserInput(
                players,
                enemies.characters
            );

            await actionCoordinator.iterateGame(puzzle, actions, enemies);
        }
        */
    },
    { once: true }
);
