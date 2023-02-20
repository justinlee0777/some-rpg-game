import './index.scss';

import { Engine, GameEventType, Puzzle } from 'rpg-game-engine';

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

        const engine = new Engine(puzzle);
        const uiInputCoordinator = new UIInputCoordinator(puzzle, engine);
        const animator = new Animator(puzzle);

        animator.draw();

        let gameEnd = false;
        while (!gameEnd) {
            const inputs = await uiInputCoordinator.listenForUserInput();
            const events = await engine.getResults(inputs);
            const animations = await animator.animateEvents(events);

            for (const animation of animations) {
                await animation();
            }

            gameEnd = events.some(
                (event) => event.type === GameEventType.END_GAME
            );
        }
    },
    { once: true }
);
