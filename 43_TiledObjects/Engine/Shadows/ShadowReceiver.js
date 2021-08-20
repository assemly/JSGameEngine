/*
 * File: ShadowReceiver.js
 * Shadow support
 * 
 * Instance variables:
 *     mReceiver: Reference to any GameObject
 *                Treats this target for shadow receiver
 *     mCasters: Reference to an array of Renderables that are at least LightRenderable
 *     
 * Draws the mReceiver, and the shadows of mCasters on this mReceiver
 */
import { ShadowCaster } from "./ShadowCaster";

class ShadowReceiver {
    constructor(gEngine, theReceiverObject) {
        this.gEngine = gEngine;
        this.kShadowStencilBit = 0x01;              // The stencil bit to switch on/off for shadow
        this.kShadowStencilMask = 0xFF;             // The stencil mask 
        this.mReceiverShader = gEngine.DefaultResources.getShadowReceiverShader();

        this.mReceiver = theReceiverObject;

        // To support shadow drawing
        this.mShadowCaster = [];                    // array of ShadowCasters
    }

    // <editor-fold desc="support for setting and removing casters ">
    addShadowCaster(lgtRenderable) {
        var c = new ShadowCaster(this.gEngine,lgtRenderable, this.mReceiver);
        this.mShadowCaster.push(c);
    };
    // for now, cannot remove shadow casters
    // </editor-fold>

    // <editor-fold  desc="shadow drawing support">
    draw(aCamera) {
        var c;

        // draw receiver as a regular renderable
        this.mReceiver.draw(aCamera);

        this._shadowRecieverStencilOn();
        var s = this.mReceiver.getRenderable().swapShader(this.mReceiverShader);
        this.mReceiver.draw(aCamera);
        this.mReceiver.getRenderable().swapShader(s);
        this._shadowRecieverStencilOff();

        // now draw shadow color to the pixels in the stencil that are switched on
        for (c = 0; c < this.mShadowCaster.length; c++) {
            this.mShadowCaster[c].draw(aCamera);
        }

        // switch off stencil checking
        this._shadowRecieverStencilDisable();
    };

    /* 
* GL Stencil settings to support rendering to and checking of 
* the stencil buffer
*/
    _shadowRecieverStencilOn() {
        var gl = this.gEngine.Core.getGL();
        gl.clear(gl.STENCIL_BUFFER_BIT);
        gl.enable(gl.STENCIL_TEST);
        gl.colorMask(false, false, false, false);
        gl.depthMask(false);
        gl.stencilFunc(gl.NEVER, this.kShadowStencilBit, this.kShadowStencilMask);
        gl.stencilOp(gl.REPLACE, gl.KEEP, gl.KEEP);
        gl.stencilMask(this.kShadowStencilMask);
    };

    _shadowRecieverStencilOff() {
        var gl = this.gEngine.Core.getGL();
        gl.depthMask(gl.TRUE);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
        gl.stencilFunc(gl.EQUAL, this.kShadowStencilBit, this.kShadowStencilMask);
        gl.colorMask(true, true, true, true);
    };

    _shadowRecieverStencilDisable() {
        var gl = this.gEngine.Core.getGL();
        gl.disable(gl.STENCIL_TEST);
    };
}


export { ShadowReceiver }