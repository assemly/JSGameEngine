import { SpriteAnimateRenderable } from "./SpriteAnimateRenderable";


class LightRenderable extends SpriteAnimateRenderable {
    constructor(gEngine, myTexture) {
        super(gEngine, myTexture);
        //Renderable.prototype._setShader.call(this, gEngine.DefaultResources.getLightShader());
        super._setShader(gEngine.DefaultResources.getLightShader());

        // here is the light source
        this.mLights = [];
    };

    draw(aCamera) {
        this.mShader.setLights(this.mLights);
        super.draw(aCamera);
    };

    getLightAt(index) {
        return this.mLights[index];
    };

    addLight(l) {
        this.mLights.push(l);
    };
}

export { LightRenderable };