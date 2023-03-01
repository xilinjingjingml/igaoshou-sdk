import { Constants } from "../../constants";
import BaseUI from "../../base/BaseUI";
import { DataMgr } from "../../base/DataMgr";
import { User } from "../../system/User";
import { Helper } from "../../system/Helper"
import { UIMgr } from "../../base/UIMgr"
import { EventMgr } from "../../base/EventMgr";
import { Util } from "../../api/utilApi";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LevelInfoMode extends BaseUI {

    onOpen() {
        this.initData()
    }

    onLoad(){
        this.setActive("startUpNode", false)
        this.initButton()
        this.initEvent()
    }

    initEvent() {
        EventMgr.on(Constants.EVENT_DEFINE.SHOW_OTHER_GAME_LEVEL, this.showGameLevelProgress, this)
    }

    showGameLevelProgress(data){
        console.log("showGameLevelProgress", data)
        if(data.type != this.param.type){
            this.setActive("select", false)
        }
    }

    setParam(param) {
        this.param = param
        this.initData()
    }

    initData() {
        let data: ILevelInfo = this.param
        if (!data) {
            return
        }

        if (data.type === "igaoshou" || data.type === DataMgr.Config.gameId){
            this.setActive("startUpNode", false)
        }else{
            this.setActive("startUpNode", true)
        }

        if(data.exp && data.maxExp && data.lv){
            this.setLabelValue("exp", data.exp + "/" + data.maxExp)
            this.expProgressAction(data.exp / data.maxExp)
            this.lvCountAction(data.lv)
        }else{            
            this.setActive("lv", false)
            // this.setActive("progress", false)
            this.setLabelValue("name", data["promotion_game_name"])
            this.setSpriteFrame("mask/icon", data["icon"], true)       
        }

        if(data["addGame"]){
            this.setActive("lv", false)
            this.setActive("progress", false)
            this.setActive("startUpNode", false)
            this.setSpriteFrame("mask/icon", "image/level/tianjiayigexinyouxi", true)      
            this.setLabelValue("name", "更多游戏")    
        }else if (data.type === "igaoshou") {
            this.setLabelValue("name", data.name)
            // if (data.type === config.gameId) {
                // this.setSpriteFrame("mask/icon", data.icon, true)
            // }
        } else if (data.type) {
            User.GetGameInfo(data.type, (res) => {
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

    initButton(){
        if (DataMgr.Config.platId === 3) {
            return
        }

        this.setButtonClick("btn", () => {
            console.log("btn on click")
            let data: ILevelInfo = this.param
            if(data["addGame"]){
                // Helper.OpenPageUI("component/Level/OtherGameEntry", "启动游戏", null, {})
                Helper.OpenPageUI("component/Level/OtherGameLevel", "", null, {})
            }else{
                if (!!UIMgr.FindUI("component/Level/OtherGameLevel")) {
                    if(!isNaN(data.exp) && !isNaN(data.maxExp) && !isNaN(data.lv)){   
                    this.setActive("select", true)
                    EventMgr.dispatchEvent(Constants.EVENT_DEFINE.SHOW_OTHER_GAME_LEVEL, data)
                }else{
                        this.btnAddOnClick()
                    }
                }else{
                    Helper.OpenPageUI("component/Level/OtherGameLevel", "", null, {data:data})
                }
            }
        })

        this.setButtonClick("startUpNode/btnAdd", () => {
            console.log("btnAdd on click")
            this.btnAddOnClick()
        })
    }

    btnAddOnClick(){
        Util.NativeGame(this.param.promotion_appid)
    }
}
