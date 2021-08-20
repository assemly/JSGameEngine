import { SimpleShader } from "./SimpleShader";

class LineShader extends SimpleShader {

    constructor(gEngine, vertexShaderFilePath, fragmentShaderFilePath) {
        super(gEngine, vertexShaderFilePath, fragmentShaderFilePath);
        this.mPointSizeRef = null;            // reference to the PointSize uniform
        this.gl = gEngine.Core.getGL();
        this.gEngine = gEngine;
        // point size uniform
        this.mPointSizeRef = this.gl.getUniformLocation(this.mCompiledShader, "uPointSize");

        this.mPointSize = 1;
    };

    activateShader(pixelColor, aCamera) {
        // first call the super class's activate
        super.activateShader(pixelColor, aCamera);

        // now our own functionality: enable texture coordinate array
        var gl = this.gl;
        gl.uniform1f(this.mPointSizeRef, this.mPointSize);
        gl.bindBuffer(gl.ARRAY_BUFFER, gEngine.VertexBuffer.getGLLineVertexRef());
        gl.vertexAttribPointer(this.mShaderVertexPositionAttribute,
            3,              // each element is a 3-float (x,y.z)
            gl.FLOAT,       // data type is FLOAT
            false,          // if the content is normalized vectors
            0,              // number of bytes to skip in between elements
            0);

        gl.enableVertexAttribArray(this.mShaderVertexPositionAttribute);
    };

    setPointSize(w) { this.mPointSize = w; };
};

export { LineShader }