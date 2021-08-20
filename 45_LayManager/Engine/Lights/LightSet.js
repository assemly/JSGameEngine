/* File: LightSet.js 
 *
 * Support for working with a set of Lights
 */

class LightSet {
    constructor() {
        this.mSet = [];
    };

    numLights() { return this.mSet.length; };

    getLightAt(index) {
        return this.mSet[index];
    };

    addToSet(light) {
        this.mSet.push(light);
    };
}

export { LightSet }