class SimpleShader {
    constructor(gEngine, vertexShaderFilePath, fragmentShaderFilePath) {
        // instance variables
        // Convention: all instance variables: mVariables
        this.mCompiledShader = null;  // reference to the compiled shader in webgl context  
        this.mShaderVertexPositionAttribute = null; // reference to SquareVertexPosition within the shader
        this.gEngine = gEngine;
        this.gl = gEngine.Core.getGL();
        this.mPixelColor = null; //reference to the pixelColor uniform in the fragment shader
        this.mModelTransform = null;
        this.mViewProjTransform = null;
        // start of constructor code
        // 
        // Step A: load and compile vertex and fragment shaders
        var vertexShader = this._compileShader(vertexShaderFilePath, this.gl.VERTEX_SHADER);
        var fragmentShader = this._compileShader(fragmentShaderFilePath, this.gl.FRAGMENT_SHADER);

        // Step B: Create and link the shaders into a program.
        this.mCompiledShader = this.gl.createProgram();
        this.gl.attachShader(this.mCompiledShader, vertexShader);
        this.gl.attachShader(this.mCompiledShader, fragmentShader);
        this.gl.linkProgram(this.mCompiledShader);

        // Step C: check for error
        if (!this.gl.getProgramParameter(this.mCompiledShader, this.gl.LINK_STATUS)) {
            alert("Error linking shader");
            return null;
        }

        // Step D: Gets a reference to the aSquareVertexPosition attribute within the shaders.
        this.mShaderVertexPositionAttribute = this.gl.getAttribLocation(
            this.mCompiledShader, "aSquareVertexPosition");

        // Step E: Activates the vertex buffer loaded in EngineCore_VertexBuffer.js
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, gEngine.VertexBuffer.getGLVertexRef());

        // Step F: Describe the characteristic of the vertex position attribute
        this.gl.vertexAttribPointer(this.mShaderVertexPositionAttribute,
            3,              // each element is a 3-float (x,y.z)
            this.gl.FLOAT,       // data type is FLOAT
            false,          // if the content is normalized vectors
            0,              // number of bytes to skip in between elements
            0);

        // Step G: Gets a reference to the uniform variable uPixelColor in the
        // fragment shader
        this.mPixelColor = this.gl.getUniformLocation(this.mCompiledShader, "uPixelColor");
        this.mModelTransform = this.gl.getUniformLocation(this.mCompiledShader, "uModelTransform");
        this.mViewProjTransform = this.gl.getUniformLocation(this.mCompiledShader, "uViewProjTransform");
    }

    getShader() { return this.mCompiledShader; };

    activateShader(pixelColor, vpMatrix) {
        this.gl.useProgram(this.mCompiledShader);
        this.gl.uniformMatrix4fv(this.mViewProjTransform, false, vpMatrix);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.gEngine.VertexBuffer.getGLVertexRef());
        this.gl.vertexAttribPointer(this.mShaderVertexPositionAttribute,
            3,              // each element is a 3-float (x,y.z)
            this.gl.FLOAT,       // data type is FLOAT
            false,          // if the content is normalized vectors
            0,              // number of bytes to skip in between elements
            0);             // offsets to the first element
        this.gl.enableVertexAttribArray(this.mShaderVertexPositionAttribute);
        this.gl.uniform4fv(this.mPixelColor, pixelColor);
    };


    // Loads per-object model transform to the vertex shader
    loadObjectTransform(modelTransform) {
        this.gl.uniformMatrix4fv(this.mModelTransform, false, modelTransform);
    };

    _loadAndCompileShader(file, shaderType) {
        var shaderSource, compiledShader;


        // Step A: Get the shader source from index.html
        //shaderText = document.getElementById(id);
        shaderSource = file;
        // console.log(shaderSource);

        // Step B: Create the shader based on the shader type: vertex or fragment
        compiledShader = this.gl.createShader(shaderType);

        // Step C: Compile the created shader
        this.gl.shaderSource(compiledShader, shaderSource);
        this.gl.compileShader(compiledShader);

        // Step D: check for errors and return results (null if error)
        // The log info is how shader compilation errors are typically displayed.
        // This is useful for debugging the shaders.
        if (!this.gl.getShaderParameter(compiledShader, this.gl.COMPILE_STATUS)) {
            alert("A shader compiling error occurred: " + this.gl.getShaderInfoLog(compiledShader));
        }

        return compiledShader;
    };

    _compileShader(filePath, shaderType) {
        var gl = this.gEngine.Core.getGL();
        var shaderSource = null, compiledShader = null;

        // Step A: Access the shader textfile
        shaderSource = this.gEngine.ResourceMap.retrieveAsset(filePath);

        if (shaderSource === null) {
            alert("WARNING: Loading of:" + filePath + " Failed!");
            return null;
        }

        // Step B: Create the shader based on the shader type: vertex or fragment
        compiledShader = this.gl.createShader(shaderType);

        // Step C: Compile the created shader
        this.gl.shaderSource(compiledShader, shaderSource);
        this.gl.compileShader(compiledShader);

        // Step D: check for errors and return results (null if error)
        // The log info is how shader compilation errors are typically displayed.
        // This is useful for debugging the shaders.
        if (!this.gl.getShaderParameter(compiledShader, this.gl.COMPILE_STATUS)) {
            alert("A shader compiling error occurred: " + this.gl.getShaderInfoLog(compiledShader));
        }

        return compiledShader;
    };
}

export { SimpleShader }