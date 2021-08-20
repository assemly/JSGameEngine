import { Core } from "./Core/Core";
import { VertexBuffer } from "./Core/VertexBuffer";
import { GameLoop } from "./Core/GameLoop";
import { Input } from "./Core/Input";

class Engine {
    constructor() {
        this.Core = new Core(this);
        this.VertexBuffer = new VertexBuffer(this);
        this.GameLoop = new GameLoop(this);
        this.Input = new Input(this);
    };
}

export { Engine }