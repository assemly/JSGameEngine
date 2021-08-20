// 通过抛出异常使得Scene作为抽象基类
class Scene {
    constructor() {
        if (new.target === Scene) {
            throw new Error("Scene::You cant create Scene instances");
        }
    }

    // Begin Scene: must load all the scene contents
    // when done 
    //  => start the GameLoop
    // The game loop will call initialize and then Update/draw
    loadScene() {
        throw new Error("Scene::You have to implement the method loadScene!");// override to load scene specific contents
    };

    // Performs all initialization functions
    //   => Should call gEngine.GameLoop.start(this)!
    initialize() {
        throw new Error("Scene::You have to implement the method initialize!");// initialize the level (called from GameLoop)
    };

    update() {
        // when done with this level should call:
        // GameLoop.stop() ==> which will call this.unloadScene();
        throw new Error("Scene::You have to implement the method update!");
    };

    // draw function to be called from EngineCore.GameLoop
    draw() {
        throw new Error("Scene::You have to implement the method draw!");
    };

    unloadScene() {
        // .. unload all resources
        throw new Error("Scene::You have to implement the method unloadScene!");
    };
}

export { Scene };