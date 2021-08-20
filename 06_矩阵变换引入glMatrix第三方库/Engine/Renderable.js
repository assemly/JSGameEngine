class Renderable {
    constructor(gEnigne,shader){
        this.gEnigne = gEnigne;
        this.mShader = shader;
        this.mColor = [1,1,1,1]
    };

    draw(modelTransform){
        this.gl = this.gEnigne.Core.getGL();
        this.mShader.activateShader(this.mColor);
        this.mShader.loadObjectTransform(modelTransform);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP,0,4);
    };

    setColor(color){
        this.mColor = color;
    };

    getColor(){
        return this.mColor;
    };

}

export { Renderable }