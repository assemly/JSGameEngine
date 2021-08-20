import { GameObject } from "../../Engine/GameObjects/GameObject";
import {IllumRenderable} from "../../Engine/Renderables/IllumRenderable";

class Hero extends GameObject {

    constructor(gEngine, spriteTexture,normalMap) {
        super();
        this.gEngine = gEngine;
        this.kDelta = 0.3;

        this.mDye = new IllumRenderable(gEngine,spriteTexture, normalMap);
        this.mDye.setColor([1, 1, 1, 0]);
        this.mDye.getXform().setPosition(35, 50);
        this.mDye.getXform().setSize(9, 12);
        this.mDye.setElementPixelPositions(0, 120, 0, 180);
        super.setRenderable(this.mDye);
    };

    update() {
        // control by WASD
        var xform = this.getXform();
        if (this.gEngine.Input.isKeyPressed(this.gEngine.Input.keys.W)) {
            xform.incYPosBy(this.kDelta);
        }
        if (this.gEngine.Input.isKeyPressed(this.gEngine.Input.keys.S)) {
            xform.incYPosBy(-this.kDelta);
        }
        if (this.gEngine.Input.isKeyPressed(this.gEngine.Input.keys.A)) {
            xform.incXPosBy(-this.kDelta);
        }
        if (this.gEngine.Input.isKeyPressed(this.gEngine.Input.keys.D)) {
            xform.incXPosBy(this.kDelta);
        }
    };
}
export { Hero };