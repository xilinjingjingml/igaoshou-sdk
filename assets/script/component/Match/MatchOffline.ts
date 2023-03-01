import BaseUI from "../../base/BaseUI";
import { Constants } from "../../constants";
import { UIMgr } from "../../base/UIMgr";
import { MatchSvr } from "../../system/MatchSvr";
import { DataMgr } from "../../base/DataMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MatchOffline extends BaseUI {

    onOpen() {
        this.initEvent()
        this.initData()
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

        let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        if (user) {
            this.setLabelValue("content/top/userName", user.userName)
            this.setSpriteFrame("content/top/avatar", user.avatar)
        }

        let count = 0
        for (let idx in data) {
            let res = data[idx]
            UIMgr.OpenUI("component/Match/MatchOfflineMode", 
                {parent: this.getNode("content/list/view/content"), name: res.matchUuid, param: {data: res, idx: Number(idx)}})
            
            count = Number(idx) + 1
        }

        for (let i = count; i < 6; i ++) {
            UIMgr.OpenUI("component/Match/MatchOfflineMode", 
                {parent: this.getNode("content/list/view/content"), name: "none", param: {data: null, idx: Number(i)}})
        }
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
