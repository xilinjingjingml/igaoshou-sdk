import BaseUI from "../../../../start/script/base/BaseUI";
import { UIMgr } from "../../../../start/script/base/UIMgr";
import { PlatformApi } from "../../../../start/script/api/platformApi";
import { EventMgr } from "../../../../start/script/base/EventMgr";
import { Constants } from "../../../../start/script/igsConstants";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BrokeGold extends BaseUI {

    onPressCancel() {
        this.close()
    }

    onPressConfirm() {
        this.close()
        UIMgr.CloseUI("component/matchDetail/MatchDetail")
        UIMgr.CloseUI("component/match/activityMatch/ActivityMatchList")
        UIMgr.CloseUI("component/task/TaskScene")
        if (cc.director.getScene().name === "result") {
            PlatformApi.GotoLobby("shop")
        } else {
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.CHANGE_MAIN_TAB, { name: "shop" })
        }
        this.param?.brokeCb?.()
    }
}