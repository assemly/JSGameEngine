import { Engine } from "./Engine/Engine";
import { SimpleShader } from "./Engine/SimpleShader";
import { Renderable } from "./Engine/Renderable";
import VertexShader from "./GLSLShaders/SimpleVS.glsl";
import FragmentShader from "./GLSLShaders/WhiteFS.glsl";


import "./style.css"


function MyGame(htmlCanvasID) {
    // The shader for drawing
    let mShader = null;
    const gEngine = new Engine();
    // Step A: Initialize the webGL Context and the VertexBuffer
    let width = window.innerWidth * window.devicePixelRatio;
    let height = window.innerHeight * window.devicePixelRatio;
    gEngine.Core.initializeWebGL(htmlCanvasID,width,height);

    // Step B: Create, load and compile the shaders
    mShader = new SimpleShader(gEngine, VertexShader, FragmentShader);

    // Step C: Create Renderable objects
    const mWhiteSq = new Renderable(gEngine,mShader);
    mWhiteSq.setColor([1,0,1,0.5]);
    const mRedSq = new Renderable(gEngine,mShader);
    mRedSq.setColor([1,0,0,1]);
    // Step D: Draw!
    // Step C1: Clear the canvas
    gEngine.Core.clearCanvas([0, 0.8, 0, 1]);

    mWhiteSq.getXform().setPoistion(-0.25,0.25);
    mWhiteSq.getXform().setRotationInRad(0.2);
    mWhiteSq.getXform().setSize(1.2,1.2);
    mWhiteSq.draw();

    mRedSq.getXform().setXPos(0.25);  // to show alternative to setPosition
    mRedSq.getXform().setYPos(-0.25); // it is possible to setX/Y separately
    mRedSq.getXform().setRotationInDegree(45);  // this is in Degree
    mRedSq.getXform().setWidth(0.4);  // to show alternative to setSize
    mRedSq.getXform().setHeight(0.4);  // that it is possible to width/height separately
    // Step H: draw the red square (transform in the object)
    mRedSq.draw();

    //mRedSq.draw(xform);
   
}

MyGame('GLCanvas');