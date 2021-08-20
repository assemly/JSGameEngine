/* 
 * File: ParticleGameObjectSet.js
 * a set of ParticleGameObjects
 */

import { GameObjectSet } from "../GameObjects/GameObjectSet";

class ParticleGameObjectSet extends GameObjectSet {
    constructor(gEngine) {
        super();
        this.gEngine = gEngine
    }


    draw(aCamera) {
        var gl = this.gEngine.Core.getGL();
        gl.blendFunc(gl.ONE, gl.ONE);  // for additive blending!
        super.draw(aCamera);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); // restore alpha blending
    };

    update() {
        super.update();

        // Cleanup Particles
        var i, obj;
        for (i = 0; i < this.size(); i++) {
            obj = this.getObjectAt(i);
            if (obj.hasExpired()) {
                this.removeFromSet(obj);
            }
        }
    };

}

export { ParticleGameObjectSet };
