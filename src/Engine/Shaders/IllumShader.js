import { LightShader } from "./LightShader";
import { ShaderMaterial } from "./ShaderMaterial";


class IllumShader extends LightShader {
    constructor(gEngine, vertexShaderPath, fragmentShaderPath) {
        super(gEngine, vertexShaderPath, fragmentShaderPath);
        this.gEngine = gEngine;

        // this is the material property of the Renderable
        this.mMaterial = null;
        this.mMaterialLoader = new ShaderMaterial(gEngine, this.mCompiledShader);

        this.gl = this.gEngine.Core.getGL();

        // Reference to the camera position
        this.mCameraPos = null;  // points to a vec3
        this.mCameraPosRef = this.gl.getUniformLocation(this.mCompiledShader, "uCameraPosition");


        this.mNormalSamplerRef = this.gl.getUniformLocation(this.mCompiledShader, "uNormalSampler");

    };

    activateShader(pixelColor, aCamera) {
        // first call the super class's activate
        super.activateShader(pixelColor, aCamera); // call不该用
        const gl = this.gl;
        gl.uniform1i(this.mNormalSamplerRef, 1); // binds to texture unit 1
        // do not need to set up texture coordinate buffer
        // as we are going to use the ones from the sprite texture 
        // in the fragment shader
        this.mMaterialLoader.loadToShader(this.mMaterial);
        gl.uniform3fv(this.mCameraPosRef, this.mCameraPos);
    };

    setMaterialAndCameraPos(m, p) {
        this.mMaterial = m;
        this.mCameraPos = p;
    };

}

export { IllumShader }