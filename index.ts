import { ActionCoordinator, Character, Puzzle } from 'rpg-game-engine';

import { UIImpl } from './src';
import { HiderAI } from './src/ai';
import { CharacterType, Hider } from './src/characters';
import { Sprite } from './src/sprites/sprite';

document.addEventListener(
    'DOMContentLoaded',
    () => {
        const actionCoordinator = new ActionCoordinator(UIImpl);
        const players = [new Hider()];
        const enemies = new HiderAI();

        const allSprites: Array<Sprite> = [];

        const setMap = (character: Character) => {
            const constructorFn = character.constructor as CharacterType;

            const element = UIImpl.SpriteHelper.get(character);
            UIImpl.CharacterSpriteMap.set(constructorFn, element.sprite);

            allSprites.push(element.sprite);

            return element;
        };

        players.forEach((player) => {
            const element = setMap(player);
            UIImpl.SpriteDrawer.draw(element, {
                character: player,
                player: true,
            });
        });

        enemies.characters.forEach((enemy) => {
            const element = setMap(enemy);
            UIImpl.SpriteDrawer.draw(element, {
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

        Promise.all([...allSprites.map((sprite) => sprite.doneDrawing)]).then(
            async () => {
                while (!gameEnd()) {
                    const actions = await UIImpl.listenForUserInput(
                        players,
                        enemies.characters
                    );

                    await actionCoordinator.iterateGame(
                        puzzle,
                        actions,
                        enemies
                    );
                }
            }
        );
    },
    { once: true }
);
