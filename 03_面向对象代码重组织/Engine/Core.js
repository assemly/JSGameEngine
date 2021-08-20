class Core {
    constructor(gEngine){
        this.mGL = null; // The graphical context to draw to
        this.gEngine = gEngine;
    }

    getGL() { return this.mGL};
    
    initializeWebGL(htmlCanvasID) {
        var canvas = document.getElementById(htmlCanvasID);

        // Get the standard or experimental webgl and binds to the Canvas area
        // store the results to the instance variable mGL
        this.mGL = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

        if (this.mGL === null) {
            document.write("<br><b>WebGL is not supported!</b>");
            return;
        }

        // now initialize the VertexBuffer
        this.gEngine.VertexBuffer.initialize();
    };

    clearCanvas (color) {
        this.mGL.clearColor(color[0], color[1], color[2], color[3]);  // set the color to be cleared
        this.mGL.clear(this.mGL.COLOR_BUFFER_BIT);      // clear to the color previously set
    };



}

export { Core }