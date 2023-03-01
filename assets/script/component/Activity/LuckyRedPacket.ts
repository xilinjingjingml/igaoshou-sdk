import BaseUI from "../../base/BaseUI";
import { Constants } from "../../constants";
import { AdSrv } from "../../system/AdSrv";
import { Helper } from "../../system/Helper";
import { ActivitySrv } from "../../system/ActivitySrv";
import { TaskSrv } from "../../system/TaskSrv";
import { UIMgr } from "../../base/UIMgr";
import { DataMgr } from "../../base/DataMgr";
import { PluginMgr } from "../../base/PluginMgr";

const { ccclass, property } = cc._decorator;

const COUNT_DOWN = 20

@ccclass
export default class LuckyRedPacket extends BaseUI {

    _countdown: number = COUNT_DOWN
    _adCount: number = 0
    _adIndex: number = 0

    _destroy:boolean = false
    onOpen() {
        console.log("LuckyRedPacket onOpen", this.param)

        this.initButton()
        this.initData()

        PluginMgr.showBanner(() => {
            if (!this || !this.node || !this.node.isValid || this._destroy) {
                PluginMgr.hideBanner()
            }
        })
    }

    onLoad() {
    }

    onClose() {
        cc.log("luckyRedPacket close")
        this._destroy = true
        PluginMgr.hideBanner()
    }

    initEvent() {
    }

    initButton() {
        this.setButtonClick("node/btnAd", this.node, () => {
            console.log("btnAd")
            this.createAdOrder()
        }, 2)

        this.setButtonClick("node/btnClose", this.node, () => {
            this.close()
        })

        this.setActive("node/btnClose", false)
        cc.tween(this.getNode("node"))
            .delay(2)
            .call(() => {
                this.setActive("node/btnClose", true)
                cc.tween(this.getNode("node/btnClose"))
                    .set({ opacity: 0 })
                    .to(1, { opacity: 255 })
                    .start()
            })
            .start()

        cc.tween(this.getNode("node/btnAd"))
            .repeatForever(cc.tween(this.getNode("node/btnAd"))
                .to(1.5, { scale: 1.1 })
                .delay(.5)
                .to(1.5, { scale: .9 })
            )
            .start()

        cc.tween(this.node)
            .repeat(COUNT_DOWN, cc.tween().delay(1).call(() => {
                this.setLabelValue("node/countdown", "限时" + this._countdown-- + "秒")
            }))
            .call(() => this.close())
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
        } else if (this.param.activity_id === 1007) {  // 返回报名费
            this.initRebackGatemoney()
        } else if (this.param.group_id === 1005) {  // 5局奖励
            this.initGamesTaskAward()
        } else {
            this.close()
        }
    }

    initLuckyAward() {
        this.setActive("node/freeAawardTitle", true)
        this.setLabelValue("node/tips", "幸运奖励")
        this.setLabelValue("node/btnAd/Background/info/count", "")
        this.setSpriteFrame("node/awardIcon/icon", "image/icon/big-jiangquan", true)
        this.setActive("node/msg", false)
        this.setActive("node/awards", true)
        this.setActive("node/time", false)

        let param = this.param
        let config = param.fix_weight
        if (!config) {
            this.close()
            return
        }

        let rewards = null
        for (let i of config) {
            if (i.times === param.day_times || (i.start_times >= param.day_times && i.end_times <= param.day_times)) {
                let weight = i.weight
                for (let j of weight) {
                    if (!rewards || rewards.item_id < j.rewards[0].item_id ||
                        rewards.item_num < j.rewards[0].item_num || rewards.max_num < j.rewards[0].max_num) {
                        rewards = j.rewards[0]
                    }
                }
            }
        }

        if (rewards) {
            this.setItems(rewards)
        }
    }

    initGatemoneyAward() {
        let param = this.param
        this.setActive("node/freeAawardTitle", true)
        this.setLabelValue("node/tips", "")
        this.setLabelValue("node/btnAd/Background/info/count", "")
        this.setSpriteFrame("node/awardIcon/icon", "image/icon/big_zuanshi", true)
        this.setLabelValue("node/msg/msg0", "高概率获得")
        this.setLabelValue("node/msg/msg1", "金币")
        this.setActive("node/msg", true)
        this.setActive("node/awards", false)
        this.setLabelValue("node/time/timeVal", (param.day_times - (param.receive_num || 0)) + "次")
    }

    initMultipleAward() {
        let param = this.param
        this.setActive("node/multipleAwardTitle", true)
        this.setLabelValue("node/tips", "")
        this.setLabelValue("node/btnAd/Background/info/count", "")
        this.setSpriteFrame("node/awardIcon/icon", "image/icon/big_weibi", true)
        this.setLabelValue("node/msg/msg0", "奖励翻")
        this.setLabelValue("node/msg/msg1", "1-10倍")
        this.setActive("node/msg", true)
        this.setActive("node/awards", false)
        this.setLabelValue("node/time/timeVal", (param.day_times - (param.receive_num || 0)) + "次")
    }

    initRebackGatemoney() {
        let param = this.param
        this.setActive("node/rebackGateMoneyTitle", true)
        // if (this.param.activity_id === 0) {
        //     this.setLabelValue("node/tips", "第一次返回100, 第二次返回200")
        //     this.setLabelValue("node/btnAd/Background/info/count", "(0/2)")
        // } else {
        this.setLabelValue("node/tips", "")
        // }
        this.setSpriteFrame("node/awardIcon/icon", "image/icon/big_weibi", true)
        this.setActive("node/msg", false)
        this.setActive("node/awards", true)
        this.setLabelValue("node/time/timeVal", (param.day_times - (param.receive_num || 0)) + "次")

        let config = param.weight
        let rewards = null
        let msg = ""//"第1次返还"//100，第二次200。"
        for (let i of config) {
            msg += "第" + (this._adCount + 1) + "次返还"
            if (!rewards) {
                rewards = i.rewards[0]
            } else {
                rewards.max_num += i.rewards[0].max_num
            }
            msg += i.rewards[0].max_num
            msg += ","
            this._adCount++
        }

        if (this._adCount >= 2) {
            this.setLabelValue("node/tips", msg.substr(0, msg.length - 1))
            this.setLabelValue("node/btnAd/Background/info/count", "(0/" + this._adCount + ")")
        }

        if (rewards) {
            this.setItems(rewards)
        }
    }

    initGamesTaskAward() {
        let param = this.param
        this.setActive("node/freeAawardTitle", true)
        this.setLabelValue("node/tips", "打满5局奖励")
        this.setLabelValue("node/btnAd/Background/info/count", "")
        this.setSpriteFrame("node/awardIcon/icon", "image/icon/big_zuanshi", true)
        this.setActive("node/msg", false)
        this.setActive("node/awards", true)
        this.setLabelValue("node/time/timeVal", (param.max - param.cur) + "次")

        let config = param.box_list[0]
        let rewards = {
            item_id: config.Id,
            max_num: 0
        }
        for (let i of config.prob) {
            rewards.max_num = i.Max > rewards.max_num ? i.Max : rewards.max_num
        }

        if (rewards) {
            this.setItems(rewards)
        }
    }

    setItems(item) {
        this.setActive("node/awards/wcoin", false)
        this.setActive("node/awards/lottery", false)
        this.setActive("node/awards/diamond", false)
        if (item.item_id === Constants.ITEM_INDEX.WCOIN || !item.item_id) {
            this.setActive("node/awards/wcoin", true)
            this.setLabelValue("node/awards/wcoin/num", Helper.FormatNumWY(item.max_num))
            this.setSpriteFrame("node/awardIcon/icon", "image/icon/big_weibi", true)
        } else if (item.item_id === Constants.ITEM_INDEX.LOTTERY) {
            this.setActive("node/awards/lottery", true)
            this.setLabelValue("node/awards/lottery/num", Helper.FormatNumWY(item.max_num))
            this.setSpriteFrame("node/awardIcon/icon", "image/icon/big-jiangquan", true)
        } else if (item.item_id === Constants.ITEM_INDEX.DIAMOND) {
            this.setActive("node/awards/diamond", true)
            this.setLabelValue("node/awards/diamond/num", Helper.FormatNumPrice(item.max_num / 100))
            this.setSpriteFrame("node/awardIcon/icon", "image/icon/big_zuanshi", true)
        }
    }

    createAdOrder() {
        this.node.pauseAllActions()
        let self = this
        if (this.param.activity_id) {
            AdSrv.createAdOrder(this.param.ad_aid, JSON.stringify(this.param), (order_no: string) => {
                self.node.resumeAllActions()
                if (order_no && order_no.length > 0) {
                    self._adIndex++
                    if (self._adCount > 0 && self._adCount > self._adIndex) {
                        AdSrv.completeAdOrder((res) => {
                            if (self.param.activity_id === 1007) {
                                ActivitySrv.GetReward(self.param.activity_id, self._adIndex - 1)
                            } else {
                                if (res && res.code == "00000") {
                                    if (res.award_list) {
                                        let res1 = JSON.parse(res.award_list)
                                        if (res1 && res1.err_code == 1) {
                                            UIMgr.OpenUI("component/Shop/GetAwardEntry", { param: { awards: res1.award_item } })
                                        }
                                    }
                                }
                            }
                        })
                        self.setLabelValue("node/btnAd/Background/info/count", "(" + this._adIndex + "/" + this._adCount + ")")
                    } else {
                        AdSrv.completeAdOrder((res) => {
                            if (self.param.activity_id === 1007) {
                                ActivitySrv.GetReward(self.param.activity_id, self._adIndex - 1, (res1) => {
                                    if (res1 && res1.err_code == 1 && res1.award_item) {
                                        UIMgr.OpenUI("component/Shop/GetAwardEntry", { param: { awards: res1.award_item }, closeCb: () => self.close() })
                                    }
                                })
                            } else {
                                if (res && res.code == "00000") {
                                    if (res.award_list) {
                                        let res1 = JSON.parse(res.award_list)
                                        if (res1 && res1.err_code == 1) {
                                            UIMgr.OpenUI("component/Shop/GetAwardEntry", { param: { awards: res1.award_item }, closeCb: () => self.close()})
                                        }
                                    }
                                }
                            }
                        })
                        // self.close()
                    }
                }
            })
        } else if (this.param.task_id) {
            let activity = null

            if (this.param.group_id === 1005 || this.param.group_id === 1006) {
                activity = ActivitySrv.GetActivityById(1009)
            }

            if (activity && activity.ad_aid > 0) {
                AdSrv.createAdOrder(activity.ad_aid, JSON.stringify(activity), (order_no: string) => {
                    self.node.resumeAllActions()
                    if (order_no && order_no.length > 0) {
                        AdSrv.completeAdOrder((res) => {
                            if (res && res.code == "00000") {
                                TaskSrv.GetAward(this.param.task_id, (res) => {
                                    for (let v of res.award_list) {
                                        v.item_id = v.id
                                        v.item_num = v.num
                                    }
                                    UIMgr.OpenUI("component/Shop/GetAwardEntry", { param: { awards: res.award_list, autoOpenBox: true } })
                                    self.close()
                                    let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
                                    TaskSrv.GetNextTask(user.userLife <= 4 ? "1005" : "1006")
                                })
                            }
                        })
                    }
                })
            } else {
                self.node.resumeAllActions()
            }
        }
    }
}
