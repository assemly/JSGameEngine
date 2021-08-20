import { GameObject } from "../../Engine/GameObjects/GameObject";
import { SpriteAnimateRenderable } from "../../Engine/Renderables/SpriteAnimateRenderable";
import { RigidCircle } from "../../Engine/Physics/RigidCircle";
import {vec2} from "../../Engine/Lib/gl-matrix";

class Minion extends GameObject {
    constructor(gEngine, spriteTexture, atX, atY) {
        super();
        this.kSpeed = 5;
        this.mMinion = new SpriteAnimateRenderable(gEngine, spriteTexture);

        this.mMinion.setColor([1, 1, 1, 0]);
        this.mMinion.getXform().setPosition(atX, atY);
        this.mMinion.getXform().setSize(18, 14.4);
        this.mMinion.setSpriteSequence(512, 0,      // first element pixel position: top-left 512 is top of image, 0 is left of image
            204, 164,    // widthxheight in pixels
            5,           // number of elements in this sequence
            0);          // horizontal padding in between
        this.mMinion.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
        this.mMinion.setAnimationSpeed(30);
        // show each element for mAnimSpeed updates
        super.setRenderable(this.mMinion);

        var r = new RigidCircle(gEngine, this.getXform(), 6.5);
        r.setMass(2);
        r.setAcceleration([0, 0]);
        r.setFriction(0);
        r.setColor([0, 1, 0, 1]);
        r.setDrawBounds(true);
        if (Math.random() > 0.5) {
            r.setVelocity([this.kSpeed, 0]);
        } else {
            r.setVelocity([-this.kSpeed, 0]);
        }
        this.setPhysicsComponent(r);

        this.mHasCollision = false;
    };

    update() {
        super.update();
        // remember to update this.mMinion's animation
        this.mMinion.updateAnimation();

        if (this.mHasCollision) {
            this.flipVelocity();
            this.mHasCollision = false;
        }
    };

    flipVelocity() {
        var v = this.getPhysicsComponent().getVelocity();
        vec2.scale(v, v, -1);
    };

    hasCollision() {
        this.mHasCollision = true;
    };

}
export { Minion };