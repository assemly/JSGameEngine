import { GameObject } from "../../Engine/GameObjects/GameObject";
import { SpriteAnimateRenderable } from "../../Engine/Renderables/SpriteAnimateRenderable";
import { IllumRenderable } from "../../Engine/Renderables/IllumRenderable";
import { LightRenderable } from "../../Engine/Renderables/LightRenderable";


class Minion extends GameObject {
    constructor(gEngine, spriteTexture, normalMap, atX, atY) {
        super();
        this.kDelta = 0.2;

        if (normalMap === null) {
            this.mMinion = new LightRenderable(gEngine, spriteTexture);
        } else {
            this.mMinion = new IllumRenderable(gEngine, spriteTexture, normalMap);
        }

        this.mMinion.setColor([1, 1, 1, 0]);
        this.mMinion.getXform().setPosition(atX, atY);
        this.mMinion.getXform().setSize(9, 7.2);
        this.mMinion.getXform().setZPos(2);
        this.mMinion.setSpriteSequence(512, 0,      // first element pixel position: top-left 512 is top of image, 0 is left of image
            204, 164,    // widthxheight in pixels
            5,           // number of elements in this sequence
            0);          // horizontal padding in between
        this.mMinion.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
        this.mMinion.setAnimationSpeed(30);

        super.setRenderable(this.mMinion);


    };

    update() {
        // remember to update this.mMinion's animation
        this.mMinion.updateAnimation();
    };

}
export { Minion };