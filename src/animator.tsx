import {
    Effect,
    EffectedCharacter,
    EffectType,
    GameEvent,
    OngoingEffect,
    Puzzle,
} from 'rpg-game-engine';
import * as React from 'react';
import { createRoot } from 'react-dom/client';

import { Animation, damageAnimation } from './animations';
import {
    CharacterSprite,
    getCharacterSpriteAvatar,
    setCharacterSpriteStamina,
} from './sprites/character-sprite';
import { GameCharacter } from './characters/game-character';
import { HelpMenu } from './ui-input/help-menu';
import { GameOngoingEffect } from './ongoing-effects';
import { GameCommand } from './commands/game-command';

export class Animator {
    constructor(private puzzle: Puzzle) {}

    draw(): void {
        const playerContainer = createRoot(document.getElementById('players'));
        const enemyContainer = createRoot(document.getElementById('enemies'));

        const playerSprites = this.puzzle.players.map(
            (player: GameCharacter) => (
                <CharacterSprite character={player} key={player.type} />
            )
        );

        const enemySprites = this.puzzle.enemies.characters.map(
            (enemy: GameCharacter) => (
                <CharacterSprite character={enemy} key={enemy.type} />
            )
        );

        playerContainer.render(<>{playerSprites}</>);

        enemyContainer.render(<>{enemySprites}</>);

        const helpElement = createRoot(document.getElementById('help'));
        helpElement.render(<HelpMenu />);
    }

    animateEvents(events: Array<GameEvent>): Array<Animation> {
        const queue: Array<Animation> = [];

        for (const event of events) {
            const effect: Effect = event.event;

            switch (effect.type) {
                case EffectType.ACTION:
                    const { execute, source, command } = effect;
                    const { beforeEffect, runEffect, afterEffect } = (
                        command as GameCommand
                    ).ui.animation(source[0].character);

                    queue.push(
                        beforeEffect,
                        () =>
                            Promise.all([
                                new Promise((resolve) => resolve(execute())),
                                runEffect(),
                            ]).then(),
                        this.animateReaction(effect.targets),
                        afterEffect
                    );
                    break;
                case EffectType.STAMINA_REGEN:
                    queue.push(
                        () =>
                            new Promise((resolve) => resolve(effect.execute())),
                        () =>
                            Promise.all(
                                [
                                    ...this.puzzle.players,
                                    ...this.puzzle.enemies.characters,
                                ].map((character: GameCharacter) =>
                                    this.animateStaminaRegen(character)
                                )
                            ).then()
                    );
                    break;
                case EffectType.ONGOING_EFFECT:
                    queue.push(
                        () =>
                            new Promise((resolve) => resolve(effect.execute())),
                        this.animateReaction(effect.characters),
                        () =>
                            Promise.all(
                                [...effect.characters].map((character) =>
                                    this.animateStatusEffectRemoval(
                                        character.character as GameCharacter,
                                        character.delta.ongoingEffects.removed
                                    )()
                                )
                            ).then()
                    );
                    break;
            }
        }

        return queue;
    }

    private animateReaction(characters: Array<EffectedCharacter>): Animation {
        return () =>
            Promise.all([
                ...characters.map((targetEffect) => {
                    return new Promise((resolve) => {
                        if (targetEffect.delta.health < 0) {
                            return resolve(
                                damageAnimation(targetEffect.character)()
                            );
                        } else {
                            return resolve(undefined);
                        }
                    }).then(async () => {
                        const appliedEffects = targetEffect.delta.ongoingEffects
                            .added as Array<GameOngoingEffect>;
                        if (appliedEffects) {
                            for (const appliedEffect of appliedEffects) {
                                const characterSprite =
                                    getCharacterSpriteAvatar(
                                        targetEffect.character
                                    );
                                await appliedEffect.ui.animation.applied(
                                    characterSprite
                                )();
                            }
                        }
                    });
                }),
            ]).then();
    }

    private animateStaminaRegen(character: GameCharacter): Animation {
        return () => {
            setCharacterSpriteStamina(character);
            return Promise.resolve();
        };
    }

    private animateStatusEffectRemoval(
        character: GameCharacter,
        removedEffects: Array<OngoingEffect>
    ): Animation {
        const animations: Array<Animation> = removedEffects.map(
            (ongoingEffect: GameOngoingEffect) => {
                const characterSprite = getCharacterSpriteAvatar(character);
                return ongoingEffect.ui.animation.removed(characterSprite);
            }
        );

        return () =>
            Promise.all([...animations.map((animation) => animation())]).then();
    }
}
