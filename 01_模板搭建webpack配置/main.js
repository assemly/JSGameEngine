"use strict";

var gGL = null;

const initializeGL = () => {
    var canvas = document.getElementById("GLCanvas");
    gGL = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    if (gGL !== null) {
        gGL.clearColor(0.0, 0.8, 0.0, 1.0);
    } else {
        document.write("<br><b>WebGL不支持</b>");
    }
}

const clearCanvas = () => {
    gGL.clear(gGL.COLOR_BUFFER_BIT);
}

const doGLDraw = () => {
    initializeGL();
    clearCanvas();
}

doGLDraw();