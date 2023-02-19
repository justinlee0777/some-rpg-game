import { Animation } from './animation.interface';

/**
 * Represents the necessary animations for a skill.
 */
export interface SkillAnimation {
    /** Ran before a skill is executed (ex. a character running up to an enemy). */
    beforeEffect: Animation;
    /** Ran when a skill is executed and calculated (ex. a character kicking an enemy). */
    runEffect: Animation;
    /**
     * Ran after a skill is executed (ex. a character running away from an enemy).
     */
    afterEffect: Animation;
}
