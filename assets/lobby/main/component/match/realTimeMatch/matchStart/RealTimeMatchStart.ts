import BaseUI from "../../../../../start/script/base/BaseUI";
import { DataMgr } from "../../../../../start/script/base/DataMgr";
import { EventMgr } from "../../../../../start/script/base/EventMgr";
import { Constants } from "../../../../../start/script/igsConstants";
import { Helper } from "../../../../../start/script/system/Helper";
import { User } from "../../../../../start/script/data/User";
import { MatchSvr } from "../../../../../start/script/system/MatchSvr";
import { ActivitySrv } from "../../../../../start/script/system/ActivitySrv";
import { AdSrv } from "../../../../../start/script/system/AdSrv";
import { UIMgr } from "../../../../../start/script/base/UIMgr";
import { UserSrv } from "../../../../../start/script/system/UserSrv";

const { ccclass, property } = cc._decorator;

const FACES = [
    { avatar: "faces/7", userName: "简天宇", region: "上海市" },
    { avatar: "faces/8", userName: "糖尛果", region: "北京市" },
    { avatar: "faces/9", userName: "Raymond", region: "青岛市" },
    { avatar: "faces/10", userName: "葛先生", region: "杭州市" },
    { avatar: "faces/11", userName: "笑看人生", region: "齐齐哈尔市" },
    { avatar: "faces/12", userName: "Watson", region: "长沙市" },
    { avatar: "faces/13", userName: "李美琳～熹茗", region: "大连市" },
    { avatar: "faces/14", userName: "娟毛儿、", region: "拉萨市" },
    { avatar: "faces/15", userName: "开心就好", region: "武汉市" },
    { avatar: "faces/16", userName: "日月明", region: "重庆市" },
    { avatar: "faces/17", userName: "差一点", region: "成都市" },
]

const MSG = "正在寻找比赛..."

@ccclass
export default class RealTimeMatchStart extends BaseUI {

    _list: cc.Node = null
    _bWait: boolean = false

    _bJoinReq = null
    _bConfirm: boolean = false

    _opponents = []
    _opponentIdx: number = 0
    _updateTime: number = 0

    _bWaitTime: number = 0

    _bInit: boolean = false

    onOpen() {
        this.initEvent()
        this.initData()
    }

    initEvent() {
        if (this._bInit) return
        DataMgr.feed(Constants.DATA_DEFINE.REAL_TIME_LIST, this.updateButtonState, this)
        EventMgr.on(Constants.EVENT_DEFINE.REALTIME_MATCH_CONFIRM, this.openMatchConfirm, this)
        EventMgr.on(Constants.EVENT_DEFINE.REALTIME_MATCH_CONFIRM_BACK, this.matchConfirmBack, this)
        EventMgr.on(Constants.EVENT_DEFINE.GAME_START, this.onGameStart, this)

        this.setButtonClick("content/btnStart", () => this.onPressJoin())
        this._bInit = true
    }

    initData() {
        let isAd = this.param.isAd
        // let type = this.param.type || Constants.ITEM_INDEX.LOTTERY
        // if (type === Constants.ITEM_INDEX.LOTTERY) {
        //     this.setActive("content/item/gold", false)
        //     this.setActive("content/item/lottery", true)            
        this.setRichTextValue("content/item/numl", Helper.FormatNumWYCNinRichText(User.Lottery, 36))
        // } else {
        //     this.setActive("content/item/gold", true)
        //     this.setActive("content/item/lottery", false)            
        this.setRichTextValue("content/item/numg", Helper.FormatNumWYCNinRichText(User.Gold, 36))
        // }

        this._list = this.getNode("content/list")

        let matchs: TMatchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)
        let list = []
        for (let i in matchs) {
            if (matchs[i]?.realTime && matchs[i].gameId === DataMgr.data.Config.gameId) {
                if (isAd && matchs[i].freeAd) {
                    list.push(matchs[i])
                } else if (!isAd && !matchs[i].freeAd && matchs[i].gateMoney.filter(i => (i.id === Constants.ITEM_INDEX.GOLD || i.id === Constants.ITEM_INDEX.LOTTERY) && i.num > 0).length > 0) {
                    list.push(matchs[i])
                }
            }
        }

        this.setActive("content/btnStart/Background/anniu-bofang", isAd)

        let record = DataMgr.getData(Constants.DATA_DEFINE.NEWBIE_LIST) || {}
        this.setChildParam("content/list/MatchTable", { list: list, isNewbie: record[22] !== 1 })

        this.updateScene(!!this.param?.start)

        this.checkGuide()
    }

    onPressBack() {
        if (this._bWait) {
            let param = {
                param: { msg: "\n 是否停止匹配并重新选择赛事？\n" },
                confirmName: "取消",
                cancelName: "确定",
                cancel: () => this.updateScene(false),
            }
            Helper.OpenPopUI("component/base/MsgEntry", "提示", param)
        } else {
            this.close()
        }
    }

    onPressJoin() {
        let list = DataMgr.getData<string[]>(Constants.DATA_DEFINE.REAL_TIME_LIST) || []
        if (list.length <= 0) {
            Helper.OpenTip("请选择至少一场比赛！")
            return
        }

        this.setButtonClickDelay("content/btnStart", 3)
        // MatchSvr.JoinRealTimeMatch(list, (err) => !err && this.updateScene(true))
        this.updateScene(true)
    }

    updateButtonState() {
        let list = DataMgr.getData<string[]>(Constants.DATA_DEFINE.REAL_TIME_LIST) || []
        this.setButtonInfo("content/btnStart", { interactable: list.length > 0 })
        this.setActive("content/msg", list.length === 0)
    }

    updateScene(bWait: boolean) {
        if (this._bJoinReq) {
            clearTimeout(this._bJoinReq)
            this._bJoinReq = null
        }

        if (!bWait) {
            this.setActive("content/tip", true)
            this.setActive("content/btnStart", true)
            this.setActive("content/opponent", false)
            this.updateButtonState()

            this._list.height = this.getNode("content").height - 270 - 250
            this.stopTween(this._list)
            this.runTween(this._list, cc.tween().to(.2, { position: cc.v3(0, this.getNode("content").height / 2 - 270) }))
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.REALTIME_MATCH_TABLE_STATE, { state: 0 })

            MatchSvr.CancelRealTimeMatch()

            if (this._bJoinReq) {
                clearTimeout(this._bJoinReq)
                this._bJoinReq = null
            }

            this._bWaitTime = 0

            this._bWait = false
        } else {
            let match = () => {
                let list = DataMgr.getData<string[]>(Constants.DATA_DEFINE.REAL_TIME_LIST) || []
                if (list.length <= 0) {
                    this.updateScene(false)
                    return
                }

                this.setActive("content/tip", false)
                this.setActive("content/btnStart", false)
                this.setActive("content/opponent", true)

                let time = DataMgr.getData<number>(Constants.DATA_DEFINE.REALTIME_WAIT_TIME) || (Math.random() * 100000 % 10000 + 10000)
                time += Math.random() * 100000 % 10000
                if (time >= 180000) {
                    time = 180000
                }
                this.setLabelValue("content/opponent/expectTime", "预计等待时间: " + Helper.FormatTimeString(time, "mm:ss"))

                this._list.height = this.getNode("content").height - 490 - 250
                this.stopTween(this._list)
                this.runTween(this._list, cc.tween().to(.2, { position: cc.v3(0, this.getNode("content").height / 2 - 490) }))
                EventMgr.dispatchEvent(Constants.EVENT_DEFINE.REALTIME_MATCH_TABLE_STATE, { state: 1 })

                MatchSvr.JoinRealTimeMatch(list, (err) => {
                    if (err) {
                        this.updateScene(false)
                        return
                    }
                    this.updateOpponent(MatchSvr.GetOpponentList())
                    this._opponentIdx = 0
                })
                if (this._bJoinReq) {
                    clearTimeout(this._bJoinReq)
                    this._bJoinReq = null
                }

                let req = () => {
                    MatchSvr.JoinRealTimeMatch(list, (err) => {
                        if (err) {
                            this.updateScene(false)
                            return
                        }
                        this._bJoinReq = setTimeout(() => req(), 15000)
                    })
                }

                this._bJoinReq = setTimeout(() => req(), 15000)
                this._bWaitTime = Date.now()
            }

            MatchSvr.checkRealTimeMatch((res) => {
                if (null === res) {
                    if (this.param.isAd) {
                        let activity = ActivitySrv.GetActivityById(1010)
                        console.log(activity)
                        if (activity && activity.ad_aid > 0) {
                            let num = (activity.receive_num || 0)
                            if (num < activity.day_times) {
                                AdSrv.PlayAD(activity.ad_aid, JSON.stringify(activity))
                                    .then(() => match())
                                    .catch(() => { })
                            } else {
                                let param = {
                                    buttons: 1,
                                    cancelName: "确定",
                                    param: { msg: "本赛事今日参与次数已用完\n请选择其他比赛进行游戏!" }
                                }
                                Helper.OpenPopUI("component/base/MsgEntry", "提示", param)
                            }
                        } else {
                            match()
                        }
                    } else {
                        match()
                    }
                    this._bWait = true
                } else {
                    this.setButtonInfo("content/btnStart", { interactable: res })
                }
            })
        }
    }

    openMatchConfirm(msg) {
        if (this._bConfirm) {
            return
        }

        if (msg && msg.matchCid && msg.matchId) {
            let time = DataMgr.getData<number>(Constants.DATA_DEFINE.REALTIME_WAIT_TIME) || 20000
            time += Date.now() - this._bWaitTime
            time /= 2
            DataMgr.setData(Constants.DATA_DEFINE.REALTIME_WAIT_TIME, time, true)

            if (this._bJoinReq) {
                clearTimeout(this._bJoinReq)
                this._bJoinReq = null
            }

            UIMgr.OpenUI("lobby", "component/match/realTimeMatch/matchConfirm/MatchConfirm", { param: { matchCid: msg.matchCid, matchId: msg.matchId } })
            this._bConfirm = true
        }
    }

    matchConfirmBack(msg) {
        this._bConfirm = false
        this.updateScene(msg.bJoin)
    }

    updateOpponent(data) {
        this._opponents = []
        for (let i = 0; i < FACES.length; i++) {
            let idx = Math.floor(Math.random() * 100 % FACES.length)
            this._opponents[i] = FACES[idx]
        }
        if (data) {
            data.forEach(item => {
                let idx = Math.floor(Math.random() * 100 % this._opponents.length)
                if (typeof item === "string" && item !== User.OpenID) {
                    UserSrv.GetPlyDetail(item, (ply: IPlayerBase) => {
                        this._opponents[idx] = { avatar: ply.avatar, region: ply.region, userName: ply.userName }
                    })
                }
            })
        }
    }

    onGameStart() {
        if (this._bJoinReq) {
            clearTimeout(this._bJoinReq)
            this._bJoinReq = null
        }
        this.close()
    }

    update(dt) {
        if (this._bWaitTime <= 0) {
            return
        }

        let time = Date.now() - this._bWaitTime
        this.setLabelValue("content/opponent/state", MSG.substring(0, 6 + Math.floor(time / 500) % 4))
        this.setLabelValue("content/opponent/time", "已用时:" + Helper.FormatTimeString(time, "mm:ss"))

        this._updateTime += dt
        if (this._updateTime >= .4) {
            let self = this
            this.stopTween("content/opponent/face")
            this.runTween("content/opponent/face", cc.tween()
                .set({ opacity: 200 })
                .call(() => {
                    if (!self._opponents) {
                        return
                    }

                    let ply = self._opponents[self._opponentIdx]
                    self._opponentIdx = (self._opponentIdx + 1) % self._opponents.length
                    if (!ply) {
                        console.log(self._opponents)
                        return
                    }

                    self.setSpriteFrame("content/opponent/face", ply.avatar)
                })
                .to(.3, { opacity: 255 })
            )

            this._updateTime = 0
        }
    }

    checkGuide() {
        let record = DataMgr.getData(Constants.DATA_DEFINE.NEWBIE_LIST) || {}
        if (record[22] !== 1) {
            UIMgr.OpenUI("lobby", "component/guidance/GameGuidance", { single: true, param: { index: 22, node: this.getNode("content/btnStart") } })
        }
    }
}
