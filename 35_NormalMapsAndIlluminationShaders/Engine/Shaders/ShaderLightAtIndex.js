import {vec3 } from "../Lib/gl-matrix";

class ShaderLightAtIndex {
    constructor(gEngine, shader, index) {
        this.gEngine = gEngine;
        this._setShaderReferences(shader, index);
    };

    loadToShader(aCamera, aLight) {
        let gl = this.gEngine.Core.getGL();
        gl.uniform1i(this.mIsOnRef, aLight.isLightOn());
        if (aLight.isLightOn()) {
            var p = aCamera.wcPosToPixel(aLight.getPosition());
            var ic = aCamera.wcSizeToPixel(aLight.getNear());
            var oc = aCamera.wcSizeToPixel(aLight.getFar());
            var c = aLight.getColor();
            gl.uniform4fv(this.mColorRef, c);
            gl.uniform3fv(this.mPosRef, vec3.fromValues(p[0], p[1], p[2]));
            gl.uniform1f(this.mNearRef, ic);
            gl.uniform1f(this.mFarRef, oc);
            gl.uniform1f(this.mIntensityRef, aLight.getIntensity());
        }
    };

    switchOffLight = function () {
        let gl = this.gEngine.Core.getGL();
        gl.uniform1i(this.mIsOnRef, false);
    };

    _setShaderReferences(aLightShader, index) {
        let gl = this.gEngine.Core.getGL();
        this.mColorRef = gl.getUniformLocation(aLightShader,      "uLights[" + index + "].Color");
        this.mPosRef = gl.getUniformLocation(aLightShader,        "uLights[" + index + "].Position");
        this.mNearRef = gl.getUniformLocation(aLightShader,       "uLights[" + index + "].Near");
        this.mFarRef = gl.getUniformLocation(aLightShader,        "uLights[" + index + "].Far");
        this.mIntensityRef = gl.getUniformLocation(aLightShader,  "uLights[" + index + "].Intensity");
        this.mIsOnRef = gl.getUniformLocation(aLightShader,       "uLights[" + index + "].IsOn");
    };
}


export { ShaderLightAtIndex };