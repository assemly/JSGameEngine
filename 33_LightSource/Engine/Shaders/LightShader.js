import { SpriteShader } from "./SpriteShader";
import {vec3} from "../Lib/gl-matrix";

class LightShader extends SpriteShader {
    constructor(gEngine, vertexShaderPath, fragmentShaderPath) {
        super(gEngine, vertexShaderPath, fragmentShaderPath);

        // glsl uniform position references
        this.mColorRef = null;
        this.mPosRef = null;
        this.mRadiusRef = null;
        this.mIsOnRef = null;

        this.mLight = null; // <-- this is the light source in the Game Engine

        var shader = this.mCompiledShader;
        var gl = gEngine.Core.getGL();
        this.mColorRef = gl.getUniformLocation(shader, "uLightColor");
        this.mPosRef = gl.getUniformLocation(shader, "uLightPosition");
        this.mRadiusRef = gl.getUniformLocation(shader, "uLightRadius");
        this.mIsOnRef = gl.getUniformLocation(shader, "uLightOn");
    };

    activateShader(pixelColor, aCamera) {
        // first call the super class's activate
        super.activateShader(pixelColor, aCamera);

        // now push the light information to the shader
        if (this.mLight !== null) {
            this._loadToShader(aCamera);
        } else {
            this.gEngine.Core.getGL().uniform1i(this.mIsOnRef, false); // <-- switch off the light!
        }
    };

    setLight(l) {
        this.mLight = l;
    };

    _loadToShader(aCamera) {
        var gl = this.gEngine.Core.getGL();
        gl.uniform1i(this.mIsOnRef, this.mLight.isLightOn());
        if (this.mLight.isLightOn()) {
            let p = aCamera.wcPosToPixel(this.mLight.getPosition());
            let r = aCamera.wcSizeToPixel(this.mLight.getRadius());
            let c = this.mLight.getColor();

            gl.uniform4fv(this.mColorRef, c);
            gl.uniform3fv(this.mPosRef, vec3.fromValues(p[0], p[1], p[2]));
            gl.uniform1f(this.mRadiusRef, r);
        }
    };

}

export { LightShader }