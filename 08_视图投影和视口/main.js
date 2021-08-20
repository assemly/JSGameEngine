import { Engine } from "./Engine/Engine";
import { SimpleShader } from "./Engine/SimpleShader";
import { Renderable } from "./Engine/Renderable";
import VertexShader from "./GLSLShaders/SimpleVS.glsl";
import FragmentShader from "./GLSLShaders/WhiteFS.glsl";
import { mat4 } from "./Engine/Lib/gl-matrix"

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
    
    gl.viewport(
        20,     // x position of bottom-left corner of the area to be drawn
        40,     // y position of bottom-left corner of the area to be drawn
        600,    // width of the area to be drawn
        300);     // height of the area to be drawn

    // Step E2: set up the corresponding scissor area to limit clear area
    gl.scissor(
        20,     // x position of bottom-left corner of the area to be drawn
        40,     // y position of bottom-left corner of the area to be drawn
        600,    // width of the area to be drawn
        300);    // height of the area to be drawn

    // Step E3: enable the scissor area, clear, and then disable the scissor area
    gl.enable(gl.SCISSOR_TEST);
    gEngine.Core.clearCanvas([0.8, 0.8, 0.8, 1.0]);  // clear the scissor area
    gl.disable(gl.SCISSOR_TEST);
    //</editor-fold>

    //<editor-fold desc="Step F: Set up View and Projection matrices">
    var viewMatrix = mat4.create();
    var projMatrix = mat4.create();
    // Step F1: define the view matrix
    mat4.lookAt(viewMatrix,
        [20, 60, 10],   // camera position
        [20, 60, 0],    // look at position
        [0, 1, 0]);     // orientation 
    // Step F2: define the projection matrix
    mat4.ortho(projMatrix,
        -10,     // distance to left of WC
        10,     // distance to right of WC
        -5,      // distance to bottom of WC
        5,      // distance to top of WC
        0,      // distance to near plane 
        1000);  // distance to far plane 
    
    // Step F3: concatenate to form the View-Projection operator
    var vpMatrix = mat4.create();
    mat4.multiply(vpMatrix, projMatrix, viewMatrix);

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
    mTLSq.getXform().setPosition(10, 65);
    mTLSq.draw(vpMatrix);

    // top right
    mTRSq.getXform().setPosition(30, 65);
    mTRSq.draw(vpMatrix);

    // bottom right
    mBRSq.getXform().setPosition(30, 55);
    mBRSq.draw(vpMatrix);

    // bottom left
    mBLSq.getXform().setPosition(10, 55);
    mBLSq.draw(vpMatrix);
}

MyGame('GLCanvas');