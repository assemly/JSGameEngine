/* 
 * File: RigidShape_Physics.js
 * Support physical attributes for RigidShape
 */
import {vec2} from "../Lib/gl-matrix";

export const RigidShapeBehavior = {
    update,
    getInvMass,
    setMass,
    getVelocity,
    setVelocity,
    getRestitution,
    setRestitution,
    getAcceleration,
    setAcceleration,
    getFriction,
    setFriction,
}

function update() {
    var dt = this.gEngine.GameLoop.getUpdateIntervalInSeconds();

    // Symplectic Euler
    //    v += (1/m * F) * dt
    //    x += v * dt
    var v = this.getVelocity();
    vec2.scaleAndAdd(v, v, this.mAcceleration, (this.getInvMass() * dt));

    var pos = this.getPosition();
    vec2.scaleAndAdd(pos, pos, v, dt);
};
function getInvMass() { return this.mInvMass; };
function setMass(m) {
    if (m > 0) {
        this.mInvMass = 1 / m;
    } else {
        this.mInvMass = 0;
    }
};
function getVelocity() { return this.mVelocity; };
function setVelocity(v) { this.mVelocity = v; };
function getRestitution() { return this.mRestitution; };
function setRestitution(r) { this.mRestitution = r; };
function getFriction() { return this.mFriction; };
function setFriction(f) { this.mFriction = f; };
function getAcceleration() { return this.mAcceleration; };
function setAcceleration(g) { this.mAcceleration = g; };