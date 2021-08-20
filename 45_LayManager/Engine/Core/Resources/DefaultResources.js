import { TextureShader } from "../../Shaders/TextureShader";
import { SimpleShader } from "../../Shaders/SimpleShader";
import { SpriteShader } from "../../Shaders/SpriteShader";
import { LineShader } from "../../Shaders/LineShader";
import { LightShader } from "../../Shaders/LightShader";
import { IllumShader } from "../../Shaders/IllumShader";
import { ShadowCasterShader } from "../../Shaders/ShadowCasterShader";
import { vec4 } from "../../Lib/gl-matrix";


class DefaultResources {
    constructor(gEngine) {
        this.gEngine = gEngine;

        // Global Ambient color
        this.mGlobalAmbientColor = [0.8, 0.8, 0.8, 1];
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

        // Light Shader
        this.kLightFS = "src/GLSLShaders/LightFS.glsl";  // Path to the Light FragmentShader
        this.mLightShader = null;

        // Illumination Shader
        this.kIllumFS = "src/GLSLShaders/IllumFS.glsl";  // Path to the Illumination FragmentShader
        this.mIllumShader = null;

        // Shadow shaders
        this.kShadowReceiverFS = "src/GLSLShaders/ShadowReceiverFS.glsl";  // Path to the FragmentShader
        this.mShadowReceiverShader = null;
        this.kShadowCasterFS = "src/GLSLShaders/ShadowCasterFS.glsl";  // Path to the FragmentShader
        this.mShadowCasterShader = null;

        // Particle shader
        this.kParticleFS = "src/GLSLShaders/ParticleFS.glsl";
        this.mParticleShader = null;

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
    getLightShader() { return this.mLightShader; };
    getIllumShader() { return this.mIllumShader; };
    getShadowReceiverShader() { return this.mShadowReceiverShader; };
    getShadowCasterShader() { return this.mShadowCasterShader; };
    getParticleShader() { return this.mParticleShader };


    _createShaders(callBackFunction) {
        this.gEngine.ResourceMap.setLoadCompleteCallback(null);
        this.mConstColorShader = new SimpleShader(this.gEngine, this.kSimpleVS, this.kSimpleFS);
        this.mTextureShader = new TextureShader(this.gEngine, this.kTextureVS, this.kTextureFS);
        this.mSpriteShader = new SpriteShader(this.gEngine, this.kTextureVS, this.kTextureFS);
        this.mLineShader = new LineShader(this.gEngine, this.kSimpleVS, this.kLineFS);
        this.mLightShader = new LightShader(this.gEngine, this.kTextureVS, this.kLightFS);
        this.mIllumShader = new IllumShader(this.gEngine, this.kTextureVS, this.kIllumFS);
        this.mShadowReceiverShader = new SpriteShader(this.gEngine, this.kTextureVS, this.kShadowReceiverFS);
        this.mShadowCasterShader = new ShadowCasterShader(this.gEngine, this.kTextureVS, this.kShadowCasterFS);
        this.mParticleShader = new TextureShader(this.gEngine, this.kTextureVS, this.kParticleFS);
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

        // Light Shader
        this.gEngine.TextFileLoader.loadTextFile(this.kLightFS, this.gEngine.TextFileLoader.eTextFileType.eTextFile);

        // Illumination Shader
        this.gEngine.TextFileLoader.loadTextFile(this.kIllumFS, this.gEngine.TextFileLoader.eTextFileType.eTextFile);

        // Shadow caster and receiver shaders
        this.gEngine.TextFileLoader.loadTextFile(this.kShadowReceiverFS, this.gEngine.TextFileLoader.eTextFileType.eTextFile);
        this.gEngine.TextFileLoader.loadTextFile(this.kShadowCasterFS, this.gEngine.TextFileLoader.eTextFileType.eTextFile);

        // particle shader
        this.gEngine.TextFileLoader.loadTextFile(this.kParticleFS, this.gEngine.TextFileLoader.eTextFileType.eTextFile);

        // load default font
        this.gEngine.Fonts.loadFont(this.kDefaultFont);
        this.gEngine.ResourceMap.setLoadCompleteCallback(() => { this._createShaders(callBackFunction); });
    };

    // unload all resources
    cleanUp() {
        this.mConstColorShader.cleanUp();
        this.mTextureShader.cleanUp();
        this.mSpriteShader.cleanUp();
        this.mLineShader.cleanUp();
        this.mLightShader.cleanUp();
        this.mIllumShader.cleanUp();

        this.gEngine.TextFileLoader.unloadTextFile(this.kSimpleVS);
        this.gEngine.TextFileLoader.unloadTextFile(this.kSimpleFS);

        // texture shader: 
        this.gEngine.TextFileLoader.unloadTextFile(this.kTextureVS);
        this.gEngine.TextFileLoader.unloadTextFile(this.kTextureFS);

        // Line Shader:
        this.gEngine.TextFileLoader.unloadTextFile(this.kLineFS);

        // Light Shader
        this.gEngine.TextFileLoader.unloadTextFile(this.kLightFS);

        // Illumination Shader
        this.gEngine.TextFileLoader.unloadTextFile(this.kIllumFS);

        // Shadow shaders
        this.gEngine.TextFileLoader.unloadTextFile(this.kShadowReceiverFS, this.gEngine.TextFileLoader.eTextFileType.eTextFile);
        this.gEngine.TextFileLoader.unloadTextFile(this.kShadowCasterFS, this.gEngine.TextFileLoader.eTextFileType.eTextFile);

        // particle shader
        this.gEngine.TextFileLoader.unloadTextFile(this.kParticleFS);

        // default font
        this.gEngine.Fonts.unloadFont(this.kDefaultFont);
    };
}
export { DefaultResources }