## ajax 注意丢失 this

```
if (!(this.gEngine.ResourceMap.isAssetLoaded(fileName))) {
            // Update resources in load counter.
            this.gEngine.ResourceMap.asyncLoadRequested(fileName);

            // Asynchronously request the data from server.
            let req = new XMLHttpRequest();
            req.onreadystatechange =  () => {
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
            if ((callbackFunction !== null) && (callbackFunction !== undefined)) {
                callbackFunction(fileName);
            }
        }
    };

```

>因为在类中要注意上下文环境,所以使用箭头函数

## 创建 renderable 对象之前 Shader 必须存在

```
    this.mConstColorShader =  gEngine.DefaultResources.getConstColorShader();
    if(!this.mConstColorShader) return;
```
> main.js 中initialize() 可以多次使用是因为ajax onload重置,所以未加载到shader前都是返回避免错误
