import { Engine } from "./Engine/Engine";
import { Renderable } from "./Engine/Renderable";
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
        gEngine.Core.initializeEngineCore(htmlCanvasID, this,this.width, this.height);

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
            [(width - width * 0.8) / 2, (height - height * 0.8) / 2, width * 0.8, height * 0.8]);       // viewport (orgX, orgY, width, height)

        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
        // sets the background to dark gray

        // Step  B: create the shader
        // while(!gEngine.DefaultResources.getConstColorShader())
        
        this.mConstColorShader =  gEngine.DefaultResources.getConstColorShader();
        if(!this.mConstColorShader) return;
        console.log("main::this.mConstColorShader: "+this.mConstColorShader)
        // Step  C: Create the Renderable objects:
       
        this.mWhiteSq = new Renderable(gEngine, this.mConstColorShader);
        this.mWhiteSq.setColor([1, 1, 1, 1]);
        this.mRedSq = new Renderable(gEngine, this.mConstColorShader);
        this.mRedSq.setColor([1, 0, 0, 1]);

        // Step  D: Initialize the white Renderable object: centered, 5x5, rotated
        this.mWhiteSq.getXform().setPosition(20, 60);
        this.mWhiteSq.getXform().setRotationInRad(0.2); // In Radians
        this.mWhiteSq.getXform().setSize(5, 5);

        // Step  E: Initialize the red Renderable object: centered 2x2
        this.mRedSq.getXform().setPosition(20, 60);
        this.mRedSq.getXform().setSize(2, 2);

        // Step F: Start the game loop running
        gEngine.GameLoop.start(this); //因为
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
        let whiteXform = this.mWhiteSq.getXform();
        let deltaX = 0.05;
        // Step A: test for white square movement
        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)) {
            if (whiteXform.getXPos() > 30) // this is the right-bound of the window
                whiteXform.setPosition(10, 60);
            whiteXform.incXPosBy(deltaX);
            
        }

        // Step  B: test for white square rotation
        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Up)) {
            whiteXform.incRotationByDegree(1);
        }

        let redXform = this.mRedSq.getXform();
        // Step  C: test for pulsing the red square
        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Down)) {
            if (redXform.getWidth() > 5)
                redXform.setSize(2, 2);
            redXform.incSizeBy(0.05);
        }

    };

}
new MyGame('GLCanvas');