import { Camera } from "./Camera";

export const CameraInput = {
    _mouseDCX,
    _mouseDCY,
    isMouseInViewport,
    mouseWCX,
    mouseWCY,
}

function _mouseDCX() {
    
    return this.gEngine.Input.getMousePosX() - this.mViewport[Camera.eViewport.eOrgX];
};

function _mouseDCY() {
    return this.gEngine.Input.getMousePosY() - this.mViewport[Camera.eViewport.eOrgY];
};

function isMouseInViewport() {
    
    let dcX = this._mouseDCX.call(this);
    let dcY = this._mouseDCY.call(this);
    return ((dcX >= 0) && (dcX < this.mViewport[Camera.eViewport.eWidth]) &&
        (dcY >= 0) && (dcY < this.mViewport[Camera.eViewport.eHeight]));
};

function mouseWCX() {
    let minWCX = this.getWCCenter()[0] - this.getWCWidth() / 2;
    return minWCX + (this._mouseDCX() * (this.getWCWidth() / this.mViewport[Camera.eViewport.eWidth]));
};

function mouseWCY() {
    var minWCY = this.getWCCenter()[1] - this.getWCHeight() / 2;
    return minWCY + (this._mouseDCY() * (this.getWCHeight() / this.mViewport[Camera.eViewport.eHeight]));
};