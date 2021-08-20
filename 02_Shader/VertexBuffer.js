/*
 * File: VertexBuffer.js
 *  
 * Support the loading of the buffer that contains vertex positions of a square 
 * onto the Gloabl.gGL context
 */

/*jslint node: true, vars: true */
/*global Gloabl.gGL: false, alert: false, loadAndCompileShader: false,
    document: false, Float32Array: false */
 /* find out more about jslint: http://www.jslint.com/help.html */

 "use strict";  // Operate in Strict mode such that variables must be declared before used!
import { Gloabl } from "./constant";

     // Gloabl.gGL reference to the vertex positions for the square
 
 export function initSquareBuffer() {
     // First: define the vertices for a square
     var verticesOfSquare = [
         0.5, 0.5, 0.0,
         -0.5, 0.5, 0.0,
         0.5, -0.5, 0.0,
         -0.5, -0.5, 0.0
     ];
 
     // Step A: Create a buffer on the Gloabl.gGL context for our vertex positions
     Gloabl.gSquareVertexBuffer = Gloabl.gGL.createBuffer();
 
     // Step B: Activate vertexBuffer
     Gloabl.gGL.bindBuffer(Gloabl.gGL.ARRAY_BUFFER, Gloabl.gSquareVertexBuffer);
 
     // Step C: Loads verticesOfSquare into the vertexBuffer
     Gloabl.gGL.bufferData(Gloabl.gGL.ARRAY_BUFFER, new Float32Array(verticesOfSquare), Gloabl.gGL.STATIC_DRAW);
 }