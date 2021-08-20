/* 
 * File: RigidCircle.js
 * Defines a rigid circle
 */
import { RigidShape } from "./RigidShape";
import { RigidCircleCollison } from "./RigidCircle_Collision";
import {LineRenderable} from "../Renderables/LineRenderable";
import { vec2 } from "../Lib/gl-matrix";


class RigidCircle extends RigidShape {
    constructor(gEngine, xform, r) {
        super(gEngine, xform);
        this.kNumSides = 16;
        this.mSides = new LineRenderable(gEngine);
        this.mRadius = r;

        Object.assign(this, { ...RigidCircleCollison });
    }

    rigidType() {
        return RigidShape.eRigidType.eRigidCircle;
    };
    getRadius() {
        return this.mRadius;
    };

    draw(aCamera) {
        if (!this.mDrawBounds) {
            return;
        }
        super.draw(aCamera);

        // kNumSides forms the circle.
        var pos = this.getPosition();
        var prevPoint = vec2.clone(pos);
        var deltaTheta = (Math.PI * 2.0) / this.kNumSides;
        var theta = deltaTheta;
        prevPoint[0] += this.mRadius;
        var i, x, y;
        for (i = 1; i <= this.kNumSides; i++) {
            x = pos[0] + this.mRadius * Math.cos(theta);
            y = pos[1] + this.mRadius * Math.sin(theta);

            this.mSides.setFirstVertex(prevPoint[0], prevPoint[1]);
            this.mSides.setSecondVertex(x, y);
            this.mSides.draw(aCamera);

            theta = theta + deltaTheta;
            prevPoint[0] = x;
            prevPoint[1] = y;
        }
    };

    setColor(color) {
        super.setColor(color);
        this.mSides.setColor(color);
    };
}

export { RigidCircle };