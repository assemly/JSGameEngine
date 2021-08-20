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
        var pixelTouch = false;
        var xIndex = 0, yIndex;
        var otherIndex = [0, 0];

        var xDir = [1, 0];
        var yDir = [0, 1];
        var otherXDir = [1, 0];
        var otherYDir = [0, 1];
        //这个需要检测因为新版本增加了rotate 所以自我添加了rotateA;
        vec2.rotateA(xDir, xDir, this.mXform.getRotationInRad());
        vec2.rotateA(yDir, yDir, this.mXform.getRotationInRad());
        vec2.rotateA(otherXDir, otherXDir, other.mXform.getRotationInRad());
        vec2.rotateA(otherYDir, otherYDir, other.mXform.getRotationInRad());

        while ((!pixelTouch) && (xIndex < this.mTexWidth)) {
            yIndex = 0;
            while ((!pixelTouch) && (yIndex < this.mTexHeight)) {
                if (this._pixelAlphaValue(xIndex, yIndex) > 0) {
                    this._indexToWCPosition(wcTouchPos, xIndex, yIndex, xDir, yDir);
                    other._wcPositionToIndex(otherIndex, wcTouchPos, otherXDir, otherYDir);
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

    _wcPositionToIndex(returnIndex, wcPos, xDir, yDir) {
        // use wcPos to compute the corresponding returnIndex[0 and 1]
        let delta = [];
        vec2.sub(delta, wcPos, this.mXform.getPosition());
        let xDisp = vec2.dot(delta, xDir);
        let yDisp = vec2.dot(delta, yDir);
        returnIndex[0] = this.mTexWidth * (xDisp / this.mXform.getWidth());
        returnIndex[1] = this.mTexHeight * (yDisp / this.mXform.getHeight());

        // recall that xForm.getPosition() returns center, yet
        // Texture origin is at lower-left corner!
        returnIndex[0] += this.mTexWidth / 2;
        returnIndex[1] += this.mTexHeight / 2;

        returnIndex[0] = Math.floor(returnIndex[0]);
        returnIndex[1] = Math.floor(returnIndex[1]);
    };

    _indexToWCPosition(returnWCPos, i, j, xDir, yDir) {
        //console.log("TextureRenderable::_indexToWCPosition")
        var x = i * this.mXform.getWidth() / this.mTexWidth;
        var y = j * this.mXform.getHeight() / this.mTexHeight;
        var xDisp = x - (this.mXform.getWidth() * 0.5);
        var yDisp = y - (this.mXform.getHeight() * 0.5);
        var xDirDisp = [];
        var yDirDisp = [];

        vec2.scale(xDirDisp, xDir, xDisp);
        vec2.scale(yDirDisp, yDir, yDisp);
        vec2.add(returnWCPos, this.mXform.getPosition(), xDirDisp);
        vec2.add(returnWCPos, returnWCPos, yDirDisp);

    };
};

export { TextureRenderable }