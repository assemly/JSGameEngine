import { Engine } from "../Engine/Engine";
import { Scene } from "../Engine/Scene";
import { Camera } from "../Engine/Cameras/Camera";
import { FontRenderable } from "../Engine/Renderables/FontRenderable";
import { vec2 } from "../Engine/Lib/gl-matrix";
import { TextureObject } from "./Objects/TextureObject";
import { Hero } from "./Objects/Hero";
import { Brain } from "./Objects/Brain";
import { Minion } from "./Objects/Minion";
import { LightRenderable } from "../Engine/Renderables/LightRenderable";
import { GameObject } from "../Engine/GameObjects/GameObject"
import { Light } from "../Engine/Lights/Light";



import "../style.css"




class MyGame extends Scene {
    constructor(gEngine) {
        super();

        this.gEngine = gEngine;
        // textures: 
        this.kBgClip = "assets/sounds/bensound-creativeminds.mp3";

        this.kMinionSprite = "assets/textures/minion_sprite.png";
        this.kMinionPortal = "assets/textures/minion_portal.png";
        this.kBg = "assets/bg.png";
        // The camera to view the scene
        this.mCamera = null;
        this.mHeroCam = null;
        this.mBrainCam = null;
        this.mPortalCam = null;

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

        this.mLineSet = [];
        this.mCurrentLine = null;
        this.mP1 = null;

        this.mTheLight = null;

        this.mChoice = 'D';

    };

    loadScene() {
        this.gEngine.AudioClips.loadAudio(this.kBgClip);
        this.gEngine.Textures.loadTexture(this.kMinionSprite);
        this.gEngine.Textures.loadTexture(this.kBg);
        this.gEngine.Textures.loadTexture(this.kMinionPortal);
    };

    unloadScene() {
        this.gEngine.AudioClips.unloadAudio(this.kBgClip);
        this.gEngine.Textures.unloadTexture(this.kMinionSprite);
        this.gEngine.Textures.unloadTexture(this.kBg);
        this.gEngine.Textures.unloadTexture(this.kMinionPortal);
    };

    initialize() {
        // console.log("*************")
        // console.log( this.gEngine.ResourceMap.isAssetLoaded(this.kBgClip));

        //this.gEngine.AudioClips.playBackgroundAudio(this.kBgClip);

        // Step A: set up the cameras
        this.mCamera = new Camera(
            this.gEngine,
            vec2.fromValues(50, 37.5),   // position of the camera
            100,                        // width of camera
            [0, 0, window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio]         // viewport (orgX, orgY, width, height)
        );

        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);

        this.mTheLight = new Light();
        this.mTheLight.setRadius(8);
        this.mTheLight.setZPos(2);
        this.mTheLight.setXPos(30);
        this.mTheLight.setYPos(30);  // Position above LMinion
        this.mTheLight.setColor([0.9, 0.9, 0.2, 1]);

        this.mHeroCam = new Camera(
            this.gEngine,
            vec2.fromValues(50, 30),    // will be updated at each cycle to point to hero
            20,
            [window.innerWidth * window.devicePixelRatio - 160, window.innerHeight * window.devicePixelRatio - 160, 150, 150],
            2                           // viewport bounds
        );
        this.mHeroCam.setBackgroundColor([0.5, 0.5, 0.5, 1]);

        this.mPortalCam = new Camera(
            this.gEngine,
            vec2.fromValues(50, 30),    // will be updated at each cycle to point to hero
            20,
            [window.innerWidth * window.devicePixelRatio - 320, window.innerHeight * window.devicePixelRatio - 320, 150, 150],
            2                           // viewport bounds
        );
        this.mPortalCam.setBackgroundColor([0.7, 0.7, 0.7, 1]);

        this.mBrainCam = new Camera(
            this.gEngine,
            vec2.fromValues(50, 30),    // will be updated at each cycle to point to the brain
            10,
            [0, window.innerHeight * window.devicePixelRatio - 160, 150, 150],
            2                           // viewport bounds
        );
        this.mBrainCam.setBackgroundColor([1, 1, 1, 1]);
        this.mBrainCam.configInterpolation(0.7, 10);
        // Large background image
        var bgR = new LightRenderable(this.gEngine, this.kBg);
        bgR.setElementPixelPositions(0, 1024, 0, 1024);
        bgR.getXform().setSize(150, 150);
        bgR.getXform().setPosition(50, 35);
        bgR.addLight(this.mTheLight);

        this.mBg = new GameObject(bgR);
        this.mBg.setRenderable(bgR);

        // Objects in the scene
        this.mBrain = new Brain(this.gEngine, this.kMinionSprite);

        this.mHero = new Hero(this.gEngine, this.kMinionSprite);
        this.mHero.getRenderable().addLight(this.mTheLight);

        this.mPortal = new TextureObject(this.gEngine, this.kMinionPortal, 50, 30, 10, 10);
        this.mLMinion = new Minion(this.gEngine, this.kMinionSprite, 30, 30);
        this.mLMinion.getRenderable().addLight(this.mTheLight);
        this.mRMinion = new Minion(this.gEngine, this.kMinionSprite, 70, 30);
        this.mRMinion.getRenderable().addLight(this.mTheLight);
        this.mFocusObj = this.mHero;

        this.mMsg = new FontRenderable(this.gEngine, "Status Message");
        this.mMsg.setColor([1, 1, 1, 1]);
        this.mMsg.getXform().setPosition(5, 30);
        this.mMsg.setTextHeight(3);
        this.gEngine.AudioClips.playBackgroundAudio(this.kBgClip);
    };

    drawCamera(camera) {
        camera.setupViewProjection();
        this.mBg.draw(camera);
        this.mHero.draw(camera);
        this.mBrain.draw(camera);
        this.mPortal.draw(camera);
        this.mLMinion.draw(camera);
        this.mRMinion.draw(camera);
    };

    draw() {
        //this.gEngine.AudioClips.playBackgroundAudio(this.kBgClip);
        // Step A: clear the canvas
        this.gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        // Step  B: Activate the drawing Camera

        this.drawCamera(this.mCamera)
        this.mMsg.draw(this.mCamera); //会覆盖所以要draw注意位置
        this.drawCamera(this.mHeroCam);
        this.drawCamera(this.mPortalCam);
        this.drawCamera(this.mBrainCam);


    };

    update() {
        const gEngine = this.gEngine
        var zoomDelta = 0.05;
        var msg, i, c;
        var deltaC = 0.01;
        var deltaZ = 0.05;

        // var msg = "L/R: Left or Right Minion; H: Dye; B: Brain]: ";

        this.mCamera.update();  // for smoother camera movements
        this.mHeroCam.update();
        this.mPortalCam.update();
        this.mBrainCam.update();

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

        // set the hero and brain cams    
        this.mHeroCam.panTo(this.mHero.getXform().getXPos(), this.mHero.getXform().getYPos());
        this.mBrainCam.panTo(this.mBrain.getXform().getXPos(), this.mBrain.getXform().getYPos());
        this.mPortalCam.panTo(this.mLMinion.getXform().getXPos(), this.mLMinion.getXform().getYPos());
        // Move the hero cam viewport just to show it is possible
        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Q)) {
            this.mCamera.shake(-2, -2, 20, 30);
            this.gEngine.AudioClips.playBackgroundAudio(this.kBgClip);
        }

        msg = "";
        let deltaAmbient = 0.01;
        let v = gEngine.DefaultResources.getGlobalAmbientColor();
        // testing the mouse input
        if (gEngine.Input.isButtonPressed(gEngine.Input.mouseButton.Left)) {
            msg += "[L Down]";
            if (this.mCamera.isMouseInViewport()) {
                this.mPortal.getXform().setXPos(this.mCamera.mouseWCX());
                this.mPortal.getXform().setYPos(this.mCamera.mouseWCY());
            }
            v[2] += deltaAmbient;
        }

        if (gEngine.Input.isButtonPressed(gEngine.Input.mouseButton.Middle)) {
            if (this.mHeroCam.isMouseInViewport()) {
                this.mHero.getXform().setXPos(this.mHeroCam.mouseWCX());
                this.mHero.getXform().setYPos(this.mHeroCam.mouseWCY());
            }

            this.mPortal.setVisibility(true);
            v[2] -= deltaAmbient;
        }
        if (gEngine.Input.isButtonClicked(gEngine.Input.mouseButton.Right)) {
            this.mPortal.setVisibility(false);
        }

        if (gEngine.Input.isButtonClicked(gEngine.Input.mouseButton.Middle)) {
            this.mPortal.setVisibility(true);
        }
        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.One)) {
            gEngine.DefaultResources.setGlobalAmbientIntensity(gEngine.DefaultResources.getGlobalAmbientIntensity() - deltaAmbient);
        }

        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Two)) {
            gEngine.DefaultResources.setGlobalAmbientIntensity(gEngine.DefaultResources.getGlobalAmbientIntensity() + deltaAmbient);
        }
        msg = "";
        msg += " X=" + gEngine.Input.getMousePosX() + " Y=" + gEngine.Input.getMousePosY();

        msg += " Current Ambient]: ";
        msg += " Red=" + v[0].toPrecision(3) + " Intensity=" + gEngine.DefaultResources.getGlobalAmbientIntensity().toPrecision(3);

        var p = this.mTheLight.getPosition(), r;
        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Z)) {
            p[2] += deltaZ;
        }
        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.X)) {
            p[2] -= deltaZ;
        }
        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.C)) {
            r = this.mTheLight.getRadius();
            r += deltaC;
            this.mTheLight.setRadius(r);
        }
        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.V)) {
            r = this.mTheLight.getRadius();
            r -= deltaC;
            this.mTheLight.setRadius(r);
        }

        c = this.mTheLight.getColor();
        msg = "LightColor:" + c[0].toPrecision(4) + " " + c[1].toPrecision(4) +
            " " + c[2].toPrecision(4) + " " + c[3].toPrecision(4) +
            " Z=" + p[2].toPrecision(3) +
            " r=" + this.mTheLight.getRadius().toPrecision(3);
        this.mMsg.setText(msg);

    };
}
const gEngine = new Engine();
const width = window.innerWidth * window.devicePixelRatio;
const height = window.innerHeight * window.devicePixelRatio;
gEngine.Core.initializeEngineCore("GLCanvas", new MyGame(gEngine), width, height);

export { MyGame }
