import { vec2, vec3, vec4, mat4 } from "./Lib/gl-matrix";

class Transform {
    constructor() {
        this.mPosition = vec2.fromValues(0, 0);
        this.mScale = vec2.fromValues(1, 1);
        this.mRotationInRad = 0.0;
    }

    // 设置位置
    getXPos() { return this.mPosition[0]; };
    setXPos(xPos) { this.mPosition[0] = xPos; };
    getYPos() { return this.mPosition[1]; };
    setYPos(yPos) { this.mPosition[1] = yPos; };
    setPoistion(xPos, yPos) {
        this.setXPos(xPos);
        this.setYPos(yPos);
    }
    getPosition() { return this.mPosition; };
    incXPosBy(delta) { this.mPosition[0] += delta; };
    incYPosBy(delta) { this.mPosition[1] += delta; };

    // 大小
    getWidth() { return this.mScale[0]; };
    setWidth(width) { this.mScale[0] = width; };
    incWidthBy(delta) { this.mScale[0] += delta; };
    getHeight() { return this.mScale[1]; };
    setHeight(height) { this.mScale[1] = height; };
    incHeightBy(delta) { this.mScale[1] += delta; };
    setSize(width, height) {
        this.setWidth(width);
        this.setHeight(height);
    };
    getSize() { return this.mScale; };
    incSizeBy(delta) {
        this.incWidthBy(delta);
        this.incHeightBy(delta);
    };

    //旋转
    setRotationInRad(rotationInRadians) {
        this.mRotationInRad = rotationInRadians;
        while (this.mRotationInRad > (2 * Math.PI)) {
            this.mRotationInRad -= (2 * Math.PI);
        }
    };
    setRotationInDegree(rotationInDegree) {
        this.setRotationInRad(rotationInDegree * Math.PI / 180.0);
    };
    incRotationByDegree(deltaDegree) {
        this.incRotationByRad(deltaDegree * Math.PI / 180.0);
    };
    incRotationByRad(deltaRad) {
        this.setRotationInRad(this.mRotationInRad + deltaRad);
    };
    getRotationInRad() { return this.mRotationInRad; };
    getRotationInDegree() { return this.mRotationInRad * 180.0 / Math.PI; };

    getXform() {
        // Creates a blank identity matrix
        var matrix = mat4.create();
    
        // The matrices that WebGL uses are transposed, thus the typical matrix
        // operations must be in reverse.
    
        // Step A: compute translation, for now z is always at 0.0
        mat4.translate(matrix, matrix, vec3.fromValues(this.getXPos(), this.getYPos(), 0.0));
        // Step B: concatenate with rotation.
        mat4.rotateZ(matrix, matrix, this.getRotationInRad());
        // Step C: concatenate with scaling
        mat4.scale(matrix, matrix, vec3.fromValues(this.getWidth(), this.getHeight(), 1.0));
    
        return matrix;
    };
   
}

export { Transform }