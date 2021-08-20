import { Core } from "./Core/Core";
import { VertexBuffer } from "./Core/VertexBuffer";
import { GameLoop } from "./Core/GameLoop";
import { Input } from "./Core/Input";
import { Physics } from "./Core/Physics";
import { Particle } from "./Core/Particle";
import { LayerManager } from "./Core/LayerManager";

import { ResourceMap } from "./Core/Resources/ResourceMap";
import { TextFileLoader } from "./Core/Resources/TextFileLoader";
import { Textures } from "./Core/Resources/Textures";
import { AudioClips } from "./Core/Resources/AudioClips";
import { DefaultResources } from "./Core/Resources/DefaultResources";
import { Fonts } from "./Core/Resources/Fonts";


class Engine {
    

    constructor() {

        this.eLayer = {
            eBackground: 0,
            eShadowReceiver: 1,
            eActors: 2,
            eFront: 3,
            eHUD: 4
        };

        this.Core = new Core(this);
        this.VertexBuffer = new VertexBuffer(this);
        this.GameLoop = new GameLoop(this);
        this.Input = new Input();
        this.ResourceMap = new ResourceMap();
        this.TextFileLoader = new TextFileLoader(this);
        this.DefaultResources = new DefaultResources(this);
        this.AudioClips = new AudioClips(this);
        this.Textures = new Textures(this);
        this.Fonts = new Fonts(this);
        this.Physics = new Physics();
        this.Particle = new Particle();
        this.LayerManager = new LayerManager(this);
    };
}

export { Engine }