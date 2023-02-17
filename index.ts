import './index.scss';

import { ActionCoordinator, Character, Puzzle } from 'rpg-game-engine';

import { UIImpl } from './src/ui-impl';
import { HiderAI } from './src/ai';
import { Burn, CharacterType, Hider } from './src/characters';

document.addEventListener(
    'DOMContentLoaded',
    async () => {
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
    },
    { once: true }
);
