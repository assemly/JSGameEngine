"use strict";
import {initSquareBuffer} from "./VertexBuffer";
import  {initSimpleShader} from "./ShaderSupport";
import {Gloabl} from "./constant";

    // The GL context upon which we will access web-GL functionality
    // Convention: global variable names: gName

// Initialize the webGL by binding the functionality to the Gloabl.gGL variable
function initializeGL() {
    // the "GLCanvas" defined in the index.html file
    var canvas = document.getElementById("GLCanvas");

    // Get standard webgl, or experimental
    // binds webgl to the Canvas area on the web-page to the global variable "Gloabl.gGL"
    Gloabl.gGL = canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");

    if (Gloabl.gGL !== null) {
        Gloabl.gGL.clearColor(0.0, 0.8, 0.0, 1.0);  // set the color to be cleared

        // 1. initialize the buffer with the vertex positions for the unit square
        initSquareBuffer(); // This function is defined in the VertexBuffer.js file

        // 2. now load and compile the vertex and fragment shaders
        initSimpleShader("VertexShader", "FragmentShader");
                // the two shaders are defined in the index.html file
                // InitSimpleShader() function is defined in ShaderSupport.js file

    } else {
        document.write("<br><b>WebGL is not supported!</b>");
    }
}


// Clears the draw area and draws one square
function drawSquare() {
    Gloabl.gGL.clear(Gloabl.gGL.COLOR_BUFFER_BIT);      // clear to the color previously set

    // Step A: Enable the shader to use
    Gloabl.gGL.useProgram(Gloabl.gSimpleShader);

    // Step B. Enables the vertex position attribute
    Gloabl.gGL.enableVertexAttribArray(Gloabl.gShaderVertexPositionAttributer);

    // Step C. draw with the above settings
    Gloabl.gGL.drawArrays(Gloabl.gGL.TRIANGLE_STRIP, 0, 4);
}

// this is the function that will cause the WebGL drawing
function doGLDraw() {
    initializeGL();     // Binds Gloabl.gGL context to WebGL functionality
    drawSquare();       // Clears the GL area and draws one square
}

doGLDraw();