import { Engine } from "./Engine/Engine";
import { SimpleShader } from "./Engine/SimpleShader";
import { Renderable } from "./Engine/Renderable";
import VertexShader from "./GLSLShaders/SimpleVS.glsl";
import FragmentShader from "./GLSLShaders/WhiteFS.glsl";
import { mat4,vec3 } from "./Engine/Lib/gl-matrix";

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

    
    let xform = mat4.create();

    // Step E: compute the white square transform
    mat4.translate(xform,xform,vec3.fromValues(-0.25,0.25,0.0));
    mat4.rotateZ(xform,xform,0.2);
    mat4.scale(xform,xform,vec3.fromValues(1.2,1.2,1.0));

    mWhiteSq.draw(xform);

    mat4.identity(xform);
    mat4.translate(xform, xform, vec3.fromValues(0.25, -0.25, 0.0));
    mat4.rotateZ(xform, xform, -0.785); // rotation is in radian (about -45-degree)
    mat4.scale(xform, xform, vec3.fromValues(0.4, 0.4, 1.0));

    mRedSq.draw(xform);
   
}

MyGame('GLCanvas');