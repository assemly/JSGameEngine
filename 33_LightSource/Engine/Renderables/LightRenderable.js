import { SpriteAnimateRenderable } from "./SpriteAnimateRenderable";
import { Renderable } from "./Renderable";

class LightRenderable extends SpriteAnimateRenderable {
    constructor(gEngine, myTexture) {
        super(gEngine, myTexture);
        //Renderable.prototype._setShader.call(this, gEngine.DefaultResources.getLightShader());
        super._setShader(gEngine.DefaultResources.getLightShader());

        // here is the light source
        this.mLight = null;
    };

    draw(aCamera) {
        this.mShader.setLight(this.mLight);
        super.draw(aCamera);
    };

    getLight() {
        return this.mLight;
    };

    addLight(l) {
        this.mLight = l;
    };
}

export { LightRenderable };