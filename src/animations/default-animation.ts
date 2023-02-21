import { SkillAnimation } from './skill-animation.interface';

export const defaultAnimation: SkillAnimation = {
    beforeEffect: () => Promise.resolve(),
    runEffect: () => Promise.resolve(),
    afterEffect: () => Promise.resolve(),
};
