import { Transform } from "../Transform";

class Renderable {
    constructor(gEnigne) {
        
        this.gEnigne = gEnigne;
        console.log("Renderable::constructor:-- " + this.gEnigne.DefaultResources.getConstColorShader());
        this.mShader = this.gEnigne.DefaultResources.getConstColorShader();
        console.log("Renderable::constructor: " + this.mShader);
        this.mColor = [1, 1, 1, 1]
        this.mXform = new Transform();
        this.gl = this.gEnigne.Core.getGL();
    };

    draw(aCamera) {
        
        this.mShader.activateShader(this.mColor, aCamera);
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

    _setShader(s) { this.mShader = s; };
}

export { Renderable }