import { Scene } from "../Engine/Scene";
import { MyGame } from "./main";
import { SceneFileParser } from "./Util/SceneFileParser";

class BlueLevel extends Scene {
    constructor(gEngine) {
        super();
        // audio clips: supports both mp3 and wav formats
        this.kBgClip = "assets/sounds/bensound-creativeminds.mp3";
        this.kCue = "assets/sounds/shoot.wav";
        // scene file name
        this.kSceneFile = "assets/scene/BlueLevel.xml";
        // all squares
        this.mSqSet = [];        // these are the Renderable objects
        // this.width = window.innerWidth * window.devicePixelRatio;
        // this.height = window.innerHeight * window.devicePixelRatio;
        // gEngine.Core.initializeEngineCore(htmlCanvasID, this, this.width, this.height);
        // The camera to view the scene
        this.gEngine = gEngine;
        this.mCamera = null;
        
        

        // textures: (Note: jpg does not support transparency)
        this.kPortal = "assets/textures/minion_portal.png";
        this.kCollector = "assets/textures/minion_collector.jpg";
        
    };

    unloadScene() {
        // Step A: Game loop not running, unload all assets
        //          nothing for this level

        // unload the scene flie and loaded resources
        this.gEngine.TextFileLoader.unloadTextFile(this.kSceneFile);
        this.gEngine.Textures.unloadTexture(this.kPortal);
        this.gEngine.Textures.unloadTexture(this.kCollector);

        this.gEngine.AudioClips.unloadAudio(this.kBgClip);
        this.gEngine.AudioClips.unloadAudio(this.kCue);

        // Step B: starts the next level
        let nextLevel = new MyGame(this.gEngine);  // next level to be loaded
        this.gEngine.Core.startScene(nextLevel);

    };

    clearRenderObjec() {
        while (this.mSqSet.length > 0) {
            delete this.mSqSet.pop();
        }
    }

    loadScene() {


        // load the scene file
        this.gEngine.TextFileLoader.loadTextFile(this.kSceneFile, this.gEngine.TextFileLoader.eTextFileType.eXMLFile);

        // load the textures
        this.gEngine.Textures.loadTexture(this.kPortal);
        this.gEngine.Textures.loadTexture(this.kCollector);
        this.gEngine.AudioClips.loadAudio(this.kBgClip);
        this.gEngine.AudioClips.loadAudio(this.kCue);
    };
    initialize() {

        var sceneParser = new SceneFileParser(this.gEngine, this.kSceneFile);

        // Step A: Read in the camera
        this.mCamera = sceneParser.parseCamera();

        // Step B: Read all the squares and textureSquares
        sceneParser.parseSquares(this.mSqSet);
        sceneParser.parseTextureSquares(this.mSqSet);

        this.gEngine.AudioClips.playBackgroundAudio(this.kBgClip);

    };

    draw() {

        // Step A: clear the canvas
        this.gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

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

        // continously change texture tinting
        var c = this.mSqSet[1].getColor();
        var ca = c[3] + deltaX;
        if (ca > 1) {
            ca = 0;
        }
        c[3] = ca;
    };
}

export { BlueLevel };