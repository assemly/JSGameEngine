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
        this.mGL = canvas.getContext("webgl", { alpha: false, depth: true, stencil: true })
            || canvas.getContext("experimental-webgl", { alpha: false, depth: true, stencil: true });

        // Allows transperency with textures.
        this.mGL.blendFunc(this.mGL.SRC_ALPHA, this.mGL.ONE_MINUS_SRC_ALPHA);
        this.mGL.enable(this.mGL.BLEND);

        // Set images to flip y axis to match the texture coordinate space.
        this.mGL.pixelStorei(this.mGL.UNPACK_FLIP_Y_WEBGL, true);

        // make sure depth testing is enabled
        this.mGL.enable(this.mGL.DEPTH_TEST);
        this.mGL.depthFunc(this.mGL.LEQUAL);

        if (this.mGL === null) {
            document.write("<br><b>WebGL is not supported!</b>");
            return;
        }

        // // now initialize the VertexBuffer
        // this.gEngine.VertexBuffer.initialize();
    };

    startScene(scene) {

        scene.loadScene.call(scene); // Called in this way to keep correct context
        this.gEngine.GameLoop.start(scene); // start the game loop after initialization is done

    };

    initializeEngineCore(htmlCanvasID, myGame, width = "640", height = "480") {
        this._initializeWebGL(htmlCanvasID, width, height);
        this.gEngine.VertexBuffer.initialize();
        this.gEngine.Input.initialize(htmlCanvasID);
        this.gEngine.AudioClips.initAudioContext();
        // Inits DefaultResources, when done, invoke the anonymous function to call startScene(myGame).
        this.gEngine.DefaultResources.initialize(() => { this.startScene(myGame); });
    };

    clearCanvas(color) {
        this.mGL.clearColor(color[0], color[1], color[2], color[3]);  // set the color to be cleared
        this.mGL.clear(this.mGL.COLOR_BUFFER_BIT | this.mGL.STENCIL_BUFFER_BIT | this.mGL.DEPTH_BUFFER_BIT);      // clear to the color previously set
    };

    cleanUp() {
        this.gEngine.DefaultResources.cleanUp();
        this.gEngine.VertexBuffer.cleanUp();
    };

}

export { Core }