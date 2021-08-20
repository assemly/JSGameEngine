import { GameObject } from "../../Engine/GameObjects/GameObject";
import { IllumRenderable } from "../../Engine/Renderables/IllumRenderable";
import { LightRenderable } from "../../Engine/Renderables/LightRenderable";
import { RigidCircle } from "../../Engine/Physics/RigidCircle";

class Hero extends GameObject {

    constructor(gEngine, spriteTexture, normalMap) {
        super();
        this.gEngine = gEngine;
        this.kDelta = 0.3;

        if (normalMap !== null) {
            this.mDye = new IllumRenderable(gEngine, spriteTexture, normalMap);
        } else {
            this.mDye = new LightRenderable(gEngine, spriteTexture);
        }
        this.mDye.setColor([1, 1, 1, 0]);
        this.mDye.getXform().setPosition(35, 50);
        this.mDye.getXform().setSize(9, 12);
        this.mDye.setElementPixelPositions(0, 120, 0, 180);
        super.setRenderable(this.mDye);

        let r = new RigidCircle(gEngine,this.getXform(),9);
        r.setColor([1,1,0,1]);
        r.setDrawBounds(true);
        this.setPhysicsComponent(r);
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