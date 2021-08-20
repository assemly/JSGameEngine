import { Engine } from "../Engine/Engine";
import { Scene } from "../Engine/Scene";
import { Camera } from "../Engine/Cameras/Camera";
import { vec2 } from "../Engine/Lib/gl-matrix";

import { Hero } from "./Objects/Hero";
import { Minion } from "./Objects/Minion";
import { GameObject } from "../Engine/GameObjects/GameObject"

import { Renderable } from "../Engine/Renderables/Renderable";
import { IllumRenderable } from "../Engine/Renderables/IllumRenderable";
import { FontRenderable } from "../Engine/Renderables/FontRenderable";

import { MyGameLights } from "./MyGame_Lights";
import { MyGameLightControl } from "./MyGame_LightControl";
import { MyGameMaterialControl } from "./MyGame_MaterialControl";
import { MyGameShadow } from "./MyGame_Shadow";

import "../style.css"


class MyGame extends Scene {
    constructor(gEngine) {
        super();

        this.gEngine = gEngine;
        this.kMinionSprite = "assets/textures/minion_sprite.png";
        this.kMinionSpriteNormal = "assets/textures/minion_sprite_normal.png";
        this.kBg = "assets/bg.png";
        this.kBgNormal = "assets/bg_normal.png";

        this.kCollideColor = [1, 0, 1, 1];

        // The camera to view the scene
        this.mCamera = null;
        this.mBg = null;

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
        this.mBgShadow = null;
        this.mMinionShadow = null;
        this.mLgtMinionShaodw = null;

        Object.assign(this, { ...MyGameLights, ...MyGameLightControl, ...MyGameMaterialControl, ...MyGameShadow });

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

        bgR.getMaterial().setSpecular([1, 0, 0, 1]);
        var i;
        for (i = 0; i < 4; i++) {
            bgR.addLight(this.mGlobalLightSet.getLightAt(i));   // all the lights
        }
        this.mBg = new GameObject(bgR);
        this.mBg.setRenderable(bgR);

        // 
        // the objects
        this.mIllumHero = new Hero(this.gEngine, this.kMinionSprite, this.kMinionSpriteNormal, 15, 50);
        this.mLgtHero = new Hero(this.gEngine, this.kMinionSprite, null, 80, 50);
        this.mIllumMinion = new Minion(this.gEngine, this.kMinionSprite, this.kMinionSpriteNormal, 17, 15);
        this.mLgtMinion = new Minion(this.gEngine, this.kMinionSprite, null, 87, 15);
        for (i = 0; i < 4; i++) {
            this.mIllumHero.getRenderable().addLight(this.mGlobalLightSet.getLightAt(i));
            this.mLgtHero.getRenderable().addLight(this.mGlobalLightSet.getLightAt(i));
            this.mIllumMinion.getRenderable().addLight(this.mGlobalLightSet.getLightAt(i));
            this.mLgtMinion.getRenderable().addLight(this.mGlobalLightSet.getLightAt(i));
        }

        this.mMsg = new FontRenderable(this.gEngine, "Status Message");
        this.mMsg.setColor([1, 1, 1, 1]);
        this.mMsg.getXform().setPosition(1, 2);
        this.mMsg.setTextHeight(3);

        this.mMatMsg = new FontRenderable(this.gEngine, "Status Message");
        this.mMatMsg.setColor([1, 1, 1, 1]);
        this.mMatMsg.getXform().setPosition(1, 73);
        this.mMatMsg.setTextHeight(3);

        this.mBlock1 = new Renderable(this.gEngine,);
        this.mBlock1.setColor([1, 0, 0, 1]);
        this.mBlock1.getXform().setSize(5, 5);
        this.mBlock1.getXform().setPosition(30, 50);

        this.mBlock2 = new Renderable(this.gEngine,);
        this.mBlock2.setColor([0, 1, 0, 1]);
        this.mBlock2.getXform().setSize(5, 5);
        this.mBlock2.getXform().setPosition(70, 50);

        this.mSlectedCh = this.mIllumHero;
        this.mMaterialCh = this.mSlectedCh.getRenderable().getMaterial().getDiffuse();
        this.mSelectedChMsg = "H:";

        this._setupShadow(); // defined in MyGame_Shadow.js
    };

    drawCamera(camera) {
        camera.setupViewProjection();
        // Step B: Now draws each primitive
        // Step B: Now draws each primitive

        // always draw shadow receivers first!
        this.mBgShadow.draw(camera);        // also draws the receiver object
        this.mMinionShadow.draw(camera);
        this.mLgtMinionShaodw.draw(camera);

        this.mBlock1.draw(camera);
        this.mIllumHero.draw(camera);
        this.mBlock2.draw(camera);
        this.mLgtHero.draw(camera);
    };

    draw() {
        //this.gEngine.AudioClips.playBackgroundAudio(this.kBgClip);
        // Step A: clear the canvas
        this.gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray


        // Step  B: Draw with all three cameras
        this.drawCamera(this.mCamera);
        this.mMsg.draw(this.mCamera);   // only draw status in the main camera
        this.mMatMsg.draw(this.mCamera);


    };

    update() {
        this.mCamera.update();  // to ensure proper interpolated movement effects

        this.mIllumMinion.update(); // ensure sprite animation
        this.mLgtMinion.update();

        this.mIllumHero.update();  // allow keyboard control to move

        if(this.mIllumHero.getPhysicsComponent().collided(this.mLgtMinion.getPhysicsComponent())){
            this.mLgtMinion.getPhysicsComponent().setColor(this.kCollideColor);
        }else{
            this.mLgtMinion.getPhysicsComponent().setColor([0,1,0,1]);
        }
        
        // control the selected light
        var msg = "L=" + this.mLgtIndex + " ";
        msg += this._lightControl();
        this.mMsg.setText(msg);

        msg = this._selectCharacter();
        msg += this.materialControl();
        this.mMatMsg.setText(msg);
    };

    _selectCharacter() {
        // select which character to work with
        const gEngine = this.gEngine;
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
