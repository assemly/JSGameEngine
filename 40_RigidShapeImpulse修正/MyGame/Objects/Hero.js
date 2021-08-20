import { GameObject } from "../../Engine/GameObjects/GameObject";
import { SpriteRenderable } from "../../Engine/Renderables/SpriteRenderable";
import { RigidRectangle } from "../../Engine/Physics/RigidRectangle";

class Hero extends GameObject {

    constructor(gEngine, spriteTexture, atX, atY) {
        super();
        this.gEngine = gEngine;
        this.kXDelta = 1;
        this.kYDelta = 2.0;
        this.mDye = new SpriteRenderable(gEngine, spriteTexture);
        this.mDye.setColor([1, 1, 1, 0]);
        this.mDye.getXform().setPosition(atX, atY);
        this.mDye.getXform().setSize(18, 24);
        this.mDye.setElementPixelPositions(0, 120, 0, 180);
        super.setRenderable(this.mDye);

        var r = new RigidRectangle(gEngine, this.getXform(), 16, 22);
        r.setMass(0.7);  // less dense than Minions
        r.setRestitution(0.3);
        r.setColor([0, 1, 0, 1]);
        r.setDrawBounds(true);
        this.setPhysicsComponent(r);
    };

    update(dyePacks) {
        super.update();
        const gEngine = this.gEngine;
        // control by WASD
        var v = this.getPhysicsComponent().getVelocity();
        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.W)) {
            v[1] += this.kYDelta;
        }
        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.S)) {
            v[1] -= this.kYDelta;
        }
        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.A)) {
            v[0] -= this.kXDelta;
        }
        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
            v[0] += this.kXDelta;
        }

        // now interact with the dyePack ...
        var i, obj;
        var heroBounds = this.getBBox();
        var p = this.getXform().getPosition();
        for (i = 0; i < dyePacks.size(); i++) {
            obj = dyePacks.getObjectAt(i);
            // chase after hero
            obj.rotateObjPointTo(p, 0.8);
            if (obj.getBBox().intersectsBound(heroBounds)) {
                dyePacks.removeFromSet(obj);
            }
        }
    };
}
export { Hero };