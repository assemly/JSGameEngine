import { Core } from "./Core/Core";
import { VertexBuffer } from "./Core/VertexBuffer";
import { GameLoop } from "./Core/GameLoop";
import { Input } from "./Core/Input";
import { ResourceMap } from "./Core/Resources/ResourceMap";
import {TextFileLoader} from "./Core/Resources/TextFileLoader";
import { DefaultResources } from "./Core/Resources/DefaultResources";

class Engine {
    constructor() {
        this.Core = new Core(this);
        this.VertexBuffer = new VertexBuffer(this);
        this.GameLoop = new GameLoop(this);
        this.Input = new Input();
        this.ResourceMap = new ResourceMap();
        this.TextFileLoader = new TextFileLoader(this);
        this.DefaultResources = new DefaultResources(this);
    };
}

export { Engine }