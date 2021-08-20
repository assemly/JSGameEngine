import { Renderable } from "../../Engine/Renderable";
import { Camera } from "../../Engine/Camera";
import { vec2 } from "../../Engine/Lib/gl-matrix";

class SceneFileParser {
    constructor(gEngine, sceneFilePath) {
        this.sceneFileName = sceneFilePath;
        this.gEngine = gEngine;
        this.mSceneXml = this.gEngine.ResourceMap.retrieveAsset(sceneFilePath);
        this.mConstColorShader = null;
    }

    _getElm(tagElm) {   
        if(!this.mSceneXml || typeof(this.mSceneXml) === 'string') return;
        console.log("SceneFileParser::"+typeof this.mSceneXml);
        let theElm = this.mSceneXml.getElementsByTagName(tagElm);
        if (theElm.length === 0) {
            console.error("Warning: Level element:[" + tagElm + "]: is not found!");
        }
        return theElm;
    };

    parseCamera() {
        
        let camElm = this._getElm("Camera");
        if(!camElm) return;
        console.log("SceneFileParser::parseCamera: "+camElm[0]);
        let cx = Number(camElm[0].getAttribute("CenterX"));
        let cy = Number(camElm[0].getAttribute("CenterY"));
        let w = Number(camElm[0].getAttribute("Width"));
        let viewport = camElm[0].getAttribute("Viewport").split(" ");
        console.log("SceneFileParser::viewport: "+eval(viewport[2]));
        let bgColor = camElm[0].getAttribute("BgColor").split(" ");
        // make sure viewport and color are number
        let j;
        for (j = 0; j < 4; j++) {
            bgColor[j] = Number(bgColor[j]);
            viewport[j] = Number(eval(viewport[j]));
            
        }

        let cam = new Camera(
            this.gEngine,
            vec2.fromValues(cx, cy),  // position of the camera
            w,                        // width of camera
            viewport                  // viewport (orgX, orgY, width, height)
        );
        cam.setBackgroundColor(bgColor);
        return cam;
    };

    parseSquares(sqSet) {
        let elm = this._getElm("Square");
        if(!elm) return;
        let i, j, x, y, w, h, r, c, sq;
        for (i = 0; i < elm.length; i++) {
            x = Number(elm.item(i).attributes.getNamedItem("PosX").value);
            y = Number(elm.item(i).attributes.getNamedItem("PosY").value);
            w = Number(elm.item(i).attributes.getNamedItem("Width").value);
            h = Number(elm.item(i).attributes.getNamedItem("Height").value);
            r = Number(elm.item(i).attributes.getNamedItem("Rotation").value);
            c = elm.item(i).attributes.getNamedItem("Color").value.split(" ");
            this.mConstColorShader =  this.gEngine.DefaultResources.getConstColorShader();
            if(!this.mConstColorShader) return;
            sq = new Renderable(this.gEngine,this.mConstColorShader);
            // make sure color array contains numbers
            for (j = 0; j < 4; j++) {
                c[j] = Number(c[j]);
            }
            sq.setColor(c);
            sq.getXform().setPosition(x, y);
            sq.getXform().setRotationInDegree(r); // In Degree
            sq.getXform().setSize(w, h);
            sqSet.push(sq);
        }

    }

    releaseSceneAsset(sceneName){
        this.gEngine.ResourceMap.unloadAsset(sceneName);
    }
}
export { SceneFileParser }