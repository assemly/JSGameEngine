import { Renderable } from "./Renderable";

class TextureRenderable extends Renderable {
    constructor(gEnigne, myTexture) {
        super(gEnigne);
        this.gEnigne = gEnigne;
        super.setColor([1, 1, 1, 0]);
        super._setShader(this.gEnigne.DefaultResources.getTextureShader());
        this.mTexture = myTexture;          // texture for this object, cannot be a "null"
    };

    draw(vpMatrix) {
        // activate the texture
        this.gEnigne.Textures.activateTexture(this.mTexture);
        super.draw(vpMatrix);
    };

    getTexture() { return this.mTexture; };
    setTexture(t) { this.mTexture = t; };
};

export { TextureRenderable }