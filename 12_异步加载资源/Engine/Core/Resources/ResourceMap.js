class MapEntry{
    constructor(rName){
    this.mAsset = rName;
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

    asyncLoadCompleted (rName, loadedAsset) {
        console.log("ResourceMap :: asyncLoadCompleted************" + this.mNumOutstandingLoads);
        if (!this.isAssetLoaded(rName)) {
            alert("gEngine.asyncLoadCompleted: [" + rName + "] not in map!");
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
        console.log("ResourceMap::setLoadCompleteCallback::"+this.mLoadCompleteCallback)
        this._checkForAllLoadCompleted();
    };

    retrieveAsset(rName) {
        var r = null;
        if (rName in this.mResourceMap) {
            r = this.mResourceMap[rName].mAsset;
        } else {
            alert("gEngine.retrieveAsset: [" + rName + "] not in map!");
        }
        return r;
    };

    unloadAsset(rName) {
        if (rName in this.mResourceMap) {
            delete this.mResourceMap[rName];
        }
    };
}

export { ResourceMap }