/*
 * @Description: 比赛模块 数据填充
 * @Version: 1.0
 * @Autor: sonke
 * @Date: 20210330 1528
 * @LastEditors: sonke
 * @LastEditTime: 20210331 1712
 */

import BaseUI from "../../base/BaseUI";
import { Constants } from "../../constants";
import { Helper } from "../../system/Helper";
import { MatchSvr } from "../../system/MatchSvr";
import { EventMgr } from "../../base/EventMgr";
import { UIMgr } from "../../base/UIMgr";
import { DataMgr } from "../../base/DataMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MatchMode extends BaseUI {

    @property({
        type: cc.SpriteFrame
    })
    activityIcon: cc.SpriteFrame = new cc.SpriteFrame()

    @property({
        type: cc.SpriteFrame
    })
    activityIconBg: cc.SpriteFrame = new cc.SpriteFrame()

    @property({
        type: cc.SpriteFrame
    })
    battleIcon: cc.SpriteFrame = new cc.SpriteFrame()

    @property({
        type: cc.SpriteFrame
    })
    battleIconBg: cc.SpriteFrame = new cc.SpriteFrame()

    @property({
        type: cc.SpriteFrame
    })
    practiceIcon: cc.SpriteFrame = new cc.SpriteFrame()

    @property({
        type: cc.SpriteFrame
    })
    practiceIconBg: cc.SpriteFrame = new cc.SpriteFrame()

    _bHighLight: boolean = false
    _bHighLightAni: cc.Tween = null
    _bInit: boolean = false

    onOpen() {
        // this.initEvent()
        // this.initData()
    }

    setParam(param) {
        this.param = param
        this.initData()
        this.initEvent()
    }

    initEvent() {
        if (this._bInit) {
            return
        }
        this.setButtonClick(this.node, this.joinMatch.bind(this))
        this._bInit = true
    }

    initData() {
        let data: IMatchInfo = this.param
        let now = Math.floor(Date.now() / 1000)
        this.setActive("top", undefined !== data.highMsg && null !== data.highMsg)
        this.setLabelValue("top/msg", data.highMsg)
        this._bHighLight = data.highLight
        this.highLight()

        this.setLabelValue("info/detail/name", data.name)
        this.setLabelValue("info/detail/desc", data.desc)
        if (data.startTime) {
            if (data.startTime > now) {
                this.setLabelValue("info/detail/desc", "开始时间" + Helper.FormatTimeString(data.startTime * 1000, "mm-dd hh:mm"))

                this.setActive("info/detail/btnJoin", false)
                this.setActive("info/detail/wait", true)
                Helper.DelayFun(() => {
                    this.initData()
                }, data.startTime - now + 1)

                if (data.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
                    this.node.active = data.startTime - data.forwordShowTime < now
                    let time = Math.ceil(data.startTime - Date.now() / 1000)
                    let label = this.getNodeComponent("info/detail/desc", cc.Label)
                    label.string = "开赛倒计时:" + (time > 86400 ? Helper.FormatTimeString(time * 1000, "d天 hh:mm:ss") : Helper.FormatTimeString(time * 1000, "hh:mm:ss"))
                    label.node.stopAllActions()
                    cc.tween(label.node)
                        .repeatForever(
                            cc.tween()
                                .delay(1)
                                .call(() => { 
                                    let time = Math.ceil(data.startTime - Date.now() / 1000)
                                    label.string = "开赛倒计时:" + (time > 86400 ? Helper.FormatTimeString(time * 1000, "d天 hh:mm:ss") : Helper.FormatTimeString(time-- * 1000, "hh:mm:ss")) 
                                    if (time <= 0) {
                                        this.setLabelValue("info/detail/desc", data.desc)
                                        label.node.stopAllActions()
                                    }
                                })
                        )                       
                        .start()
                }
            } else if (data.endTime > now) {
                this.setActive("info/detail/btnJoin", true)
                this.setActive("info/detail/wait", false)

                if (data.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
                    this.node.active = true
                    let time = Math.ceil(data.endTime - Date.now() / 1000)
                    let label = this.getNodeComponent("info/detail/desc", cc.Label)
                    label.string = "结束倒计时:" + (time > 86400 ? Helper.FormatTimeString(time * 1000, "d天 hh:mm:ss") : Helper.FormatTimeString(time * 1000, "hh:mm:ss"))
                    label.node.stopAllActions()
                    cc.tween(label.node)
                        .repeatForever(
                            cc.tween()
                                .delay(1)
                                .call(() => { 
                                    let time = Math.ceil(data.endTime - Date.now() / 1000)
                                    label.string = "结束倒计时:" + (time > 86400 ? Helper.FormatTimeString(time * 1000, "d天 hh:mm:ss") : Helper.FormatTimeString(time * 1000, "hh:mm:ss")) 
                                    if (time <= 0) {
                                        MatchSvr.GetNextActivityMatch(data.matchId, (match) => match.startTime && this.initData())
                                        label.node.stopAllActions()
                                    }
                                })
                        )                        
                        .start()
                } else {
                    this.setLabelValue("info/detail/desc", "每轮持续:" + Helper.FormatTimeString(data.endTime - data.startTime, "h小时"))
                }
            } else if (now > data.endTime) {
                this.setActive("info/detail/btnJoin", false)
                this.setActive("info/detail/wait", true)
                this.setLabelValue("info/detail/desc", data.desc)

                if (data.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
                    MatchSvr.GetNextActivityMatch(data.matchId)//, (match) => match.startTime && this.initData())
                    this.node.active = false
                }
            }
        } else {
            this.setLabelValue("info/detail/btnJoin/name", "报名")
            if (data.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
                MatchSvr.GetNextActivityMatch(data.matchId)
                this.node.active = false
            }
        }

        if (data.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
            this.setLabelValue("info/btm/players/num", "∞玩家")
        } else {
            this.setLabelValue("info/btm/players/num", data.maxPlayer + " 玩家")
        }


        if (data.awards) {
            let awards = MatchSvr.GetAwards(data.matchId, 1)
            if (data.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
                awards = []
                for (let i in data.awards) {
                    for (let j of data.awards[i].items) {
                        if (awards[j.id]) {
                            awards[j.id].num += j.num * (data.awards[i].end - data.awards[i].start + 1)
                        } else {
                            awards[j.id] = { id: j.id, num: j.num * (data.awards[i].end - data.awards[i].start + 1) }
                        }
                    }
                }
                this.setLabelValue("info/btm/award/awardlist/tip", "总奖品")
            }

            this.setItems("info/btm/award/awardlist", awards)
            let tipAward = awards
            let str = ""
            if (tipAward[0].id === Constants.ITEM_INDEX.LOTTERY) {
                str = "j" + Helper.FormatNumQWY(tipAward[0].num)
            } else if (tipAward[0].id === Constants.ITEM_INDEX.WCOIN) {
                str = "g" + Helper.FormatNumQWY(tipAward[0].num)
            } else if (tipAward[0].id === Constants.ITEM_INDEX.DIAMOND) {
                str = "d" + Helper.FormatNumPrice(tipAward[0].num / 100)
            }
            this.setLabelValue("info/icon/icon/num", str)
        }

        let free = true
        data.gateMoney.forEach(i => i.num > 0 ? free = false : "")

        if (data.freeAd || free) {
            this.setLabelValue("info/btm/gateMoney/list/tip", "免费入场")
            this.setActive("info/btm/gateMoney/list/wcoin", false)
            this.setActive("info/btm/gateMoney/list/lottery", false)
            this.setActive("info/btm/gateMoney/list/diamond", false)
        } else {
            this.setItems("info/btm/gateMoney/list", data.gateMoney)
        }

        this.setActive("info/detail/btnJoin/bofang", !!data.freeAd)

        if (data.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
            this.setSpriteFrame("info/icon", this.activityIconBg)
            this.setSpriteFrame("info/icon/icon", this.activityIcon)
        } else if (data.type === Constants.MATCH_TYPE.BATTLE_MATCH) {
            this.setSpriteFrame("info/icon", this.battleIconBg)
            this.setSpriteFrame("info/icon/icon", this.battleIcon)
        } else if (data.type === Constants.MATCH_TYPE.PRACTICE_MATCH) {
            this.setSpriteFrame("info/icon", this.practiceIconBg)
            this.setSpriteFrame("info/icon/icon", this.practiceIcon)
        } else if (data.type === Constants.MATCH_TYPE.TOURNEY_MATCH) {
            if (data.gateMoney[0] && data.gateMoney[0].id === Constants.ITEM_INDEX.DIAMOND) {
                this.setSpriteFrame("info/icon", this.battleIconBg)
                this.setSpriteFrame("info/icon/icon", this.battleIcon)
            } else {
                this.setSpriteFrame("info/icon", this.practiceIconBg)
                this.setSpriteFrame("info/icon/icon", this.practiceIcon)
            }
        }
    }

    onEnable() {
        // this.highLight()
    }

    onDisable() {

    }

    highLight() {
        if (this._bHighLightAni) {
            this._bHighLightAni.stop()
            this._bHighLightAni = null
        }

        if (!this._bHighLight) {
            cc.tween(this.node).to((1 - this.node.scale) / .8, { scale: 1 }).start()
        } else {
            this.node.scale = 1
            this._bHighLightAni = cc.tween(this.node)
                .repeatForever(cc.tween()
                    .to(.8, { scale: .95 })
                    .to(.8, { scale: 1 }))
                .start()

            Helper.DelayFun(() => EventMgr.dispatchEvent(Constants.EVENT_DEFINE.MATCH_HIGH_LIGHT_DIRECT, { target: this.node }), 1)
        }
    }

    joinMatch() {
        let data: IMatchInfo = this.param
        if (data.type === Constants.MATCH_TYPE.TOURNEY_MATCH || data.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
            let now = Date.now() / 1000
            if (data.startTime && data.startTime > now) {
                let param = {
                    buttons: 1,
                    cancelName: "确定",
                    param: { msg: "本赛事还未开始\n请选择其他比赛进行游戏!" }
                }
                Helper.OpenPopUI("component/Base/MsgEntry", "提示", param)
                return
            } else if (data.endTime && data.endTime < now) {
                let param = {
                    buttons: 1,
                    cancelName: "确定",
                    param: { msg: "比赛已结束!" }
                }
                Helper.OpenPopUI("component/Base/MsgEntry", "提示", param)
                return
            }

            this.setButtonClickDelay(this.node, 3)
            if (data.type === Constants.MATCH_TYPE.ACTIVITY_MATCH && data.curMatchId) {
                MatchSvr.GetActivityMatch(data.curMatchId, (result) => {
                    if (result) {
                        let matchs: TMatchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)
                        if (matchs[data.matchId]) {
                            matchs[data.matchId].curTimes = result.curStage || 0
                            DataMgr.setData(Constants.DATA_DEFINE.MATCH_CONFIG, matchs)    
                        }
                        
                        if (!result.curStage) {
                            Helper.OpenPageUI("component/Match/MatchDetailEntry", "", null, { match: matchs[data.matchId] })
                        } else {
                            UIMgr.OpenUI("component/Match/ActivityMatchList", { param: { data: result } })
                        }
                    }
                })
            } else {
                Helper.OpenPageUI("component/Match/MatchDetailEntry", "", null, { match: data })
            }
        } else {
            MatchSvr.JoinMatch(data.matchId)
        }
    }

    setItems(name, items: TItems) {
        this.setActive(name + "/wcoin", false)
        this.setActive(name + "/lottery", false)
        this.setActive(name + "/diamond", false)
        items = items["sort"]((a, b) => { return a.id < b.id ? -1 : 1 })
        let idx = 0
        this.setActive(name + "/medal", false)
        this.setActive(name + "/medal/gold", false)
        this.setActive(name + "/medal/silver", false)
        for (let i in items) {
            if (items[i].id === Constants.ITEM_INDEX.WCOIN) {
                this.setActive(name + "/wcoin", true)
                this.setLabelValue(name + "/wcoin/num", Helper.FormatNumWY(items[i].num))
            } else if (items[i].id === Constants.ITEM_INDEX.LOTTERY) {
                this.setActive(name + "/lottery", true)
                this.setLabelValue(name + "/lottery/num", Helper.FormatNumWY(items[i].num))
                this.setActive(name + "/lottery/add", idx > 0)
            } else if (items[i].id === Constants.ITEM_INDEX.DIAMOND) {
                this.setActive(name + "/diamond", true)
                this.setLabelValue(name + "/diamond/num", items[i].num >= 10000 ? Helper.FormatNumWY(items[i].num) : Helper.FormatNumPrice(items[i].num / 100))
                this.setActive(name + "/diamond/add", idx > 0)
            } else if (items[i].id === Constants.ITEM_INDEX.GoldenMedal) {
                this.setActive(name + "/medal", true)
                this.setActive(name + "/medal/gold", true)
                this.setLabelValue(name + "/medal/num", Helper.FormatNumWY(items[i].num))
                this.setActive(name + "/medal/add", idx > 0)
            } else if (items[i].id === Constants.ITEM_INDEX.SilverMedal) {
                this.setActive(name + "/medal", true)
                this.setActive(name + "/medal/silver", true)
                this.setLabelValue(name + "/medal/num", Helper.FormatNumWY(items[i].num))
                this.setActive(name + "/medal/add", idx > 0)
            } else {
                continue
            }
            idx++
        }
    }
}
