import { GameObject } from "../../Engine/GameObjects/GameObject";
import { SpriteRenderable } from "../../Engine/Renderables/SpriteRenderable";
import {vec2} from "../../Engine/Lib/gl-matrix";

class Brain extends GameObject {
    constructor(gEngine, spriteTexture) {
        super();
        this.gEngine = gEngine;
        this.kDeltaDegree = 1;
        this.kDeltaRad = Math.PI * this.kDeltaDegree / 180;
        this.kDeltaSpeed = 0.01;
        this.mBrain = new SpriteRenderable(gEngine, spriteTexture);
        this.mBrain.setColor([1, 1, 1, 0]);
        this.mBrain.getXform().setPosition(50, 10);
        this.mBrain.getXform().setSize(3, 5.4);
        this.mBrain.setElementPixelPositions(600, 700, 0, 180);
        super.setRenderable(this.mBrain);
        this.setSpeed(0.05);
    };

    update () {
        super.update();  // default moving forward

        let xf = this.getXform();
        let fdir = this.getCurrentFrontDir();
        if (this.gEngine.Input.isKeyPressed(this.gEngine.Input.keys.Left)) {
            xf.incRotationByDegree(this.kDeltaDegree);
            vec2.rotateA(fdir, fdir, this.kDeltaRad);
        }
        if (this.gEngine.Input.isKeyPressed(this.gEngine.Input.keys.Right)) {
            xf.incRotationByRad(-this.kDeltaRad);
            vec2.rotateA(fdir, fdir, -this.kDeltaRad);
        }
        if (this.gEngine.Input.isKeyClicked(this.gEngine.Input.keys.Up)) {
            this.incSpeedBy(this.kDeltaSpeed);
        }
        if (this.gEngine.Input.isKeyClicked(this.gEngine.Input.keys.Down)) {
            this.incSpeedBy(-this.kDeltaSpeed);
        }
    };
};

export { Brain };