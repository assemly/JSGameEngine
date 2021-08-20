import { Engine } from "../Engine/Engine";
import { Scene } from "../Engine/Scene";
import { Camera } from "../Engine/Camera";
import { FontRenderable } from "../Engine/Renderables/FontRenderable";
import { vec2 } from "../Engine/Lib/gl-matrix";
import { DyePack } from "./Objects/DyePack";
import { Hero } from "./Objects/Hero";
import { Minion } from "./Objects/Minion";
import { GameObjectSet } from "../Engine/GameObjects/GameObjectSet";

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
        this.mMinionset = null;
        this.mDyePack = null;

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
            120,                        // width of camera
            [0, 0, window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio]         // viewport (orgX, orgY, width, height)
        );

        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
        // Step B: Create the font and minion images using sprite
        // Step B: Create the support objects

        // Step B: The dye pack: simply another GameObject
        this.mDyePack = new DyePack(this.gEngine, this.kMinionSprite);

        // Step C: A set of Minions
        this.mMinionset = new GameObjectSet();
        var i = 0, randomY, aMinion;
        // create 5 minions at random Y values
        for (i = 0; i < 5; i++) {
            randomY = Math.random() * 65;
            aMinion = new Minion(this.gEngine, this.kMinionSprite, randomY);
            this.mMinionset.addToSet(aMinion);
        }

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
        this.mMinionset.draw(this.mCamera);
        this.mDyePack.draw(this.mCamera);
        this.mMsg.draw(this.mCamera);

    };

    update() {
        this.mHero.update();
        this.mMinionset.update();
        this.mDyePack.update();
    }
}
const gEngine = new Engine();
const width = window.innerWidth * window.devicePixelRatio;
const height = window.innerHeight * window.devicePixelRatio;
gEngine.Core.initializeEngineCore("GLCanvas", new MyGame(gEngine), width, height);

export { MyGame }
