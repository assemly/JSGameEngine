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

    const mWhiteSq = new Renderable(gEngine,mShader);
    mWhiteSq.setColor([1,0,1,0.5]);
    const mRedSq = new Renderable(gEngine,mShader);
    mRedSq.setColor([1,0,0,0]);
    // Step C: Draw!
    // Step C1: Clear the canvas
    gEngine.Core.clearCanvas([0, 0.8, 0, 1]);

    mWhiteSq.draw();
    mRedSq.draw();
   
}

MyGame('GLCanvas');