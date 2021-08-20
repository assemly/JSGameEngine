import { Engine } from "../Engine/Engine";
import { Scene } from "../Engine/Scene";
import { Camera } from "../Engine/Cameras/Camera";
import { vec2 } from "../Engine/Lib/gl-matrix";

import { Wall } from "./Objects/Wall";
import { Platform } from "./Objects/Platform";
import { Hero } from "./Objects/Hero";
import { Minion } from "./Objects/Minion";
import { DyePack } from "./Objects/DyePack";

import { GameObjectSet } from "../Engine/GameObjects/GameObjectSet";
import { ParticleGameObject } from "../Engine/Particles/ParticleGameObject";
import { ParticleGameObjectSet } from "../Engine/Particles/ParticleGameObjectSet";
import { TiledGameObject } from "../Engine/GameObjects/TiledGameObject";

import { Renderable } from "../Engine/Renderables/Renderable";
import { FontRenderable } from "../Engine/Renderables/FontRenderable";
import { IllumRenderable } from "../Engine/Renderables/IllumRenderable";

import { MyGameLightControl } from "./MyGame_LightControl";
import { MyGameLights } from "./MyGame_Lights";
import { MyGamePhysics } from "./MyGame_Physics";
import { MyGameShadow } from "./MyGame_Shadow";
import { MyGameMaterialControl } from "./MyGame_MaterialControl";

import "../style.css"


class MyGame extends Scene {
    constructor(gEngine) {
        super();

        this.gEngine = gEngine;
        this.kMinionSprite = "assets/textures/minion_sprite.png";
        this.kMinionSpriteNormal = "assets/textures/minion_sprite_normal.png";
        this.kBg = "assets/bg.png";
        this.kBgNormal = "assets/bg_normal.png";
        this.kBgLayer = "assets/bgLayer.png";
        this.kBgLayerNormal = "assets/bgLayer_normal.png";

        // The camera to view the scene
        this.mCamera = null;
        this.mHeroCam = null;

        this.mBg = null;
        this.mBgL1 = null;

        this.mMsg = null;
        this.mMatMsg = null;

        // the hero and the support objects
        this.mLgtHero = null;
        this.mIllumHero = null;

        this.mLgtMinion = null;
        this.mIllumMinion = null;

        this.mGlobalLightSet = null;

        this.mBlock1 = null;   // to verify swiitching between shaders is fine
        this.mBlock2 = null;

        this.mLgtIndex = 0;
        this.mLgtRotateTheta = 0;

        // shadow support
        this.mBgShadow1 = null;
        Object.assign(this, { ...MyGamePhysics, ...MyGameLightControl, ...MyGameLights, ...MyGameShadow, ...MyGameMaterialControl });

    };

    loadScene() {
        this.gEngine.Textures.loadTexture(this.kMinionSprite);
        this.gEngine.Textures.loadTexture(this.kBg);
        this.gEngine.Textures.loadTexture(this.kBgNormal);
        this.gEngine.Textures.loadTexture(this.kBgLayer);
        this.gEngine.Textures.loadTexture(this.kBgLayerNormal);
        this.gEngine.Textures.loadTexture(this.kMinionSpriteNormal);
    };

    unloadScene() {
        this.gEngine.Textures.unloadTexture(this.kMinionSprite);
        this.gEngine.Textures.unloadTexture(this.kBg);
        this.gEngine.Textures.unloadTexture(this.kBgNormal);
        this.gEngine.Textures.unloadTexture(this.kBgLayer);
        this.gEngine.Textures.unloadTexture(this.kBgLayerNormal);
        this.gEngine.Textures.unloadTexture(this.kMinionSpriteNormal);
    };

    initialize() {
        // console.log("*************")
        // console.log( this.gEngine.ResourceMap.isAssetLoaded(this.kBgClip));

        //this.gEngine.AudioClips.playBackgroundAudio(this.kBgClip);

        // Step A: set up the cameras
        // Step A: set up the cameras
        this.mHeroCam = new Camera(
            this.gEngine,
            vec2.fromValues(20, 30.5), // position of the camera
            14,                        // width of camera
            [0, 420, 300, 300],        // viewport (orgX, orgY, width, height)
            2
        );
        this.mHeroCam.setBackgroundColor([0.5, 0.5, 0.9, 1]);
        this.mCamera = new Camera(
            this.gEngine,
            vec2.fromValues(50, 37.5), // position of the camera
            100,                       // width of camera
            [0, 0, window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio],         // viewport (orgX, orgY, width, height)

        );

        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);

        // Step B: the lights
        this._initializeLights();   // defined in MyGame_Lights.js

        // Step C: the far Background
        var bgR = new IllumRenderable(this.gEngine, this.kBg, this.kBgNormal);
        bgR.setElementPixelPositions(0, 1024, 0, 1024);
        bgR.getXform().setSize(30, 30);
        bgR.getXform().setPosition(0, 0);
        bgR.getMaterial().setSpecular([0.2, 0.1, 0.1, 1]);
        bgR.getMaterial().setShininess(50);
        bgR.getXform().setZPos(-20);
        bgR.addLight(this.mGlobalLightSet.getLightAt(1));   // only the directional light
        this.mBg = new TiledGameObject(bgR);

        // Step D: the closer Background
        var i;
        var bgR1 = new IllumRenderable(this.gEngine, this.kBgLayer, this.kBgLayerNormal);
        bgR1.getXform().setSize(30, 30);
        bgR1.getXform().setPosition(0, 0);
        bgR1.getXform().setZPos(-10);
        for (i = 0; i < 4; i++) {
            bgR1.addLight(this.mGlobalLightSet.getLightAt(i));   // all the lights
        }
        bgR1.getMaterial().setSpecular([0.2, 0.2, 0.5, 1]);
        bgR1.getMaterial().setShininess(10);
        this.mBgL1 = new TiledGameObject(bgR1);
        this.mBgL1.setSpeed(0.1);
        this.mBgL1.setCurrentFrontDir([-1, 0]);

        // 
        // the objects
        this.mIllumHero = new Hero(this.gEngine, this.kMinionSprite, this.kMinionSpriteNormal, 20, 30);
        this.mLgtHero = new Hero(this.gEngine, this.kMinionSprite, null, 60, 50);
        this.mIllumMinion = new Minion(this.gEngine, this.kMinionSprite, this.kMinionSpriteNormal, 25, 30);
        this.mLgtMinion = new Minion(this.gEngine, this.kMinionSprite, null, 65, 25);
        for (i = 0; i < 4; i++) {
            this.mIllumHero.getRenderable().addLight(this.mGlobalLightSet.getLightAt(i));
            this.mLgtHero.getRenderable().addLight(this.mGlobalLightSet.getLightAt(i));
            this.mIllumMinion.getRenderable().addLight(this.mGlobalLightSet.getLightAt(i));
            this.mLgtMinion.getRenderable().addLight(this.mGlobalLightSet.getLightAt(i));
        }

        this.mMsg = new FontRenderable(this.gEngine, "Status Message");
        this.mMsg.setColor([1, 1, 1, 1]);
        this.mMsg.getXform().setPosition(4, 12);
        this.mMsg.setTextHeight(3);

        this.mMatMsg = new FontRenderable(this.gEngine, "Status Message");
        this.mMatMsg.setColor([1, 1, 1, 1]);
        this.mMatMsg.getXform().setPosition(4, 64);
        this.mMatMsg.setTextHeight(3);

        this.mBlock1 = new Renderable(this.gEngine);
        this.mBlock1.setColor([1, 0, 0, 1]);
        this.mBlock1.getXform().setSize(5, 5);
        this.mBlock1.getXform().setPosition(30, 50);

        this.mBlock2 = new Renderable(this.gEngine);
        this.mBlock2.setColor([0, 1, 0, 1]);
        this.mBlock2.getXform().setSize(5, 5);
        this.mBlock2.getXform().setPosition(70, 50);

        this.mSlectedCh = this.mIllumHero;
        this.mMaterialCh = this.mSlectedCh.getRenderable().getMaterial().getDiffuse();
        this.mSelectedChMsg = "H:";

        this._setupShadow();  // defined in MyGame_Shadow.js

    };



    draw() {
        //this.gEngine.AudioClips.playBackgroundAudio(this.kBgClip);
        // Step A: clear the canvas
        this.gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray


        // Step  B: Draw with all cameras
        this.drawCamera(this.mCamera);
        this.mMsg.draw(this.mCamera);   // only draw status in the main camera
        this.mMatMsg.draw(this.mCamera);

        this.drawCamera(this.mHeroCam);


    };

    drawCamera(camera) {
        // Step A: set up the View Projection matrix
        camera.setupViewProjection();
        // Step B: Now draws each primitive

        // always draw shadow first!
        this.mBg.draw(camera);
        this.mBgShadow1.draw(camera);

        this.mBlock1.draw(camera);
        this.mLgtMinion.draw(camera);
        this.mIllumMinion.draw(camera);
        this.mIllumHero.draw(camera);
        this.mBlock2.draw(camera);
        this.mLgtHero.draw(camera);

    };

    update() {
        const gEngine = this.gEngine;
        this.mCamera.update();  // to ensure proper interpolated movement effects
        this.mHeroCam.update();

        this.mBgL1.update();

        this.mIllumMinion.update(); // ensure sprite animation
        this.mLgtMinion.update();

        this.mIllumHero.update();  // allow keyboard control to move
        this.mLgtHero.update();

        var xf = this.mIllumHero.getXform();
        this.mCamera.panWith(xf, 0.7);
        this.mGlobalLightSet.getLightAt(2).set2DPosition(xf.getPosition());
        this.mHeroCam.setWCCenter(xf.getXPos(), xf.getYPos());

        this.mCamera.panWith(this.mLgtHero.getXform(), 0.7);
        this.mGlobalLightSet.getLightAt(3).set2DPosition(this.mLgtHero.getXform().getPosition());

        // control the selected light
        var msg = "L=" + this.mLgtIndex + " ";
        msg += this._lightControl();
        this.mMsg.setText(msg);

        msg = this._selectCharacter();
        msg += this.materialControl();
        this.mMatMsg.setText(msg);

    };


    _selectCharacter() {
        const gEngine = this.gEngine;
        // select which character to work with
        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Five)) {
            this.mSlectedCh = this.mIllumMinion;
            this.mMaterialCh = this.mSlectedCh.getRenderable().getMaterial().getDiffuse();
            this.mSelectedChMsg = "L:";
        }
        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Six)) {
            this.mSlectedCh = this.mIllumHero;
            this.mMaterialCh = this.mSlectedCh.getRenderable().getMaterial().getDiffuse();
            this.mSelectedChMsg = "H:";
        }
        return this.mSelectedChMsg;
    };

}
const gEngine = new Engine();
const width = window.innerWidth * window.devicePixelRatio;
const height = window.innerHeight * window.devicePixelRatio;
gEngine.Core.initializeEngineCore("GLCanvas", new MyGame(gEngine), width, height);

export { MyGame }
