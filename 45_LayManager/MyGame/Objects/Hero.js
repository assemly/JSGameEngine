import { GameObject } from "../../Engine/GameObjects/GameObject";
import { IllumRenderable } from "../../Engine/Renderables/IllumRenderable";
import { LightRenderable } from "../../Engine/Renderables/LightRenderable";

class Hero extends GameObject {

    constructor(gEngine, spriteTexture, normalMap, atX, atY) {
        super();
        this.gEngine = gEngine;
        this.kDelta = 0.3;
        if (normalMap !== null) {
            this.mDye = new IllumRenderable(gEngine, spriteTexture, normalMap);
        } else {
            this.mDye = new LightRenderable(gEngine, spriteTexture);
        }
        this.mDye.setColor([1, 1, 1, 0]);
        this.mDye.getXform().setPosition(atX, atY);
        this.mDye.getXform().setZPos(5);
        this.mDye.getXform().setSize(9, 12);
        this.mDye.setElementPixelPositions(0, 120, 0, 180);
        super.setRenderable(this.mDye);
    };

    update(dyePacks, allParticles, func) {
        super.update();
        const gEngine = this.gEngine;
        // control by WASD
        var xform = this.getXform();
        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.W)) {
            xform.incYPosBy(this.kDelta);
        }
        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.S)) {
            xform.incYPosBy(-this.kDelta);
        }
        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.A)) {
            xform.incXPosBy(-this.kDelta);
        }
        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
            xform.incXPosBy(this.kDelta);
        }
    };
}
export { Hero };