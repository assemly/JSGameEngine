import { GameObject } from "../../Engine/GameObjects/GameObject";
import { TextureRenderable } from "../../Engine/Renderables/TextureRenderable";
import { RigidCircle } from "../../Engine/Physics/RigidCircle";

class DyePack extends GameObject {
    constructor(gEngine, texture, atX, atY) {
        super()
        this.mCycleLeft = 300;

        this.mDyePack = new TextureRenderable(gEngine, texture);

        this.mDyePack.setColor([1, 1, 1, 0]);
        this.mDyePack.getXform().setPosition(atX, atY);
        this.mDyePack.getXform().setSize(4, 3);

        super.setRenderable(this.mDyePack);

        this.setSpeed(0.5);
        this.setCurrentFrontDir([1, 0]);

        var rigidShape = new RigidCircle(gEngine, this.getXform(), 1.5);
        rigidShape.setMass(0.1);
        rigidShape.setAcceleration([0, 0]);
        rigidShape.setDrawBounds(true);
        this.setPhysicsComponent(rigidShape);
    };

    update() {
        super.update();
        // remember to update this.mMinion's animation
        this.mCycleLeft--;
    };

    hasExpired() { return this.mCycleLeft <= 0; };
}

export { DyePack };