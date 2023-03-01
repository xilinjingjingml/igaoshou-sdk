import BaseUI from "../../../../start/script/base/BaseUI";
import { EventMgr } from "../../../../start/script/base/EventMgr";
import { Constants } from "../../../../start/script/igsConstants";
import { QualifyingSrv } from "../../../../start/script/system/QualifyingSrv";
import { UIMgr } from "../../../../start/script/base/UIMgr";
import { DataMgr } from "../../../../start/script/base/DataMgr";
import { Helper } from "../../../../start/script/system/Helper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class QualifyingLevel extends BaseUI {
    _finalGrade: any = null
    _award_id: number = 0
    _rewardItemPrefab: cc.Node = null
    onOpen() {
        console.log("QualifyingLevel", this.param)
        this.initEvent()
        this.initButton()
        this.initData()

        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.PAUSE_BANNER)
    }

    onLoad() {
        this._rewardItemPrefab = cc.find("node/reward/content/item", this.node)
        this._rewardItemPrefab.active = false
        this.setActive("node/reward", false)
        this.setActive("nodeBottom", false)
    }

    onClose() {
        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.RESUME_BANNER)
    }

    initEvent() {

    }

    initButton() {
        this.setButtonClick("btnClose", this.node, () => {
            cc.log("on click btnStart")
            if (this.param.type == 1) {
                QualifyingSrv.SeasonSettle(() => {
                    this.close()
                })
            } else {
                this.close()
            }
        })

        this.setButtonClick("nodeBottom/btnStart", this.node, () => {
            cc.log("on click btnStart")
            if (this.param.type == 1) {
                QualifyingSrv.SeasonSettle(() => {
                    this.close()
                })
            } else {
                this.close()
            }
        })

        this.setButtonClick("nodeBottom/btnShare", this.node, () => {
            cc.log("on click btnShare")
            let curSeason: any = DataMgr.getData(Constants.DATA_DEFINE.QUALIFYING_CUR_SEASON)
            if (curSeason && cc.sys.WECHAT_GAME === cc.sys.platform) {
                UIMgr.OpenUI("lobby", "component/league/qualifying/QualifyingShare",
                    {
                        param: { grade: this.param.data.finalGrade },
                        closeCb: () => {
                            // if(this._award_id){
                            //     QualifyingSrv.GetReward({award_id:this._award_id}, (res=>{
                            //         if(res.award_list && res.award_list.length > 0){
                            //             User.UpdateItem(() => UIMgr.OpenUI("component/Shop/GetAwardEntry", { param: { awards: res.award_list } }))
                            //         }
                            //     }))
                            // }

                            this.close()
                        }
                    })
            } else {
                Helper.shareInfo()
            }
        })
    }

    initData() {
        //赛季结算
        if (this.param.type == 1) {
            this._finalGrade = this.param.data.grade
            this.setLabelValue("node/title/lv", this.param.data.last_settle.season_id)
            this.setSpriteFrame("node/title/icon", "image/league/qualifying/dwjs")
            this.setChildParam("node/QualifyingLevelMode", { grade: this.param.data.last_settle.grade, finalGrade: this.param.data.grade, tip: "" })

            this.setActive("nodeBottom/btnStart", true)
            this.setActive("nodeBottom/btnShare", false)
            let nodeBottom = cc.find("nodeBottom", this.node)
            nodeBottom.active = true
            nodeBottom.opacity = 0
            cc.tween(nodeBottom)
                .delay(1.5)
                .call(() => {
                    this.setLabelValue("node/title/lv", this.param.data.cur_season_id)
                    this.setSpriteFrame("node/title/icon", "image/league/qualifying/csdw")
                    this.getRewardData()
                })
                .to(0.4, { opacity: 255 })
                .start()
        } else if (this.param.type == 2) {//升级
            this._finalGrade = this.param.data.finalGrade
            this.setActive("node/title/lv", false)
            this.setChildParam("node/QualifyingLevelMode", { grade: this.param.data.grade, finalGrade: this.param.data.finalGrade, tip: "" })

            if(cc.sys.BYTEDANCE_GAME === cc.sys.platform || cc.sys.WECHAT_GAME === cc.sys.platform){
            this.setActive("nodeBottom/btnStart", false)
            this.setActive("nodeBottom/btnShare", true)
            }else{
                this.setActive("nodeBottom/btnStart", true)
                this.setActive("nodeBottom/btnShare", false)
            }
            let nodeBottom = cc.find("nodeBottom", this.node)
            nodeBottom.active = true
            nodeBottom.opacity = 0
            cc.tween(nodeBottom)
                .delay(1.5)
                .call(() => {
                    this.getRewardData()
                })
                .to(0.4, { opacity: 255 })
                .start()
        }
    }

    getRewardData() {
        QualifyingSrv.GetListRewardStatus((status_list) => {
            for (let v of status_list) {
                if (this._finalGrade.major == v.major && this._finalGrade.minor == v.minor) {
                    this._award_id = v.award_id
                    let award_list = v.award_list
                    for (let i = 0; i < v.award_list.length; i++) {
                        let award = award_list[i]
                        let rewardItem = cc.instantiate(this._rewardItemPrefab)
                        rewardItem.active = true
                        rewardItem.parent = cc.find("node/reward/content", this.node)
                        if (award.id == Constants.ITEM_INDEX.ProtectStarCard) {
                            this.setActive("bxk", rewardItem, true)
                            this.setActive("lotter", rewardItem, false)
                        } else if (award.id == Constants.ITEM_INDEX.LOTTERY) {
                            this.setActive("bxk", rewardItem, false)
                            this.setActive("lotter", rewardItem, true)
                        }
                        this.setLabelValue("num", rewardItem, award.num)
                        this.setActive("node/reward", true)
                    }

                    //奖励直接发放且不提示
                    if (this._award_id && v.status == 1) {
                        QualifyingSrv.GetReward({ award_id: this._award_id }, (res => {
                            // if(res.award_list && res.award_list.length > 0){
                            //     User.UpdateItem(() => UIMgr.OpenUI("component/Shop/GetAwardEntry", { param: { awards: res.award_list } }))
                            // }
                        }))
                    }
                }
            }
        })
    }
}
