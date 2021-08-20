import { Engine } from "./Engine/Engine";
import { SimpleShader } from "./Engine/SimpleShader";
import { Renderable } from "./Engine/Renderable";
import VertexShader from "./GLSLShaders/SimpleVS.glsl";
import FragmentShader from "./GLSLShaders/WhiteFS.glsl";
import { Camera } from "./Engine/Camera";
import { vec2 } from "./Engine/Lib/gl-matrix";

import "./style.css"

const gEngine = new Engine();

class MyGame {
    constructor(htmlCanvasID) {
        // letiables of the constant color shader
        this.mConstColorShader = null;

        // letiables for the squares
        this.mWhiteSq = null;        // these are the Renderable objects
        this.mRedSq = null;

        // The camera to view the scene
        this.mCamera = null;
        this.width = window.innerWidth * window.devicePixelRatio;
        this.height = window.innerHeight * window.devicePixelRatio;
        // Initialize the webGL Context
        gEngine.Core.initializeWebGL(htmlCanvasID,this.width,this.height);

        // Initialize the game
        this.initialize();
    };

    initialize() {
        // Step A: set up the cameras
        let width = this.width;
        let height = this.height;
        this.mCamera = new Camera(
            gEngine,
            vec2.fromValues(20, 60),   // position of the camera
            20,                        // width of camera
            [(width-width*0.8)/2, (height-height*0.8)/2, width*0.8, height*0.8] );       // viewport (orgX, orgY, width, height)

        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
        // sets the background to dark gray

        // Step  B: create the shader
        this.mConstColorShader = new SimpleShader(
            gEngine,
            VertexShader,      // Path to the VertexShader 
            FragmentShader);    // Path to the Simple FragmentShader    

        // Step  C: Create the Renderable objects:
        this.mWhiteSq = new Renderable(gEngine,this.mConstColorShader);
        this.mWhiteSq.setColor([1, 1, 1, 1]);
        this.mRedSq = new Renderable(gEngine,this.mConstColorShader);
        this.mRedSq.setColor([1, 0, 0, 1]);

        // Step  D: Initialize the white Renderable object: centered, 5x5, rotated
        this.mWhiteSq.getXform().setPosition(20, 60);
        this.mWhiteSq.getXform().setRotationInRad(0.2); // In Radians
        this.mWhiteSq.getXform().setSize(5, 5);

        // Step  E: Initialize the red Renderable object: centered 2x2
        this.mRedSq.getXform().setPosition(20, 60);
        this.mRedSq.getXform().setSize(2, 2);

        // Step F: Start the game loop running
        gEngine.GameLoop.start(this);
    };

    draw() {
        // Step A: clear the canvas
        gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        // Step  B: Activate the drawing Camera
        this.mCamera.setupViewProjection();

        // Step  C: Activate the white shader to draw
        this.mWhiteSq.draw(this.mCamera.getVPMatrix());

        // Step  D: Activate the red shader to draw
        this.mRedSq.draw(this.mCamera.getVPMatrix());
    };

    update() {
        // For this very simple game, let's move the white square and pulse the red

        // Step A: move the white square
        let whiteXform = this.mWhiteSq.getXform();
        let deltaX = 0.05;
        if (whiteXform.getXPos() > 30) // this is the right-bound of the window
            whiteXform.setPosition(10, 60);
        whiteXform.incXPosBy(deltaX);
        whiteXform.incRotationByDegree(1);

        // Step B: pulse the red square
        let redXform = this.mRedSq.getXform();
        if (redXform.getWidth() > 5)
            redXform.setSize(2, 2);
        redXform.incSizeBy(0.05);
    };

}
new MyGame('GLCanvas');