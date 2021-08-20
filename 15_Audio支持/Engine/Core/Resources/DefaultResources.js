import { SimpleShader} from "../../SimpleShader";


class DefaultResources {
    constructor(gEngine) {
        this.gEngine = gEngine;
        
        this.kSimpleVS = "src/GLSLShaders/SimpleVS.glsl";  // Path to the VertexShader 
        this.kSimpleFS = "src/GLSLShaders/SimpleFS.glsl";  // Path to the simple FragmentShader
        this.mConstColorShader = null;
    }

    getConstColorShader() { return this.mConstColorShader; };

    _createShaders(callBackFunction) {
        this.mConstColorShader = new SimpleShader(this.gEngine,this.kSimpleVS, this.kSimpleFS);
        console.log("DefaultResources::createShader mConstColorShader");
        callBackFunction();
    };

    initialize(callBackFunction) {
        // constant color shader: SimpleVS, and SimpleFS
        this.gEngine.TextFileLoader.loadTextFile(this.kSimpleVS, this.gEngine.TextFileLoader.eTextFileType.eTextFile);
        this.gEngine.TextFileLoader.loadTextFile(this.kSimpleFS, this.gEngine.TextFileLoader.eTextFileType.eTextFile);
        console.log("DefaultResources::initialize::loadTextFileofNums: "+ this.gEngine.ResourceMap.mNumOutstandingLoads);
        this.gEngine.ResourceMap.setLoadCompleteCallback(()=> { this._createShaders(callBackFunction); });
    };
}
export { DefaultResources }