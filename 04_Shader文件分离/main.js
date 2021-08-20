import { Engine } from "./Engine/Engine";
import { SimpleShader } from "./Engine/SimpleShader";
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

    // Step C: Draw!
    // Step C1: Clear the canvas
    gEngine.Core.clearCanvas([0, 0.8, 0, 1]);

    // Step C2: Activate the proper shader
    mShader.activateShader([0,1,1,1]);

    // Step C3: Draw with the currently activated geometry and the activated shader
    var gl = gEngine.Core.getGL();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

MyGame('GLCanvas');