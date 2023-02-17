import {
    Character,
    Effect,
    EffectReaction,
    isHiding,
    OngoingEffect,
    OngoingEffectType,
} from 'rpg-game-engine';
import { Animation, Animator, SkillAnimation } from 'rpg-game-engine/ui';

import { CharacterSpriteMap } from './character-sprite-map';

import { damageAnimation } from './reaction-animations/damage-animation';
import { attackAnimation } from './skill-animations/attack-animation';
import { hideAnimation } from './ongoing-effect-animations/hide-animation';
import { CharacterType } from './characters';
import { SkillType } from './skills/types';

export class AnimatorImpl implements Animator {
    private readonly defaultAnimation: SkillAnimation = {
        beforeEffect: () => Promise.resolve(),
        runEffect: () => Promise.resolve(),
        afterEffect: () => Promise.resolve(),
    };

    constructor(private characterSpriteMap: CharacterSpriteMap) {}

    animateCommand(type: string, sources: Array<Character>): SkillAnimation {
        switch (type) {
            case SkillType.ATTACK:
            case SkillType.FASTER_ATTACK:
            case SkillType.FASTEST_ATTACK:
                return attackAnimation(sources[0], this.characterSpriteMap);
            default:
                return this.defaultAnimation;
        }
    }

    animateReaction(
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
                            return damageAnimation(
                                target,
                                this.characterSpriteMap
                            )();
                        }
                    }),
                ]).then();
        } else if (effect.hiding) {
            return () =>
                Promise.all([
                    ...targets.map((target) =>
                        hideAnimation.applied(target, this.characterSpriteMap)()
                    ),
                ]).then();
        }
        return () => Promise.resolve();
    }

    animateStaminaRegen(character: Character, newStamina: number): Animation {
        const sprite = this.characterSpriteMap.get(
            character.constructor as CharacterType
        );
        return () => {
            sprite.setStamina(newStamina.toString());
            return Promise.resolve();
        };
    }

    animateStatusEffectRemoval(
        character: Character,
        removedEffects: Array<OngoingEffect>
    ): Animation {
        const animations: Array<Animation> = removedEffects.map(
            (ongoingEffect) => {
                switch (ongoingEffect.type) {
                    case OngoingEffectType.HIDE:
                        return hideAnimation.removed(
                            character,
                            this.characterSpriteMap
                        );
                    default:
                        return () => Promise.resolve();
                }
            }
        );

        return () =>
            Promise.all([...animations.map((animation) => animation())]).then();
    }
}
