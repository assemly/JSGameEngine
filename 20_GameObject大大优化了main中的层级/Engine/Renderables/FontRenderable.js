import { Transform } from "../Transform";
import { SpriteRenderable } from "./SpriteRenderable";

class FontRenderable {
    constructor(gEngine, aString) {
        this.gEngine = gEngine;
        this.mFont = this.gEngine.DefaultResources.getDefaultFont();
        this.mOneChar = new SpriteRenderable(this.gEngine, this.mFont + ".png");
        this.mXform = new Transform(); // transform that moves this object around
        this.mText = aString;
    }

    draw(aCamera) {
        // we will draw the text string by calling to mOneChar for each of the
        // chars in the mText string.
        var widthOfOneChar = this.mXform.getWidth() / this.mText.length;
        var heightOfOneChar = this.mXform.getHeight();
        // this.mOneChar.getXform().SetRotationInRad(this.mXform.getRotationInRad());
        var yPos = this.mXform.getYPos();

        // center position of the first char
        var xPos = this.mXform.getXPos() - (widthOfOneChar / 2) + (widthOfOneChar * 0.5);
        var charIndex, aChar, charInfo, xSize, ySize, xOffset, yOffset;
        for (charIndex = 0; charIndex < this.mText.length; charIndex++) {
            aChar = this.mText.charCodeAt(charIndex);
            charInfo = this.gEngine.Fonts.getCharInfo(this.mFont, aChar);

            // set the texture coordinate
            this.mOneChar.setElementUVCoordinate(charInfo.mTexCoordLeft, charInfo.mTexCoordRight,
                charInfo.mTexCoordBottom, charInfo.mTexCoordTop);

            // now the size of the char
            xSize = widthOfOneChar * charInfo.mCharWidth;
            ySize = heightOfOneChar * charInfo.mCharHeight;
            this.mOneChar.getXform().setSize(xSize, ySize);

            // how much to offset from the center
            xOffset = widthOfOneChar * charInfo.mCharWidthOffset * 0.5;
            yOffset = heightOfOneChar * charInfo.mCharHeightOffset * 0.5;

            this.mOneChar.getXform().setPosition(xPos - xOffset, yPos - yOffset);

            this.mOneChar.draw(aCamera);

            xPos += widthOfOneChar;
        }
        console.log("FontRenderable::draw: "+xPos);
    };

    getXform() { return this.mXform; };
    getText() { return this.mText; };

    setText(t) {
        this.mText = t;
        this.setTextHeight(this.getXform().getHeight());
    };

    setTextHeight(h) {
        var charInfo = this.gEngine.Fonts.getCharInfo(this.mFont, "A".charCodeAt(0)); // this is for "A"
        var w = h * charInfo.mCharAspectRatio;
        this.getXform().setSize(w * this.mText.length, h);
    };

    getFont() { return this.mFont; };
    setFont(f) {
        this.mFont = f;
        this.mOneChar.setTexture(this.mFont + ".png");
    };

    setColor(c) { this.mOneChar.setColor(c); };
    getColor() { return this.mOneChar.getColor(); };

    update() { };

    getStringWidth(h) {
        var stringWidth = 0;
        var charSize = h;
        var charIndex, aChar, charInfo;
        for (charIndex = 0; charIndex < this.mText.length; charIndex++) {
            aChar = this.mText.charCodeAt(charIndex);
            charInfo = this.gEngine.Fonts.getCharInfo(this.mFont, aChar);
            console.log("FontRenderable::getStringWidth:");
            stringWidth += charSize * charInfo.mCharWidth * charInfo.mXAdvance;
        }
        return stringWidth;
    };
}

export { FontRenderable }