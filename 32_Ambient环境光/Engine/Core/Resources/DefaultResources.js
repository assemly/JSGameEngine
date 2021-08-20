import { TextureShader } from "../../Shaders/TextureShader";
import { SimpleShader } from "../../Shaders/SimpleShader";
import { SpriteShader } from "../../Shaders/SpriteShader";
import { LineShader } from "../../Shaders/LineShader";
import { vec4 } from "../../Lib/gl-matrix";


class DefaultResources {
    constructor(gEngine) {
        this.gEngine = gEngine;

        // Global Ambient color
        this.mGlobalAmbientColor = [0.3, 0.3, 0.3, 1];
        this.mGlobalAmbientIntensity = 1;

        // Simple Shader
        this.kSimpleVS = "src/GLSLShaders/SimpleVS.glsl";  // Path to the VertexShader 
        this.kSimpleFS = "src/GLSLShaders/SimpleFS.glsl";  // Path to the simple FragmentShader
        this.mConstColorShader = null;

        // Texture Shader
        this.kTextureVS = "src/GLSLShaders/TextureVS.glsl";  // Path to the VertexShader 
        this.kTextureFS = "src/GLSLShaders/TextureFS.glsl";  // Path to the texture FragmentShader
        this.mTextureShader = null;
        this.mSpriteShader = null;
        this.kLineFS = "src/GLSLShaders/LineFS.glsl";        // Path to the Line FragmentShader
        this.mLineShader = null;

        // Default font
        this.kDefaultFont = "assets/fonts/system-default-font";
    }
    getGlobalAmbientIntensity() { return this.mGlobalAmbientIntensity; };
    setGlobalAmbientIntensity(v) { this.mGlobalAmbientIntensity = v; };
    getGlobalAmbientColor() { return this.mGlobalAmbientColor; };
    setGlobalAmbientColor(v) { this.mGlobalAmbientColor = vec4.fromValues(v[0], v[1], v[2], v[3]); };

    getDefaultFont() { return this.kDefaultFont; };
    getConstColorShader() { return this.mConstColorShader; };
    getTextureShader() { return this.mTextureShader; };
    getSpriteShader() { return this.mSpriteShader; };
    getLineShader() { return this.mLineShader; };

    _createShaders(callBackFunction) {
        this.gEngine.ResourceMap.setLoadCompleteCallback(null);
        this.mConstColorShader = new SimpleShader(this.gEngine, this.kSimpleVS, this.kSimpleFS);
        this.mTextureShader = new TextureShader(this.gEngine, this.kTextureVS, this.kTextureFS);
        this.mSpriteShader = new SpriteShader(this.gEngine, this.kTextureVS, this.kTextureFS);
        this.mLineShader = new LineShader(this.gEngine, this.kSimpleVS, this.kLineFS);
        console.log("DefaultResources::createShader mConstColorShader");
        callBackFunction();
    };

    initialize(callBackFunction) {
        // constant color shader: SimpleVS, and SimpleFS
        this.gEngine.TextFileLoader.loadTextFile(this.kSimpleVS, this.gEngine.TextFileLoader.eTextFileType.eTextFile);
        this.gEngine.TextFileLoader.loadTextFile(this.kSimpleFS, this.gEngine.TextFileLoader.eTextFileType.eTextFile);

        // texture shader: 
        this.gEngine.TextFileLoader.loadTextFile(this.kTextureVS, this.gEngine.TextFileLoader.eTextFileType.eTextFile);
        this.gEngine.TextFileLoader.loadTextFile(this.kTextureFS, this.gEngine.TextFileLoader.eTextFileType.eTextFile);
        console.log("DefaultResources::initialize::loadTextFileofNums: " + this.gEngine.ResourceMap.mNumOutstandingLoads);

        // Line Shader:
        this.gEngine.TextFileLoader.loadTextFile(this.kLineFS, this.gEngine.TextFileLoader.eTextFileType.eTextFile);
        // load default font
        this.gEngine.Fonts.loadFont(this.kDefaultFont);
        this.gEngine.ResourceMap.setLoadCompleteCallback(() => { this._createShaders(callBackFunction); });
    };

    // unload all resources
    cleanUp() {
        this.mConstColorShader.cleanUp();
        this.mTextureShader.cleanUp();
        this.mSpriteShader.cleanUp();

        this.gEngine.TextFileLoader.unloadTextFile(kSimpleVS);
        this.gEngine.TextFileLoader.unloadTextFile(kSimpleFS);

        // texture shader: 
        this.gEngine.TextFileLoader.unloadTextFile(kTextureVS);
        this.gEngine.TextFileLoader.unloadTextFile(kTextureFS);

        // Line Shader:
        this.gEngine.TextFileLoader.unloadTextFile(kLineFS);

        // default font
        this.gEngine.Fonts.unloadFont(kDefaultFont);
    };
}
export { DefaultResources }