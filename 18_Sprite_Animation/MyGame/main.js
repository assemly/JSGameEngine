import { Engine } from "../Engine/Engine";
import { Scene } from "../Engine/Scene";
import { Camera } from "../Engine/Camera";
import { vec2 } from "../Engine/Lib/gl-matrix";
import { SpriteRenderable } from "../Engine/Renderables/SpriteRenderable";
import { SpriteAnimateRenderable } from "../Engine/Renderables/SpriteAnimateRenderable";
import "../style.css"



class MyGame extends Scene {
    constructor(gEngine) {
        super();

        this.gEngine = gEngine;
        // textures: 
        this.kFontImage = "assets/textures/Consolas-72.png";
        this.kMinionSprite = "assets/textures/minion_sprite.png";  // Portal and Collector are embedded here

        // The camera to view the scene
        this.mCamera = null;

        // the hero and the support objects
        this.mHero = null;
        this.mPortal = null;
        this.mCollector = null;
        this.mFontImage = null;
        this.mMinion = null;


    };

    unloadScene() {
        this.gEngine.Textures.unloadTexture(this.kFontImage);
        this.gEngine.Textures.unloadTexture(this.kMinionSprite);
    };

    loadScene() {
        // loads the textures
        this.gEngine.Textures.loadTexture(this.kFontImage);
        this.gEngine.Textures.loadTexture(this.kMinionSprite);
    };
    initialize() {
        // Step A: set up the cameras
        this.mCamera = new Camera(
            this.gEngine,
            vec2.fromValues(20, 60),   // position of the camera
            20,                        // width of camera
            [0, 0, window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio]         // viewport (orgX, orgY, width, height)
        );

        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
        // sets the background to gray

        // Step B: Create the support objects
        this.mPortal = new SpriteRenderable(this.gEngine, this.kMinionSprite);
        this.mPortal.setColor([1, 0, 0, 0.2]);  // tints red
        this.mPortal.getXform().setPosition(25, 60);
        this.mPortal.getXform().setSize(3, 3);
        this.mPortal.setElementPixelPositions(130, 310, 0, 180);

        this.mCollector = new SpriteRenderable(this.gEngine, this.kMinionSprite);
        this.mCollector.setColor([0, 0, 0, 0]);  // No tinting
        this.mCollector.getXform().setPosition(15, 60);
        this.mCollector.getXform().setSize(3, 3);
        this.mCollector.setElementPixelPositions(315, 495, 0, 180);

        // Step C: Create the font and minion images using sprite
        this.mFontImage = new SpriteRenderable(this.gEngine, this.kFontImage);
        this.mFontImage.setColor([1, 1, 1, 0]);
        this.mFontImage.getXform().setPosition(13, 62);
        this.mFontImage.getXform().setSize(4, 4);


        // The right minion
        this.mRightMinion = new SpriteAnimateRenderable(this.gEngine, this.kMinionSprite);
        this.mRightMinion.setColor([1, 1, 1, 0]);
        this.mRightMinion.getXform().setPosition(26, 56.5);
        this.mRightMinion.getXform().setSize(4, 3.2);
        this.mRightMinion.setSpriteSequence(512, 0,     // first element pixel position: top-left 512 is top of image, 0 is left of image
            204, 164,       // widthxheight in pixels
            5,              // number of elements in this sequence
            0);             // horizontal padding in between
        this.mRightMinion.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
        this.mRightMinion.setAnimationSpeed(-100);
        // show each element for mAnimSpeed updates

        // the left minion
        this.mLeftMinion = new SpriteAnimateRenderable(this.gEngine, this.kMinionSprite);
        this.mLeftMinion.setColor([1, 1, 1, 0]);
        this.mLeftMinion.getXform().setPosition(15, 56.5);
        this.mLeftMinion.getXform().setSize(4, 3.2);
        this.mLeftMinion.setSpriteSequence(348, 0,      // first element pixel position: top-left 164 from 512 is top of image, 0 is left of image
            204, 164,       // widthxheight in pixels
            5,              // number of elements in this sequence
            0);             // horizontal padding in between
        this.mLeftMinion.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateRight);
        this.mLeftMinion.setAnimationSpeed(50);
        // show each element for mAnimSpeed updates


        // Step D: Create the hero object with texture from the lower-left corner 
        this.mHero = new SpriteRenderable(this.gEngine, this.kMinionSprite);
        this.mHero.setColor([1, 1, 1, 0]);
        this.mHero.getXform().setPosition(20, 60);
        this.mHero.getXform().setSize(2, 3);
        this.mHero.setElementPixelPositions(0, 120, 0, 180);


    };

    draw() {
        // Step A: clear the canvas
        this.gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        // Step  B: Activate the drawing Camera
        this.mCamera.setupViewProjection();

        // Step  C: Draw everything
        this.mPortal.draw(this.mCamera.getVPMatrix());
        this.mCollector.draw(this.mCamera.getVPMatrix());
        this.mHero.draw(this.mCamera.getVPMatrix());
        this.mFontImage.draw(this.mCamera.getVPMatrix());
        this.mRightMinion.draw(this.mCamera.getVPMatrix());
        this.mLeftMinion.draw(this.mCamera.getVPMatrix());

    };

    update() {

        let xform = this.mHero.getXform();
        let deltaX = 0.05;

        // Step A: test for white square movement
        if (this.gEngine.Input.isKeyPressed(this.gEngine.Input.keys.Right)) {
            xform.incXPosBy(deltaX);
            if (xform.getXPos() > 30) { // this is the right-bound of the window
                xform.setPosition(10, 60);
            }

        }

        if (this.gEngine.Input.isKeyPressed(this.gEngine.Input.keys.Left)) {
            xform.incXPosBy(-deltaX);
            if (xform.getXPos() < 11) {  // this is the left-bound of the window
                xform.setXPos(20);
            }
        }

        // Step  B: test for white square rotation
        if (this.gEngine.Input.isKeyClicked(this.gEngine.Input.keys.Up)) {
            xform.incRotationByDegree(1);
        }

        // continously change texture tinting
        var c = this.mPortal.getColor();
        var ca = c[3] + deltaX;
        if (ca > 1) {
            ca = 0;
        }
        c[3] = ca;

        // New update code for changing the sub-texture regions being shown"
        var deltaT = 0.001;

        // <editor-fold desc="The font image:">
        // zoom into the texture by updating texture coordinate
        // For font: zoom to the upper left corner by changing bottom right
        var texCoord = this.mFontImage.getElementUVCoordinateArray();
        // The 8 elements:
        //      mTexRight,  mTexTop,          // x,y of top-right
        //      mTexLeft,   mTexTop,
        //      mTexRight,  mTexBottom,
        //      mTexLeft,   mTexBottom

        var b = texCoord[SpriteRenderable.eTexCoordArray.eBottom] + deltaT;
        var r = texCoord[SpriteRenderable.eTexCoordArray.eRight] - deltaT;

        if (b > 1.0) {
            b = 0;
        }
        if (r < 0) {
            r = 1.0;
        }

        this.mFontImage.setElementUVCoordinate(
            texCoord[SpriteRenderable.eTexCoordArray.eLeft],
            r,
            b,
            texCoord[SpriteRenderable.eTexCoordArray.eTop]
        );

        // remember to update the minion's animation
        this.mRightMinion.updateAnimation();
        this.mLeftMinion.updateAnimation();

        // Animate left on the sprite sheet
        if (this.gEngine.Input.isKeyClicked(this.gEngine.Input.keys.One)) {
            this.mRightMinion.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateLeft);
            this.mLeftMinion.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateLeft);
        }

        // swing animation 
        if (this.gEngine.Input.isKeyClicked(this.gEngine.Input.keys.Two)) {
            this.mRightMinion.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
            this.mLeftMinion.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
        }

        // Animate right on the sprite sheet
        if (this.gEngine.Input.isKeyClicked(this.gEngine.Input.keys.Three)) {
            this.mRightMinion.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateRight);
            this.mLeftMinion.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateRight);
        }

        // decrease the duration of showing each sprite element, thereby speeding up the animation
        if (this.gEngine.Input.isKeyClicked(this.gEngine.Input.keys.Four)) {
            this.mRightMinion.incAnimationSpeed(-2);
            this.mLeftMinion.incAnimationSpeed(-2);
        }

        // increase the duration of showing each sprite element, thereby slowing down the animation
        if (this.gEngine.Input.isKeyClicked(this.gEngine.Input.keys.Five)) {
            this.mRightMinion.incAnimationSpeed(2);
            this.mLeftMinion.incAnimationSpeed(2);
        }

    };

}
const gEngine = new Engine();
const width = window.innerWidth * window.devicePixelRatio;
const height = window.innerHeight * window.devicePixelRatio;
gEngine.Core.initializeEngineCore("GLCanvas", new MyGame(gEngine), width, height);

export { MyGame }
