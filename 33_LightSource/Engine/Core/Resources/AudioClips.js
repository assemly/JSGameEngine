class AudioClips {
    constructor(gEngine) {
        this.gEngine = gEngine;
        this.mAudioContext = null;
        this.mBgAudioNode = null;
    };

    initAudioContext() {
        try {
            let AudioContext = window.AudioContext || window.webkitAudioContext;
            this.mAudioContext = new AudioContext();
        } catch (e) { alert("Web Audio Is not supported."); }
    };

    loadAudio(clipName) {
        if (!(this.gEngine.ResourceMap.isAssetLoaded(clipName))) {
            // Update resources in load counter.
            this.gEngine.ResourceMap.asyncLoadRequested(clipName);

            // Asynchronously request the data from server.
            var req = new XMLHttpRequest();
            req.onreadystatechange = () => {
                if ((req.readyState === 4) && (req.status !== 200)) {
                    alert(clipName + ": loading failed! [Hint: you cannot double click index.html to run this project. " +
                        "The index.html file must be loaded by a web-server.]");
                }
            };
            req.open('GET', clipName, true);
            // Specify that the request retrieves binary data.
            req.responseType = 'arraybuffer';

            req.onload = () => {
                // Asynchronously decode, then call the function in parameter.

                this.mAudioContext.decodeAudioData(req.response,
                    (buffer) => {
                        this.gEngine.ResourceMap.asyncLoadCompleted(clipName, buffer);
                    }
                );
            };
            req.send();
        } else {
            this.gEngine.ResourceMap.incAssetRefCount(clipName);
        }
    };

    unloadAudio(clipName) {
        this.gEngine.ResourceMap.unloadAsset(clipName);
    };

    playACue(clipName) {
        let clipInfo = this.gEngine.ResourceMap.retrieveAsset(clipName);
        if (clipInfo !== null) {
            // SourceNodes are one use only.
            var sourceNode = this.mAudioContext.createBufferSource();
            sourceNode.buffer = clipInfo;
            sourceNode.connect(this.mAudioContext.destination);
            sourceNode.start(0);
        }
    };

    playBackgroundAudio(clipName) {

        var clipInfo = this.gEngine.ResourceMap.retrieveAsset(clipName);
        console.log("clipInfo");
        //console.log(clipInfo)
        if (clipInfo !== null && typeof (clipInfo) !== "string") {
            //console.log("AudioClips::playBackgroundAudio::clipInfo: " + typeof (clipInfo));
            // Stop audio if playing.
            this.stopBackgroundAudio();

            this.mBgAudioNode = this.mAudioContext.createBufferSource();
            // console.log("AudioClips::playBackgroundAudio: " + typeof (this.mBgAudioNode));
            this.mBgAudioNode.buffer = clipInfo;
            this.mBgAudioNode.connect(this.mAudioContext.destination);
            this.mBgAudioNode.loop = true;
            this.mBgAudioNode.start(0);
        }
    };

    stopBackgroundAudio() {
        // Check if the audio is  playing.
        if (this.mBgAudioNode !== null) {
            this.mBgAudioNode.stop(0);
            this.mBgAudioNode = null;
        }
    };

    isBackgroundAudioPlaying() {
        return (this.mBgAudioNode !== null);
    };

};
export { AudioClips }