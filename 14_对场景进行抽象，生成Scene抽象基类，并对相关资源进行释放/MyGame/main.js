import { Engine } from "../Engine/Engine";
import { SceneFileParser } from "./Util/SceneFileParser";
import { Scene } from "../Engine/Scene";
import { BlueLevel } from "./BlueLevel";
import "../style.css"



class MyGame extends Scene {
    constructor(gEngine,htmlCanvasID="GLCanvas") {
        super();
        // scene file name
        this.kSceneFile = "assets/scene.xml";
        this.gEngine = gEngine;
        // all squares
        this.mSqSet = [];        // these are the Renderable objects
        this.width = window.innerWidth * window.devicePixelRatio;
        this.height = window.innerHeight * window.devicePixelRatio;
        this.gEngine.Core.initializeEngineCore(htmlCanvasID, this, this.width, this.height);
        // The camera to view the scene
        this.mCamera = null;
        this.sceneParser = null;
        this.initialize();
    };
    releaseRenderObject() {
        while(this.mSqSet.length > 0){
            delete this.mSqSet.pop();
        }
    }
    unloadScene() {
        // Step A: Game loop not running, unload all assets
        //          nothing for this level

        // Step B: starts the next level
        
        this.releaseRenderObject();
        this.sceneParser.releaseSceneAsset(this.kSceneFile);
        let nextLevel = new BlueLevel(this.gEngine);  // next level to be loaded
        this.gEngine.Core.startScene(nextLevel);
        
    };

    loadScene() {
        this.gEngine.TextFileLoader.loadTextFile(
            this.kSceneFile,
            this.gEngine.TextFileLoader.eTextFileType.eXMLFile
        );
    };
    initialize() {
        
        this.sceneParser = new SceneFileParser(this.gEngine, this.kSceneFile);

        // Step A: Parse the camera
        this.mCamera = this.sceneParser.parseCamera();
        console.log("main::initialize: "+this.mCamera);

        // Step B: Parse for all the squares
        this.sceneParser.parseSquares(this.mSqSet);
        

        //this.gEngine.GameLoop.start(this); //因为
    };

    draw() {
        // Step A: clear the canvas
        this.gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
        if(!this.mCamera) return;
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
       if(!this.mSqSet[0]) return;
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
            xform.incXPosBy(-deltaX);
            if (xform.getXPos() < 11) {  // this is the left-bound of the window
                this.gEngine.GameLoop.stop();
            }
        }
    };

}
new MyGame(new Engine());
export { MyGame }
