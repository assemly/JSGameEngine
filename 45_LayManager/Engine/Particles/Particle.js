/* 
 * File: Particle.js
 * Defines a particle
 */
import { vec2 } from "../Lib/gl-matrix";
import { LineRenderable } from "../Renderables/LineRenderable";

class Particle {
    constructor(gEngine, pos) {
        this.gEngine = gEngine;
        this.kPadding = 0.5;   // for drawing particle bounds

        this.mPosition = pos;  // this is likely to be a reference to xform.mPosition
        this.mVelocity = vec2.fromValues(0, 0);
        this.mAcceleration = gEngine.Particle.getSystemtAcceleration();
        this.mDrag = 0.95;

        this.mPositionMark = new LineRenderable(gEngine);
        this.mDrawBounds = false;
    }

    draw(aCamera) {
        if (!this.mDrawBounds) {
            return;
        }

        //calculation for the X at the particle position
        var x = this.mPosition[0];
        var y = this.mPosition[1];

        this.mPositionMark.setFirstVertex(x - this.kPadding, y + this.kPadding);  //TOP LEFT
        this.mPositionMark.setSecondVertex(x + this.kPadding, y - this.kPadding); //BOTTOM RIGHT
        this.mPositionMark.draw(aCamera);

        this.mPositionMark.setFirstVertex(x + this.kPadding, y + this.kPadding);  //TOP RIGHT
        this.mPositionMark.setSecondVertex(x - this.kPadding, y - this.kPadding); //BOTTOM LEFT
        this.mPositionMark.draw(aCamera);
    };

    update() {
        var dt = this.gEngine.GameLoop.getUpdateIntervalInSeconds();

        // Symplectic Euler
        //    v += a * dt
        //    x += v * dt
        var p = this.getPosition();
        vec2.scaleAndAdd(this.mVelocity, this.mVelocity, this.mAcceleration, dt);
        vec2.scale(this.mVelocity, this.mVelocity, this.mDrag);
        vec2.scaleAndAdd(p, p, this.mVelocity, dt);
    };

    setColor(color) {
        this.mPositionMark.setColor(color);
    };
    getColor() { return this.mPositionMark.getColor(); };
    setDrawBounds(d) { this.mDrawBounds = d; };
    getDrawBounds() { return this.mDrawBounds; };

    setPosition(xPos, yPos) { this.setXPos(xPos); this.setYPos(yPos); };
    getPosition() { return this.mPosition; };
    getXPos() { return this.mPosition[0]; };
    setXPos(xPos) { this.mPosition[0] = xPos; };
    getYPos() { return this.mPosition[1]; };
    setYPos(yPos) { this.mPosition[1] = yPos; };
    setVelocity(f) { this.mVelocity = f; };
    getVelocity() { return this.mVelocity; };
    setAcceleration(g) { this.mAcceleration = g; };
    getAcceleration() { return this.mAcceleration; };
    setDrag(d) { this.mDrag = d; };
    getDrag() { return this.mDrag; };
}

export { Particle };