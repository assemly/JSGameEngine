import { LightRenderable } from "./LightRenderable";
import { Material } from "../Material";


class IllumRenderable extends LightRenderable {
    constructor(gEngine, myTexture, myNormalMap) {
        super(gEngine, myTexture);
        //Renderable.prototype._setShader.call(this, gEngine.DefaultResources.getLightShader());
        super._setShader(gEngine.DefaultResources.getIllumShader());

        this.gEngine = gEngine;
        // here is the normal map resource id
        this.mNormalMap = myNormalMap;

        // Normal map texture coordinate will reproduce the corresponding sprite sheet
        // This means, the normal map MUST be based on the sprite sheet

        // Material for this Renderable
        this.mMaterial = new Material();
    };

    draw(aCamera) {
        this.gEngine.Textures.activateNormalMap(this.mNormalMap);
        // Here thenormal map texture coordinate is copied from those of 
        // the corresponding sprite sheet
        this.mShader.setMaterialAndCameraPos(this.mMaterial, aCamera.getPosInPixelSpace());
        super.draw(aCamera);
    };

    getMaterial() { return this.mMaterial; };
}

export { IllumRenderable };
