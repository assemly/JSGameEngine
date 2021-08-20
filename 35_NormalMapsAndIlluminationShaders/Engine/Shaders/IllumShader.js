import { LightShader } from "./LightShader";


class IllumShader extends LightShader {
    constructor(gEngine, vertexShaderPath, fragmentShaderPath) {
        super(gEngine, vertexShaderPath, fragmentShaderPath);
        this.gEngine = gEngine;
        this.gl = this.gEngine.Core.getGL();
        this.mNormalSamplerRef = this.gl.getUniformLocation(this.mCompiledShader, "uNormalSampler");
        console.log("*********IllumShader")
        console.log(this.mNormalSamplerRef);
    };

    activateShader(pixelColor, aCamera) {
        // first call the super class's activate
        super.activateShader( pixelColor, aCamera); // call不该用
        let gl = this.gl;
        gl.uniform1i(this.mNormalSamplerRef, 1); // binds to texture unit 1
        // do not need to set up texture coordinate buffer
        // as we are going to use the ones from the sprite texture 
        // in the fragment shader
    };


}

export { IllumShader }