import { Transform } from "./Transform";

class Renderable {
    constructor(gEnigne, shader) {
        this.gEnigne = gEnigne;
        this.mShader = shader;
        this.mColor = [1, 1, 1, 1]
        this.mXform = new Transform();
    };

    draw(vpMatrix) {
        this.gl = this.gEnigne.Core.getGL();
        this.mShader.activateShader(this.mColor,vpMatrix);
        this.mShader.loadObjectTransform(this.mXform.getXform());
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    };

    setColor(color) {
        this.mColor = color;
    };

    getColor() {
        return this.mColor;
    };

    getXform() {
        return this.mXform;
    }
}

export { Renderable }