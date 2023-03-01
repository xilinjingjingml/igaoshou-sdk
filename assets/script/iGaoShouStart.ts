import { IGaoShouAPI } from "./iGaoShou";
import { Util } from "./api/utilApi";
import { DataMgr } from "./base/DataMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class iGaoShouStart extends cc.Component {
    start() {
        cc.macro.CLEANUP_IMAGE_CACHE = false;
        cc.dynamicAtlasManager.enabled = true;
    
        IGaoShouAPI.Initialize(() => {
            DataMgr.Bundle.load("image/BG1", cc.SpriteFrame, (err, res: cc.SpriteFrame) => {
                if (!err)
                    Util.SetBackgroundImage(res)

                IGaoShouAPI.LaunchPlatform()
            })            
        })
    }
}