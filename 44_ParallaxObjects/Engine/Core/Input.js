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
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90,

    LastKeyCode: 222
};

const kMouseButton = {
    Left: 0,
    Middle: 1,
    Right: 2
};

class Input {
    constructor() {

        // Previous key state
        this.mKeyPreviousState = [];     // a new array
        // The pressed keys.
        this.mIsKeyPressed = [];
        // Click events: once an event is set, it will remain there until polled
        this.mIsKeyClicked = [];
        this.keys = kKeys;
        this.mouseButton = kMouseButton;

        // Support mouse
        this.mCanvas = null;
        this.mButtonPreviousState = [];
        this.mIsButtonPressed = [];
        this.mIsButtonClicked = [];
        this.mMousePosX = -1;
        this.mMousePosY = -1;
    };

    // Event handler functions
    _onKeyDown(event) {
        this.mIsKeyPressed[event.keyCode] = true;
    };
    _onKeyUp(event) {
        this.mIsKeyPressed[event.keyCode] = false;
    };

    _onMouseMove(event) {
        let inside = false;
        let bBox = this.mCanvas.getBoundingClientRect();
        // In Canvas Space now. Convert via ratio from canvas to client.
        let x = Math.round((event.clientX - bBox.left) * (this.mCanvas.width / bBox.width));
        let y = Math.round((event.clientY - bBox.top) * (this.mCanvas.height / bBox.height));

        if ((x >= 0) && (x < this.mCanvas.width) &&
            (y >= 0) && (y < this.mCanvas.height)) {
            this.mMousePosX = x;
            this.mMousePosY = this.mCanvas.height - 1 - y;
            inside = true;
        }
        return inside;
    };

    _onMouseDown(event) {
        if (this._onMouseMove(event)) {
            this.mIsButtonPressed[event.button] = true;
        }
    };

    _onMouseUp(event) {
        this._onMouseMove(event);
        this.mIsButtonPressed[event.button] = false;
    };

    initialize(canvasID) {
        let i;
        for (i = 0; i < kKeys.LastKeyCode; i++) {
            this.mIsKeyPressed[i] = false;
            this.mKeyPreviousState[i] = false;
            this.mIsKeyClicked[i] = false;
        }
        // register handlers 
        window.addEventListener('keyup', (event) => this._onKeyUp(event));
        window.addEventListener('keydown', (event) => this._onKeyDown(event));

        for (i = 0; i < 3; i++) {
            this.mButtonPreviousState[i] = false;
            this.mIsButtonPressed[i] = false;
            this.mIsButtonClicked[i] = false;
        }

        window.addEventListener('mousedown', (event) => this._onMouseDown(event));
        window.addEventListener('mouseup', (event) => this._onMouseUp(event));
        window.addEventListener('mousemove', (event) => this._onMouseMove(event));
        this.mCanvas = document.getElementById(canvasID);
    };

    update() {
        let i;
        for (i = 0; i < kKeys.LastKeyCode; i++) {
            this.mIsKeyClicked[i] = (!this.mKeyPreviousState[i]) && this.mIsKeyPressed[i];
            this.mKeyPreviousState[i] = this.mIsKeyPressed[i];
        }

        for (i = 0; i < 3; i++) {
            this.mIsButtonClicked[i] = (!this.mButtonPreviousState[i]) && this.mIsButtonPressed[i];
            this.mButtonPreviousState[i] = this.mIsButtonPressed[i];
        }
    };

    // Function for GameEngine programmer to test if a key is pressed down
    isKeyPressed(keyCode) {

        return this.mIsKeyPressed[keyCode];
    };

    isKeyClicked(keyCode) {
        return (this.mIsKeyClicked[keyCode]);
    };

    isButtonPressed(button) {
        return this.mIsButtonPressed[button];
    };

    isButtonClicked(button) {
        return this.mIsButtonClicked[button];
    };

    getMousePosX() { return this.mMousePosX; };
    getMousePosY() { return this.mMousePosY; };

    
}

export { Input }