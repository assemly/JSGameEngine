import { GameObject } from "../../Engine/GameObjects/GameObject";
import { SpriteAnimateRenderable } from "../../Engine/Renderables/SpriteAnimateRenderable";
import {LightRenderable} from "../../Engine/Renderables/LightRenderable";

class Minion extends GameObject {
    constructor(gEngine, spriteTexture, atY) {
        super();
        this.gEngine = gEngine;
        this.kDelta = 0.2;
        this.mMinion = new LightRenderable(gEngine, spriteTexture);
        this.mMinion.setColor([1, 1, 1, 0]);
        this.mMinion.getXform().setPosition(Math.random() * 100, atY);
        this.mMinion.getXform().setSize(12, 9.6);
        this.mMinion.setSpriteSequence(512, 0,      // first element pixel position: top-left 512 is top of image, 0 is left of image
            204, 164,   // widthxheight in pixels
            5,          // number of elements in this sequence
            0);         // horizontal padding in between
        this.mMinion.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
        this.mMinion.setAnimationSpeed(15);
        // show each element for mAnimSpeed updates
        super.setRenderable(this.mMinion);
    };

    update() {
        // remember to update this.mMinion's animation
        this.mMinion.updateAnimation();

        // move towards the left and wraps
        var xform = this.getXform();
        xform.incXPosBy(-this.kDelta);

        // if fly off to the left, re-appear at the right
        if (xform.getXPos() < 0) {
            xform.setXPos(100);
            xform.setYPos(65 * Math.random());
        }
    };
}
export { Minion };