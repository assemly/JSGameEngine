import { Core } from "./Core/Core";
import { VertexBuffer } from "./Core/VertexBuffer";

class Engine {
    constructor() {
        this.Core = new Core(this);
        this.VertexBuffer = new VertexBuffer(this);
    };
}

export { Engine }