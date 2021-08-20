class MapEntry {
    constructor(rName) {
        this.mAsset = rName;
        this.mRefCount = 1;
    }
};

class ResourceMap {
    constructor() {
        // Number of outstanding load operations
        this.mNumOutstandingLoads = 0;

        // Callback function when all textures are loaded
        this.mLoadCompleteCallback = null;

        // Resource storage
        this.mResourceMap = {};
    }

    isAssetLoaded(rName) {
        return (rName in this.mResourceMap);
    };
    /*
    * Register one more resource to load
    */
    asyncLoadRequested(rName) {
        this.mResourceMap[rName] = new MapEntry(rName); // place holder for the resource to be loaded
        ++this.mNumOutstandingLoads;
    };

    asyncLoadCompleted(rName, loadedAsset) {
        console.log("ResourceMap :: asyncLoadCompleted************: " + this.mNumOutstandingLoads);
        if (!this.isAssetLoaded(rName)) {
            console.log("ResourceMap:: gEngine.asyncLoadCompleted: [" + rName + "] not in map!");
        }
        this.mResourceMap[rName].mAsset = loadedAsset;
        --this.mNumOutstandingLoads;
        this._checkForAllLoadCompleted();
    };

    _checkForAllLoadCompleted() {
        if ((this.mNumOutstandingLoads === 0) && (this.mLoadCompleteCallback !== null)) {
            // ensures the load complete call back will only be called once!
            var funToCall = this.mLoadCompleteCallback;
            this.mLoadCompleteCallback = null;
            funToCall();

        }
        console.log("ResourceMap::_checkForAllLoadCompleted")
    };

    // Make sure to set the callback _AFTER_ all load commands are issued
    setLoadCompleteCallback(funct) {
        this.mLoadCompleteCallback = funct;
        // in case all loading are done
        console.log("ResourceMap::setLoadCompleteCallback::" )
        this._checkForAllLoadCompleted();
    };

    retrieveAsset(rName) {
        var r = null;
        if (rName in this.mResourceMap) {
            r = this.mResourceMap[rName].mAsset;
        } else {
            console.log("ResourceMap:: gEngine.retrieveAsset: [" + rName + "] not in map!");
        }
        return r;
    };

    incAssetRefCount(rName) {
        this.mResourceMap[rName].mRefCount += 1;
    };

    unloadAsset(rName) {
        let c;
        if (rName in this.mResourceMap) {
            this.mResourceMap[rName].mRefCount -= 1;
            c = this.mResourceMap[rName].mRefCount;
            if (c === 0) {
                delete this.mResourceMap[rName];
            }
        }
        console.log("ResourceMap::unloadAsset: "+c);
        return c;
    };
}

export { ResourceMap }