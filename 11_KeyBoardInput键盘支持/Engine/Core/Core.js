class Core {
    constructor(gEngine) {
        this.mGL = null; // The graphical context to draw to
        this.gEngine = gEngine;
    }

    getGL() { return this.mGL };

    _initializeWebGL(htmlCanvasID, width = "640", height = "480") {
        var canvas = document.getElementById(htmlCanvasID);
        canvas.width = width;
        canvas.height = height;
        // Get the standard or experimental webgl and binds to the Canvas area
        // store the results to the instance variable mGL
        this.mGL = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

        if (this.mGL === null) {
            document.write("<br><b>WebGL is not supported!</b>");
            return;
        }

        // // now initialize the VertexBuffer
        // this.gEngine.VertexBuffer.initialize();
    };

    initializeEngineCore(htmlCanvasID,width = "640", height = "480") {
        this._initializeWebGL(htmlCanvasID,width,height);
        this.gEngine.VertexBuffer.initialize();
        this.gEngine.Input.initialize();
    };

    clearCanvas(color) {
        this.mGL.clearColor(color[0], color[1], color[2], color[3]);  // set the color to be cleared
        this.mGL.clear(this.mGL.COLOR_BUFFER_BIT);      // clear to the color previously set
    };



}

export { Core }