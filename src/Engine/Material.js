import { vec4 } from "./Lib/gl-matrix";

class Material {
    constructor() {
        this.mKa = vec4.fromValues(0.0, 0.0, 0.0, 0);
        this.mKs = vec4.fromValues(0.2, 0.2, 0.2, 1);
        this.mKd = vec4.fromValues(1.0, 1.0, 1.0, 1);
        this.mShininess = 20;
    };

    //<editor-fold desc="Public Methods">
    //**-----------------------------------------
    // Public methods
    //**-----------------------------------------
    setAmbient(a) { this.mKa = vec4.clone(a); };
    getAmbient() { return this.mKa; };

    setDiffuse(d) { this.mKd = vec4.clone(d); };
    getDiffuse() { return this.mKd; };

    setSpecular(s) { this.mKs = vec4.clone(s); };
    getSpecular() { return this.mKs; };

    setShininess(s) { this.mShininess = s; };
    getShininess() { return this.mShininess; };
    //--- end of Public Methods

    //</editor-fold>
}

export { Material };
