class GameLoop {
    constructor(gEngine) {
        this.gEngine = gEngine;
        this.kFPS = 60;          // Frames per second
        this.kMPF = 1000 / this.kFPS; // Milliseconds per frame.

        // this.iables for timing gameloop.
        this.mPreviousTime = Date.now();
        this.mLagTime;

        // The current loop state (running or should stop)
        this.mIsLoopRunning = false;
        this.mMyGame = null;
    };

    _runLoop() {
        if (this.mIsLoopRunning) {
            // Step A: set up for next call to _runLoop and update input!
            window.requestAnimationFrame(() => this._runLoop());

            // Step B: compute how much time has elapsed since we last RunLoop was executed
            let currentTime = Date.now();
            let elapsedTime = currentTime - this.mPreviousTime;
            this.mPreviousTime = currentTime;
            this.mLagTime += elapsedTime;

            // Step C: Make sure we update the game the appropriate number of times.
            //      Update only every Milliseconds per frame.
            //      If lag larger then update frames, update until caught up.
            while ((this.mLagTime >= this.kMPF) && this.mIsLoopRunning) {
                this.gEngine.Input.update();
                this.mMyGame.update();      // call MyGame.update()
                this.mLagTime -= this.kMPF;
            }

            // Step D: now let's draw

            this.mMyGame.draw();


        } else {
            // this scene is done, unload it!
            this.mMyGame.unloadScene();
        }
    };

    // update and draw functions must be set before this.
    _startLoop() {
        // Step A: reset frame time 
        this.mPreviousTime = Date.now();
        this.mLagTime = 0.0;

        // Step B: remember that loop is now running
        this.mIsLoopRunning = true;

        // Step C: request _runLoop to start when loading is done
        requestAnimationFrame(() => { this._runLoop(); });
    };
    // update and draw functions must be set before this.
    start(myGame) {
        this.mMyGame = myGame;
        
        this.gEngine.ResourceMap.setLoadCompleteCallback(
            () => {
                this.mMyGame.initialize();
                this._startLoop();
            }
        );
    };

    //
    stop() {
        this.mIsLoopRunning = false;
    };

}
export { GameLoop }