import { Engine } from "../Engine/Engine";
import { SceneFileParser } from "./Util/SceneFileParser";
import { Scene } from "../Engine/Scene";
import { BlueLevel } from "./BlueLevel";
import "../style.css"



class MyGame extends Scene {
    constructor(gEngine) {
        super();
        // audio clips: supports both mp3 and wav formats
        this.kBgClip = "assets/sounds/bensound-creativeminds.mp3";
        this.kCue = "assets/sounds/hit.wav";
        // scene file name
        this.kSceneFile = "assets/scene/scene.xml";
        this.gEngine = gEngine;
        // all squares
        this.mSqSet = [];        // these are the Renderable objects
        
        // The camera to view the scene
        this.mCamera = null;
        this.sceneParser = null;
        
        
    };
    clearRenderObjec() {
        while (this.mSqSet.length > 0) {
            delete this.mSqSet.pop();
        }
    }
    unloadScene() {
        // Step A: Game loop not running, unload all assets
        //          nothing for this level

        // Step B: starts the next level

        
        // unload the scene flie and loaded resources
        this.gEngine.TextFileLoader.unloadTextFile(this.kSceneFile);
        this.gEngine.AudioClips.unloadAudio(this.kBgClip);
        this.gEngine.AudioClips.unloadAudio(this.kCue);

        let nextLevel = new BlueLevel(this.gEngine);  // next level to be loaded
        console.log("main::unloadScene:" + nextLevel);
        this.gEngine.Core.startScene(nextLevel);
        

    };

    loadScene() {
        if (!this.gEngine) return;
        this.gEngine.TextFileLoader.loadTextFile(
            this.kSceneFile,
            this.gEngine.TextFileLoader.eTextFileType.eXMLFile
        );

        this.gEngine.AudioClips.loadAudio(this.kBgClip);
        this.gEngine.AudioClips.loadAudio(this.kCue);
    };
    initialize() {
        if (!this.gEngine) return
        this.sceneParser = new SceneFileParser(this.gEngine, this.kSceneFile);

        // Step A: Parse the camera
        this.mCamera = this.sceneParser.parseCamera();
        console.log("main::initialize: " + this.mCamera);

        // Step B: Parse for all the squares
        this.sceneParser.parseSquares(this.mSqSet);

        this.gEngine.AudioClips.playBackgroundAudio(this.kBgClip);
        //this.gEngine.GameLoop.start(this); //因为
    };

    draw() {
        // Step A: clear the canvas
        this.gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
        if (!this.mCamera) return;
        // Step  B: Activate the drawing Camera
        this.mCamera.setupViewProjection();

        // Step  C: draw all the squares
        let i;
        if (this.mSqSet.length === 0) return;
        for (i = 0; i < this.mSqSet.length; i++) {
            this.mSqSet[i].draw(this.mCamera.getVPMatrix());
        }

    };

    update() {
        if (!this.mSqSet[0]) return;
        let xform = this.mSqSet[0].getXform();
        let deltaX = 0.05;

        // Step A: test for white square movement
        if (this.gEngine.Input.isKeyPressed(this.gEngine.Input.keys.Right)) {
            if (xform.getXPos() > 30) { // this is the right-bound of the window
                xform.setPosition(10, 60);
            }
            xform.incXPosBy(deltaX);
        }

        // Step  B: test for white square rotation
        if (this.gEngine.Input.isKeyClicked(this.gEngine.Input.keys.Up)) {
            xform.incRotationByDegree(1);
        }

        xform = this.mSqSet[1].getXform();
        // Step  C: test for pulsing the red square
        if (this.gEngine.Input.isKeyPressed(this.gEngine.Input.keys.Down)) {
            if (xform.getWidth() > 5) {
                xform.setSize(2, 2);
            }
            xform.incSizeBy(0.05);
        }

        if (this.gEngine.Input.isKeyPressed(this.gEngine.Input.keys.Left)) {
            this.gEngine.AudioClips.playACue(this.kCue);
            xform.incXPosBy(-deltaX);
            if (xform.getXPos() < 11) {  // this is the left-bound of the window
                this.gEngine.GameLoop.stop();
            }
        }
    };

}
const gEngine =new Engine();
const width = window.innerWidth * window.devicePixelRatio;
const height = window.innerHeight * window.devicePixelRatio;
gEngine.Core.initializeEngineCore("GLCanvas", new MyGame(gEngine), width, height);

export { MyGame }
