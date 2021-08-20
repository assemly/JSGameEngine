// value: target for interpolation
// cycles: integer, how many cycle it should take for a value to change to final
// rate: the rate at which the value should change at each cycle
class Interpolate {
    constructor(value, cycles, rate) {
        this.mCurrentValue = value;    // begin value of interpolation
        this.mFinalValue = value;      // final value of interpolation
        this.mCycles = cycles;
        this.mRate = rate;

        // if there is a new value to interpolate to, number of cycles left for interpolation
        this.mCyclesLeft = 0;
    };

    getValue() { return this.mCurrentValue; };
    setFinalValue(v) {
        this.mFinalValue = v;
        this.mCyclesLeft = this.mCycles;     // will trigger interpolation
    };

    updateInterpolation() {
        if (this.mCyclesLeft <= 0) {
            return;
        }

        this.mCyclesLeft--;
        if (this.mCyclesLeft === 0) {
            this.mCurrentValue = this.mFinalValue;
        } else {
            this._interpolateValue();
        }
    };

    // stiffness of 1 switches off interpolation
    configInterpolation(stiffness, duration) {
        this.mRate = stiffness;
        this.mCycles = duration;
    };

    _interpolateValue() {
        this.mCurrentValue = this.mCurrentValue + this.mRate * (this.mFinalValue - this.mCurrentValue);
    };
}
export { Interpolate };