/* File: ParallexGameObject.js 
 *
 * Represent an GameObject located at some distance D away, thus 
 * resulting in slower movements
 * 
 * Passed in scale: 
 *     ==1: means same as actors
 *     > 1: farther away, slows down inversely (scale==2 slows down twice)
 *     < 1: closer, speeds up inversely (scale==0.5 speeds up twice)
 */
import { TiledGameObject } from "./TiledGameObject";
import { vec2 } from "../Lib/gl-matrix";

class ParallaxGameObject extends TiledGameObject {

    constructor(renderableObj, scale, aCamera) {
        super()
        this.mRefCamera = aCamera;
        this.mCameraWCCenterRef = vec2.clone(this.mRefCamera.getWCCenter());
        this.mParallaxScale = 1;
        this.setParallaxScale(scale);
        super.setRenderable(renderableObj);
        
    }


    //
    // renderableObj xfrom is accessible, it is in WC space!!
    // GameObject parameters: speed and direction are all in WC space
    //

    update() {
        // simple default behavior
        this._refPosUpdate(); // check to see if the camera has moved
        var pos = this.getXform().getPosition();  // our own xform
        vec2.scaleAndAdd(pos, pos, this.getCurrentFrontDir(), this.getSpeed() * this.mParallaxScale);
    };

    _refPosUpdate() {
        // now check for reference movement
        var deltaT = vec2.fromValues(0, 0);
        vec2.sub(deltaT, this.mCameraWCCenterRef, this.mRefCamera.getWCCenter());
        this.setWCTranslationBy(deltaT);
        vec2.sub(this.mCameraWCCenterRef, this.mCameraWCCenterRef, deltaT); // update WC center ref position
    };

    setWCTranslationBy(delta) {
        var f = (1 - this.mParallaxScale);
        this.getXform().incXPosBy(-delta[0] * f);
        this.getXform().incYPosBy(-delta[1] * f);
    };

    getParallaxScale() {
        return this.mParallaxScale;
    };

    setParallaxScale(s) {
        if (s <= 0) {
            this.mParallaxScale = 1;
        } else {
            this.mParallaxScale = 1 / s;
        }
    };
}

export { ParallaxGameObject };