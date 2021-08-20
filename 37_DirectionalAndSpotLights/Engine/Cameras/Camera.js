import { mat4, vec2, vec3 } from "../Lib/gl-matrix";
import { BoundingBox } from "../Utils/BoundingBox";
import { CameraManipulation } from "./Camera_Manipulation";
import { CameraState } from "./CameraState";
import { CameraInput } from "./Camera_Input";
import { CameraXform } from "./Camera_Xform";

// Information to be updated once per render for efficiency concerns
class PerRenderCache {
    constructor() {
        this.mWCToPixelRatio = 1;  // WC to pixel transformation
        this.mCameraOrgX = 1; // Lower-left corner of camera in WC 
        this.mCameraOrgY = 1;
        this.mCameraPosInPixelSpace = vec3.fromValues(0, 0, 0); //
    }
};
// wcCenter: is a vec2
// wcWidth: is the width of the user defined WC
//      Height of the user defined WC is implicitly defined by the viewport aspect ratio
//      Please refer to the following
// viewportRect: an array of 4 elements
//      [0] [1]: (x,y) position of lower left corner on the canvas (in pixel)
//      [2]: width of viewport
//      [3]: height of viewport
//      
//  wcHeight = wcWidth * viewport[3]/viewport[2]
//
class Camera {

    static eViewport = {
        eOrgX: 0,
        eOrgY: 1,
        eWidth: 2,
        eHeight: 3
    };

    constructor(gEngine, wcCenter, wcWidth, viewportArray, bound) {
        // WC and viewport position and size
        this.gl = gEngine.Core.getGL();
        this.gEngine = gEngine;
        // WC and viewport position and size
        this.mCameraState = new CameraState(wcCenter, wcWidth);
        this.mCameraShake = null;

        this.mViewport = [];  // [x, y, width, height]
        this.mViewportBound = 0;
        if (bound !== undefined) {
            this.mViewportBound = bound;
        }
        this.mScissorBound = [];  // use for bounds
        this.setViewport(viewportArray, this.mViewportBound);

        this.mNearPlane = 0;
        this.mFarPlane = 1000;

        this.kCameraZ = 10;  // This is for illumination computation

        // transformation matrices
        this.mViewMatrix = mat4.create();
        this.mProjMatrix = mat4.create();
        this.mVPMatrix = mat4.create();


        // background color
        this.mBgColor = [0.8, 0.8, 0.8, 1]; // RGB and Alpha

        // per-rendering cached information
        // needed for computing transforms for shaders
        // updated each time in SetupViewProjection()
        this.mRenderCache = new PerRenderCache();
        // SHOULD NOT be used except 
        // xform operations during the rendering
        // Client game should not access this!

        Object.assign(this, { ...CameraManipulation, ...CameraInput, ...CameraXform }); //对Camera类进行扩展

    }

    setWCCenter(xPos, yPos) {
        let p = vec2.fromValues(xPos, yPos);
        this.mCameraState.setCenter(p);
    };
    getPosInPixelSpace() { return this.mRenderCache.mCameraPosInPixelSpace; };
    getWCCenter() { return this.mCameraState.getCenter(); };
    setWCWidth(width) { this.mCameraState.setWidth(width); };
    getWCWidth() { return this.mCameraState.getWidth(); };
    getWCHeight() { return this.mCameraState.getWidth() * this.mViewport[Camera.eViewport.eHeight] / this.mViewport[Camera.eViewport.eWidth]; };

    setViewport(viewportArray, bound) {
        if (bound === undefined) {
            bound = this.mViewportBound;
        }
        // [x, y, width, height]
        this.mViewport[0] = viewportArray[0] + bound;
        this.mViewport[1] = viewportArray[1] + bound;
        this.mViewport[2] = viewportArray[2] - (2 * bound);
        this.mViewport[3] = viewportArray[3] - (2 * bound);
        this.mScissorBound[0] = viewportArray[0];
        this.mScissorBound[1] = viewportArray[1];
        this.mScissorBound[2] = viewportArray[2];
        this.mScissorBound[3] = viewportArray[3];
    };
    getViewport() {
        let out = [];
        out[0] = this.mScissorBound[0];
        out[1] = this.mScissorBound[1];
        out[2] = this.mScissorBound[2];
        out[3] = this.mScissorBound[3];
        return out;
    };

    setBackgroundColor(newColor) { this.mBgColor = newColor; };
    getBackgroundColor() { return this.mBgColor; };

    // Getter for the View-Projection transform operator
    getVPMatrix() {
        return this.mVPMatrix;
    };

    setupViewProjection() {
        // Step A1: Set up the viewport: area on canvas to be drawn
        this.gl.viewport(
            this.mViewport[0],  // x position of bottom-left corner of the area to be drawn
            this.mViewport[1],  // y position of bottom-left corner of the area to be drawn
            this.mViewport[2],  // width of the area to be drawn
            this.mViewport[3]); // height of the area to be drawn
        // Step A2: set up the corresponding scissor area to limit the clear area
        this.gl.scissor(
            this.mScissorBound[0], // x position of bottom-left corner of the area to be drawn
            this.mScissorBound[1], // y position of bottom-left corner of the area to be drawn
            this.mScissorBound[2], // width of the area to be drawn
            this.mScissorBound[3]);// height of the area to be drawn
        // Step A3: set the color to be clear
        this.gl.clearColor(this.mBgColor[0], this.mBgColor[1], this.mBgColor[2], this.mBgColor[3]);  // set the color to be cleared
        // Step A4: enable the scissor area, clear, and then disable the scissor area
        this.gl.enable(this.gl.SCISSOR_TEST);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.disable(this.gl.SCISSOR_TEST);

        // Step B1: define the view matrix
        let center = [];
        if (this.mCameraShake !== null) {
            center = this.mCameraShake.getCenter();
        } else {
            center = this.getWCCenter();
        };
        mat4.lookAt(this.mViewMatrix,
            [center[0], center[1], 10],   // WC center
            [center[0], center[1], 0],    // 
            [0, 1, 0]);     // orientation
        // Step B2: define the projection matrix
        let halfWCWidth = 0.5 * this.getWCWidth();
        let halfWCHeight = halfWCWidth * this.mViewport[3] / this.mViewport[2]; // viewportH/viewportW
        mat4.ortho(this.mProjMatrix,
            -halfWCWidth,   // distance to left of WC
            halfWCWidth,   // distance to right of WC
            -halfWCHeight,  // distance to bottom of WC
            halfWCHeight,  // distance to top of WC
            this.mNearPlane,   // z-distance to near plane 
            this.mFarPlane  // z-distance to far plane 
        );

        // Step B3: concatenate view and project matrices
        mat4.multiply(this.mVPMatrix, this.mProjMatrix, this.mViewMatrix);

        // Step B4: compute and cache per-rendering information
        this.mRenderCache.mWCToPixelRatio = this.mViewport[Camera.eViewport.eWidth] / this.getWCWidth();
        this.mRenderCache.mCameraOrgX = center[0] - (this.getWCWidth() / 2);
        this.mRenderCache.mCameraOrgY = center[1] - (this.getWCHeight() / 2);

        let p = this.wcPosToPixel(this.getWCCenter());
        this.mRenderCache.mCameraPosInPixelSpace[0] = p[0];
        this.mRenderCache.mCameraPosInPixelSpace[1] = p[1];
        this.mRenderCache.mCameraPosInPixelSpace[2] = this.fakeZInPixelSpace(this.kCameraZ);
    }

    collideWCBound(aXform, zone) {
        let bbox = new BoundingBox(aXform.getPosition(), aXform.getWidth(), aXform.getHeight());
        let w = zone * this.getWCWidth();
        let h = zone * this.getWCHeight();
        let cameraBound = new BoundingBox(this.getWCCenter(), w, h);
        return cameraBound.boundCollideStatus(bbox);
    };

    clampAtBoundary(aXform, zone) {
        var status = this.collideWCBound(aXform, zone);
        if (status !== BoundingBox.eboundCollideStatus.eInside) {
            var pos = aXform.getPosition();
            if ((status & BoundingBox.eboundCollideStatus.eCollideTop) !== 0) {
                pos[1] = (this.getWCCenter())[1] + (zone * this.getWCHeight() / 2) - (aXform.getHeight() / 2);
            }
            if ((status & BoundingBox.eboundCollideStatus.eCollideBottom) !== 0) {
                pos[1] = (this.getWCCenter())[1] - (zone * this.getWCHeight() / 2) + (aXform.getHeight() / 2);
            }
            if ((status & BoundingBox.eboundCollideStatus.eCollideRight) !== 0) {
                pos[0] = (this.getWCCenter())[0] + (zone * this.getWCWidth() / 2) - (aXform.getWidth() / 2);
            }
            if ((status & BoundingBox.eboundCollideStatus.eCollideLeft) !== 0) {
                pos[0] = (this.getWCCenter())[0] - (zone * this.getWCWidth() / 2) + (aXform.getWidth() / 2);
            }
        }
        return status;
    };
}



export { Camera }