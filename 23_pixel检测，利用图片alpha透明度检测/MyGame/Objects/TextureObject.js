import { GameObject } from "../../Engine/GameObjects/GameObject";
import { TextureRenderable } from "../../Engine/Renderables/TextureRenderable";

class TextureObject extends GameObject {
    constructor(gEngine, texture, x, y, w, h) {
        super()
        this.kDelta = 0.2;
        this.gEngine = gEngine;
        this.mRenderable = new TextureRenderable(gEngine, texture);
        this.mRenderable.setColor([1, 1, 1, 0.1]);
        this.mRenderable.getXform().setPosition(x, y);
        this.mRenderable.getXform().setSize(w, h);

        super.setRenderable(this.mRenderable);
    };

    update(up, down, left, right) {
        let xform = this.getXform();
        if (this.gEngine.Input.isKeyPressed(up)) {
            xform.incYPosBy(this.kDelta);
        }
        if (this.gEngine.Input.isKeyPressed(down)) {
            xform.incYPosBy(-this.kDelta);
        }
        if (this.gEngine.Input.isKeyPressed(left)) {
            xform.incXPosBy(-this.kDelta);
        }
        if (this.gEngine.Input.isKeyPressed(right)) {
            xform.incXPosBy(this.kDelta);
        }
    };
}

export { TextureObject };