import { Engine } from "../Engine/Engine";
import { SceneFileParser } from "./Util/SceneFileParser";
import "../style.css"

const gEngine = new Engine();

class MyGame {
    constructor(htmlCanvasID) {
        // scene file name
        this.kSceneFile = "assets/scene.xml";
        // all squares
        this.mSqSet = [];        // these are the Renderable objects
        this.width = window.innerWidth * window.devicePixelRatio;
        this.height = window.innerHeight * window.devicePixelRatio;
        gEngine.Core.initializeEngineCore(htmlCanvasID, this,this.width,this.height);
        // The camera to view the scene
        this.mCamera = null;
        this.initialize();
    };

    loadScene() {
        gEngine.TextFileLoader.loadTextFile(
            this.kSceneFile,
            gEngine.TextFileLoader.eTextFileType.eXMLFile
        );
    };
    initialize() {
        let sceneParser = new SceneFileParser(gEngine, this.kSceneFile);

        // Step A: Parse the camera
        this.mCamera = sceneParser.parseCamera();

        // Step B: Parse for all the squares
        sceneParser.parseSquares(this.mSqSet);
        
        //gEngine.GameLoop.start(this); //因为
    };

    draw() {
        // Step A: clear the canvas
        gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        // Step  B: Activate the drawing Camera
        this.mCamera.setupViewProjection();

        // Step  C: draw all the squares
        let i;
        if(this.mSqSet.length === 0) return;
        for (i = 0; i < this.mSqSet.length; i++) {
            this.mSqSet[i].draw(this.mCamera.getVPMatrix());
        }

    };

    update() {
        let xform = this.mSqSet[0].getXform();
        let deltaX = 0.05;
    
        // Step A: test for white square movement
        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)) {
            if (xform.getXPos() > 30) { // this is the right-bound of the window
                xform.setPosition(10, 60);
            }
            xform.incXPosBy(deltaX);
        }
    
        // Step  B: test for white square rotation
        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Up)) {
            xform.incRotationByDegree(1);
        }
    
        xform = this.mSqSet[1].getXform();
        // Step  C: test for pulsing the red square
        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Down)) {
            if (xform.getWidth() > 5) {
                xform.setSize(2, 2);
            }
            xform.incSizeBy(0.05);
        }
    };

}
new MyGame('GLCanvas');
