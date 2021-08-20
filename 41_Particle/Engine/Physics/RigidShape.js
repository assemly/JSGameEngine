/* 
 * File: RigidShape.js
 * Defines a simple rigid shape
 */

import { vec2 } from "../Lib/gl-matrix";
import { LineRenderable } from "../Renderables/LineRenderable";
import { RigidShapeCollison } from "./RigidShape_Collision";
import { RigidShapeBehavior } from "./RigidShape_Behavior";


class RigidShape {

    static eRigidType = {
        eRigidAbstract: 0,
        eRigidCircle: 1,
        eRigidRectangle: 2
    };
    constructor(gEngine, xform) {
        this.gEngine = gEngine;
        this.mXform = xform; // this is typically from gameObject
        this.kPadding = 0.25; // size of the position mark

        this.mPositionMark = new LineRenderable(gEngine);

        this.mDrawBounds = false;

        // physical properties
        this.mInvMass = 1;
        this.mRestitution = 0.8;
        this.mVelocity = vec2.fromValues(0, 0);
        this.mFriction = 0.3;
        this.mAcceleration = gEngine.Physics.getSystemtAcceleration();

        Object.assign(this, { ...RigidShapeCollison, ...RigidShapeBehavior });
    }

    rigidType() {
        return RigidShape.eRigidType.eRigidAbstract;
    };

    draw(aCamera) {
        if (!this.mDrawBounds) {
            return;
        }

        //calculation for the X at the center of the shape
        var x = this.mXform.getXPos();
        var y = this.mXform.getYPos();

        this.mPositionMark.setFirstVertex(x - this.kPadding, y + this.kPadding);  //TOP LEFT
        this.mPositionMark.setSecondVertex(x + this.kPadding, y - this.kPadding); //BOTTOM RIGHT
        this.mPositionMark.draw(aCamera);

        this.mPositionMark.setFirstVertex(x + this.kPadding, y + this.kPadding);  //TOP RIGHT
        this.mPositionMark.setSecondVertex(x - this.kPadding, y - this.kPadding); //BOTTOM LEFT   
        this.mPositionMark.draw(aCamera);

    };



    getPosition() {
        return this.mXform.getPosition();
    };
    setPosition(x, y) {
        this.mXform.setPosition(x, y);
    };
    getXform() { return this.mXform; };
    setXform(xform) { this.mXform = xform; };
    setColor(color) {
        this.mPositionMark.setColor(color);
    };
    getColor() { return this.mPositionMark.getColor(); };
    setDrawBounds(d) { this.mDrawBounds = d; };
    getDrawBounds() { return this.mDrawBounds; };

}

export { RigidShape }