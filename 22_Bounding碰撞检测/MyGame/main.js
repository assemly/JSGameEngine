import { Engine } from "../Engine/Engine";
import { Scene } from "../Engine/Scene";
import { Camera } from "../Engine/Camera";
import { FontRenderable } from "../Engine/Renderables/FontRenderable";
import { vec2 } from "../Engine/Lib/gl-matrix";
import { DyePack } from "./Objects/DyePack";
import { Hero } from "./Objects/Hero";
import { Brain } from "./Objects/Brain";
import { GameObject } from "../Engine/GameObjects/GameObject";

import "../style.css"



class MyGame extends Scene {
    constructor(gEngine) {
        super();

        this.gEngine = gEngine;
        // textures: 

        this.kMinionSprite = "assets/textures/minion_sprite.png";  // Portal and Collector are embedded here

        // The camera to view the scene
        this.mCamera = null;

        // For echo message
        this.mMsg = null;

        // the hero and the support objects
        this.mHero = null;

        this.mDyePack = null;

        // mode of running: 
        //   H: Player drive brain
        //   J: Dye drive brain, immediate orientation change
        //   K: Dye drive brain, gradual orientation change
        this.mMode = 'H';
    };

    unloadScene() {
        this.gEngine.Textures.unloadTexture(this.kMinionSprite);
    };

    loadScene() {
        this.gEngine.Textures.loadTexture(this.kMinionSprite);
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

        // Create the brain  
        this.mBrain = new Brain(this.gEngine, this.kMinionSprite);
        // Step D: Create the hero object
        this.mHero = new Hero(this.gEngine, this.kMinionSprite);

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

        // Step  C: draw everything
        this.mHero.draw(this.mCamera);
        this.mBrain.draw(this.mCamera);
        this.mDyePack.draw(this.mCamera);
        this.mMsg.draw(this.mCamera);

    };

    update() {
        let msg = "Brain modes [H:keys, J:immediate, K:gradual]: ";
        let rate = 1;

        this.mHero.update();

        // get the bounding box for collision
        let hBbox = this.mHero.getBBox();
        let bBbox = this.mBrain.getBBox();

        switch (this.mMode) {
            case 'H':
                this.mBrain.update();  // player steers with arrow keys
                break;
            case 'K':
                rate = 0.02;    // graduate rate
            // When "K" is typed, the following should also be executed.
            case 'J':
                if (!hBbox.intersectsBound(bBbox)) {  // stop the brain when it touches hero bound
                    this.mBrain.rotateObjPointTo(this.mHero.getXform().getPosition(), rate);
                    //GameObject.prototype.update.call(this.mBrain);  // the default GameObject: only move forward

                    //this.mBrain.__proto__.update();
                    // console.log("ssssssssssssss")
                    //this.mBrain.super.update.call(this.Brain); error
                    this.mBrain.__proto__.__proto__.update.call(this.mBrain);
                    //console.log(this.mBrain.__proto__.__proto__)
                }

                break;
        }

        //// Check for hero going outside 80% of the WC Window bound
        let status = this.mCamera.collideWCBound(this.mHero.getXform(), 0.8);

        if (this.gEngine.Input.isKeyClicked(this.gEngine.Input.keys.H)) {
            this.mMode = 'H';
        }
        if (this.gEngine.Input.isKeyClicked(this.gEngine.Input.keys.J)) {
            this.mMode = 'J';
        }
        if (this.gEngine.Input.isKeyClicked(this.gEngine.Input.keys.K)) {
            this.mMode = 'K';
        }
        this.mMsg.setText(msg + this.mMode + " [Hero bound=" + status + "]");
    };
}
const gEngine = new Engine();
const width = window.innerWidth * window.devicePixelRatio;
const height = window.innerHeight * window.devicePixelRatio;
gEngine.Core.initializeEngineCore("GLCanvas", new MyGame(gEngine), width, height);

export { MyGame }
