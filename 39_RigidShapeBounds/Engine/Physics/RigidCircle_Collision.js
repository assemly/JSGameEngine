/* 
 * File: RigidCircle_Collision.js
 * Detects RigidCircle collisions
 */
import { vec2 } from "../Lib/gl-matrix";
import { RigidShape } from "./RigidShape";

export const RigidCircleCollison = {
    containsPos,
    collidedCircCirc,
    collided,
}

function containsPos(pos) {
    var dist = vec2.distance(this.getPosition(), pos);
    return (dist < this.getRadius());
};

function collidedCircCirc(c1, c2) {
    var vecToCenter = [0, 0];
    vec2.sub(vecToCenter, c1.getPosition(), c2.getPosition());
    var rSum = c1.getRadius() + c2.getRadius();
    return (vec2.squaredLength(vecToCenter) < (rSum * rSum));
};


function collided(otherShape) {
    var status = false;
    switch (otherShape.rigidType()) {
        case RigidShape.eRigidType.eRigidCircle:
            status = this.collidedCircCirc(this, otherShape);
            break;
        case RigidShape.eRigidType.eRigidRectangle:
            status = this.collidedRectCirc(otherShape, this);
            break;
    }
    return status;
};
