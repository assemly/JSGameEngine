/*
 * File: Engine_Particle.js 
 * Particle System support
 */
import {vec2} from "../Lib/gl-matrix";


class Particle {
    constructor() {
        this.mSystemtAcceleration = [0, -50.0];

        // the follows are scratch workspace for vec2
        this.mFrom1to2 = [0, 0];
        this.mVec = [0, 0];
        this.mNormal = [0, 0];
    }

    resolveCirclePos  (circShape, particle) {
        var collided = false;
        var pos = particle.getPosition();
        var cPos = circShape.getPosition();
        vec2.subtract(this.mFrom1to2, pos, cPos);
        var dist = vec2.length(this.mFrom1to2);
        if (dist < circShape.getRadius()) {
            vec2.scale(this.mFrom1to2, this.mFrom1to2, 1 / dist);
            vec2.scaleAndAdd(pos, cPos, this.mFrom1to2, circShape.getRadius());
            collided = true;
        }
        return collided;
    };

    resolveRectPos  (rectShape, particle) {
        var collided = false;
        var alongX = rectShape.getWidth() / 2;
        var alongY = rectShape.getHeight() / 2;

        var pos = particle.getPosition();
        var rPos = rectShape.getPosition();

        var rMinX = rPos[0] - alongX;
        var rMaxX = rPos[0] + alongX;
        var rMinY = rPos[1] - alongY;
        var rMaxY = rPos[1] + alongY;

        collided = ((rMinX < pos[0]) && (rMinY < pos[1]) &&
            (rMaxX > pos[0]) && (rMaxY > pos[1]));

        if (collided) {
            vec2.subtract(this.mFrom1to2, pos, rPos);
            this.mVec[0] = this.mFrom1to2[0];
            this.mVec[1] = this.mFrom1to2[1];

            // Find closest axis
            if (Math.abs(this.mFrom1to2[0] - alongX) < Math.abs(this.mFrom1to2[1] - alongY)) {
                // Clamp to closest side
                this.mNormal[0] = 0;
                this.mNormal[1] = 1;
                if (this.mVec[0] > 0) {
                    this.mVec[0] = alongX;
                } else {
                    this.mVec[0] = -alongX;
                }
            } else { // y axis is shorter
                this.mNormal[0] = 1;
                this.mNormal[1] = 0;
                // Clamp to closest side
                if (this.mVec[1] > 0) {
                    this.mVec[1] = alongY;
                } else {
                    this.mVec[1] = -alongY;
                }
            }

            vec2.subtract(this.mVec, this.mVec, this.mFrom1to2);
            vec2.add(pos, pos, this.mVec);  // remember pos is particle position
        }
        return collided;
    };

    // Rigid Shape interactions: a game object and a set of particle game objects
    processObjSet  (obj, pSet) {
        var s1 = obj.getPhysicsComponent();  // a RigidShape
        var i, p;
        for (i = 0; i < pSet.size(); i++) {
            p = pSet.getObjectAt(i).getPhysicsComponent();  // a Particle
            s1.resolveParticleCollision(p);
        }
    };

    // Rigid Shape interactions: game object set and a set of particle game objects
    processSetSet  (objSet, pSet) {
        var i;
        for (i = 0; i < objSet.size(); i++) {
            this.processObjSet(objSet.getObjectAt(i), pSet);
        }
    };
    getSystemtAcceleration  () { return this.mSystemtAcceleration; };
    setSystemtAcceleration  (g) { this.mSystemtAcceleration = g; };

}

export { Particle };