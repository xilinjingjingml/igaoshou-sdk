import BaseUI from "../../../../start/script/base/BaseUI";
import { Helper } from "../../../../start/script/system/Helper";
import { AdSrv } from "../../../../start/script/system/AdSrv";
import { ActivitySrv } from "../../../../start/script/system/ActivitySrv";
import { UserSrv } from "../../../../start/script/system/UserSrv";
import { UIMgr } from "../../../../start/script/base/UIMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FreeGoldCoins extends BaseUI {

    dataInfo = null
    countDownCount = null
    //TODO 1.剩余领奖次数 2.点击 1.获取奖励 2.关闭 btn事件跳转 3.没有广告id情况处理
    onOpen(){
        console.log("jin---onOpen FreeGoldCoins", this.param)
        this.dataInfo = this.param.dataInfo
        this.dataInfo.receive_num = this.dataInfo.receive_num || 0
        this.param.ad_aid = this.param.ad_aid || 0
        this.countDownCount = cc.find("node/tipLayout/lbl_1", this.node)
        cc.find("node/tipLayout/lbl_0", this.node).getComponent(cc.Label).string = "每日" + this.dataInfo.day_times + "次，今日剩余"
        this.countDownCount.getComponent(cc.Label).string = this.dataInfo.day_times - this.dataInfo.receive_num
        this.initButton()
    }

    

    initButton(){
        this.setButtonClick("node/btn_get_award", this.node, this.onPressGetAward.bind(this))
        this.setButtonClick("node/btnClose", this.node, this.close.bind(this))

        cc.tween(this.getNode("node/btnGetAward"))
            .repeatForever(cc.tween(this.getNode("node/btnGetAward"))
                .to(.8, { scale: 1.1 })
                .to(.8, { scale: .9 })
            )
            .start()
    }

    onPressGetAward(){
        //TODO 1.次数是否用完 2.是否有广告id，分别处理
        this.setButtonInfo("node/btnClose", { interactable: false })
        if (this.dataInfo.day_times && this.dataInfo.receive_num && this.dataInfo.receive_num >= this.dataInfo.day_times) {
            this.setButtonInfo("node/btnClose", { interactable: true })
            Helper.OpenTip("今日次数已用完！")
            return
        }
        if(this.dataInfo.ad_aid && this.dataInfo.ad_aid > 0){
            AdSrv.createAdOrder(this.dataInfo.ad_aid, JSON.stringify(this.dataInfo), (res: IPlayAdCallBack) => {
                if (res && res.order_no && res.order_no.length > 0) {
                    AdSrv.completeAdOrder((res) => {
                        ActivitySrv.GetActivityConfig(this.dataInfo.activity_id)
                        if (res && res.code == "00000") {
                            if (res.award_list) {
                                let res1 = Helper.ParseJson(res.award_list, "freeGoldCoins")
                                if (res1 && res1.err_code == 1) {
                                    this.refreshCountDown()
                                    UserSrv.UpdateItem(() => UIMgr.OpenUI("lobby", "component/activity/getAwardPop/GetAwardPop", { param: { awards: res1.award_item } }, ()=>{ this.close() }))
                                }
                            }
                            // GetActivityConfig(info.activity_id)
                        }
                    })
                }
            })
        }else{
        }
    }

    close() {
        if (this.node && this.node.isValid)
            UIMgr.CloseUI(this.node)
    }

    refreshCountDown(){
        this.dataInfo.receive_num++
        if (this.dataInfo.day_times - this.dataInfo.receive_num === 0) {
            this.countDownCount.getComponent(cc.Label).string = "今日次数已用完"
            this.setActive("node/tipLayout/lbl_0", false)
            this.setActive("node/tipLayout/lbl_2", false)
        } else {
            this.countDownCount.getComponent(cc.Label).string = this.dataInfo.day_times - this.dataInfo.receive_num
        }
        this.setButtonInfo("node/btn_get_award", { interactable: false })
        this.setButtonInfo("node/btnClose", { interactable: true })
    }

}