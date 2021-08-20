
import {InterpolateVec2} from "../Utils/InterpolateVec2";
import {Interpolate} from "../Utils/Interpolate";

class CameraState {

    constructor(center, width) {
        this.kCycles = 300;  // number of cycles to complete the transition
        this.kRate = 0.1;    // rate of change for each cycle
        this.mCenter = new InterpolateVec2(center, this.kCycles, this.kRate);
        this.mWidth = new Interpolate(width, this.kCycles, this.kRate);
    }

    getCenter() { return this.mCenter.getValue(); };
    getWidth() { return this.mWidth.getValue(); };

    setCenter(c) { this.mCenter.setFinalValue(c); };
    setWidth(w) { this.mWidth.setFinalValue(w); };

    updateCameraState() {
        this.mCenter.updateInterpolation();
        this.mWidth.updateInterpolation();
    };

    configInterpolation(stiffness, duration) {
        this.mCenter.configInterpolation(stiffness, duration);
        this.mWidth.configInterpolation(stiffness, duration);
    };
}
export { CameraState };