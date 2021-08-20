import { TextureShader } from "./TextureShader";
import { SimpleShader } from "./SimpleShader";

class SpriteShader extends TextureShader {
    constructor(gEnigne, vertexShaderPath, fragmentShaderPath) {
        super(gEnigne, vertexShaderPath, fragmentShaderPath);
        this.mTexCoordBuffer = null; // this is the reference to gl buffer that contains the actual texture coordinate
        this.gEngine = gEnigne;
        this.initTexCoord = [
            1.0, 1.0,
            0.0, 1.0,
            1.0, 0.0,
            0.0, 0.0
        ];

        this.gl = this.gEngine.Core.getGL();

        this.mTexCoordBuffer = this.gl.createBuffer();

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mTexCoordBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.initTexCoord), this.gl.DYNAMIC_DRAW);
        //// DYNAMIC_DRAW: says buffer content may change!
    }

    // Overriding the Activation of the shader for rendering

    activateShader(pixelColor, vpMatrix) {
        // first call the super class's activate
        // super.activateShader(pixelColor, vpMatrix);
        SimpleShader.prototype.activateShader.call(this, pixelColor, vpMatrix);
        // now binds the proper texture coordinate buffer
        this.gl = this.gEngine.Core.getGL();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mTexCoordBuffer);
        this.gl.vertexAttribPointer(this.mShaderTextureCoordAttribute,
            2,
            this.gl.FLOAT,
            false,
            0,
            0);
        this.gl.enableVertexAttribArray(this.mShaderTextureCoordAttribute);
    };

    setTextureCoordinate(texCoord) {
        this.gl = this.gEngine.Core.getGL();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mTexCoordBuffer);
        this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, new Float32Array(texCoord));
    };
}

export { SpriteShader }