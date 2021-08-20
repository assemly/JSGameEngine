import { SpriteShader } from "./SpriteShader";
import { ShaderLightAtIndex } from "./ShaderLightAtIndex";
/* 
 * File: ShadowCasterShader.js
 * Subclass from SpriteShader
 *      a little similar to LightShader, except, only defines
 *      one light: the one that casts the shadow
 */

//<editor-fold desc="constructor">
// constructor 
class ShadowCasterShader extends SpriteShader {
    constructor(gEngine, vertexShaderPath, fragmentShaderPath) {
        // Call super class constructor
        super(gEngine, vertexShaderPath, fragmentShaderPath);  // call SimpleShader constructor

        this.mLight = null;  // The light that casts the shadow

        // **** The GLSL Shader must define uLights[1] <-- as the only light source!!
        this.mShaderLight = new ShaderLightAtIndex(gEngine, this.mCompiledShader, 0);
    }

    //</editor-fold>

    // <editor-fold desc="Public Methods">

    // Overriding the Activation of the shader for rendering
    activateShader(pixelColor, aCamera) {
        // first call the super class's activate
        super.activateShader(pixelColor, aCamera);
        this.mShaderLight.loadToShader(aCamera, this.mLight);
    };

    setLight(l) {
        this.mLight = l;
    };
}

export { ShadowCasterShader }