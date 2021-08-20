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
import { Renderable } from "../Engine/Renderables/Renderable";

import { MyGameLights } from "./MyGame_Lights";
import { MyGameLightControl } from "./MyGame_LightControl";

import { IllumRenderable } from "../Engine/Renderables/IllumRenderable";

import "../style.css"


class MyGame extends Scene {
    constructor(gEngine) {
        super();

        this.gEngine = gEngine;
        this.kMinionSprite = "assets/textures/minion_sprite.png";
        this.kMinionSpriteNormal = "assets/textures/minion_sprite_normal.png";
        this.kBg = "assets/bg.png";
        this.kBgNormal = "assets/bg_normal.png";

        // The camera to view the scene
        this.mCamera = null;
        this.mBg = null;

        this.mMsg = null;

        // the hero and the support objects
        this.mHero = null;
        this.mLMinion = null;
        this.mRMinion = null;

        this.mGlobalLightSet = null;

        this.mBlock1 = null;   // to verify swiitching between shaders is fine
        this.mBlock2 = null;

        this.mLgtIndex = 0;    // the light to move

        Object.assign(this, { ...MyGameLights, ...MyGameLightControl });

    };

    loadScene() {

        this.gEngine.Textures.loadTexture(this.kMinionSprite);
        this.gEngine.Textures.loadTexture(this.kBg);
        this.gEngine.Textures.loadTexture(this.kBgNormal);
        this.gEngine.Textures.loadTexture(this.kMinionSpriteNormal);
    };

    unloadScene() {

        this.gEngine.Textures.unloadTexture(this.kMinionSprite);
        this.gEngine.Textures.unloadTexture(this.kBg);
        this.gEngine.Textures.unloadTexture(this.kBgNormal);
        this.gEngine.Textures.unloadTexture(this.kMinionSpriteNormal);
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

        // the light
        this._initializeLights();   // defined in MyGame_Lights.js

        // the Background
        var bgR = new IllumRenderable(this.gEngine, this.kBg, this.kBgNormal);

        bgR.setElementPixelPositions(0, 1024, 0, 1024);
        bgR.getXform().setSize(100, 100);
        bgR.getXform().setPosition(50, 35);

        // set background materal properties
        bgR.getMaterial().setShininess(100);
        bgR.getMaterial().setSpecular([1, 0, 0, 1]);
        var i;
        for (i = 0; i < 4; i++) {
            bgR.addLight(this.mGlobalLightSet.getLightAt(i));   // all the lights
        }
        this.mBg = new GameObject(bgR);
        this.mBg.setRenderable(bgR);

        // 
        // the objects
        this.mHero = new Hero(this.gEngine, this.kMinionSprite, this.kMinionSprite);
        this.mHero.getRenderable().addLight(this.mGlobalLightSet.getLightAt(0));   // hero light
        this.mHero.getRenderable().addLight(this.mGlobalLightSet.getLightAt(3));   // center light
        // Uncomment the following to see how light affects Dye
        //      this.mHero.getRenderable().addLight(this.mGlobalLightSet.getLightAt(1)); 
        //      this.mHero.getRenderable().addLight(this.mGlobalLightSet.getLightAt(2)); 

        this.mLMinion = new Minion(this.gEngine, this.kMinionSprite, this.kMinionSprite, 17, 15);
        this.mLMinion.getRenderable().addLight(this.mGlobalLightSet.getLightAt(1));   // LMinion light
        this.mLMinion.getRenderable().addLight(this.mGlobalLightSet.getLightAt(3));   // center light

        this.mRMinion = new Minion(this.gEngine, this.kMinionSprite, this.kMinionSprite, 87, 15);
        this.mRMinion.getRenderable().addLight(this.mGlobalLightSet.getLightAt(2));   // RMinion light
        this.mRMinion.getRenderable().addLight(this.mGlobalLightSet.getLightAt(3));   // center light

        this.mMsg = new FontRenderable(this.gEngine, "Status Message");
        this.mMsg.setColor([1, 1, 1, 1]);
        this.mMsg.getXform().setPosition(1, 2);
        this.mMsg.setTextHeight(3);

        this.mBlock1 = new Renderable(this.gEngine);
        this.mBlock1.setColor([1, 0, 0, 1]);
        this.mBlock1.getXform().setSize(5, 5);
        this.mBlock1.getXform().setPosition(30, 50);

        this.mBlock2 = new Renderable(this.gEngine);
        this.mBlock2.setColor([0, 1, 0, 1]);
        this.mBlock2.getXform().setSize(5, 5);
        this.mBlock2.getXform().setPosition(70, 50);
    };

    drawCamera(camera) {
        camera.setupViewProjection();
        // Step B: Now draws each primitive
        this.mBg.draw(camera);
        this.mBlock1.draw(camera);
        this.mLMinion.draw(camera);
        this.mBlock2.draw(camera);
        this.mHero.draw(camera);
        this.mRMinion.draw(camera);
    };

    draw() {
        //this.gEngine.AudioClips.playBackgroundAudio(this.kBgClip);
        // Step A: clear the canvas
        this.gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        // Step  B: Activate the drawing Camera

        // this.drawCamera(this.mCamera)
        // this.mMsg.draw(this.mCamera); //会覆盖所以要draw注意位置
        // this.drawCamera(this.mHeroCam);
        // this.drawCamera(this.mPortalCam);
        // this.drawCamera(this.mBrainCam);
        this.drawCamera(this.mCamera);
        this.mMsg.draw(this.mCamera);   // only draw status in the main camera


    };

    update() {
        var msg = "Selected Light=" + this.mLgtIndex + " ";

        this.mCamera.update();  // to ensure proper interpolated movement effects

        this.mLMinion.update(); // ensure sprite animation
        this.mRMinion.update();

        this.mHero.update();  // allow keyboard control to move

        // control the selected light
        msg += this._lightControl();

        this.mMsg.setText(msg);
    };
}
const gEngine = new Engine();
const width = window.innerWidth * window.devicePixelRatio;
const height = window.innerHeight * window.devicePixelRatio;
gEngine.Core.initializeEngineCore("GLCanvas", new MyGame(gEngine), width, height);

export { MyGame }
