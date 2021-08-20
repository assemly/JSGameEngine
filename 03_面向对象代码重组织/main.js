import {Engine} from "./Engine/Engine";
import {SimpleShader} from "./Engine/SimpleShader";

function MyGame(htmlCanvasID) {
    // The shader for drawing
    let mShader = null;
    const gEngine = new Engine();
    // Step A: Initialize the webGL Context and the VertexBuffer
    gEngine.Core.initializeWebGL(htmlCanvasID);

    // Step B: Create, load and compile the shaders
    mShader = new SimpleShader(gEngine,"VertexShader", "FragmentShader");

    // Step C: Draw!
    // Step C1: Clear the canvas
    gEngine.Core.clearCanvas([0, 0.8, 0, 1]);

    // Step C2: Activate the proper shader
    mShader.activateShader();

    // Step C3: Draw with the currently activated geometry and the activated shader
    var gl = gEngine.Core.getGL();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

MyGame('GLCanvas');