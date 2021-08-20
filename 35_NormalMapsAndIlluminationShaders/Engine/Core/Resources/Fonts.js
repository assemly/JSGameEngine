
class CharacterInfo {
    constructor() {
        // in texture coordinate (0 to 1) maps to the entire image
        this.mTexCoordLeft = 0;
        this.mTexCoordRight = 1;
        this.mTexCoordBottom = 0;
        this.mTexCoordTop = 0;

        // reference to nominal character size, 1 is "standard width/height" of a char
        this.mCharWidth = 1;
        this.mCharHeight = 1;
        this.mCharWidthOffset = 0;
        this.mCharHeightOffset = 0;
        this.mXAdvance = 0;

        // reference of char width/height ratio
        this.mCharAspectRatio = 1;
    };
};

class Fonts {
    constructor(gEngine) {
        this.gEngine = gEngine;
    }

    _storeLoadedFont(fontInfoSourceString) {
        var fontName = fontInfoSourceString.slice(0, -4);  // trims the .fnt extension
        //console.log("Fonts::_storeLoadedFont:");
        var fontInfo = this.gEngine.ResourceMap.retrieveAsset(fontInfoSourceString);
        fontInfo.FontImage = fontName + ".png";
        //console.log("Fonts::_storeLoadedFont:"+fontInfo);
        this.gEngine.ResourceMap.asyncLoadCompleted(fontName, fontInfo); // to store the actual font info
    };

    loadFont(fontName) {
        if (!(this.gEngine.ResourceMap.isAssetLoaded(fontName))) {
            var fontInfoSourceString = fontName + ".fnt";
            var textureSourceString = fontName + ".png";
            
            this.gEngine.ResourceMap.asyncLoadRequested(fontName); // to register an entry in the map
            console.log("Fonts::loadFont: ")
            this.gEngine.Textures.loadTexture(textureSourceString);
            this.gEngine.TextFileLoader.loadTextFile(fontInfoSourceString,
                this.gEngine.TextFileLoader.eTextFileType.eXMLFile, (fontInfoSourceString) => this._storeLoadedFont(fontInfoSourceString));
            
        } else {
            this.gEngine.ResourceMap.incAssetRefCount(fontName);
        }
    };

    // Remove the reference to allow associated memory 
    // be available for subsequent garbage collection
    unloadFont(fontName) {
        this.gEngine.ResourceMap.unloadAsset(fontName);
        if (!(this.gEngine.ResourceMap.isAssetLoaded(fontName))) {
            var fontInfoSourceString = fontName + ".fnt";
            var textureSourceString = fontName + ".png";

            this.gEngine.Textures.unloadTexture(textureSourceString);
            this.gEngine.TextFileLoader.unloadTextFile(fontInfoSourceString);
        }
    };

    getCharInfo(fontName, aChar) {
        var returnInfo = null;
        var fontInfo = this.gEngine.ResourceMap.retrieveAsset(fontName);
        var commonPath = "font/common";
        var commonInfo = fontInfo.evaluate(commonPath, fontInfo, null, XPathResult.ANY_TYPE, null);
        commonInfo = commonInfo.iterateNext();
        if (commonInfo === null) {
            return returnInfo;
        }
        var charHeight = commonInfo.getAttribute("base");

        var charPath = "font/chars/char[@id=" + aChar + "]";
        var charInfo = fontInfo.evaluate(charPath, fontInfo, null, XPathResult.ANY_TYPE, null);
        charInfo = charInfo.iterateNext();

        if (charInfo === null) {
            return returnInfo;
        }

        returnInfo = new CharacterInfo();
        var texInfo = this.gEngine.Textures.getTextureInfo(fontInfo.FontImage);
        var leftPixel = Number(charInfo.getAttribute("x"));
        var rightPixel = leftPixel + Number(charInfo.getAttribute("width")) - 1;
        var topPixel = (texInfo.mHeight - 1) - Number(charInfo.getAttribute("y"));
        var bottomPixel = topPixel - Number(charInfo.getAttribute("height")) + 1;

        // texture coordinate information
        returnInfo.mTexCoordLeft = leftPixel / (texInfo.mWidth - 1);
        returnInfo.mTexCoordTop = topPixel / (texInfo.mHeight - 1);
        returnInfo.mTexCoordRight = rightPixel / (texInfo.mWidth - 1);
        returnInfo.mTexCoordBottom = bottomPixel / (texInfo.mHeight - 1);

        // relative character size
        var charWidth = charInfo.getAttribute("xadvance");
        returnInfo.mXAdvance = charWidth;
        returnInfo.mCharWidth = charInfo.getAttribute("width") / charWidth;
        returnInfo.mCharHeight = charInfo.getAttribute("height") / charHeight;
        returnInfo.mCharWidthOffset = charInfo.getAttribute("xoffset") / charWidth;
        returnInfo.mCharHeightOffset = charInfo.getAttribute("yoffset") / charHeight;
        returnInfo.mCharAspectRatio = charWidth / charHeight;
        // console.log("Fonts::getCharInfo: ");
        return returnInfo;
    };
}

export { Fonts };