class ShaderMaterial {
    constructor(gEngine, aIllumShader) {
        // reference to the normal map sampler
        this.gEngine = gEngine;
        let gl = gEngine.Core.getGL();
        this.mKaRef = gl.getUniformLocation(aIllumShader, "uMaterial.Ka");
        this.mKdRef = gl.getUniformLocation(aIllumShader, "uMaterial.Kd");
        this.mKsRef = gl.getUniformLocation(aIllumShader, "uMaterial.Ks");
        this.mShineRef = gl.getUniformLocation(aIllumShader, "uMaterial.Shininess");
    };

    loadToShader(aMaterial) {
        let gl = this.gEngine.Core.getGL();
        gl.uniform4fv(this.mKaRef, aMaterial.getAmbient());
        gl.uniform4fv(this.mKdRef, aMaterial.getDiffuse());
        gl.uniform4fv(this.mKsRef, aMaterial.getSpecular());
        gl.uniform1f(this.mShineRef, aMaterial.getShininess());
    };
}

export { ShaderMaterial };
