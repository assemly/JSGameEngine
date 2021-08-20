/* 
 * File: RigidRectangle.js
 * Defines a rigid Rectangle
 */
import { RigidShape } from "./RigidShape";
import { RigidRectangleCollison } from "./RigidRectangle_Collision";
import {LineRenderable} from "../Renderables/LineRenderable";

class RigidRectangle extends RigidShape {
    constructor(gEngine, xform, w, h) {
        super(gEngine, xform);
        this.mSides = new LineRenderable(gEngine);

        this.mWidth = w;
        this.mHeight = h;

        Object.assign(this, { ...RigidRectangleCollison });
    };

    rigidType() {
        return RigidShape.eRigidType.eRigidRectangle;
    };

    draw(aCamera) {
        if (!this.mDrawBounds) {
            return;
        }
        super.draw(aCamera);
        var x = this.getPosition()[0];
        var y = this.getPosition()[1];
        var w = this.mWidth / 2;
        var h = this.mHeight / 2;

        this.mSides.setFirstVertex(x - w, y + h);  //TOP LEFT
        this.mSides.setSecondVertex(x + w, y + h); //TOP RIGHT
        this.mSides.draw(aCamera);
        this.mSides.setFirstVertex(x + w, y - h); //BOTTOM RIGHT
        this.mSides.draw(aCamera);
        this.mSides.setSecondVertex(x - w, y - h); //BOTTOM LEFT
        this.mSides.draw(aCamera);
        this.mSides.setFirstVertex(x - w, y + h); //TOP LEFT
        this.mSides.draw(aCamera);
    };

    getWidth() { return this.mWidth; };
    getHeight() { return this.mHeight; };
    setColor(color) {
        super.setColor(color);
        this.mSides.setColor(color);
    };

}

export { RigidRectangle };