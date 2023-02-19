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
                await animation();
            }
        }
    },
    { once: true }
);
