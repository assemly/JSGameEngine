import { SpriteShader } from "./SpriteShader";
import { vec3 } from "../Lib/gl-matrix";
import { ShaderLightAtIndex } from "./ShaderLightAtIndex";

class LightShader extends SpriteShader {
    constructor(gEngine, vertexShaderPath, fragmentShaderPath) {
        super(gEngine, vertexShaderPath, fragmentShaderPath);

        // // glsl uniform position references
        // this.mColorRef = null;
        // this.mPosRef = null;
        // this.mRadiusRef = null;
        // this.mIsOnRef = null;

        this.mLights = null; // <-- this is the light source in the Game Engine

        //*******WARNING***************
        // this number MUST correspond to the GLSL uLight[] array size (for LightFS.glsl)
        //*******WARNING********************
        this.kGLSLuLightArraySize = 4;  // <-- make sure this is the same as LightFS.glsl
        this.mShaderLights = [];

        let i, ls;
        for (i = 0; i < this.kGLSLuLightArraySize; i++) {
            ls = new ShaderLightAtIndex(gEngine, this.mCompiledShader, i);
            this.mShaderLights.push(ls);
        }
    };

    activateShader(pixelColor, aCamera) {
        // first call the super class's activate
        super.activateShader(pixelColor, aCamera);

        // now push the light information to the shader
        let numLight = 0;
        if (this.mLights !== null) {
            while (numLight < this.mLights.length) {
                this.mShaderLights[numLight].loadToShader(aCamera, this.mLights[numLight]);
                numLight++;
            }
        }
        // switch off the left over ones.
        while (numLight < this.kGLSLuLightArraySize) {
            this.mShaderLights[numLight].switchOffLight(); // switch off unused lights
            numLight++;
        }
    };

    setLights(l) {
        this.mLights = l;
    };



}

export { LightShader }