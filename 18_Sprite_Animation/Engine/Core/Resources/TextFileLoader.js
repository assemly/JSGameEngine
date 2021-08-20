
const eTextFileType = {
    eXMLFile: 0,
    eTextFile: 1
};

class TextFileLoader {
    constructor(gEngine) {
        this.gEngine = gEngine;
        this.eTextFileType = eTextFileType;
    }

    loadTextFile(fileName, fileType, callbackFunction) {
        if (!(this.gEngine.ResourceMap.isAssetLoaded(fileName))) {
            // Update resources in load counter.
            this.gEngine.ResourceMap.asyncLoadRequested(fileName);

            // Asynchronously request the data from server.
            let req = new XMLHttpRequest();
            req.onreadystatechange = () => {
                if ((req.readyState === 4) && (req.status !== 200)) {
                    alert(fileName + ": loading failed! [Hint: you cannot double click index.html to run this project. " +
                        "The index.html file must be loaded by a web-server.]");
                }
            };
            req.open('GET', fileName, true);
            req.setRequestHeader('Content-Type', 'text/xml');

            req.onload = ()=> {
                let fileContent = null;
                if (fileType === eTextFileType.eXMLFile) {
                    let parser = new DOMParser();
                    fileContent = parser.parseFromString(req.responseText, "text/xml");
                } else {
                    fileContent = req.responseText;
                }
                // 这个需要使用箭头函数，不然this会丢失                 
                this.gEngine.ResourceMap.asyncLoadCompleted(fileName, fileContent);
                if ((callbackFunction !== null) && (callbackFunction !== undefined)) {
                    callbackFunction(fileName);
                }
            };
            req.send();
        } else {
            this.gEngine.ResourceMap.incAssetRefCount(fileName);
            if ((callbackFunction !== null) && (callbackFunction !== undefined)) {
                callbackFunction(fileName);
            }
        }
    };

    unloadTextFile(fileName) {
        this.gEngine.ResourceMap.unloadAsset(fileName);
    };
}

export { TextFileLoader }