import { Engine } from "../Engine/Engine";
import { Scene } from "../Engine/Scene";
import { Camera } from "../Engine/Cameras/Camera";
import { FontRenderable } from "../Engine/Renderables/FontRenderable";
import { vec2 } from "../Engine/Lib/gl-matrix";
import { LineRenderable } from "../Engine/Renderables/LineRenderable";



import "../style.css"



class MyGame extends Scene {
    constructor(gEngine) {
        super();

        this.gEngine = gEngine;
        // The camera to view the scene
        this.mCamera = null;

        this.mMsg = null;

        this.mLineSet = [];
        this.mCurrentLine = null;
        this.mP1 = null;

    };

    loadScene() {

    };

    unloadScene() {

    };

    initialize() {
        // console.log("*************")
        // console.log( this.gEngine.ResourceMap.isAssetLoaded(this.kBgClip));

        //this.gEngine.AudioClips.playBackgroundAudio(this.kBgClip);

        // Step A: set up the cameras
        this.mCamera = new Camera(
            this.gEngine,
            vec2.fromValues(50, 37.5),   // position of the camera
            150,                        // width of camera
            [0, 0, window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio]         // viewport (orgX, orgY, width, height)
        );

        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);

        this.mMsg = new FontRenderable(this.gEngine, "Status Message");
        this.mMsg.setColor([0, 0, 0, 1]);
        this.mMsg.getXform().setPosition(10, 10);
        this.mMsg.setTextHeight(3);

    };



    draw() {
        //this.gEngine.AudioClips.playBackgroundAudio(this.kBgClip);
        // Step A: clear the canvas
        this.gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        this.mCamera.setupViewProjection();
        let i, l;
        for (i = 0; i < this.mLineSet.length; i++) {
            l = this.mLineSet[i];
            l.draw(this.mCamera);
        }
        this.mMsg.draw(this.mCamera);   // only draw status in the main camera

    };

    update() {
        let msg = "Lines: " + this.mLineSet.length + " ";
        let echo = "";
        let x, y;
        let gEngine = this.gEngine;
        if (gEngine.Input.isButtonPressed(gEngine.Input.mouseButton.Middle)) {
            var len = this.mLineSet.length;
            if (len > 0) {
                this.mCurrentLine = this.mLineSet[len - 1];
                x = this.mCamera.mouseWCX();
                y = this.mCamera.mouseWCY();
                echo += "Selected " + len + " ";
                echo += "[" + x.toPrecision(2) + " " + y.toPrecision(2) + "]";
                this.mCurrentLine.setFirstVertex(x, y);
            }
        }

        if (gEngine.Input.isButtonPressed(gEngine.Input.mouseButton.Left)) {
            x = this.mCamera.mouseWCX();
            y = this.mCamera.mouseWCY();
            echo += "[" + x.toPrecision(2) + " " + y.toPrecision(2) + "]";

            if (this.mCurrentLine === null) { // start a new one
                this.mCurrentLine = new LineRenderable(gEngine);
                this.mCurrentLine.setFirstVertex(x, y);
                this.mLineSet.push(this.mCurrentLine);
            } else {
                this.mCurrentLine.setSecondVertex(x, y);
            }
        } else {
            this.mCurrentLine = null;
            this.mP1 = null;
        }

        msg += echo;
        this.mMsg.setText(msg);
    };
}
const gEngine = new Engine();
const width = window.innerWidth * window.devicePixelRatio;
const height = window.innerHeight * window.devicePixelRatio;
gEngine.Core.initializeEngineCore("GLCanvas", new MyGame(gEngine), width, height);

export { MyGame }
