
import { ShadowReceiver } from "../Engine/Shadows/ShadowReceiver";

export const MyGameShadow = {
    _setupShadow,
}

function _setupShadow() {
    this.mBgShadow1 = new ShadowReceiver(this.gEngine, this.mBgL1);
    this.mBgShadow1.addShadowCaster(this.mIllumHero);
    this.mBgShadow1.addShadowCaster(this.mLgtHero);
    this.mBgShadow1.addShadowCaster(this.mLgtMinion);
    this.mBgShadow1.addShadowCaster(this.mIllumMinion);
};
