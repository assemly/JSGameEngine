class ShakePosition {
    constructor(xDelta, yDelta, shakeFrequency, shakeDuration) {
        this.mXMag = xDelta;
        this.mYMag = yDelta;

        this.mCycles = shakeDuration; // number of cycles to complete the transition
        this.mOmega = shakeFrequency * 2 * Math.PI; // Converts frequency to radians 

        this.mNumCyclesLeft = shakeDuration;
    };

    shakeDone() {
        return (this.mNumCyclesLeft <= 0);
    };

    getShakeResults() {
        this.mNumCyclesLeft--;
        let c = [];
        let fx = 0;
        let fy = 0;
        if (!this.shakeDone()) {
            let v = this._nextDampedHarmonic();
            fx = (Math.random() > 0.5) ? -v : v;
            fy = (Math.random() > 0.5) ? -v : v;
        }
        c[0] = this.mXMag * fx;
        c[1] = this.mYMag * fy;
        return c;
    };

    _nextDampedHarmonic() {
        // computes (Cycles) * cos(  Omega * t )
        let frac = this.mNumCyclesLeft / this.mCycles;
        return frac * frac * Math.cos((1 - frac) * this.mOmega);
    };
}
export { ShakePosition }