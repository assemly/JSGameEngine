/* File: ParticleGameObject.js 
 *
 * support particle object particulars: color change and expiration
 */
import { GameObject } from "../GameObjects/GameObject";
import { ParticleRenderable } from "../Renderables/ParticleRenderable";
import { Particle } from "./Particle";
import { vec4 } from "../Lib/gl-matrix";

class ParticleGameObject extends GameObject {
    constructor(gEngine, texture, atX, atY, cyclesToLive) {
        super();
        var renderableObj = new ParticleRenderable(gEngine, texture);
        var xf = renderableObj.getXform();
        xf.setPosition(atX, atY);
        super.setRenderable(renderableObj);

        var p = new Particle(gEngine, xf.getPosition());
        this.setPhysicsComponent(p);

        this.mDeltaColor = [0, 0, 0, 0];
        this.mSizeDelta = 0;
        this.mCyclesToLive = cyclesToLive;
    };


    setFinalColor(f) {
        vec4.sub(this.mDeltaColor, f, this.mRenderComponent.getColor());
        if (this.mCyclesToLive !== 0) {
            vec4.scale(this.mDeltaColor, this.mDeltaColor, 1 / this.mCyclesToLive);
        }
    };
    setSizeDelta(d) {
        this.mSizeDelta = d;
    };

    hasExpired() {
        return (this.mCyclesToLive < 0);
    };

    update() {
        super.update();

        this.mCyclesToLive--;
        var c = this.mRenderComponent.getColor();
        vec4.add(c, c, this.mDeltaColor);

        var xf = this.getXform();
        var s = xf.getWidth() * this.mSizeDelta;
        xf.setSize(s, s);
    };
}

export { ParticleGameObject };