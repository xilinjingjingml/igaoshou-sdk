import BaseUI from "../../../start/script/base/BaseUI";
import { DataMgr } from "../../../start/script/base/DataMgr";
import { Constants } from "../../../start/script/igsConstants";
import { User } from "../../../start/script/data/User";

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
        DataMgr.feed(Constants.DATA_DEFINE.USER_INFO, this.initData, this)
    }

    initData() {
        this.setLabelValue("battleRecord/winNum", User.WinNum)
        this.setLabelValue("battleRecord/conNum", User.WinCon)
    }
    
}
