import BaseUI from "../../../start/script/base/BaseUI";
import { EventMgr } from "../../../start/script/base/EventMgr";
import { Constants } from "../../../start/script/igsConstants";
import { Helper } from "../../../start/script/system/Helper";
import { DataMgr } from "../../../start/script/base/DataMgr";
import { UserSrv } from "../../../start/script/system/UserSrv";
import { PluginMgr } from "../../../start/script/base/PluginMgr";
import { UIMgr } from "../../../start/script/base/UIMgr";
import { Util } from "../../../start/script/api/utilApi";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LevelInfoMode extends BaseUI {

    start() {
        this.setActive("startUpNode", false)
        this.initButton()
        this.initEvent()
        // }

        // onOpen() {
        this.initData()
    }

    initEvent() {
        EventMgr.on(Constants.EVENT_DEFINE.SHOW_OTHER_GAME_LEVEL, this.showGameLevelProgress, this)
    }

    showGameLevelProgress(data) {
        console.log("showGameLevelProgress", data)
        if (data.type != this.param.type) {
            this.setActive("select", false)
        }
    }

    setParam(param) {
        this.param = param
        this.initData()
    }

    initData() {
        if (Helper.isNative()) {
            this.setActive("startUpNode/btnAdd", false)
        }

        let data: ILevelInfo = this.param
        if (!data) {
            return
        }

        if (data.type === "igaoshou" || data.type === DataMgr.data.Config.gameId) {
            this.setActive("startUpNode", false)
        } else {
            this.setActive("startUpNode", true)
        }

        if (data.exp && data.maxExp && data.lv) {
            this.setLabelValue("exp", data.exp + "/" + data.maxExp)
            this.expProgressAction(data.exp / data.maxExp)
            this.lvCountAction(data.lv)
        } else {
            this.setActive("lv", false)
            // this.setActive("progress", false)
            this.setLabelValue("name", data["promotion_game_name"])
            this.setSpriteFrame("mask/icon", data["icon"], true)
        }

        if (data["addGame"]) {
            this.setActive("lv", false)
            this.setActive("progress", false)
            this.setActive("startUpNode", false)
            this.setSpriteFrame("mask/icon", "component/level/style1/image/tianjiayigexinyouxi", true)
            this.setLabelValue("name", "更多游戏")
        } else if (data.type === "igaoshou") {
            this.setLabelValue("name", data.name)
            // if (data.type === config.gameId) {
            // this.setSpriteFrame("mask/icon", data.icon, true)
            // }
        } else if (data.type) {
            UserSrv.GetGameInfo(data.type, (res) => {
                this.param.name = res.game_name
                this.setLabelValue("name", res.game_name)
                this.setSpriteFrame("mask/icon", res.game_icon, true)
            })
        }

    }

    expProgressAction(value: number) {
        let sprite = this.getNodeComponent("progress/bar", cc.Sprite)
        if (!sprite) {
            return
        }

        cc.tween(sprite)
            .to(1.5, { fillRange: value }, { easing: "backIn" })
            .start()
    }

    lvCountAction(value: number) {
        let lv = this.getNodeComponent("lv/num", cc.Label)
        if (!lv) {
            return
        }
        lv.string = "" + value
        lv.node.position = cc.v3(0, lv.node.height / 2 - lv.node.parent.height / 2)
        cc.tween(lv.node)
            .to(.5, { position: cc.Vec3.ZERO })
            .start()
    }

    initButton() {
        if (DataMgr.data.Config.platId === 3 || Constants.sys.WECHAT_GAME_QQ === cc.sys.platform) {
            console.log("===levelInfoMode 1")
            return
        } else if (!Helper.isNative() && (cc.sys.OPPO_GAME == cc.sys.platform || cc.sys.VIVO_GAME == cc.sys.platform)) {
            console.log("===levelInfoMode 2")
            return
        } else if (cc.sys.BYTEDANCE_GAME === cc.sys.platform || PluginMgr.isH52345Game()) {
            console.log("===levelInfoMode 3")
            return
            // } else if (cc.sys.OS_IOS == cc.sys.os) {
            //     return
        }

        this.setButtonClick("btn", () => {
            console.log("btn on click")
            let data: ILevelInfo = this.param
            if (data["addGame"]) {
                Helper.OpenPageUI("component/level/style2/OtherGameLevel2", "", null, { single: true })
            } else {
                if (!!UIMgr.FindUI("component/level/style2/OtherGameLevel2")) {
                    if (!isNaN(data.exp) && !isNaN(data.maxExp) && !isNaN(data.lv)) {
                        this.setActive("select", true)
                        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.SHOW_OTHER_GAME_LEVEL, data)
                    } else {
                        this.btnAddOnClick()
                    }
                } else {
                    Helper.OpenPageUI("component/level/style2/OtherGameLevel2", "", null, { single: true, data: data })
                }
            }
        })

        this.setButtonClick("startUpNode/btnAdd", () => {
            console.log("btnAdd on click")
            this.btnAddOnClick()
        })
    }

    btnAddOnClick() {
        Util.NativeGame(this.param.promotion_appid)
    }
}
