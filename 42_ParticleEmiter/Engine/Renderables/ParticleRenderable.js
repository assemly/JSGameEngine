/*
 * File: ParticleRenderable.js
 *  
 * ParticleRenderable specifically for particles (additive blending)
 */
import { TextureRenderable } from "./TextureRenderable";

class ParticleRenderable extends TextureRenderable {
    constructor(gEngine, myTexture) {
        super(gEngine, myTexture);
        super._setShader(gEngine.DefaultResources.getParticleShader());
    };
}

export { ParticleRenderable };
