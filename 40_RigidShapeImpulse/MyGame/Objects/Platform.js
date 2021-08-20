/* File: Platform.js 
 *
 * Creates and initializes a ploatform object
 */
import { GameObject } from "../../Engine/GameObjects/GameObject";
import { TextureRenderable } from "../../Engine/Renderables/TextureRenderable";
import { RigidRectangle } from "../../Engine/Physics/RigidRectangle";

class Platform extends GameObject {
    constructor(gEngine, texture, atX, atY) {
        super();
        this.mPlatform = new TextureRenderable(gEngine, texture);

        this.mPlatform.setColor([1, 1, 1, 0]);
        this.mPlatform.getXform().setPosition(atX, atY);
        this.mPlatform.getXform().setSize(30, 3.75);
        // show each element for mAnimSpeed updates
        super.setRenderable(this.mPlatform);

        var rigidShape = new RigidRectangle(gEngine, this.getXform(), 30, 3);
        rigidShape.setMass(0);  // ensures no movements!
        rigidShape.setDrawBounds(true);
        rigidShape.setColor([1, 0.2, 0.2, 1]);
        this.setPhysicsComponent(rigidShape);
    }
}

export { Platform };