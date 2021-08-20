class VertexBuffer {
    constructor(gEngine) {
        // reference to the vertex positions for the square in the gl context
        this.mSquareVertexBuffer = null;
        // reference to the texture positions for the square vertices in the gl context
        this.mTextureCoordBuffer = null;
        // reference to the Line  for the square vertices in the gl context
        this.mLineVertexBuffer = null;

        this.gEngine = gEngine;

        //  First: define the vertices for a square
        this.verticesOfSquare = [
            0.5, 0.5, 0.0,
            -0.5, 0.5, 0.0,
            0.5, -0.5, 0.0,
            -0.5, -0.5, 0.0
        ];
        // Second: define the corresponding texture coordinates
        this.textureCoordinates = [
            1.0, 1.0,
            0.0, 1.0,
            1.0, 0.0,
            0.0, 0.0
        ];
        // this is to support the debugging of physics engine
        this.verticesOfLine = [
            0.5, 0.5, 0.0,
            -0.5, -0.5, 0.0
        ];
    }

    initialize() {
        this.gl = this.gEngine.Core.getGL();

        // Step A: Create a buffer on the gGL context for our vertex positions
        this.mSquareVertexBuffer = this.gl.createBuffer();

        // Step B: Activate vertexBuffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mSquareVertexBuffer);

        // Step C: Loads verticesOfSquare into the vertexBuffer
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.verticesOfSquare), this.gl.STATIC_DRAW);

        // Create a buffer on the gGL context for our vertex positions
        this.mTextureCoordBuffer = this.gl.createBuffer();

        // Activate vertexBuffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mTextureCoordBuffer);

        // Loads verticesOfSquare into the vertexBuffer
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.textureCoordinates), this.gl.STATIC_DRAW);

        // Create a buffer on the gGL context for our vertex positions
        this.mLineVertexBuffer = this.gl.createBuffer();

        // Connect the vertexBuffer to the ARRAY_BUFFER global gl binding point.
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mLineVertexBuffer);

        // Put the verticesOfSquare into the vertexBuffer, as non-changing drawing data (STATIC_DRAW)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.verticesOfLine), this.gl.STATIC_DRAW);

    };

    getGLVertexRef() { return this.mSquareVertexBuffer; };
    getGLTexCoordRef() { return this.mTextureCoordBuffer; };
    getGLLineVertexRef() { return this.mLineVertexBuffer; };

    cleanUp() {
        var gl = this.gEngine.Core.getGL();
        gl.deleteBuffer(this.mSquareVertexBuffer);
        gl.deleteBuffer(this.mTextureCoordBuffer);
        gl.deleteBuffer(this.mLineVertexBuffer);
    };
}

export { VertexBuffer }