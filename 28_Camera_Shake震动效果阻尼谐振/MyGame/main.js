import { Engine } from "../Engine/Engine";
import { Scene } from "../Engine/Scene";
import { Camera } from "../Engine/Cameras/Camera";
import { FontRenderable } from "../Engine/Renderables/FontRenderable";
import { vec2 } from "../Engine/Lib/gl-matrix";
import { DyePack } from "./Objects/DyePack";
import { TextureObject } from "./Objects/TextureObject";
import { Hero } from "./Objects/Hero";
import { Brain } from "./Objects/Brain";
import { Minion } from "./Objects/Minion";
import { SpriteRenderable } from "../Engine/Renderables/SpriteRenderable";
import { GameObject } from "../Engine/GameObjects/GameObject"



import "../style.css"



class MyGame extends Scene {
    constructor(gEngine) {
        super();

        this.gEngine = gEngine;
        // textures: 


        this.kMinionSprite = "assets/textures/minion_sprite.png";
        this.kMinionPortal = "assets/textures/minion_portal.png";
        this.kBg = "assets/bg.png";
        // The camera to view the scene
        this.mCamera = null;

        // For echo message

        this.mBg = null;

        this.mMsg = null;

        // the hero and the support objects
        this.mHero = null;
        this.mBrain = null;
        this.mPortal = null;
        this.mLMinion = null;
        this.mRMinion = null;
        this.mFocusObj = null;

        this.mChoice = 'D';

    };

    loadScene() {
        this.gEngine.Textures.loadTexture(this.kMinionSprite);
        this.gEngine.Textures.loadTexture(this.kBg);
        this.gEngine.Textures.loadTexture(this.kMinionPortal);
    };

    unloadScene() {
        this.gEngine.Textures.unloadTexture(this.kMinionSprite);
        this.gEngine.Textures.unloadTexture(this.kBg);
        this.gEngine.Textures.unloadTexture(this.kMinionPortal);
    };

    initialize() {
        // Step A: set up the cameras
        this.mCamera = new Camera(
            this.gEngine,
            vec2.fromValues(50, 37.5),   // position of the camera
            100,                        // width of camera
            [0, 0, window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio]         // viewport (orgX, orgY, width, height)
        );

        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);

        // Large background image
        var bgR = new SpriteRenderable(this.gEngine, this.kBg);
        bgR.setElementPixelPositions(0, 1024, 0, 1024);
        bgR.getXform().setSize(150, 150);
        bgR.getXform().setPosition(50, 35);
        this.mBg = new GameObject(bgR);
        this.mBg.setRenderable(bgR);

        // Objects in the scene
        this.mBrain = new Brain(this.gEngine, this.kMinionSprite);
        this.mHero = new Hero(this.gEngine, this.kMinionSprite);
        this.mPortal = new TextureObject(this.gEngine, this.kMinionPortal, 50, 30, 10, 10);
        this.mLMinion = new Minion(this.gEngine, this.kMinionSprite, 30, 30);
        this.mRMinion = new Minion(this.gEngine, this.kMinionSprite, 70, 30);
        this.mFocusObj = this.mHero;

        this.mMsg = new FontRenderable(this.gEngine, "Status Message");
        this.mMsg.setColor([1, 1, 1, 1]);
        this.mMsg.getXform().setPosition(2, 4);
        this.mMsg.setTextHeight(3);
    };


    draw() {
        // Step A: clear the canvas
        this.gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        // Step  B: Activate the drawing Camera
        this.mCamera.setupViewProjection();

        // Step  C: Draw everything
        this.mBg.draw(this.mCamera);
        this.mHero.draw(this.mCamera);
        this.mBrain.draw(this.mCamera);
        this.mPortal.draw(this.mCamera);
        this.mLMinion.draw(this.mCamera);
        this.mRMinion.draw(this.mCamera);
        this.mMsg.draw(this.mCamera);

    };

    update() {
        const gEngine = this.gEngine
        var zoomDelta = 0.05;
        var msg = "L/R: Left or Right Minion; H: Dye; B: Brain]: ";

        this.mCamera.update();  // for smoother camera movements

        this.mLMinion.update();
        this.mRMinion.update();

        this.mHero.update();

        this.mPortal.update(gEngine.Input.keys.Up, gEngine.Input.keys.Down,
            gEngine.Input.keys.Left, gEngine.Input.keys.Right, gEngine.Input.keys.O);

        var h = [];



        // hero always collide with Brain (Brain chases hero)
        if (!this.mHero.pixelTouches(this.mBrain, h)) {
            this.mBrain.rotateObjPointTo(this.mHero.getXform().getPosition(), 0.05);
            // GameObject.prototype.update.call(this.mBrain);
            this.mBrain.__proto__.__proto__.update.call(this.mBrain);

        }

        // Pan camera to object
        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.L)) {
            this.mFocusObj = this.mLMinion;
            this.mChoice = 'L';
            this.mCamera.panTo(this.mLMinion.getXform().getXPos(), this.mLMinion.getXform().getYPos());
        }
        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.R)) {
            this.mFocusObj = this.mRMinion;
            this.mChoice = 'R';
            this.mCamera.panTo(this.mRMinion.getXform().getXPos(), this.mRMinion.getXform().getYPos());
        }
        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.P)) {
            this.mFocusObj = this.mPortal;
            this.mChoice = 'P';
        }
        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.H)) {
            this.mFocusObj = this.mHero;
            this.mChoice = 'H';
            this.mCamera.panTo(this.mHero.getXform().getXPos(), this.mHero.getXform().getYPos());
        }
        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.B)) {
            this.mFocusObj = this.mBrain;
            this.mChoice = 'B';
            this.mCamera.panTo(this.mBrain.getXform().getXPos(), this.mBrain.getXform().getYPos());
        }
        // zoom
        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.N)) {
            this.mCamera.zoomBy(1 - zoomDelta);
        }
        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.M)) {
            this.mCamera.zoomBy(1 + zoomDelta);
        }
        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.J)) {
            this.mCamera.zoomTowards(this.mFocusObj.getXform().getPosition(), 1 - zoomDelta);
        }
        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.K)) {
            this.mCamera.zoomTowards(this.mFocusObj.getXform().getPosition(), 1 + zoomDelta);
        }

        // interaction with the WC bound
        this.mCamera.clampAtBoundary(this.mBrain.getXform(), 0.9);
        this.mCamera.clampAtBoundary(this.mPortal.getXform(), 0.8);
        this.mCamera.panWith(this.mHero.getXform(), 0.9);

        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Q)) {
            this.mCamera.shake(-2, -2, 20, 30);
        }

        this.mMsg.setText(msg + this.mChoice);

    };
}
const gEngine = new Engine();
const width = window.innerWidth * window.devicePixelRatio;
const height = window.innerHeight * window.devicePixelRatio;
gEngine.Core.initializeEngineCore("GLCanvas", new MyGame(gEngine), width, height);

export { MyGame }
