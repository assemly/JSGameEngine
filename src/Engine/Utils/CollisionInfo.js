/* 
 * File: CollisionInfo.js
 *      normal: vector upon which collision interpenetrates
 *      depth: how much penetration
 */
import {vec2} from "../Lib/gl-matrix";

class CollisionInfo {

    constructor() {
        this.mDepth = 0;
        this.mNormal = vec2.fromValues(0, 0);
    };

    setDepth(s) { this.mDepth = s; };
    setNormal(s) { this.mNormal = s; };

    getDepth() { return this.mDepth; };
    getNormal() { return this.mNormal; };
}

export { CollisionInfo };