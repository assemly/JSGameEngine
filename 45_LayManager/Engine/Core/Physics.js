/*
 * File: EngineCore_Physics.js 
 * Physics engine supporting projection and impulse collision resolution. 
 */
import { CollisionInfo } from "../Utils/CollisionInfo";
import { vec2 } from "../Lib/gl-matrix";

class Physics {

    constructor() {
        this.mRelaxationCount = 15;                  // number of relaxation iteration
        this.mRelaxationOffset = 1 / this.mRelaxationCount; // porportion to apply when scaling friction
        this.mPosCorrectionRate = 0.8;               // percentage of separation to project objects
        this.mSystemtAcceleration = [0, -50];        // system-wide default acceleration

        this.mRelaxationLoopCount = 0;               // the current relaxation count
        this.mHasOneCollision = false;               // detect the first collision

        this.mCollisionInfo = null;                  // information of the current collision
    };

    initialize() {
        this.mCollisionInfo = new CollisionInfo(); // to avoid allocating this constantly
    };

    _positionalCorrection(s1, s2, collisionInfo) {
        let s1InvMass = s1.getInvMass();
        let s2InvMass = s2.getInvMass();
        let num = collisionInfo.getDepth() / (s1InvMass + s2InvMass) * this.mPosCorrectionRate;
        let correctionAmount = [0, 0];
        vec2.scale(correctionAmount, collisionInfo.getNormal(), num);

        let ca = [0, 0];
        vec2.scale(ca, correctionAmount, s1InvMass);
        let s1Pos = s1.getPosition();
        vec2.subtract(s1Pos, s1Pos, ca);

        vec2.scale(ca, correctionAmount, s2InvMass);
        let s2Pos = s2.getPosition();
        vec2.add(s2Pos, s2Pos, ca);
    };

    // n is the collision normal
    // v is the velocity
    // f is the friction 
    // m is the invMass
    _applyFriction(n, v, f, m) {
        let tangent = vec2.fromValues(n[1], -n[0]);  // perpendicular to n
        let tComponent = vec2.dot(v, tangent);
        if (Math.abs(tComponent) < 0.01)
            return;

        f *= m * this.mRelaxationOffset;
        if (tComponent < 0) {
            vec2.scale(tangent, tangent, -f);
        } else {
            vec2.scale(tangent, tangent, f);
        }
        vec2.sub(v, v, tangent);
    };

    resolveCollision(s1, s2, collisionInfo) {
        // Step A: one collision has been found
        this.mHasOneCollision = true;

        // Step B: correct positions
        this._positionalCorrection(s1, s2, collisionInfo);

        // collision normal direction is _against_ s2
        // Step C: apply friction
        let s1V = s1.getVelocity();
        let s2V = s2.getVelocity();
        let n = collisionInfo.getNormal();
        this._applyFriction(n, s1V, s1.getFriction(), s1.getInvMass());
        this._applyFriction(n, s2V, -s2.getFriction(), s2.getInvMass());

        // Step D: compute relatively velocity of the colliding objects
        let relativeVelocity = [0, 0];
        vec2.sub(relativeVelocity, s2V, s1V);

        // Step E: examine the component in the normal direction
        // Relative velocity in normal direction
        let rVelocityInNormal = vec2.dot(relativeVelocity, n);
        //if objects moving apart ignore
        if (rVelocityInNormal > 0) {
            return;
        }

        // Step F: compute and apply response impulses for each object
        let newRestituion = Math.min(s1.getRestitution(), s2.getRestitution());
        // Calc impulse scalar
        let j = -(1 + newRestituion) * rVelocityInNormal;
        j = j / (s1.getInvMass() + s2.getInvMass());

        let impulse = [0, 0];
        vec2.scale(impulse, collisionInfo.getNormal(), j);

        let newImpulse = [0, 0];
        vec2.scale(newImpulse, impulse, s1.getInvMass());
        vec2.sub(s1V, s1V, newImpulse);

        vec2.scale(newImpulse, impulse, s2.getInvMass());
        vec2.add(s2V, s2V, newImpulse);
    };

    beginRelaxation() {
        this.mRelaxationLoopCount = this.mRelaxationCount;
        this.mHasOneCollision = true;
    };
    continueRelaxation() {
        let oneCollision = this.mHasOneCollision;
        this.mHasOneCollision = false;
        this.mRelaxationLoopCount = this.mRelaxationLoopCount - 1;
        return ((this.mRelaxationLoopCount > 0) && oneCollision);
    };

    // Rigid Shape interactions: two game objects
    processObjObj(obj1, obj2) {
        let s1 = obj1.getPhysicsComponent();
        let s2 = obj2.getPhysicsComponent();
        if (s1 === s2)
            return;
        this.beginRelaxation();
        while (this.continueRelaxation()) {
            if (s1.collided(s2, this.mCollisionInfo)) {
                this.resolveCollision(s1, s2, this.mCollisionInfo);
            }
        }
    };

    // Rigid Shape interactions: a game object and a game object set
    processObjSet(obj, set) {
        let s1 = obj.getPhysicsComponent();
        let i, s2;
        this.beginRelaxation();
        while (this.continueRelaxation()) {
            for (i = 0; i < set.size(); i++) {
                s2 = set.getObjectAt(i).getPhysicsComponent();
                if ((s1 !== s2) && (s1.collided(s2, this.mCollisionInfo))) {
                    this.resolveCollision(s1, s2, this.mCollisionInfo);
                }
            }
        }
    };

    // Rigid Shape interactions: two game object sets
    processSetSet(set1, set2) {
        let i, j, s1, s2;
        this.beginRelaxation();
        while (this.continueRelaxation()) {
            for (i = 0; i < set1.size(); i++) {
                s1 = set1.getObjectAt(i).getPhysicsComponent();
                for (j = 0; j < set2.size(); j++) {
                    s2 = set2.getObjectAt(j).getPhysicsComponent();
                    if ((s1 !== s2) && (s1.collided(s2, this.mCollisionInfo))) {
                        this.resolveCollision(s1, s2, this.mCollisionInfo);
                    }
                }
            }
        }
    };

    // Rigid Shape interactions: a set against itself
    processSelfSet(set) {
        let i, j, s1, s2;
        this.beginRelaxation();
        while (this.continueRelaxation()) {
            for (i = 0; i < set.size(); i++) {
                s1 = set.getObjectAt(i).getPhysicsComponent();
                for (j = i + 1; j < set.size(); j++) {
                    s2 = set.getObjectAt(j).getPhysicsComponent();
                    if ((s1 !== s2) && (s1.collided(s2, this.mCollisionInfo))) {
                        this.resolveCollision(s1, s2, this.mCollisionInfo);
                    }
                }
            }
        }
    };

    getSystemtAcceleration() { return this.mSystemtAcceleration; };
    setSystemtAcceleration(g) { this.mSystemtAcceleration = g; };
    getRelaxationCorrectionRate() { return this.mPosCorrectionRate; };
    setRelaxationCorrectionRate(r) {
        if ((r <= 0) || (r >= 1)) {
            r = 0.8;
        }
        this.mPosCorrectionRate = r;
    };
    getRelaxationLoopCount() { return this.mRelaxationCount; };
    setRelaxationLoopCount(c) {
        if (c <= 0)
            c = 1;
        this.mRelaxationCount = c;
        this.mRelaxationOffset = 1 / this.mRelaxationCount;
    };


}


export { Physics };