import { Engine } from "../Engine/Engine";
import { Scene } from "../Engine/Scene";
import { Camera } from "../Engine/Camera";
import { FontRenderable } from "../Engine/Renderables/FontRenderable";
import { vec2 } from "../Engine/Lib/gl-matrix";
import { DyePack } from "./Objects/DyePack";
import { TextureObject } from "./Objects/TextureObject";
import { Hero } from "./Objects/Hero";
import { Brain } from "./Objects/Brain";
import { Minion } from "./Objects/Minion";


import "../style.css"



class MyGame extends Scene {
    constructor(gEngine) {
        super();

        this.gEngine = gEngine;
        // textures: 


        this.kMinionSprite = "assets/textures/minion_sprite.png";
        this.kMinionPortal = "assets/textures/minion_portal.png";
        // The camera to view the scene
        this.mCamera = null;

        // For echo message
        this.mMsg = null;

        // the hero and the support objects
        this.mHero = null;
        this.mBrain = null;
        this.mPortalHit = null;
        this.mHeroHit = null;

        this.mPortal = null;
        this.mLMinion = null;
        this.mRMinion = null;

        this.mCollide = null;
        this.mChoice = 'H';
    };

    unloadScene() {
        this.gEngine.Textures.unloadTexture(this.kMinionSprite);

        this.gEngine.Textures.unloadTexture(this.kMinionPortal);
    };

    loadScene() {
        this.gEngine.Textures.loadTexture(this.kMinionSprite);

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

        this.mBrain = new Brain(this.gEngine, this.kMinionSprite);

        // Step D: Create the hero object with texture from the lower-left corner 
        this.mHero = new Hero(this.gEngine, this.kMinionSprite);

        this.mPortalHit = new DyePack(this.gEngine, this.kMinionSprite);
        this.mPortalHit.setVisibility(false);
        this.mHeroHit = new DyePack(this.gEngine, this.kMinionSprite);
        this.mHeroHit.setVisibility(false);

        this.mPortal = new TextureObject(this.gEngine,this.kMinionPortal, 50, 30, 10, 10);

        this.mLMinion = new Minion(this.gEngine, this.kMinionSprite, 30, 30);
        this.mRMinion = new Minion(this.gEngine, this.kMinionSprite, 70, 30);

        this.mMsg = new FontRenderable(this.gEngine, "Status Message");
        this.mMsg.setColor([0, 0, 0, 1]);
        this.mMsg.getXform().setPosition(1, 2);
        this.mMsg.setTextHeight(3);

        this.mCollide = this.mHero;
    };


    draw() {
        // Step A: clear the canvas
        this.gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        // Step  B: Activate the drawing Camera
        this.mCamera.setupViewProjection();

        // Step  C: Draw everything
        this.mHero.draw(this.mCamera);
        this.mBrain.draw(this.mCamera);
        this.mPortal.draw(this.mCamera);
        this.mLMinion.draw(this.mCamera);
        this.mRMinion.draw(this.mCamera);
        this.mPortalHit.draw(this.mCamera);
        this.mHeroHit.draw(this.mCamera);
        this.mMsg.draw(this.mCamera);

    };

    update() {
        const gEngine = this.gEngine
        var msg = "L/R: Left or Right Minion; H: Dye; B: Brain]: ";

        this.mLMinion.update();
        this.mRMinion.update();

        this.mHero.update();

        this.mPortal.update(gEngine.Input.keys.Up, gEngine.Input.keys.Down,
            gEngine.Input.keys.Left, gEngine.Input.keys.Right, gEngine.Input.keys.P);

        var h = [];

        // Portal intersects with which ever is selected
        if (this.mPortal.pixelTouches(this.mCollide, h)) {
            this.mPortalHit.setVisibility(true);
            this.mPortalHit.getXform().setXPos(h[0]);
            this.mPortalHit.getXform().setYPos(h[1]);
        } else {
            this.mPortalHit.setVisibility(false);
        }

        // hero always collide with Brain (Brain chases hero)
        if (!this.mHero.pixelTouches(this.mBrain, h)) {
            this.mBrain.rotateObjPointTo(this.mHero.getXform().getPosition(), 0.05);
            // GameObject.prototype.update.call(this.mBrain);
            this.mBrain.__proto__.__proto__.update.call(this.mBrain);
            this.mHeroHit.setVisibility(false);
        } else {
            this.mHeroHit.setVisibility(true);
            this.mHeroHit.getXform().setPosition(h[0], h[1]);
        }

        // decide which to collide
        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.L)) {
            this.mCollide = this.mLMinion;
            this.mChoice = 'L';
        }
        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.R)) {
            this.mCollide = this.mRMinion;
            this.mChoice = 'R';
        }
        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.B)) {
            this.mCollide = this.mBrain;
            this.mChoice = 'B';
        }
        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.H)) {
            this.mCollide = this.mHero;
            this.mChoice = 'H';
        }

        this.mMsg.setText(msg + this.mChoice);

    };
}
const gEngine = new Engine();
const width = window.innerWidth * window.devicePixelRatio;
const height = window.innerHeight * window.devicePixelRatio;
gEngine.Core.initializeEngineCore("GLCanvas", new MyGame(gEngine), width, height);

export { MyGame }
