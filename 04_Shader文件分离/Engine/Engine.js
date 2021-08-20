import {Core} from "./Core";
import {VertexBuffer} from "./VertexBuffer";

class Engine {
    constructor(){
        this.Core = new Core(this);
        this.VertexBuffer = new VertexBuffer(this);
    }
}

export {Engine}