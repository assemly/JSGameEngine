/*
 * File: Engine_Particle.js 
 * Particle System support
 */


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
        vec2.subtract(mFrom1to2, pos, cPos);
        var dist = vec2.length(mFrom1to2);
        if (dist < circShape.getRadius()) {
            vec2.scale(mFrom1to2, mFrom1to2, 1 / dist);
            vec2.scaleAndAdd(pos, cPos, mFrom1to2, circShape.getRadius());
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
            vec2.subtract(mFrom1to2, pos, rPos);
            mVec[0] = mFrom1to2[0];
            mVec[1] = mFrom1to2[1];

            // Find closest axis
            if (Math.abs(mFrom1to2[0] - alongX) < Math.abs(mFrom1to2[1] - alongY)) {
                // Clamp to closest side
                mNormal[0] = 0;
                mNormal[1] = 1;
                if (mVec[0] > 0) {
                    mVec[0] = alongX;
                } else {
                    mVec[0] = -alongX;
                }
            } else { // y axis is shorter
                mNormal[0] = 1;
                mNormal[1] = 0;
                // Clamp to closest side
                if (mVec[1] > 0) {
                    mVec[1] = alongY;
                } else {
                    mVec[1] = -alongY;
                }
            }

            vec2.subtract(mVec, mVec, mFrom1to2);
            vec2.add(pos, pos, mVec);  // remember pos is particle position
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
            processObjSet(objSet.getObjectAt(i), pSet);
        }
    };
    getSystemtAcceleration  () { return mSystemtAcceleration; };
    setSystemtAcceleration  (g) { mSystemtAcceleration = g; };

}

export { Particle };