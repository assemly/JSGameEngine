import { Engine } from "./Engine/Engine";
import { SimpleShader } from "./Engine/SimpleShader";
import { Renderable } from "./Engine/Renderable";
import VertexShader from "./GLSLShaders/SimpleVS.glsl";
import FragmentShader from "./GLSLShaders/WhiteFS.glsl";
import {Camera} from "./Engine/Camera";
import { vec2 } from "./Engine/Lib/gl-matrix";

import "./style.css"


const MyGame = (htmlCanvasID) => {

    const gEngine = new Engine();
    // variables of the shader for drawing: one shader to be shared by two renderables
    let mConstColorShader = null;

    // variables for the squares
    let mBlueSq = null;        // these are the Renderable objects
    let mRedSq = null;
    let mTLSq = null;
    let mTRSq = null;
    let mBRSq = null;
    let mBLSq = null;
    // Step A: Initialize the webGL Context
    let width = window.innerWidth * window.devicePixelRatio;
    let height = window.innerHeight * window.devicePixelRatio;
    gEngine.Core.initializeWebGL(htmlCanvasID,width,height);
    let gl = gEngine.Core.getGL();
    const aspect = height / width
    mConstColorShader = new SimpleShader(gEngine,VertexShader, FragmentShader);

    // Step C: Create the Renderable objects:
    mBlueSq = new Renderable(gEngine, mConstColorShader);
    mBlueSq.setColor([0.25, 0.25, 0.95, 1]);
    mRedSq = new Renderable(gEngine, mConstColorShader);
    mRedSq.setColor([1, 0.25, 0.25, 1]);
    mTLSq = new Renderable(gEngine,mConstColorShader);
    mTLSq.setColor([0.9, 0.1, 0.1, 1]);
    mTRSq = new Renderable(gEngine, mConstColorShader);
    mTRSq.setColor([0.1, 0.9, 0.1, 1]);
    mBRSq = new Renderable(gEngine, mConstColorShader);
    mBRSq.setColor([0.1, 0.1, 0.9, 1]);
    mBLSq = new Renderable(gEngine, mConstColorShader);
    mBLSq.setColor([0.1, 0.1, 0.1, 1]);

    // Step D: Clear the entire canvas first
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1]);   // Clear the canvas
    
   // Step F: Starts the drawing by activating the camera
   const mCamer = new Camera(
       gEngine,
       vec2.fromValues(20,60),  // center of the WC
       20,                      // width of WC
       [(width-width*0.8)/2, (height-height*0.8)/2, width*0.8, height*0.8]       // viewport (orgX, orgY, width, height)
   );

   mCamer.setupViewProjection();
   var vpMatrix = mCamer.getVPMatrix();

    mBlueSq.getXform().setPosition(20, 60);
    mBlueSq.getXform().setRotationInRad(0.2); // In Radians
    mBlueSq.getXform().setSize(5, 5);
    mBlueSq.draw(vpMatrix);

    // Step H: Draw the center and the corner squares
    // centre red square
    mRedSq.getXform().setPosition(20, 60);
    mRedSq.getXform().setSize(2, 2);
    mRedSq.draw(vpMatrix);

    // top left
    mTLSq.getXform().setPosition(10, 60+10*aspect);
    mTLSq.draw(vpMatrix);

    // top right
    mTRSq.getXform().setPosition(30, 60+10*aspect);
    mTRSq.draw(vpMatrix);

    // bottom right
    mBRSq.getXform().setPosition(30, 60-10*aspect);
    mBRSq.draw(vpMatrix);

    // bottom left
    mBLSq.getXform().setPosition(10, 60-10*aspect);
    mBLSq.draw(vpMatrix);
}

MyGame('GLCanvas');