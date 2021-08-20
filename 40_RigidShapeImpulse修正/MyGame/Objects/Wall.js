/* File: Wall.js 
 *
 * Creates and initializes a Wall object
 */

/*jslint node: true, vars: true */
/*global gEngine, GameObject, TextureRenderable, RigidRectangle */
import { GameObject } from "../../Engine/GameObjects/GameObject";
import { TextureRenderable } from "../../Engine/Renderables/TextureRenderable";
import { RigidRectangle } from "../../Engine/Physics/RigidRectangle";

class Wall extends GameObject {
    constructor(gEngine, texture, atX, atY) {
        super()
        this.mWall = new TextureRenderable(gEngine, texture);

        this.mWall.setColor([1, 1, 1, 0]);
        this.mWall.getXform().setPosition(atX, atY);
        this.mWall.getXform().setSize(4, 16);
        // show each element for mAnimSpeed updates
        super.setRenderable(this.mWall);

        var rigidShape = new RigidRectangle(gEngine, this.getXform(), 2, 16);
        rigidShape.setMass(0);  // ensures no movements!
        rigidShape.setDrawBounds(true);
        rigidShape.setColor([1, 1, 1, 1]);
        this.setPhysicsComponent(rigidShape);
    }
}

export { Wall };
