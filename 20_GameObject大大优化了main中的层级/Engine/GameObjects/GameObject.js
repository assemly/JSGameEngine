class GameObject {
    constructor() {
        this.mRenderComponent = null;
    };

    
    getXform() { return this.mRenderComponent.getXform(); };

    update() { };

    getRenderable() { return this.mRenderComponent; };

    setRenderable(renderableObj) { this.mRenderComponent = renderableObj; };
    
    draw(aCamera) { this.mRenderComponent.draw(aCamera); };
}
export { GameObject }