import { Scene } from "../Engine/Scene";
import { vec2 } from "../Engine/Lib/gl-matrix";
import { FontRenderable } from "../Engine/Renderables/FontRenderable";
import { Camera } from "../Engine/Camera";

class GameOver extends Scene {
    constructor(gEngine) {
        super();
        this.gEngine = gEngine;
        this.mCamera = null;
        this.mMsg = null;
    }

    unloadScene() {
        // will be called from GameLoop.stop
        this.gEngine.Core.cleanUp(); // release gl resources
    };

    loadScene() {
    }

    initialize() {
        // Step A: set up the cameras
        this.mCamera = new Camera(
            this.gEngine,
            vec2.fromValues(50, 33),   // position of the camera
            100,                       // width of camera
            [0, 0, window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio]           // viewport (orgX, orgY, width, height)
        );
        this.mCamera.setBackgroundColor([0.9, 0.9, 0.9, 1]);
        // sets the background to gray

        //<editor-fold desc="Create the fonts!">
        // this.mText = new FontRenderable("This is green text");
        this.mMsg = new FontRenderable(this.gEngine, "Game Over!");
        this.mMsg.setColor([0, 0, 0, 1]);
        this.mMsg.getXform().setPosition(22, 32);
        this.mMsg.setTextHeight(10);
        //</editor-fold>
    };

    draw() {
        // Step A: clear the canvas
        this.gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        // Step  B: Activate the drawing Camera
        this.mCamera.setupViewProjection();
        this.mMsg.draw(this.mCamera.getVPMatrix());
    };

    update() {
        this.gEngine.GameLoop.stop();
    };
}

export { GameOver }