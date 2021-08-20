class VertexBuffer {
    constructor(gEngine){
        this.mSquareVertexBuffer = null;
        this.gEngine = gEngine;
        this.verticesOfSquare = [
            0.5, 0.5, 0.0,
            -0.5, 0.5, 0.0,
            0.5, -0.5, 0.0,
            -0.5, -0.5, 0.0
        ];

    }

    initialize () {
        this.gl = this.gEngine.Core.getGL();

        // Step A: Create a buffer on the gGL context for our vertex positions
        this.mSquareVertexBuffer = this.gl.createBuffer();

        // Step B: Activate vertexBuffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mSquareVertexBuffer);

        // Step C: Loads verticesOfSquare into the vertexBuffer
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.verticesOfSquare), this.gl.STATIC_DRAW);
    };

    getGLVertexRef() { return this.mSquareVertexBuffer; };
}

export { VertexBuffer }