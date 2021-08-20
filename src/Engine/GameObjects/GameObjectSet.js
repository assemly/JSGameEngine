class GameObjectSet {
    constructor() {
        this.mSet = [];
    };

    size() { return this.mSet.length; };

    getObjectAt(index) {
        return this.mSet[index];
    };

    addToSet(obj) {
        this.mSet.push(obj);
    };

    moveToLast(obj) {
        this.removeFromSet(obj);
        this.addToSet(obj);
    };
    
    removeFromSet(obj) {
        var index = this.mSet.indexOf(obj);
        if (index > -1)
            this.mSet.splice(index, 1);
    };
    update() {
        var i;
        for (i = 0; i < this.mSet.length; i++) {
            this.mSet[i].update();
        }
    };

    draw(aCamera) {
        var i;
        for (i = 0; i < this.mSet.length; i++) {
            this.mSet[i].draw(aCamera);
        }
    };
}
export { GameObjectSet };