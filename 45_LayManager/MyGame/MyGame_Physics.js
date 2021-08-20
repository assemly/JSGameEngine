/*
 * File: MyGame_Physics.js 
 * Relaxation support for behaviors
 */
import { Minion } from "./Objects/Minion";
import { vec2 } from "../Engine/Lib/gl-matrix";
import { GameObjectSet } from "../Engine/GameObjects/GameObjectSet";

export const MyGamePhysics = {
    _physicsSimulation,
}

function _physicsSimulation() {
    const gEngine = this.gEngine;
    // Hero platform
    gEngine.Physics.processObjSet(this.mHero, this.mAllPlatforms);

    // Hero Minion
    gEngine.Physics.processObjSet(this.mHero, this.mAllMinions);

    // Minion platform
    gEngine.Physics.processSetSet(this.mAllMinions, this.mAllPlatforms);

    // DyePack platform
    gEngine.Physics.processSetSet(this.mAllDyePacks, this.mAllPlatforms);

    // DyePack Minions
    gEngine.Physics.processSetSet(this.mAllDyePacks, this.mAllMinions);

    // Hero DyePack
    gEngine.Physics.processObjSet(this.mHero, this.mAllDyePacks);

    // Particle system collisions
   
    gEngine.Particle.processSetSet(this.mAllMinions, this.mAllParticles);
    gEngine.Particle.processSetSet(this.mAllPlatforms, this.mAllParticles);
};
