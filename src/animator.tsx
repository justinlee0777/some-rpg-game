import {
    Effect,
    EffectReaction,
    GameEvent,
    GameEventType,
    isHiding,
    OngoingEffect,
    OngoingEffectType,
    Puzzle,
} from 'rpg-game-engine';
import * as React from 'react';
import { createRoot } from 'react-dom/client';

import { SkillType } from './skills/types';
import {
    Animation,
    attackAnimation,
    damageAnimation,
    hideAnimation,
    SkillAnimation,
} from './animations';
import {
    CharacterSprite,
    getCharacterSpriteAvatar,
    setCharacterSpriteStamina,
} from './sprites/character-sprite';
import { GameCharacter } from './characters/game-character';

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
    }

    animateEvents(events: Array<GameEvent>): Array<Animation> {
        const queue: Array<Animation> = [];

        for (const event of events) {
            switch (event.type) {
                case GameEventType.ACTION:
                    const { execute, action, effect, reaction } = event.event;
                    const { beforeEffect, runEffect, afterEffect } =
                        this.animateCommand(
                            action.command.type,
                            action.source as Array<GameCharacter>
                        );

                    queue.push(
                        () => new Promise((resolve) => resolve(execute())),
                        beforeEffect,
                        () =>
                            Promise.all([
                                new Promise((resolve) =>
                                    resolve(effect.execute())
                                ),
                                runEffect(),
                            ]).then(),
                        this.animateReaction(
                            effect,
                            reaction,
                            action.targets as Array<GameCharacter>
                        ),
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
            case SkillType.FASTER_ATTACK:
            case SkillType.FASTEST_ATTACK:
                return attackAnimation(sources[0]);
            default:
                return this.defaultAnimation;
        }
    }

    private animateReaction(
        effect: Effect,
        reaction: EffectReaction,
        targets: Array<GameCharacter>
    ): Animation {
        if (reaction.foiled) {
            // TODO implement when implementing a foiling skill.
        }

        if (effect.damaging) {
            return () =>
                Promise.all([
                    ...targets.map((target) => {
                        if (isHiding(target)) {
                            return Promise.resolve();
                        } else {
                            return damageAnimation(target)();
                        }
                    }),
                ]).then();
        } else if (effect.hiding) {
            return () =>
                Promise.all([
                    ...targets.map((target) => {
                        const characterSprite =
                            getCharacterSpriteAvatar(target);
                        return hideAnimation.applied(characterSprite)();
                    }),
                ]).then();
        }
        return () => Promise.resolve();
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
            (ongoingEffect) => {
                switch (ongoingEffect.type) {
                    case OngoingEffectType.HIDE:
                        const characterSprite =
                            getCharacterSpriteAvatar(character);
                        return hideAnimation.removed(characterSprite);
                    default:
                        return () => Promise.resolve();
                }
            }
        );

        return () =>
            Promise.all([...animations.map((animation) => animation())]).then();
    }
}
