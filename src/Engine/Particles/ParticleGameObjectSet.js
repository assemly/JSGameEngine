/* 
 * File: ParticleGameObjectSet.js
 * a set of ParticleGameObjects
 */

import { GameObjectSet } from "../GameObjects/GameObjectSet";
import { ParticleEmitter } from "./ParticleEmitter";

class ParticleGameObjectSet extends GameObjectSet {
    constructor(gEngine) {
        super();
        this.gEngine = gEngine
        this.mEmitterSet = [];
    }

    addEmitterAt(p, n, func) {
        var e = new ParticleEmitter(p, n, func);
        this.mEmitterSet.push(e);
    };


    draw(aCamera) {
        var gl = this.gEngine.Core.getGL();
        gl.blendFunc(gl.ONE, gl.ONE);  // for additive blending!
        super.draw(aCamera);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); // restore alpha blending
    };

    update() {
        super.update();

        // Cleanup Particles
        var i, e, obj;
        for (i = 0; i < this.size(); i++) {
            obj = this.getObjectAt(i);
            if (obj.hasExpired()) {
                this.removeFromSet(obj);
            }
        }

        // Emit new particles
        for (i = 0; i < this.mEmitterSet.length; i++) {
            e = this.mEmitterSet[i];
            e.emitParticles(this);
            if (e.expired()) {
                this.mEmitterSet.splice(i, 1);
            }
        }
    };

}

export { ParticleGameObjectSet };
