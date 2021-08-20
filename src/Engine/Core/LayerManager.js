/*
 * File: Engine_LayerManager.js 
 * Central storage for all elements that would be drawn 
 */
/*jslint node: true, vars: true, white: true*/
/*global GameObjectSet */
/* find out more about jslint: http://www.jslint.com/help.html */
import { GameObjectSet } from "../GameObjects/GameObjectSet";

class LayerManager {


    
    constructor(gEngine) {
        // instance variables
        this.gEngine = gEngine;
        this.kNumLayers = 5;
        this.mAllLayers = [];
    }

    initialize() {
        this.mAllLayers[this.gEngine.eLayer.eBackground] = new GameObjectSet();
        this.mAllLayers[this.gEngine.eLayer.eShadowReceiver] = new GameObjectSet();
        this.mAllLayers[this.gEngine.eLayer.eActors] = new GameObjectSet();
        this.mAllLayers[this.gEngine.eLayer.eFront] = new GameObjectSet();
        this.mAllLayers[this.gEngine.eLayer.eHUD] = new GameObjectSet();
    };

    cleanUp() {
        this.initialize();
    };

    drawAllLayers(aCamera) {
        var i;
        for (i = 0; i < this.kNumLayers; i++) {
            this.mAllLayers[i].draw(aCamera);
        }
    };

    updateAllLayers() {
        var i;
        for (i = 0; i < this.kNumLayers; i++) {
            this.mAllLayers[i].update();
        }
    };


    // operations on the layers
    drawLayer(layerEnum, aCamera) {
        this.mAllLayers[layerEnum].draw(aCamera);
    };
    updateLayer(layerEnum) {
        this.mAllLayers[layerEnum].update();
    };
    addToLayer(layerEnum, obj) {
        this.mAllLayers[layerEnum].addToSet(obj);
    };
    addAsShadowCaster(obj) {
        var i;
        for (i = 0; i < this.mAllLayers[this.gEngine.eLayer.eShadowReceiver].size(); i++) {
            this.mAllLayers[this.gEngine.eLayer.eShadowReceiver].getObjectAt(i).addShadowCaster(obj);
        }
    };
    removeFromLayer(layerEnum, obj) {
        this.mAllLayers[layerEnum].removeFromSet(obj);
    };
    moveToLayerFront(layerEnum, obj) {
        this.mAllLayers[layerEnum].moveToLast(obj);
    };
    layerSize(layerEnum) {
        return this.mAllLayers[layerEnum].size();
    };


}

export { LayerManager };