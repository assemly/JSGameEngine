import { Engine } from "../Engine/Engine";
import { Scene } from "../Engine/Scene";
import { Camera } from "../Engine/Camera";
import { FontRenderable } from "../Engine/Renderables/FontRenderable";
import { vec2 } from "../Engine/Lib/gl-matrix";
import { DyePack } from "./Objects/DyePack";
import { TextureObject } from "./Objects/TextureObject";

import "../style.css"



class MyGame extends Scene {
    constructor(gEngine) {
        super();

        this.gEngine = gEngine;
        // textures: 


        this.kMinionSprite = "assets/textures/minion_sprite.png";
        this.kMinionCollector = "assets/textures/minion_collector.png";
        this.kMinionPortal = "assets/textures/minion_portal.png";
        // The camera to view the scene
        this.mCamera = null;

        // For echo message
        this.mMsg = null;

        this.mCollector = null;
        this.mPortal = null;
    };

    unloadScene() {
        this.gEngine.Textures.unloadTexture(this.kMinionSprite);
        this.gEngine.Textures.unloadTexture(this.kMinionCollector);
        this.gEngine.Textures.unloadTexture(this.kMinionPortal);
    };

    loadScene() {
        this.gEngine.Textures.loadTexture(this.kMinionSprite);
        this.gEngine.Textures.loadTexture(this.kMinionCollector);
        this.gEngine.Textures.loadTexture(this.kMinionPortal);
    };
    initialize() {
        // Step A: set up the cameras
        this.mCamera = new Camera(
            this.gEngine,
            vec2.fromValues(50, 37.5),   // position of the camera
            150,                        // width of camera
            [0, 0, window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio]         // viewport (orgX, orgY, width, height)
        );

        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
        // Step B: Create the font and minion images using sprite
        // Step B: Create the support objects

        // Step B: The dye pack: simply another GameObject
        this.mDyePack = new DyePack(this.gEngine, this.kMinionSprite);
        this.mDyePack.setVisibility(false);

        this.mCollector = new TextureObject(this.gEngine, this.kMinionCollector, 50, 30, 30, 30);
        this.mPortal = new TextureObject(this.gEngine, this.kMinionPortal, 70, 30, 10, 10);

        // Step E: Create and initialize message output
        this.mMsg = new FontRenderable(this.gEngine, "Status Message");
        this.mMsg.setColor([0, 0, 0, 1]);
        this.mMsg.getXform().setPosition(1, 2);
        this.mMsg.setTextHeight(3);

    };


    draw() {
        // Step A: clear the canvas
        this.gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        // Step  B: Activate the drawing Camera
        this.mCamera.setupViewProjection();

        // Step  C: Draw everything
        this.mCollector.draw(this.mCamera);
        this.mPortal.draw(this.mCamera);
        this.mDyePack.draw(this.mCamera);
        this.mMsg.draw(this.mCamera);

    };

    update() {
        let msg = "No Collision";
        const gEngine = this.gEngine;
        this.mCollector.update(gEngine.Input.keys.W, gEngine.Input.keys.S,
            gEngine.Input.keys.A, gEngine.Input.keys.D, gEngine.Input.keys.E);
        this.mPortal.update(gEngine.Input.keys.Up, gEngine.Input.keys.Down,
            gEngine.Input.keys.Left, gEngine.Input.keys.Right, gEngine.Input.keys.P);

        let h = [];

        // Portal's resolution is 1/16 x 1/16 that of Collector!
        // if (this.mCollector.pixelTouches(this.mPortal, h)) {  // <-- VERY EXPENSIVE!!
        // 
        if (this.mPortal.pixelTouches(this.mCollector, h)) {
            msg = "Collided!: (" + h[0].toPrecision(4) + " " + h[1].toPrecision(4) + ")";
            this.mDyePack.setVisibility(true);
            this.mDyePack.getXform().setXPos(h[0]);
            this.mDyePack.getXform().setYPos(h[1]);
        } else {
            this.mDyePack.setVisibility(false);
        }
        this.mMsg.setText(msg);

    };
}
const gEngine = new Engine();
const width = window.innerWidth * window.devicePixelRatio;
const height = window.innerHeight * window.devicePixelRatio;
gEngine.Core.initializeEngineCore("GLCanvas", new MyGame(gEngine), width, height);

export { MyGame }
