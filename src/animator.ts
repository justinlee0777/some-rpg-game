import {
    Character,
    Effect,
    EffectReaction,
    GameEvent,
    GameEventType,
    isHiding,
    OngoingEffect,
    OngoingEffectType,
    Puzzle,
} from 'rpg-game-engine';

import { SkillType } from './skills/types';
import {
    Animation,
    attackAnimation,
    damageAnimation,
    hideAnimation,
    SkillAnimation,
} from './animations';
import { SpriteHelper } from './sprites/sprite-helper';
import { setCharacterSpriteStamina } from './sprites/character-sprite';

export class Animator {
    private spriteHelper: SpriteHelper;

    private playerContainer: HTMLElement;
    private enemyContainer: HTMLElement;

    private readonly defaultAnimation: SkillAnimation = {
        beforeEffect: () => Promise.resolve(),
        runEffect: () => Promise.resolve(),
        afterEffect: () => Promise.resolve(),
    };

    constructor(private puzzle: Puzzle) {
        this.spriteHelper = new SpriteHelper();

        this.playerContainer = document.getElementById('players');
        this.enemyContainer = document.getElementById('enemies');
    }

    draw(): void {
        this.puzzle.players.forEach((player) => {
            const sprite = this.spriteHelper.get(player);
            this.playerContainer.appendChild(sprite);
        });

        this.puzzle.enemies.characters.forEach((enemy) => {
            const sprite = this.spriteHelper.get(enemy);
            this.enemyContainer.appendChild(sprite);
        });
    }

    animateEvents(events: Array<GameEvent>): Array<Animation> {
        const queue: Array<Animation> = [];

        for (const event of events) {
            switch (event.type) {
                case GameEventType.ACTION:
                    const { execute, action, effect, reaction } = event.event;
                    const { beforeEffect, runEffect, afterEffect } =
                        this.animateCommand(action.command.type, action.source);

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
                        this.animateReaction(effect, reaction, action.targets),
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
                                ].map((character) =>
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
                            ].map((character) =>
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
        sources: Array<Character>
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
        targets: Array<Character>
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
                    ...targets.map((target) => hideAnimation.applied(target)()),
                ]).then();
        }
        return () => Promise.resolve();
    }

    private animateStaminaRegen(
        character: Character,
        newStamina: number
    ): Animation {
        return () => {
            setCharacterSpriteStamina(character);
            return Promise.resolve();
        };
    }

    private animateStatusEffectRemoval(
        character: Character,
        removedEffects: Array<OngoingEffect>
    ): Animation {
        const animations: Array<Animation> = removedEffects.map(
            (ongoingEffect) => {
                switch (ongoingEffect.type) {
                    case OngoingEffectType.HIDE:
                        return hideAnimation.removed(character);
                    default:
                        return () => Promise.resolve();
                }
            }
        );

        return () =>
            Promise.all([...animations.map((animation) => animation())]).then();
    }
}
