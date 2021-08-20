/* 
 * File: ShaderSupport.js
 * Support the loading, compiling, and linking of shader code
 * 
 * Notice:  although in a different file, we have access to 
 *          global variables defined in WebGL.js: Gloabl.gGL
 *          
 *          In the same way, the global variable Gloabl.gSimpleShader defined in this
 *          file will be accessible to any other javascript source code in 
 *          our project.
 * 
 */
/*jslint node: true, vars: true, evil: true */
/*global Gloabl.gGL: false, alert: false, loadAndCompileShader: false,
    Gloabl.gSquareVertexBuffer: false, document: false */
 /* find out more about jslint: http://www.jslint.com/help.html */

 "use strict";  // Operate in Strict mode such that variables must be declared before used!
 import { Gloabl } from "./constant";

     // Reference to the shader program stored in Gloabl.gGL context.
 

     // Gloabl.gGL reference to the attribute to be used by the VertexShader
 
 // Loads/compiles/links shader programs to Gloabl.gGL context
 export function initSimpleShader(vertexShaderID, fragmentShaderID) {
     // Step A: load and compile vertex and fragment shaders
     var vertexShader = loadAndCompileShader(vertexShaderID, Gloabl.gGL.VERTEX_SHADER);
     var fragmentShader = loadAndCompileShader(fragmentShaderID, Gloabl.gGL.FRAGMENT_SHADER);
 
     // Step B: Create and link the shaders into a program.
     Gloabl.gSimpleShader = Gloabl.gGL.createProgram();
     Gloabl.gGL.attachShader(Gloabl.gSimpleShader, vertexShader);
     Gloabl.gGL.attachShader(Gloabl.gSimpleShader, fragmentShader);
     Gloabl.gGL.linkProgram(Gloabl.gSimpleShader);
 
     // Step C: check for error
     if (!Gloabl.gGL.getProgramParameter(Gloabl.gSimpleShader, Gloabl.gGL.LINK_STATUS)) {
         alert("Error linking shader");
     }
 
     // Step D: Gets a reference to the SquareVertexPosition variable within the shaders.
     Gloabl.gShaderVertexPositionAttributer = Gloabl.gGL.getAttribLocation(Gloabl.gSimpleShader, "aSquareVertexPosition");
         // SquareVertexPosition: is defined in the VertexShader (in the index.html file)
 
     // Step E: Activates the vertex buffer loaded in VertexBuffer.js
     Gloabl.gGL.bindBuffer(Gloabl.gGL.ARRAY_BUFFER, Gloabl.gSquareVertexBuffer);
         // Gloabl.gSquareVertexBuffer: is defined in VertexBuffer.js and 
         //      initialized by the InitSquareBuffer() function.
 
     // Step F: Describe the characteristic of the vertex position attribute
     Gloabl.gGL.vertexAttribPointer(Gloabl.gShaderVertexPositionAttributer, // variable initialized above
         3,          // each vertex element is a 3-float (x,y,z)
         Gloabl.gGL.FLOAT,  // data type is FLOAT
         false,      // if the content is normalized vectors
         0,          // number of bytes to skip in between elements
         0);         // offsets to the first element
 }
 
 // Returns a compiled shader from a shader in the dom.
 // The id is the id of the script in the html tag.
 function loadAndCompileShader(id, shaderType) {
     var shaderText, shaderSource, compiledShader;
 
     // Step A: Get the shader source from index.html
     shaderText = document.getElementById(id);
     shaderSource = shaderText.firstChild.textContent;
 
     // Step B: Create the shader based on the shader type: vertex or fragment
     compiledShader = Gloabl.gGL.createShader(shaderType);
 
     // Step C: Compile the created shader
     Gloabl.gGL.shaderSource(compiledShader, shaderSource);
     Gloabl.gGL.compileShader(compiledShader);
 
     // Step D: check for errors and return results (null if error)
     if (!Gloabl.gGL.getShaderParameter(compiledShader, Gloabl.gGL.COMPILE_STATUS)) {
         alert("A shader compiling error occurred: " + Gloabl.gGL.getShaderInfoLog(compiledShader));
     }
 
     return compiledShader;
 }