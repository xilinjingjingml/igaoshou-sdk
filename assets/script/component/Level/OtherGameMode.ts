import { Constants } from "../../constants";
import BaseUI from "../../base/BaseUI";
import { DataMgr } from "../../base/DataMgr";
import { User } from "../../system/User";
import { Helper } from "../../system/Helper"
import { UIMgr } from "../../base/UIMgr"
import { PluginMgr } from "../../base/PluginMgr";
import { Util } from "../../api/utilApi";

const { ccclass, property } = cc._decorator;

@ccclass
export default class OtherGameMode extends BaseUI {

    onLoad(){
        this.initButton()
    }

    setParam(param) {
        this.param = param
        this.initData()
    }

    initData() {
        let data: any = this.param
        console.log("OtherGameMode data", data)
        this.setLabelValue("name", data.promotion_game_name)
        this.setLabelValue("desc", data.desc)
        this.setSpriteFrame("icon", data.icon, true)
    }

    initButton(){
        this.setButtonClick("btnAdd", () => {
            console.log("btnAdd on click")
            let data: any = this.param
            Util.NativeGame(data.promotion_appid)
        })
    }
}
