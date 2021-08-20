import { vec3, vec4 } from "../Lib/gl-matrix";

class Light {
    constructor() {
        this.mColor = vec4.fromValues(0.1, 0.1, 0.1, 1);  // light color
        this.mPosition = vec3.fromValues(0, 0, 5); // light position in WC
        this.mNear = 5;  // effective distance in WC
        this.mFar = 10;  // within near is full on, outside far is off
        this.mIntensity = 1;
        this.mIsOn = true;
    };

    setColor(c) { this.mColor = vec4.clone(c); };
    getColor() { return this.mColor; };

    set2DPosition(p) { this.mPosition = vec3.fromValues(p[0], p[1], this.mPosition[2]); };
    setXPos(x) { this.mPosition[0] = x; };
    setYPos(y) { this.mPosition[1] = y; };
    setZPos(z) { this.mPosition[2] = z; };
    getPosition() { return this.mPosition; };

    setNear(r) { this.mNear = r; };
    getNear() { return this.mNear; };

    setFar(r) { this.mFar = r; };
    getFar() { return this.mFar; };

    setIntensity(i) { this.mIntensity = i; };
    getIntensity() { return this.mIntensity; };

    setLightTo(isOn) { this.mIsOn = isOn; };
    isLightOn() { return this.mIsOn; };
}
export { Light }