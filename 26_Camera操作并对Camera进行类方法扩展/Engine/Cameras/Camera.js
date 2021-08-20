import { mat4 } from "../Lib/gl-matrix";
import { BoundingBox } from "../Utility/BoundingBox";
import { CameraManipulation } from "./Camera_Manipulation";

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

    constructor(gEngine, wcCenter, wcWidth, viewportArray) {
        // WC and viewport position and size
        this.gl = gEngine.Core.getGL();
        // WC and viewport position and size

        this.mWCCenter = wcCenter;
        this.mWCWidth = wcWidth;
        this.mViewport = viewportArray;  // [x, y, width, height]
        this.mNearPlane = 0;
        this.mFarPlane = 1000;

        // transformation matrices
        this.mViewMatrix = mat4.create();
        this.mProjMatrix = mat4.create();
        this.mVPMatrix = mat4.create();


        // background color
        this.mBgColor = [0.8, 0.8, 0.8, 1]; // RGB and Alpha

        Object.assign(this, { ...CameraManipulation }); //对Camera类进行扩展

    }

    setWCCenter(xPos, yPos) {
        this.mWCCenter[0] = xPos;
        this.mWCCenter[1] = yPos;
    };
    getWCCenter() { return this.mWCCenter; };
    setWCWidth(width) { this.mWCWidth = width; };
    getWCWidth() { return this.mWCWidth; };
    getWCHeight() { return this.mWCWidth * this.mViewport[3] / this.mViewport[2]; };

    setViewport(viewportArray) { this.mViewport = viewportArray; };
    getViewport() { return this.mViewport; };

    setBackgroundColor(newColor) { this.mBgColor = newColor; };
    getBackgroundColor() { return this.mBgColor; };

    // Getter for the View-Projection transform operator
    getVPMatrix() {
        return this.mVPMatrix;
    };

    setupViewProjection() {
        // Step A1: Set up the viewport: area on canvas to be drawn
        this.gl.viewport(this.mViewport[0],  // x position of bottom-left corner of the area to be drawn
            this.mViewport[1],  // y position of bottom-left corner of the area to be drawn
            this.mViewport[2],  // width of the area to be drawn
            this.mViewport[3]); // height of the area to be drawn
        // Step A2: set up the corresponding scissor area to limit the clear area
        this.gl.scissor(this.mViewport[0], // x position of bottom-left corner of the area to be drawn
            this.mViewport[1], // y position of bottom-left corner of the area to be drawn
            this.mViewport[2], // width of the area to be drawn
            this.mViewport[3]);// height of the area to be drawn
        // Step A3: set the color to be clear
        this.gl.clearColor(this.mBgColor[0], this.mBgColor[1], this.mBgColor[2], this.mBgColor[3]);  // set the color to be cleared
        // Step A4: enable the scissor area, clear, and then disable the scissor area
        this.gl.enable(this.gl.SCISSOR_TEST);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.disable(this.gl.SCISSOR_TEST);

        // Step B1: define the view matrix
        mat4.lookAt(this.mViewMatrix,
            [this.mWCCenter[0], this.mWCCenter[1], 10],   // WC center
            [this.mWCCenter[0], this.mWCCenter[1], 0],    // 
            [0, 1, 0]);     // orientation
        // Step B2: define the projection matrix
        let halfWCWidth = 0.5 * this.mWCWidth;
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