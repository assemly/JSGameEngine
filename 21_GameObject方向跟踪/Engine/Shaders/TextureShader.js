import { SimpleShader } from "./SimpleShader";

class TextureShader extends SimpleShader {
    constructor(gEnigne, vertexShaderPath, fragmentShaderPath) {
        super(gEnigne, vertexShaderPath, fragmentShaderPath);
        // reference to aTextureCoordinate within the shader
        this.mShaderTextureCoordAttribute = null;

        // get the reference of aTextureCoordinate within the shader
        this.gl = this.gEngine.Core.getGL();
        console.log("TextureShader::constructor ");
        this.mShaderTextureCoordAttribute = this.gl.getAttribLocation(this.mCompiledShader, "aTextureCoordinate");
    }

    // Overriding the Activation of the shader for rendering

    activateShader(pixelColor, aCamera) {
        // first call the super class's activate
        super.activateShader( pixelColor, aCamera);
    
        // now our own functionality: enable texture coordinate array
        this.gl = this.gEngine.Core.getGL();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.gEngine.VertexBuffer.getGLTexCoordRef());
        this.gl.enableVertexAttribArray(this.mShaderTextureCoordAttribute);
        this.gl.vertexAttribPointer(this.mShaderTextureCoordAttribute, 2, this.gl.FLOAT, false, 0, 0);
    };
}

export { TextureShader }