
import BaseUI from "../../base/BaseUI";
import { AdSrv } from "../../system/AdSrv";
import { UIMgr } from "../../base/UIMgr";
import { Helper } from "../../system/Helper";
import { ActivitySrv } from "../../system/ActivitySrv"
import { User } from "../../system/User";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FreeGoldCoins extends BaseUI {

    dataInfo = null
    countDownCount = null
    //1.剩余领奖次数 2.点击 1.获取奖励 2.关闭 btn事件跳转 3.没有广告id情况处理
    onOpen(){
        console.log("jin---onOpen FreeGoldCoins", this.param)
        this.dataInfo = this.param.dataInfo
        this.dataInfo.receive_num = this.dataInfo.receive_num || 0
        this.param.ad_aid = this.param.ad_aid || 0
        this.countDownCount = cc.find("tipLayout/lbl_1", this.node)
        cc.find("tipLayout/lbl_0", this.node).getComponent(cc.Label).string = "每日" + this.dataInfo.day_times + "次，今日剩余"
        this.countDownCount.getComponent(cc.Label).string = this.dataInfo.day_times - this.dataInfo.receive_num
        this.initButton()
    }

    

    initButton(){
        this.setButtonClick("btn_get_award", this.node, this.onPressGetAward.bind(this))
        this.setButtonClick("btnClose", this.node, this.close.bind(this))

        this.setActive("btnClose", false)
        cc.tween(this.node)
            .delay(2)
            .call(() => {
                this.setActive("btnClose", true)
                cc.tween(this.getNode("btnClose"))
                    .set({ opacity: 0 })
                    .to(1, { opacity: 255 })
                    .start()
            })
            .start()

        cc.tween(this.getNode("btnGetAward"))
            .repeatForever(cc.tween(this.getNode("btnGetAward"))
                .to(.8, { scale: 1.1 })
                // .delay(.2)
                .to(.8, { scale: .9 })
            )
            .start()
    }

    onPressGetAward(){
        // 1.次数是否用完 2.是否有广告id，分别处理
        this.setButtonInfo("btnClose", { interactable: false })
        if (this.dataInfo.day_times && this.dataInfo.receive_num && this.dataInfo.receive_num >= this.dataInfo.day_times) {
            this.setButtonInfo("btnClose", { interactable: true })
            Helper.OpenTip("今日次数已用完！")
            return
        }
        if(this.dataInfo.ad_aid && this.dataInfo.ad_aid > 0){
            AdSrv.createAdOrder(this.dataInfo.ad_aid, JSON.stringify(this.dataInfo), (order_no: string) => {
                if (order_no && order_no.length > 0) {
                    AdSrv.completeAdOrder((res) => {
                        ActivitySrv.GetActivityConfig(this.dataInfo.activity_id)
                        if (res && res.code == "00000") {
                            if (res.award_list) {
                                let res1 = JSON.parse(res.award_list)
                                if (res1 && res1.err_code == 1) {
                                    this.refreshCountDown()
                                    User.UpdateItem(() => UIMgr.OpenUI("component/Shop/GetAwardEntry", { param: { awards: res1.award_item } }, ()=>{ this.close() }))
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
            this.setActive("tipLayout/lbl_0", false)
            this.setActive("tipLayout/lbl_2", false)
        } else {
            this.countDownCount.getComponent(cc.Label).string = this.dataInfo.day_times - this.dataInfo.receive_num
        }
        this.setButtonInfo("btn_get_award", { interactable: false })
        this.setButtonInfo("btnClose", { interactable: true })
    }

}