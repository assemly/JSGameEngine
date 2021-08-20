import { Camera } from "./Camera";
import {vec3} from "../Lib/gl-matrix";

export const CameraXform = {
    fakeZInPixelSpace,
    wcPosToPixel,
    wcSizeToPixel,
}

function fakeZInPixelSpace(z) {
    return z * this.mRenderCache.mWCToPixelRatio;
};

function wcPosToPixel(p) {  // p is a vec3, fake Z
    // Convert the position to pixel space
    let x = this.mViewport[Camera.eViewport.eOrgX] + ((p[0] - this.mRenderCache.mCameraOrgX) * this.mRenderCache.mWCToPixelRatio) + 0.5;
    let y = this.mViewport[Camera.eViewport.eOrgY] + ((p[1] - this.mRenderCache.mCameraOrgY) * this.mRenderCache.mWCToPixelRatio) + 0.5;
    let z = this.fakeZInPixelSpace(p[2]);
    return vec3.fromValues(x, y, z);
};

function wcSizeToPixel(s) {  // 
    return (s * this.mRenderCache.mWCToPixelRatio) + 0.5;
};