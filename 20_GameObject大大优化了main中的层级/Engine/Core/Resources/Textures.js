class TextureInfo {
    constructor(name, w, h, id) {
        this.mName = name;
        this.mWidth = w;
        this.mHeight = h;
        this.mGLTexID = id;
    }
}
class Textures {
    constructor(gEngine) {
        this.gEngine = gEngine;
        this.gl = gEngine.Core.getGL();
    }

    _processLoadedImage(textureName, image) {
        
        this.gl = this.gEngine.Core.getGL();
        // Generate a texture reference to the webGL context
        var textureID = this.gl.createTexture();

        // bind the texture reference with the current texture functionality in the webGL
        this.gl.bindTexture(this.gl.TEXTURE_2D, textureID);

        // Load the texture into the texture data structure with descriptive info.
        // Parameters:
        //  1: Which "binding point" or target the texture is being loaded to.
        //  2: Level of detail. Used for mipmapping. 0 is base texture level.
        //  3: Internal format. The composition of each element. i.e. pixels.
        //  4: Format of texel data. Must match internal format.
        //  5: The data type of the texel data.
        //  6: Texture Data.
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);

        // Creates a mipmap for this texture.
        this.gl.generateMipmap(this.gl.TEXTURE_2D);

        // Tells WebGL that we are done manipulating data at the mGL.TEXTURE_2D target.
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);

        var texInfo = new TextureInfo(textureName, image.naturalWidth, image.naturalHeight, textureID);
        this.gEngine.ResourceMap.asyncLoadCompleted(textureName, texInfo);
    };

    // Loads an texture so that it can be drawn.
    // If already in the map, will do nothing.
    loadTexture(textureName) {
        if (!(this.gEngine.ResourceMap.isAssetLoaded(textureName))) {
            // Create new Texture object.
            var img = new Image();

            // Update resources in loading counter.
            this.gEngine.ResourceMap.asyncLoadRequested(textureName);

            // When the texture loads, convert it to the WebGL format then put
            // it back into the mTextureMap.
            
            img.onload = () => {
                this._processLoadedImage(textureName, img);
            };
            img.src = textureName;
        } else {
            this.gEngine.ResourceMap.incAssetRefCount(textureName);
        }
    };
    // Remove the reference to allow associated memory 
    // be available for subsequent garbage collection
    unloadTexture(textureName) {
        
        var texInfo = this.gEngine.ResourceMap.retrieveAsset(textureName);
        this.gl.deleteTexture(texInfo.mGLTexID);
        this.gEngine.ResourceMap.unloadAsset(textureName);
    };

    activateTexture(textureName) {
        this.gl = this.gEngine.Core.getGL();
        var texInfo = this.gEngine.ResourceMap.retrieveAsset(textureName);
        console.log("Textures::activateTexture() ");
        if (!this.gl) return;
        // Binds our texture reference to the current webGL texture functionality
        this.gl.bindTexture(this.gl.TEXTURE_2D, texInfo.mGLTexID);

        // To prevent texture wrappings
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

        // Handles how magnification and minimization filters will work.
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_LINEAR);

        // For pixel-graphics where you want the texture to look "sharp" do the following:
        // this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        // this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    };

    deactivateTexture() {
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    };

    getTextureInfo(textureName) {
        return this.gEngine.ResourceMap.retrieveAsset(textureName);
    };


}

export { Textures };