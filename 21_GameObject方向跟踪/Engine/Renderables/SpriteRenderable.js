import { TextureRenderable } from "./TextureRenderable";
import { Renderable } from "./Renderable";

class SpriteRenderable extends TextureRenderable {
    //// the expected texture coordinate array is an array of 8 floats where elements:
    //  [0] [1]: is u/v coordinate of Top-Right 
    //  [2] [3]: is u/v coordinate of Top-Left
    //  [4] [5]: is u/v coordinate of Bottom-Right
    //  [6] [7]: is u/v coordinate of Bottom-Left
    // Convention: eName is an enumerated data type
    static eTexCoordArray = {
        eLeft: 2,
        eRight: 0,
        eTop: 1,
        eBottom: 5
    };
    // 为什么会是这样的数字是因
    // The 8 elements:
    //      mTexRight, mTexTop         // x,y of top-right
    //      mTexLeft,   mTexTop,
    //      mTexRight,  mTexBottom,
    //      mTexLeft,   mTexBottom
    // UV坐标系很容易知道 0 是 mTexRight 所以eRight为0
    // 其余数同理mTexBottom是数组中5 eBootom也为5

    constructor(gEnigne, myTexture) {
        super(gEnigne, myTexture);
        this.gEnigne = gEnigne;
        // 调用祖父类方法可参考 祖父类函数调用方法
        Renderable.prototype._setShader.call(this, this.gEnigne.DefaultResources.getSpriteShader());
        this.mTexLeft = 0.0;   // bounds of texture coordinate (0 is left, 1 is right)
        this.mTexRight = 1.0;  // 
        this.mTexTop = 1.0;    //   1 is top and 0 is bottom of image
        this.mTexBottom = 0.0; // 
        console.log("SpriteRenderable::constructor: ");
    }

    // specify element region by texture coordinate (between 0 to 1)
    setElementUVCoordinate(left, right, bottom, top) {
        this.mTexLeft = left;
        this.mTexRight = right;
        this.mTexBottom = bottom;
        this.mTexTop = top;
    };

    // specify element region by pixel positions (between 0 to image resolutions)
    setElementPixelPositions(left, right, bottom, top) {
        var texInfo = this.gEnigne.ResourceMap.retrieveAsset(this.mTexture);
        // entire image width, height
        var imageW = texInfo.mWidth;
        var imageH = texInfo.mHeight;

        this.mTexLeft = left / imageW;
        this.mTexRight = right / imageW;
        this.mTexBottom = bottom / imageH;
        this.mTexTop = top / imageH;
    };

    getElementUVCoordinateArray() {
        return [
            this.mTexRight, this.mTexTop,          // x,y of top-right
            this.mTexLeft, this.mTexTop,
            this.mTexRight, this.mTexBottom,
            this.mTexLeft, this.mTexBottom
        ];
    };

    draw(aCamera) {
        // set the current texture coordinate
        // 
        // activate the texture

        console.log("SpriteRenderable::draw()");
        this.mShader.setTextureCoordinate(this.getElementUVCoordinateArray());
        super.draw(aCamera);
    };
}

export { SpriteRenderable }