import { Character } from 'rpg-game-engine';
import * as React from 'react';

import { Sprite } from './sprite';

export class HiderSprite extends React.Component<Sprite> implements Sprite {
    character: Character;

    avatar: React.RefObject<HTMLImageElement>;

    hitpoints: React.RefObject<HTMLElement>;

    stamina: React.RefObject<HTMLElement>;

    constructor(props: Sprite) {
        super(props);

        this.character = props.character;
        this.avatar = props.avatar;
        this.hitpoints = props.hitpoints;
        this.stamina = props.stamina;
    }

    render() {
        const src = './assets/garbage-can.png';

        return (
            <div className="character">
                <img className="avatar" ref={this.avatar} src={src} />
                <span className="health" ref={this.hitpoints}>
                    {this.character.current.health}
                </span>
                <span className="stamina" ref={this.stamina}>
                    {this.character.current.stamina}
                </span>
            </div>
        );
    }
}
