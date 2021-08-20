import { TextureShader } from "../../Shaders/TextureShader";
import { SimpleShader } from "../../Shaders/SimpleShader";


class DefaultResources {
    constructor(gEngine) {
        this.gEngine = gEngine;
        // Simple Shader
        this.kSimpleVS = "src/GLSLShaders/SimpleVS.glsl";  // Path to the VertexShader 
        this.kSimpleFS = "src/GLSLShaders/SimpleFS.glsl";  // Path to the simple FragmentShader
        this.mConstColorShader = null;

        // Texture Shader
        this.kTextureVS = "src/GLSLShaders/TextureVS.glsl";  // Path to the VertexShader 
        this.kTextureFS = "src/GLSLShaders/TextureFS.glsl";  // Path to the texture FragmentShader
        this.mTextureShader = null;
    }

    getConstColorShader() { return this.mConstColorShader; };
    getTextureShader() { return this.mTextureShader; };
    _createShaders(callBackFunction) {
        this.mConstColorShader = new SimpleShader(this.gEngine, this.kSimpleVS, this.kSimpleFS);
        this.mTextureShader = new TextureShader(this.gEngine,this.kTextureVS,this.kTextureFS);
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
        this.gEngine.ResourceMap.setLoadCompleteCallback(() => { this._createShaders(callBackFunction); });
    };
}
export { DefaultResources }