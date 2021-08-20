import { GameObject } from "../../Engine/GameObjects/GameObject";
import { SpriteRenderable } from "../../Engine/Renderables/SpriteRenderable"

class DyePack extends GameObject {
    constructor(gEngine,spriteTexture) {
        super()
        this.kRefWidth = 80;
        this.kRefHeight = 130;

        this.mDyePack = new SpriteRenderable(gEngine,spriteTexture);
        this.mDyePack.setColor([1, 1, 1, 0.1]);
        this.mDyePack.getXform().setPosition(50, 33);
        this.mDyePack.getXform().setSize(this.kRefWidth / 50, this.kRefHeight / 50);
        this.mDyePack.setElementPixelPositions(510, 595, 23, 153);

        super.setRenderable(this.mDyePack);
    };
}

export { DyePack };