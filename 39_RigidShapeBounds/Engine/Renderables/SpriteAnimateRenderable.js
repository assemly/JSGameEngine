import { SpriteRenderable } from "./SpriteRenderable";
import { Renderable } from "./Renderable";

class SpriteAnimateRenderable extends SpriteRenderable {
    // Assumption is that the first sprite in an animation is always the left-most element.
    static eAnimationType = {
        eAnimateRight: 0,     // Animate from first (left) towards right, when hit the end, start from the left again
        eAnimateLeft: 1,      // Compute find the last element (in the right), start from the right animate left-wards, 
        eAnimateSwing: 2      // Animate from first (left) towards the right, when hit the end, animates backwards 
    }

    constructor(gEngine, myTexture) {
        super(gEngine, myTexture);
        this.gEngine = gEngine;
        super._setShader.call(this, gEngine.DefaultResources.getSpriteShader());

        // All coordinates are in texture coordinate (UV between 0 to 1)

        // Information on the sprite element
        this.mFirstElmLeft = 0.0; // 0.0 is left corner of image
        this.mElmTop = 1.0;  // 1.0 is top corner of image
        this.mElmWidth = 1.0;     // default sprite element size is the entire image
        this.mElmHeight = 1.0;
        this.mWidthPadding = 0.0;
        this.mNumElems = 1;   // number of elements in an animation

        //
        // per animation settings
        this.mUpdateInterval = 1;   // how often to advance
        this.mAnimationType = SpriteAnimateRenderable.eAnimationType.eAnimateRight;

        this.mCurrentAnimAdvance = -1;
        this.mCurrentElm = 0;
        this._initAnimation();
    }

    _initAnimation() {
        // Currently running animation
        this.mCurrentTick = 0;
        switch (this.mAnimationType) {
            case SpriteAnimateRenderable.eAnimationType.eAnimateRight:
                this.mCurrentElm = 0;
                this.mCurrentAnimAdvance = 1; // either 1 or -1
                break;
            case SpriteAnimateRenderable.eAnimationType.eAnimateSwing:
                this.mCurrentAnimAdvance = -1 * this.mCurrentAnimAdvance; // swings ... 
                //console.log("Before SpriteAnimateRenderable::swing: "+this.mCurrentElm);
                this.mCurrentElm += 2 * this.mCurrentAnimAdvance; //置位
                //console.log("SpriteAnimateRenderable::swing: "+this.mCurrentElm);
                break;
            case SpriteAnimateRenderable.eAnimationType.eAnimateLeft:
                this.mCurrentElm = this.mNumElems - 1;
                this.mCurrentAnimAdvance = -1; // either 1 or -1
                break;
        }
        this._setSpriteElement();
    };

    _setSpriteElement() {
        var left = this.mFirstElmLeft + (this.mCurrentElm * (this.mElmWidth + this.mWidthPadding));
        super.setElementUVCoordinate.call(this, left, left + this.mElmWidth,
            this.mElmTop - this.mElmHeight, this.mElmTop);
    };

    // Always set the left-most element to be the first
    setSpriteSequence(
        topPixel,   // offset from top-left
        leftPixel, // offset from top-left
        elmWidthInPixel,
        elmHeightInPixel,
        numElements,      // number of elements in sequence
        wPaddingInPixel  // left/right padding
    ) {
        var texInfo = this.gEngine.ResourceMap.retrieveAsset(this.mTexture);
        // entire image width, height
        var imageW = texInfo.mWidth;
        var imageH = texInfo.mHeight;

        this.mNumElems = numElements;   // number of elements in animation
        this.mFirstElmLeft = leftPixel / imageW;
        this.mElmTop = topPixel / imageH;
        this.mElmWidth = elmWidthInPixel / imageW;
        this.mElmHeight = elmHeightInPixel / imageH;
        this.mWidthPadding = wPaddingInPixel / imageW;
        this._initAnimation();
    };

    setAnimationSpeed(
        tickInterval   // number of update calls before advancing the animation
    ) {
        this.mUpdateInterval = tickInterval;   // how often to advance
    };

    incAnimationSpeed(
        deltaInterval   // number of update calls before advancing the animation
    ) {
        this.mUpdateInterval += deltaInterval;   // how often to advance
    };

    setAnimationType(animationType) {
        this.mAnimationType = animationType;
        this.mCurrentAnimAdvance = -1;
        this.mCurrentElm = 0;
        this._initAnimation();
    };

    updateAnimation() {
        this.mCurrentTick++;
        if (this.mCurrentTick >= this.mUpdateInterval) {
            this.mCurrentTick = 0;
            this.mCurrentElm += this.mCurrentAnimAdvance;
            if ((this.mCurrentElm >= 0) && (this.mCurrentElm < this.mNumElems)) {
                this._setSpriteElement();
            } else {
                this._initAnimation();
            }
        }
    };

}

export { SpriteAnimateRenderable }