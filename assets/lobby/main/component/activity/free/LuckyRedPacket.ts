import BaseUI from "../../../../start/script/base/BaseUI";
import { Helper } from "../../../../start/script/system/Helper";
import { AdSrv } from "../../../../start/script/system/AdSrv";
import { ActivitySrv } from "../../../../start/script/system/ActivitySrv";
import { UserSrv } from "../../../../start/script/system/UserSrv";
import { UIMgr } from "../../../../start/script/base/UIMgr";
import { User } from "../../../../start/script/data/User";
import { Constants } from "../../../../start/script/igsConstants";
import { IgsBundles } from "../../../../start/script/data/IgsBundles";

const { ccclass, property } = cc._decorator;

const COUNT_DOWN = 20

@ccclass
export default class LuckyRedPacket extends BaseUI {

    _countdown: number = COUNT_DOWN
    _adCount: number = 0
    _adIndex: number = 0

    _awardList: any[] = []

    _destroy: boolean = false
    onOpen() {
        Helper.reportEvent("广告点", "广告弹窗", "打开")
        console.log("jin---LuckyRedPacket onOpen", this.param)
        this.node.zIndex = 11
        this.initButton()
        this.initData()
        this.initEvent()
    }

    onLoad() {
       
    }

    onClose() {
        cc.log("luckyRedPacket close")
        this._destroy = true
    }

    initEvent() {
    }

    initButton() {
        this.setButtonClick("node/btnAd", this.node, () => {
            Helper.reportEvent("广告点", "广告弹窗", "点击播放")
            console.log("btnAd")
            this.createAdOrder()
        })
        this.setButtonClick("node/btnClose", this.node, () => {
            Helper.reportEvent("广告点", "广告弹窗", "关闭")
            this.close()
        })

        cc.tween(this.getNode("node/guang1"))
            .by(3, { angle: 360 })
            .repeatForever()
            .start()
    }

    initData() {
        this.setActive("node/freeAawardTitle", false)
        this.setActive("node/rebackGateMoneyTitle", false)
        this.setActive("node/multipleAwardTitle", false)

        if (this.param.activity_id === 1003) {  // 幸运奖励
            this.initLuckyAward()
        } else if (this.param.activity_id == 1004) {  // 更多报名费
            this.initGatemoneyAward()
        } else if (this.param.activity_id === 1008) {  // 赢分翻倍
            this.initMultipleAward()
        } else if (this.param.activity_id === 1007) {  // 返回报名费（对局免输）
            this.initRebackGatemoney()
        } else if (this.param.group_id === 1005 || this.param.group_id === 1006) {  // 5局奖励
        } else {
            Helper.reportEvent("广告点", "广告弹窗", "无活动点关闭")
            this.close()
        }
    }

    //幸运奖励
    initLuckyAward() {
        Helper.reportEvent("广告点", "幸运奖励", "弹窗")
        console.log("jin---initLuckyAward", this.param)
       
        let config = this.param
        let rewards = {
            item_id: null,
            max_num: null,
            item_num: null
        }
        if (config.receive_num >= config.day_times) {
            Helper.reportEvent("广告点", "幸运奖励", "没有次数关闭")
            this.close()
            return
        }

        //!config.receive_days || config.receive_days <= 4
        if (User.Lottery <= 50000) {
            for (let day in config.novice_weight) {
                if (config.novice_weight[day].rewards[0].item_id === Constants.ITEM_INDEX.LOTTERY) {
                    rewards.item_id = Constants.ITEM_INDEX.LOTTERY
                    rewards.max_num = rewards.max_num >= config.novice_weight[day].rewards[0].max_num ? rewards.max_num : config.novice_weight[day].rewards[0].max_num
                }

            }
        } else if (config.fix_weight && User.Lottery > 50000 && User.Lottery <= 150000) {
            let config_fix = config.fix_weight
            for (let i of config_fix) {
                if (i.times === config.day_times || (i.start_times >= config.day_times && i.end_times <= config.day_times)) {
                    let weight = i.weight
                    for (let j of weight) {
                        if (!rewards || rewards.item_id < j.rewards[0].item_id ||
                            rewards.item_num < j.rewards[0].item_num || rewards.max_num < j.rewards[0].max_num) {
                            rewards = j.rewards[0]
                        }
                    }
                }
            }
        } else if (User.Lottery > 50000 && User.Lottery < 150000) {
            for (let day in config.weight) {
                if (config.weight[day].rewards[0].item_id === Constants.ITEM_INDEX.LOTTERY) {
                    rewards.item_id = Constants.ITEM_INDEX.LOTTERY
                    rewards.max_num = rewards.max_num >= config.weight[day].rewards[0].max_num ? rewards.max_num : config.weight[day].rewards[0].max_num
                }
            }
        } else if (User.Lottery >= 150000) {
            Helper.reportEvent("广告点", "幸运奖励", "游戏币过多关闭")
            this.close()
        }

        this.setActive("LuckyReward", true)
        this.setLabelValue("LuckyReward/lbl", "最高" + rewards.max_num + "奖券!")//只显示金币最大值
        this.setActive("node", true)
    }

    //更多报名费
    initGatemoneyAward() {
        Helper.reportEvent("广告点", "更多报名费", "弹窗")
        let param = this.param
        this.setActive("node", true)
        this.setActive("node/awardIcon", true)
        this.setActive("node/awards", true)
        this.setActive("node/time", true)
        this.setActive("node/countdown", true)
        this.setActive("node/freeAawardTitle", true)
        this.setActive("node/hongbaodi", true)
        this.setLabelValue("node/tips", "")
        this.setLabelValue("node/btnAd/Background/info/count", "")
        this.setSpriteFrame("node/awardIcon/icon", "image/icon/big_zuanshi", true)
        this.setLabelValue("node/msg/msg0", "高概率获得")
        this.setLabelValue("node/msg/msg1", "金币")
        this.setActive("node/msg", true)
        this.setActive("node/awards", false)
        this.setLabelValue("node/time/timeVal", (param.day_times - (param.receive_num || 0)) + "次")
    }

    //赢分翻倍
    initMultipleAward() {
        Helper.reportEvent("广告点", "赢分翻倍", "弹窗")
        let param = this.param
        console.log("jin---initMultipleAward", this.param)
        this.setActive("MultipleReward", true)
        this.setActive("node", true)
    }

    //对局免输
    initRebackGatemoney() {
        Helper.reportEvent("广告点", "返回报名费（对局免输）", "弹窗")
        //TODO 对局免输

        console.log("jin---initRebackGatemoney", this.param)
        let param = this.param
        let backNum: number | null = null
        let item_id: number | null = null

        this.setActive("RegainLose", true)
        this.setActive("node", true)
        for (let reward of param.weight) {
            backNum = reward.rewards[0].min_num
            item_id = reward.rewards[0].item_id
        }

        this._awardList.push({ item_id: item_id, item_num: backNum })

        this.setLabelValue("RegainLose/lbl", "本次找回" + backNum + "奖券!")
    }

    setItems(item) {
        this.setActive("node/awards/gold", false)
        this.setActive("node/awards/lottery", false)
        this.setActive("node/awards/credits", false)
        this.setActive("node/awardIcon/gold", false)
        this.setActive("node/awardIcon/lottery", false)
        this.setActive("node/awardIcon/credits", false)        
        if (item.item_id === Constants.ITEM_INDEX.GOLD || !item.item_id) {
            this.setActive("node/awards/gold", true)
            this.setActive("node/awardIcon/gold", true)
            this.setLabelValue("node/awards/gold/num", Helper.FormatNumWYCN(item.max_num))            
        } else if (item.item_id === Constants.ITEM_INDEX.LOTTERY) {
            this.setActive("node/awards/lottery", true)
            this.setActive("node/awardIcon/lottery", true)
            this.setLabelValue("node/awards/lottery/num", Helper.FormatNumWYCN(item.max_num))
        } else if (item.item_id === Constants.ITEM_INDEX.CREDITS) {
            this.setActive("node/awards/credits", true)
            this.setActive("node/awardIcon/credits", true)
            this.setLabelValue("node/awards/credits/num", Helper.FormatNumWYCN(item.max_num))
        }
    }

    createAdOrder() {
        this.node.pauseAllActions()
        let self = this
        IgsBundles.Preload("lobby", "component/activity/getAwardPop/GetAwardPop")
        console.log("jin---createAdOrder: ", this.param)
        if (this.param.activity_id) {
            self.node.opacity = 0
            AdSrv.PlayAD(this.param.ad_aid, JSON.stringify(this.param))
                .then((res: any) => {                    
                    let awards = res.award_list ? res.award_list.award_item : this._awardList
                    UIMgr.OpenUI("lobby", "component/activity/getAwardPop/GetAwardPop", { param: { awards: awards, noShowAni: true } }, () => { self.close() })
                    self.param.activity_id === 1007 && ActivitySrv.GetReward(self.param.activity_id, self._adIndex - 1, (res) => { cc.log(res) })
                })
                .catch((res) => {
                    self.node.opacity = 255
                })
        }
    }
}
