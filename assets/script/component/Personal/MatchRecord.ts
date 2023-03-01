import BaseUI from "../../base/BaseUI";
import { DataMgr } from "../../base/DataMgr";
import { Constants } from "../../constants";
import { MatchSvr } from "../../system/MatchSvr";


const {ccclass, property} = cc._decorator;

@ccclass
export default class MatchRecord extends BaseUI {

    onOpen() {        
        // this.initData()
    }

    onEnable() {
        this.initEvent()
    }

    initEvent() {
        // MatchSvr.GetPlayerProfile(this.initData.bind(this))
        DataMgr.feed(Constants.DATA_DEFINE.USER_INFO + ".histroy", this.initData, this)
    }

    initData() {
        let IPlayerData = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        this.setLabelValue("battleRecord/winNum", IPlayerData.histroy.winNum)
        this.setLabelValue("battleRecord/conNum", IPlayerData.histroy.winCon)
    }
    
}
