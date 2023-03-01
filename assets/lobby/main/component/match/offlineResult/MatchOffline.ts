import BaseUI from "../../../../start/script/base/BaseUI";
import { DataMgr } from "../../../../start/script/base/DataMgr";
import { Constants } from "../../../../start/script/igsConstants";
import { EventMgr } from "../../../../start/script/base/EventMgr";
import { UserSrv } from "../../../../start/script/system/UserSrv";
import { User } from "../../../../start/script/data/User";
import { UIMgr } from "../../../../start/script/base/UIMgr";
import { MatchSvr } from "../../../../start/script/system/MatchSvr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MatchOffline extends BaseUI {

    onLoad() {
        let offline = DataMgr.getData<boolean>("offline lock")
        if (offline) {
            this.node.active = false
            return
        }
        DataMgr.setData("offline lock", true)
    }

    onOpen() {
        this.initEvent()
        this.initData()
    }

    onClose(){
        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.FIRST_OPEN_QUEUE)
        UserSrv.UpdateItem()
    }

    initEvent() {
        this.setButtonClick("content/btm/btnOpenAll", this.onPressOpenAll.bind(this))
        this.setButtonClick("content/btm/btnOK", this.close.bind(this))
    }

    initData() {
        let data: TResults = this.param
        if (!data) {
            this.close()
            return
        }

        this.setLabelValue("content/top/userName", User.UserName)
        this.setSpriteFrame("content/top/avatar", User.Avatar)

        let count = 0
        for (let idx in data) {
            let res = data[idx]
            UIMgr.OpenUI("lobby", "component/match/offlineResult/MatchOfflineMode", 
                {parent: this.getNode("content/list/view/content"), name: res.matchUuid, param: {data: res, idx: Number(idx)}})
            
            count = Number(idx) + 1
        }

        // for (let i = count; i < 6; i ++) {
        //     UIMgr.OpenUI("component/Match/MatchOfflineMode", 
        //         {parent: this.getNode("content/list/view/content"), name: "none", param: {data: null, idx: Number(i)}})
        // }
    }

    onPressOpenAll() {
        let data: TResults = this.param   
        // this.setButtonClickDelay("content/btm/btnOpenAll", 5)
        for (let idx in data) {
            let res = data[idx]
            MatchSvr.GetMatchAward(res.matchUuid, (msg) => {
                if (!msg.err) {
                    res.playerState = Constants.PLAYER_MATCH_STATE.PLAYER_MATCH_STATE_GAMEOVER
                    this.setChildParam("content/list/view/content/" + res.matchUuid, {data: res, idx: Number(idx)})
                }                
            })
                       
            this.setActive("content/btm/btnOpenAll", false)
            this.setActive("content/btm/btnOK", true)        
        }
    }

}
