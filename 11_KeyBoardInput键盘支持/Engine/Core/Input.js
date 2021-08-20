const kKeys = {
    // arrows
    Left: 37,
    Up: 38,
    Right: 39,
    Down: 40,

    // space bar
    Space: 32,

    // numbers 
    Zero: 48,
    One: 49,
    Two: 50,
    Three: 51,
    Four: 52,
    Five: 53,
    Six: 54,
    Seven: 55,
    Eight: 56,
    Nine: 57,

    // Alphabets
    A: 65,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    R: 82,
    S: 83,
    W: 87,

    LastKeyCode: 222
};
class Input {
    constructor(gEngine) {
        this.gEngine = gEngine;
        // Previous key state
        this.mKeyPreviousState = [];     // a new array
        // The pressed keys.
        this.mIsKeyPressed = [];
        // Click events: once an event is set, it will remain there until polled
        this.mIsKeyClicked = [];
        this.keys = kKeys;
    };

    // Event handler functions
    _onKeyDown(event) {
        this.mIsKeyPressed[event.keyCode] = true;
    };
    _onKeyUp(event) {
        this.mIsKeyPressed[event.keyCode] = false;
    };

    initialize() {
        let i;
        for (i = 0; i < kKeys.LastKeyCode; i++) {
            this.mIsKeyPressed[i] = false;
            this.mKeyPreviousState[i] = false;
            this.mIsKeyClicked[i] = false;
        }
        // register handlers 
        window.addEventListener('keyup', (event)=>this._onKeyUp(event));
        window.addEventListener('keydown',(event)=>this._onKeyDown(event));
    };

    update() {
        let i;
        for (i = 0; i < kKeys.LastKeyCode; i++) {
            this.mIsKeyClicked[i] = (!this.mKeyPreviousState[i]) && this.mIsKeyPressed[i];
            this.mKeyPreviousState[i] = this.mIsKeyPressed[i];
        }
    };

    // Function for GameEngine programmer to test if a key is pressed down
    isKeyPressed(keyCode) {
        
        return this.mIsKeyPressed[keyCode];
    };

    isKeyClicked (keyCode) {
        return (this.mIsKeyClicked[keyCode]);
    };

}

export { Input }