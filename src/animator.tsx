import {
    Effect,
    GameEvent,
    GameEventType,
    OngoingEffect,
    Puzzle,
} from 'rpg-game-engine';
import * as React from 'react';
import { createRoot } from 'react-dom/client';

import { SkillType } from './skills/types';
import {
    Animation,
    attackAnimation,
    damageAnimation,
    SkillAnimation,
} from './animations';
import {
    CharacterSprite,
    getCharacterSpriteAvatar,
    setCharacterSpriteStamina,
} from './sprites/character-sprite';
import { GameCharacter } from './characters/game-character';
import { HelpMenu } from './ui-input/help-menu';
import { GameOngoingEffect } from './ongoing-effects';

export class Animator {
    private readonly defaultAnimation: SkillAnimation = {
        beforeEffect: () => Promise.resolve(),
        runEffect: () => Promise.resolve(),
        afterEffect: () => Promise.resolve(),
    };

    constructor(private puzzle: Puzzle) {}

    draw(): void {
        const playerContainer = createRoot(document.getElementById('players'));
        const enemyContainer = createRoot(document.getElementById('enemies'));

        const playerSprites = this.puzzle.players.map(
            (player: GameCharacter) => (
                <CharacterSprite
                    character={player}
                    key={player.constructor.toString()}
                />
            )
        );

        const enemySprites = this.puzzle.enemies.characters.map(
            (enemy: GameCharacter) => (
                <CharacterSprite
                    character={enemy}
                    key={enemy.constructor.toString()}
                />
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
            switch (event.type) {
                case GameEventType.ACTION:
                    const { execute, source, command } = event.event;
                    const { beforeEffect, runEffect, afterEffect } =
                        this.animateCommand(
                            command.type,
                            source.map(
                                ({ character }) => character
                            ) as Array<GameCharacter>
                        );

                    queue.push(
                        beforeEffect,
                        () =>
                            Promise.all([
                                new Promise((resolve) => resolve(execute())),
                                runEffect(),
                            ]).then(),
                        this.animateReaction(event.event),
                        afterEffect
                    );
                    break;
                case GameEventType.STAMINA_REGEN:
                    queue.push(
                        () =>
                            new Promise((resolve) =>
                                resolve(event.event.execute())
                            ),
                        () =>
                            Promise.all(
                                [
                                    ...this.puzzle.players,
                                    ...this.puzzle.enemies.characters,
                                ].map((character: GameCharacter) =>
                                    this.animateStaminaRegen(
                                        character,
                                        character.current.stamina
                                    )
                                )
                            ).then()
                    );
                    break;
                case GameEventType.ONGOING_EFFECT:
                    queue.push(() => {
                        const map = event.event.execute();

                        return Promise.all(
                            [
                                ...this.puzzle.players,
                                ...this.puzzle.enemies.characters,
                            ].map((character: GameCharacter) =>
                                this.animateStatusEffectRemoval(
                                    character,
                                    map.get(character)
                                )()
                            )
                        ).then();
                    });
                    break;
            }
        }

        return queue;
    }

    private animateCommand(
        type: string,
        sources: Array<GameCharacter>
    ): SkillAnimation {
        switch (type) {
            case SkillType.ATTACK:
                return attackAnimation(sources[0]);
            default:
                return this.defaultAnimation;
        }
    }

    private animateReaction(effect: Effect): Animation {
        return () =>
            Promise.all([
                ...effect.targets.map((targetEffect) => {
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

    private animateStaminaRegen(
        character: GameCharacter,
        newStamina: number
    ): Animation {
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
