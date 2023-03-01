/*
 * @Description: 比赛模块 数据填充
 * @Version: 1.0
 * @Autor: sonke
 * @Date: 20210330 1528
 * @LastEditors: sonke
 * @LastEditTime: 20210331 1712
 */

import BaseUI from "../../script/base/BaseUI";
import { EventMgr } from "../../script/base/EventMgr";
import { Constants } from "../../script/igsConstants";
import { Helper } from "../../script/system/Helper";
import { MatchSvr } from "../../script/system/MatchSvr";
import { DataMgr } from "../../script/base/DataMgr";
import MatchList from "./MatchList";
import { UIMgr } from "../../script/base/UIMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MatchMode extends BaseUI {

    acticeIconBg: cc.SpriteFrame = new cc.SpriteFrame()

    _bHighLight: boolean = false
    _bHighLightAni: cc.Tween = null
    _bInit: boolean = false

    _updateTime: number = 0

    _bUpdate: boolean = false

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
        this.setButtonClick(this.node, () => {
            this.joinMatch()
        })
        this._bInit = true

        EventMgr.on(Constants.EVENT_DEFINE.NOTICE_TASK_EVENT, (msg) => {
            if (msg.match_cid == this.param.matchId) {
                this.joinMatch()
            }
        }, this)
    }

    initData() {
        let data: IMatchInfo = this.param
        if (data["_noInit"]) {
            return
        }

        // console.log("MatchMode " + JSON.stringify(data))
        let now = Math.floor(Date.now() / 1000)
        this.setActive("top", undefined !== data.highMsg && null !== data.highMsg)
        this.setLabelValue("top/msg", data.highMsg)
        this._bHighLight = data.highLight
        this.highLight()

        this.setLabelValue("info/detail/name", data.name)
        this.setLabelValue("info/detail/desc", data.desc)

        if (!!data.isMultiplayer) {
            this.setSpriteFrame("info", this.getNodeComponent("duorensai", cc.Sprite)?.spriteFrame)
        }

        if (data.startTime > 0) {
            if (now <= data.endTime && now >= data.startTime) {
                this.setActive("info/detail/btnJoin", true)
                this.setActive("info/detail/wait", false)

                if (data.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {

                } else {
                    this.setLabelValue("info/detail/desc", "每轮持续:" + Helper.FormatTimeString(data.endTime - data.startTime, "h小时"))
                }
            } else if (now >= data.startTime - data.forwordShowTime) {
                this.setLabelValue("info/detail/desc", "开始时间" + Helper.FormatTimeString(data.startTime * 1000, "mm-dd hh:mm"))

                this.setActive("info/detail/btnJoin", false)
                this.setActive("info/detail/wait", true)
                Helper.DelayFun(() => {
                    this.initData()
                }, data.startTime - now + 1)

                if (data.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
                    this.node.active = false
                }
            } else if (now > data.endTime || now < data.startTime - data.forwordShowTime) {
                this.setActive("info/detail/btnJoin", false)
                this.setActive("info/detail/wait", true)
                this.setLabelValue("info/detail/desc", data.desc)

                if (data.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
                    this.node.active = false
                }
            }
        } else if (data.realTime) {
            this.setActive("info/detail/wait", false)
            this.setActive("info/detail/join", false)
            this.setActive("info/detail/realtime", true)
        } else {
            this.setLabelValue("info/detail/btnJoin/name", "报名")
            if (data.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
                if (null !== data.endTime) {
                    MatchSvr.GetNextActivityMatch(data.matchId)
                }
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
            if (data.type === Constants.MATCH_TYPE.ACTIVITY_MATCH || data.roundPlayer > 2) {
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
            }

            this.setItems("info/btm/award/awardlist", awards)
            awards = awards.filter(i => (i.id === Constants.ITEM_INDEX.GOLD || i.id === Constants.ITEM_INDEX.LOTTERY || i.id === Constants.ITEM_INDEX.CREDITS) && i.num > 0)
            if (awards.length > 0) {
                if (awards[0].id === Constants.ITEM_INDEX.GOLD) {
                    this.setActive("info/icon/gold", true)
                    this.setActive("info/icon/lottery", false)
                    this.setActive("info/icon/credits", false)
                } else if (awards[0].id === Constants.ITEM_INDEX.LOTTERY) {
                    this.setActive("info/icon/gold", false)
                    this.setActive("info/icon/lottery", true)
                    this.setActive("info/icon/credits", false)
                } else if (awards[0].id === Constants.ITEM_INDEX.CREDITS) {
                    this.setActive("info/icon/gold", false)
                    this.setActive("info/icon/lottery", false)
                    this.setActive("info/icon/credits", true)
                }
                this.setLabelValue("info/icon/num", Helper.FormatNumWY(awards[0].num))
            }
        }

        let gateMoney = data.gateMoney.filter(i => (i.id === Constants.ITEM_INDEX.GOLD || i.id === Constants.ITEM_INDEX.LOTTERY) && i.num > 0)

        if (data.freeAd || gateMoney.length === 0) {
            this.setLabelValue("info/btm/gateMoney/list/tip", "免费入场")
            this.setActive("info/btm/gateMoney/list/gold", false)
            this.setActive("info/btm/gateMoney/list/lottery", false)
            this.setActive("info/btm/gateMoney/list/num", false)
        } else {
            if (gateMoney[0].id === Constants.ITEM_INDEX.GOLD) {
                this.setActive("info/btm/gateMoney/list/gold", true)
                this.setActive("info/btm/gateMoney/list/lottery", false)
            } else if (gateMoney[0].id === Constants.ITEM_INDEX.LOTTERY) {
                this.setActive("info/btm/gateMoney/list/gold", false)
                this.setActive("info/btm/gateMoney/list/lottery", true)
            }
            this.setLabelValue("info/btm/gateMoney/list/num", gateMoney[0].num)
        }

        this.setActive("info/detail/join/bofang", !!data.freeAd && data.type !== Constants.MATCH_TYPE.ACTIVITY_MATCH && data.roundPlayer <= 2)

        this.update(1)
    }

    update(dt) {
        this._updateTime += dt
        if (this._updateTime <= 1) {
            return
        }

        this._updateTime = 0

        let data: IMatchInfo = this.param
        if (!data || data.type !== Constants.MATCH_TYPE.ACTIVITY_MATCH || this._bUpdate) {
            return
        }

        let matchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)
        data = matchs[data.matchId]
        if (!data) {
            this.node.removeFromParent(true)
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.UPDATE_MATCH_LIST_CHILDREN)
            return
        }

        if (data.startTime > 0) {
            let now = Date.now() / 1000
            if (now < data.startTime - data.forwordShowTime) { // 显示时间前
                if (data.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
                    if (this.node.opacity === 255) {
                        this.node.opacity = 0
                        this.setNodeComponentEnabled(this.node, cc.Layout, false)
                        this.node.setContentSize(this.node.width, 0)
                        this.node.parent.parent.getComponent(MatchList).updateDataList()
                    }
                }
            } else if (now >= data.startTime - data.forwordShowTime && now < data.startTime) { // 显示时间-开始时间
                if (data.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
                    if (this.node.opacity === 0) {
                        this.node.opacity = 255
                        this.setNodeComponentEnabled(this.node, cc.Layout, true)
                        this.node.setContentSize(this.node.width, 155)
                        this.node.parent.parent.getComponent(MatchList).updateDataList()
                    }

                    let time = Math.ceil(data.startTime - now)
                    this.setLabelValue("info/detail/desc",
                        "开始倒计时:" + (time > 86400 ?
                            Helper.FormatTimeString(time * 1000, "d天 hh:mm:ss") :
                            Helper.FormatTimeString(time * 1000, "hh:mm:ss"))
                    )
                }
            } else if (now >= data.startTime && now <= data.endTime) { // 开始时间-结束时间
                if (data.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
                    if (this.node.opacity === 0) {
                        this.node.opacity = 255
                        this.setNodeComponentEnabled(this.node, cc.Layout, true)
                        this.node.setContentSize(this.node.width, 155)
                        this.node.parent.parent.getComponent(MatchList).updateDataList()
                    }

                    let time = Math.ceil(data.endTime - now)
                    this.setLabelValue("info/detail/desc",
                        "结束倒计时:" + (time > 86400 ?
                            Helper.FormatTimeString(time * 1000, "d天 hh:mm:ss") :
                            Helper.FormatTimeString(time * 1000, "hh:mm:ss"))
                    )
                }
            } else if (now > data.endTime) { // 结束时间后
                this._bUpdate = true
                let self = this
                MatchSvr.GetNextActivityMatch(data.matchId, () => {
                    self._bUpdate = false
                })
                if (!!data.endTime) {
                    return
                }
                this.node.active = false
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
        if (data["_noInit"]) {
            this.setButtonClickDelay("list/realtime", 1)
            UIMgr.OpenUI("lobby", "component/match/realTimeMatch/matchStart/RealTimeMatchStart", { single: true, param: { isAd: data.freeAd } })
            return
        }

        if (data.type === Constants.MATCH_TYPE.TOURNEY_MATCH || data.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
            let now = Date.now() / 1000
            if (data.startTime && data.startTime > now) {
                let param = {
                    buttons: 1,
                    cancelName: "确定",
                    param: { msg: "本赛事还未开始\n请选择其他比赛进行游戏!" }
                }
                Helper.OpenPopUI("component/base/MsgEntry", "提示", param)
                return
            } else if (data.endTime && data.endTime < now) {
                let param = {
                    buttons: 1,
                    cancelName: "确定",
                    param: { msg: "比赛已结束!" }
                }
                Helper.OpenPopUI("component/base/MsgEntry", "提示", param)
                return
            }

            this.setButtonClickDelay(this.node, 3)
            if (data.realTime) {
                // UIMgr.OpenUI("igaoshou", "component/matchStart/MatchStart", { single: true, param: { matchId: data.matchId } })                
            } else if (data.type === Constants.MATCH_TYPE.ACTIVITY_MATCH && data.curMatchId) {
                MatchSvr.GetActivityMatch(data.curMatchId, (result) => {
                    if (result) {
                        let matchs: TMatchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)
                        if (matchs[data.matchId]) {
                            matchs[data.matchId].curTimes = result.curStage || 0
                            DataMgr.setData(Constants.DATA_DEFINE.MATCH_CONFIG, matchs)
                        }

                        if (!result.curStage) {
                            UIMgr.OpenUI("igaoshou", "component/matchDetail/MatchDetail", { param: { match: matchs[data.matchId] } })
                        } else {
                            UIMgr.OpenUI("lobby", "component/match/activityMatch/ActivityMatchList", { param: { data: result } })
                        }
                    }
                })
            } else if (data.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
                MatchSvr.GetNextActivityMatch(data.matchId, (res) => {
                    MatchSvr.GetActivityMatch(res.curMatchId, (result) => {
                        if (result) {
                            let matchs: TMatchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)
                            if (matchs[res.matchId]) {
                                matchs[res.matchId].curTimes = result.curStage || 0
                                DataMgr.setData(Constants.DATA_DEFINE.MATCH_CONFIG, matchs)
                            }

                            if (!result.curStage) {
                                UIMgr.OpenUI("igaoshou", "component/matchDetail/MatchDetail", { param: { match: matchs[res.matchId] } })
                            } else {
                                UIMgr.OpenUI("lobby", "component/match/activityMatch/ActivityMatchList", { param: { data: result } })
                            }
                        }
                    })
                })
            } else {
                UIMgr.OpenUI("igaoshou", "component/matchDetail/MatchDetail", { param: { match: data } })
            }
        } else if (data.roundPlayer > 2) {
            UIMgr.OpenUI("igaoshou", "component/matchDetail/MatchDetail", { param: { match: data } })
        } else {
            MatchSvr.JoinMatch(data.matchId)
        }
    }

    setItems(name, items: TItems) {
        this.setActive(name + "/gold", false)
        this.setActive(name + "/lottery", false)
        this.setActive(name + "/credits", false)
        items = items["sort"]((a, b) => { return a.id < b.id ? -1 : 1 })
        let idx = 0
        this.setActive(name + "/medal", false)
        this.setActive(name + "/medal/gold", false)
        this.setActive(name + "/medal/silver", false)
        for (let i in items) {
            if (items[i].id === Constants.ITEM_INDEX.GOLD) {
                this.setActive(name + "/gold", true)
                this.setLabelValue(name + "/gold/num", Helper.FormatNumWYCN(items[i].num))
            } else if (items[i].id === Constants.ITEM_INDEX.LOTTERY) {
                this.setActive(name + "/lottery", true)
                this.setLabelValue(name + "/lottery/num", Helper.FormatNumWYCN(items[i].num))
                this.setActive(name + "/lottery/add", idx > 0)
            } else if (items[i].id === Constants.ITEM_INDEX.CREDITS) {
                this.setActive(name + "/credits", true)
                this.setLabelValue(name + "/credits/num", Helper.FormatNumWYCN(items[i].num))
                this.setActive(name + "/credits/add", idx > 0)
            } else if (items[i].id === Constants.ITEM_INDEX.GoldenMedal) {
                this.setActive(name + "/medal", true)
                this.setActive(name + "/medal/gold", true)
                this.setLabelValue(name + "/medal/num", Helper.FormatNumWYCN(items[i].num))
                this.setActive(name + "/medal/add", idx > 0)
            } else if (items[i].id === Constants.ITEM_INDEX.SilverMedal) {
                this.setActive(name + "/medal", true)
                this.setActive(name + "/medal/silver", true)
                this.setLabelValue(name + "/medal/num", Helper.FormatNumWYCN(items[i].num))
                this.setActive(name + "/medal/add", idx > 0)
            } else {
                continue
            }
            idx++
        }
    }
}
