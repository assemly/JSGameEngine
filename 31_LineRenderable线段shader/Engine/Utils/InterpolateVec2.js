import { Interpolate } from "./Interpolate";
import { vec2 } from "../Lib/gl-matrix";

class InterpolateVec2 extends Interpolate {
    constructor(value, cycle, rate) {
        super(value, cycle, rate);
    };

    // overwrite
    _interpolateValue() {
        vec2.lerp(this.mCurrentValue, this.mCurrentValue, this.mFinalValue, this.mRate);
    };
};

export { InterpolateVec2 }