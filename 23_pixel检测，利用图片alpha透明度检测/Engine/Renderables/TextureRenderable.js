import { Renderable } from "./Renderable";
import { vec2 } from "../Lib/gl-matrix";

class TextureRenderable extends Renderable {
    constructor(gEngine, myTexture) {
        super(gEngine);
        this.gEngine = gEngine;
        super.setColor([1, 1, 1, 0]);
        super._setShader(this.gEngine.DefaultResources.getTextureShader());
        this.mTexture = myTexture;          // texture for this object, cannot be a "null"
        // these two instance variables are to cache texture information
        // for supporting per-pixel accurate collision
        this.mTextureInfo = null;
        this.mColorArray = null;
        // defined for subclass to override
        this.mTexWidth = 0;
        this.mTexHeight = 0;
        this.mTexLeftIndex = 0;
        this.mTexBottomIndex = 0;

        this.setTexture(myTexture);     // texture for this object, cannot be a "null"

    };

    draw(aCamera) {
        // activate the texture

        this.gEngine.Textures.activateTexture(this.mTexture);
        super.draw(aCamera);
    };

    getTexture() { return this.mTexture; };
    setTexture(newTexture) {
        this.mTexture = newTexture;
        // these two instance variables are to cache texture information
        // for supporting per-pixel accurate collision
        this.mTextureInfo = this.gEngine.Textures.getTextureInfo(newTexture);
        this.mColorArray = null;
        // defined for subclass to override
        this.mTexWidth = this.mTextureInfo.mWidth;
        this.mTexHeight = this.mTextureInfo.mHeight;
        this.mTexLeftIndex = 0;
        this.mTexBottomIndex = 0;
    };

    pixelTouches(other, wcTouchPos) {
        let pixelTouch = false;
        let xIndex = 0, yIndex;
        let otherIndex = [0, 0];

        while ((!pixelTouch) && (xIndex < this.mTexWidth)) {
            yIndex = 0;
            while ((!pixelTouch) && (yIndex < this.mTexHeight)) {
                if (this._pixelAlphaValue(xIndex, yIndex) > 0) {
                    this._indexToWCPosition(wcTouchPos, xIndex, yIndex);
                    other._wcPositionToIndex(otherIndex, wcTouchPos);
                    if ((otherIndex[0] >= 0) && (otherIndex[0] < other.mTexWidth) &&
                        (otherIndex[1] >= 0) && (otherIndex[1] < other.mTexHeight)) {
                        pixelTouch = other._pixelAlphaValue(otherIndex[0], otherIndex[1]) > 0;
                    }
                }
                yIndex++;
            }
            xIndex++;
        }
        return pixelTouch;
    };

    setColorArray() {
        if (this.mColorArray === null) {
            this.mColorArray = this.gEngine.Textures.getColorArray(this.mTexture);
        }
    };

    _pixelAlphaValue(x, y) {
        x = x * 4;
        y = y * 4;
        return this.mColorArray[(y * this.mTextureInfo.mWidth) + x + 3];
    };

    _wcPositionToIndex(returnIndex, wcPos) {
        // use wcPos to compute the corresponding returnIndex[0 and 1]
        var delta = [];
        vec2.sub(delta, wcPos, this.mXform.getPosition());
        returnIndex[0] = this.mTexWidth * (delta[0] / this.mXform.getWidth());
        returnIndex[1] = this.mTexHeight * (delta[1] / this.mXform.getHeight());

        // recall that xForm.getPosition() returns center, yet
        // Texture origin is at lower-left corner!
        returnIndex[0] += this.mTexWidth / 2;
        returnIndex[1] += this.mTexHeight / 2;

        returnIndex[0] = Math.floor(returnIndex[0]);
        returnIndex[1] = Math.floor(returnIndex[1]);
    };

    _indexToWCPosition(returnWCPos, i, j) {
        var x = i * this.mXform.getWidth() / this.mTexWidth;
        var y = j * this.mXform.getHeight() / this.mTexHeight;
        returnWCPos[0] = this.mXform.getXPos() + (x - (this.mXform.getWidth() * 0.5));
        returnWCPos[1] = this.mXform.getYPos() + (y - (this.mXform.getHeight() * 0.5));
    };
};

export { TextureRenderable }