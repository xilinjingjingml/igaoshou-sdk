import BaseUI from "../../script/base/BaseUI";
import { DataMgr } from "../../script/base/DataMgr";
import { Helper } from "../../script/system/Helper";
import { Constants } from "../../script/igsConstants";
import { MatchSvr } from "../../script/system/MatchSvr";
import { User } from "../../script/data/User";
import { Match } from "../../script/api/matchApi";
import { EventMgr } from "../../script/base/EventMgr";
import { UserSrv } from "../../script/system/UserSrv";
import { UIMgr } from "../../script/base/UIMgr";

let igs = window["igs"]

const { ccclass, property } = cc._decorator;

const COUNT_DOWN_TIME = 3

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

@ccclass
export default class MatchStart extends BaseUI {

    _bStart: boolean = false
    _match: IMatchInfo = null

    _opponents: any[] = []
    _opponentIdx: number = 0

    _reflushTime: number = 0

    _startTime: number = 0

    _bPause: boolean = false
    _bOnJoin: boolean = false

    _opponenetSize: cc.Size = null

    _defaultFace: cc.SpriteFrame = null

    _step0CountDown = 3

    textTip: string[] = [
        "我们将会为您匹配一个实力相当的对手",
        "你和对手的初始游戏场景将会完全一致",
        "你的金币和奖券可以在所有游戏中通用"
    ]

    onLoad() {        
        if (!Helper.isNative() && (cc.sys.OPPO_GAME == cc.sys.platform || cc.sys.VIVO_GAME == cc.sys.platform)) {
            this.node.getComponent(cc.Widget).top = 70
            this.node.getComponent(cc.Widget).updateAlignment()
            cc.find("top", this.node).getComponent(cc.Widget).updateAlignment()
            cc.find("content", this.node).getComponent(cc.Widget).updateAlignment()
        }

        this.initNode()
        this.initEvent()

        this._opponenetSize = cc.size(230, 230)//this.getNode("content/battle/opponent/avatar").getContentSize()

        let spine = this.getNodeComponent("content/battle/1v1donghua1", sp.Skeleton)
        if (spine) {
            spine.setAnimation(0, "kaishi", false)
            spine.setAnimation(1, "xunhuan", true)
        }

        this.scheduleOnce(() => {
            this.initData()
            let matchId = MatchSvr.GetCurMatch()
            let match = MatchSvr.GetMatchInfo(matchId)
            if (MatchSvr.isSingleMatch(matchId)) {
                // this.onPause()
                this.setActive("content/battle/tips", true)
                this.setActive("content/battle/tips/qipaokuangjiugongge/msg0", true)
                this.setActive("content/battle/tips/qipaokuangjiugongge/msg1", false)
                
                // this.onPressStep0Next()
                Helper.reportEvent("匹配-3.4、匹配引导弹出")
            } else if (User.PlayGame === 1) {
                // this.onPause()
                this.setActive("content/battle/tips", true)
                this.setActive("content/battle/tips/qipaokuangjiugongge/msg0", false)
                this.setActive("content/battle/tips/qipaokuangjiugongge/msg1", true)
                
                // this.onPressStep0Next()
                // Helper.reportEvent("匹配-3.4、匹配引导弹出")
            }
            Match.onInit()
        }, .0)
    }

    onClose() {
        cc.log("matchStart close()")
    }

    initNode() {
        this.setActive("top/btnBack", User.AllGame > 2)
        this.setButtonClick("top/btnBack", this.onPressCancel.bind(this))
    }

    initEvent() {
        EventMgr.on(Constants.EVENT_DEFINE.UPDATE_OPPONENT, this.updateOpponent, this)
        EventMgr.on(Constants.EVENT_DEFINE.SET_OPPONENT, this.setOpponent, this)

        this.setButtonClick("top/btnBack", this.onPressCancel.bind(this))
        this.setButtonClick("content/btm/btnStart", this.onPressStart.bind(this))
        this.setButtonClick("content/btm/btnStart2", this.onPressStart.bind(this))
        this.setButtonClick("content/btm/btnDetail", this.onPressDetail.bind(this))

        this.setButtonClick("Step0/tishikuang/btnNext", () => {
            this.onPressStep0Next()
        })

        EventMgr.on("pause_match", this.onPause, this)
        EventMgr.on("resume_match", this.onResume, this)
    }

    onDestroy() {
        EventMgr.offByTag(this)
    }

    onPressStep0Next() {
        this.setActive("Step0", false)
        this.onResume()
        Helper.reportEvent("匹配-3.4、匹配引导确认")
    }

    setData() {
        this._defaultFace = this.getNodeComponent("content/battle/self/avatar/mask/sptHead", cc.Sprite).spriteFrame

        this.setLabelValue("top/title", this._match.name)

        // 自己的信息
        this.setLabelValue("content/battle/self/userName", "我")

        this.setSpriteFrame("content/battle/self/avatar/mask/sptHead", User.Data.avatar)
        this.setSpriteFrame("content/battle/self/country", Helper.GetContry(User.Data.region))

        if (DataMgr.data.Config.env != 2) {
            this.setActive("content/battle/self/country", false)
            this.setActive("content/battle/self/areaInfo", true)
            this.setLabelValue("content/battle/self/areaInfo/Label", User.Data.region)
        }

        if (DataMgr.data.OnlineParam.golden_card && DataMgr.data.OnlineParam.golden_card == 1) {
            let isMember = DataMgr.getData<boolean>(User.OpenID + Constants.DATA_DEFINE.IS_MEMBER)
            this.setActive("content/battle/self/avatar/frame", !isMember)
            this.setActive("content/battle/self/avatar/frameMember", isMember)
        }

        // 对手信息
        if (this._match.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
            this.setLabelValue("content/battle/opponent/userName", this._match.name)
            this.setActive("content/battle/opponent/areaInfo", false)
            this.setActive("content/battle/opponent/countdown", true)
            if (this._match.startTime > Date.now() / 1000) {
                this.setActive("content/battle/opponent/countdown/tip", false)
                this.setLabelValue("content/battle/opponent/countdown/times", "比赛未开始")
            } else if (this._match.endTime > Date.now() / 1000) {
                let t = Math.ceil(this._match.endTime - Date.now() / 1000)
                let tween = cc.tween()
                    .repeat(t, cc.tween()
                        .call(() => this.setLabelValue("content/battle/opponent/countdown/times",
                            t > 86400 ? Helper.FormatTimeString(t-- * 1000, "h小时:m分:s秒") : Helper.FormatTimeString(t-- * 1000, "m分:s秒")))
                        .delay(1))
                    .call(() => {
                        this.setActive("content/battle/opponent/countdown/tip", false)
                        this.setLabelValue("content/battle/opponent/countdown/times", "比赛已结束")
                    })
                this.runTween("content/battle/opponent/countdown/times", tween)
            } else {
                this.setActive("content/battle/opponent/countdown/tip", false)
                this.setLabelValue("content/battle/opponent/countdown/times", "比赛已结束")
            }

            this.setActive("content/btm/btnStart", false)
            this.setActive("content/btm/btnStart2", true)
            this.setActive("content/btm/btnDetail", true)

            this.countdown(COUNT_DOWN_TIME)

            // 底部信息
            let awards = []
            for (let i in this._match.awards) {
                for (let j of this._match.awards[i].items) {
                    if (awards[j.id]) {
                        awards[j.id].num += j.num * (this._match.awards[i].end - this._match.awards[i].start + 1)
                    } else {
                        awards[j.id] = { id: j.id, num: j.num * (this._match.awards[i].end - this._match.awards[i].start + 1) }
                    }
                }
            }

            this.setLabelValue("content/btm/matchInfo/detail/tip", "比赛\n奖励")
            this.setItems("content/btm/matchInfo/detail/awards", awards)

            this.setSpriteFrame("content/battle/opponent/avatar/mask/sptHead", "image/match/huodongsai", true)
        } else {
            this.setLabelValue("content/battle/opponent/userName", "正在匹配对手")
            this.setActive("content/battle/opponent/areaInfo", true)
            this.setActive("content/battle/opponent/countdown", false)
            this._reflushTime = .8
            this.updateOpponent(MatchSvr.GetOpponentList())// this.param.opponents)
            this.reflushOpponent()

            this.setActive("content/btm/btnStart", true)
            this.setActive("content/btm/btnStart2", false)
            this.setActive("content/btm/btnDetail", false)

            this.countdown(COUNT_DOWN_TIME)

            // 底部信息
            if (this._match.awards && this._match.awards[0]) {
                this.setItems("content/btm/matchInfo/detail/awards", MatchSvr.GetAwards(this._match.matchId, 1))
            }
        }

        let free = true
        this._match.gateMoney.forEach(i => i.num > 0 ? free = false : "")
        if (this._match.freeAd || free) {
            this.setLabelValue("content/btm/matchInfo/gateMoney/tip", "免费入场")
            this.setActive("content/btm/matchInfo/gateMoney/gold", false)
            this.setActive("content/btm/matchInfo/gateMoney/lottery", false)
        } else {
            this.setItems("content/btm/matchInfo/gateMoney", this._match.gateMoney)
        }

        this.setLabelValue("content/btm/matchInfo/players/name", this._match.maxPlayer + " 玩家")
    }

    initData() {
        let matchId = MatchSvr.GetCurMatch()
        let matchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)
        if (MatchSvr.isSingleMatch(matchId)) {
            this._match = MatchSvr.getSingleMatch()
            this.setData()
        } else if (!matchs || !matchs[matchId]) {
            MatchSvr.GetMatchDetails(matchId, (match) => {
                this._match = match
                this.setData()
            })
        } else {
            this._match = matchs[matchId]
            this.setData()
        }

        let spine = this.getNode("content/battle/pipei-vs/sp").getComponent(sp.Skeleton)
        spine.setAnimation(0, "kaishi", false)
        spine.setCompleteListener(() => {
            spine.setAnimation(1, "xunhuan", true)
            spine.setCompleteListener(null)
        })
    }

    updateOpponent(data) {
        if (!data) {
            return
        }
        this._opponents = []
        for (let i = 0; i < FACES.length; i++) {
            let idx = Math.floor(Math.random() * 100 % FACES.length)
            this._opponents[i] = FACES[idx]
        }
        data.forEach(item => {
            if (item !== User.OpenID) {
                UserSrv.GetPlyDetail(item, (ply: IPlayerBase) => {
                    let idx = Math.floor(Math.random() * 100 % this._opponents.length)
                    this._opponents[idx] = { avatar: ply.avatar, region: ply.region, userName: ply.userName }
                })
            }
        })
    }

    setOpponent(msg) {
        if (msg) {
            this.stopTween("content/battle/opponent/avatar")
            if (typeof msg === "string") {
                UserSrv.GetPlyDetail(msg, (ply: IPlayerBase) => {
                    this.setLabelValue("content/battle/opponent/userName", ply.userName)
                    this.setSpriteFrame("content/battle/opponent/avatar/mask/sptHead", ply.avatar)
                    this.setSpriteFrame("content/battle/opponent/country", Helper.GetContry(ply.region))
                    if (DataMgr.data.OnlineParam.golden_card && DataMgr.data.OnlineParam.golden_card == 1) {
                        let isMember = ply.props && Helper.isMember(ply.props[Constants.ITEM_INDEX.MemberCard])
                        this.setActive("content/battle/self/avatar/frame", !isMember)
                        this.setActive("content/battle/self/avatar/frameMember", isMember)
                    }

                    if (DataMgr.data.Config.env != 2) {
                        this.setActive("content/battle/opponent/country", false)
                        this.setActive("content/battle/opponent/areaInfo", true)
                        this.setLabelValue("content/battle/opponent/areaInfo/Label", ply.region)
                    }
                })
            } else {
                this.setLabelValue("content/battle/opponent/userName", msg.userName)
                this.setSpriteFrame("content/battle/opponent/avatar/mask/sptHead", msg.avatar)
                this.setSpriteFrame("content/battle/opponent/country", Helper.GetContry(msg.region))

                if (DataMgr.data.Config.env != 2) {
                    this.setActive("content/battle/opponent/country", false)
                    this.setActive("content/battle/opponent/areaInfo", true)
                    this.setLabelValue("content/battle/opponent/areaInfo/Label", msg.region)
                }
            }
        }
    }

    countdown(num) {
        this.setLabelValue("content/btm/matchInfo/countdown/num", num)
        this.stopTween("content/btm/matchInfo/countdown/num")
        let tween = cc.tween()
            .repeat(num - 1, cc.tween()
                .delay(1)
                .call(() => { this.setLabelValue("content/btm/matchInfo/countdown/num", --num) })
            )
            .call(() => this.onPressStart())
            .repeat(1, cc.tween()
                .delay(1)
                .call(() => { this.setLabelValue("content/btm/matchInfo/countdown/num", --num) })
                .call(() => cc.log("====countdown = " + num + Date.now()))
            )

        this.runTween("content/btm/matchInfo/countdown/num", tween)
    }

    step0CountDown(num) {
        let tween = cc.tween()
            .repeat(num, cc.tween()
                .delay(1)
                .call(() => {
                    this.setLabelValue("Step0/tishikuang/btnNext/Background/Label", "知道了(" + (--num) + ")")
                })
            )
            .call(() => this.onPressStep0Next())

        this.runTween("Step0/tishikuang/btnNext/Background/Label", tween)
    }

    reflushOpponent() {
        if (!this || !this.node || !this.isValid) {
            return
        }

        let self = this
        let tween = cc.tween()
            .set({ opacity: 200 })
            .call(() => {
                if (!self._opponents) {
                    return
                }

                // let openid = self._opponents[self._opponentIdx]
                // if (openid) {                
                let ply = self._opponents[self._opponentIdx]
                self._opponentIdx = (self._opponentIdx + 1) % self._opponents.length
                if (!ply) {
                    console.log(self._opponents)
                    return
                }

                console.log("=idx " + self._opponentIdx + " avatar" + ply.avatar)
                this.setLabelValue("content/battle/opponent/userName", ply.userName)
                self.setSpriteFrame("content/battle/opponent/avatar/mask/sptHead", ply.avatar)
                self.setSpriteFrame("content/battle/opponent/country", Helper.GetContry(ply.region))
                self.setNodeSize("content/battle/opponent/avatar", self._opponenetSize)

                if (DataMgr.data.Config.env != 2) {
                    self.setActive("content/battle/opponent/country", false)
                    self.setActive("content/battle/opponent/areaInfo", true)
                    self.setLabelValue("content/battle/opponent/areaInfo/Label", ply.region)
                }
                // }
            })
            .to(.3, { opacity: 255 })
            .delay(.1)
            .call(() => !self._bStart && self.reflushOpponent())
        // this._reflushTime = this._reflushTime >= .5 ? this._reflushTime - .1 : this._reflushTime
        this.runTween("content/battle/opponent/avatar", tween)
    }

    onPressStart() {
        if (this._bStart)
            return

        if (!this._match || !this._match.matchId) {
            let param = {
                buttons: 1,
                confirmName: "确定",
                confirmIconSize: { width: 300 },
                param: { msg: "\n 匹配失败, 请稍后再试！\n" }
            }
            Helper.OpenPopUI("component/base/MsgEntry", "提示", param)
            return
        }

        let now = Date.now() / 1000
        if (this._match.startTime > 0 && this._match.startTime >= now) {
            let param = {
                buttons: 1,
                confirmName: "确定",
                confirmIconSize: { width: 300 },
                param: { msg: "\n 比赛未开始, 请稍后再试！\n" }
            }
            Helper.OpenPopUI("component/base/MsgEntry", "提示", param)
            this._bStart = true
            return
        } else if (this._match.endTime > 0 && this._match.endTime < now) {
            let param = {
                buttons: 1,
                confirmName: "确定",
                confirmIconSize: { width: 300 },
                param: { msg: "\n 比赛已结束！\n" }
            }
            Helper.OpenPopUI("component/base/MsgEntry", "提示", param)
            this._bStart = true
            return
        }

        this._startTime = Date.now() + 2000
        this.setButtonInfo("content/btm/btnStart", { interactable: false })
        this.setButtonInfo("content/btm/btnStart2", { interactable: false })
        this.setActive("GamePage/top/btnBack", cc.Canvas.instance.node, false)

        let cb = (res) => {
            if (!res) {
                this.setButtonInfo("content/btm/btnStart", { interactable: true })
                this.setButtonInfo("content/btm/btnStart2", { interactable: true })
                this.setActive("GamePage/top/btnBack", cc.Canvas.instance.node, true)
                return
            }

            this._bStart = true
            let delay = Math.max(0, (this._startTime - Date.now()) / 1000)

            this.scheduleOnce(() => {
                this.stopTween("content/battle/opponent/avatar")
                if (res.opponent_uid) {
                    if (typeof res.opponent_uid === "string") {
                        UserSrv.GetPlyDetail(res.opponent_uid, (ply: IPlayerBase) => {
                            this.setLabelValue("content/battle/opponent/userName", ply.userName)
                            this.setSpriteFrame("content/battle/opponent/avatar/mask/sptHead", this._defaultFace)
                            this.setSpriteFrame("content/battle/opponent/country", "image/common/common-country")//Helper.GetContry(ply.region))
                            this.setNodeSize("content/battle/opponent/avatar", this._opponenetSize)

                            this.scheduleOnce(() => this.setSpriteFrame("content/battle/opponent/avatar/mask/sptHead", ply.avatar), .0)

                            if (DataMgr.data.Config.env != 2) {
                                this.setActive("content/battle/opponent/country", false)
                                this.setActive("content/battle/opponent/areaInfo", true)
                                this.setLabelValue("content/battle/opponent/areaInfo/Label", ply.region)
                            }
                        })
                    } else {
                        this.setLabelValue("content/battle/opponent/userName", res.opponent_uid.userName)
                        this.setSpriteFrame("content/battle/opponent/avatar/mask/sptHead", res.opponent_uid.avatar)
                        this.setSpriteFrame("content/battle/opponent/country", "image/common/common-country")//Helper.GetContry(ply.region))
                        this.setNodeSize("content/battle/opponent/avatar", this._opponenetSize)

                        if (DataMgr.data.Config.env != 2) {
                            this.setActive("content/battle/opponent/country", false)
                            this.setActive("content/battle/opponent/areaInfo", true)
                            this.setLabelValue("content/battle/opponent/areaInfo/Label", res.opponent_uid.region)
                        }
                    }
                } else if (this._match.type !== Constants.MATCH_TYPE.ACTIVITY_MATCH) {
                    this.setLabelValue("content/battle/opponent/userName", "比赛现在开始\n对手继续匹配中")
                    this.setSpriteFrame("content/battle/opponent/avatar/mask/sptHead", "image/common/common-wenhao")
                    this.setActive("content/battle/opponent/areaInfo", false)
                    this.setLabelValue("content/battle/opponent/areaInfo/Label", "")
                }
            }, delay - 1)
            this.scheduleOnce(() => this.onJoinMatch(), delay)
        }

        if (MatchSvr.isSingleMatch(this._match.matchId)) {
            MatchSvr.EnterSingleMatch(cb)
        } else {
            MatchSvr.EnterMatch(this._match.matchId, null, cb)
        }
    }

    onPressCancel() {
        if (!this._bStart) {
            MatchSvr.CancelMatch((err) => {
                if (err) {
                    cc.log(err)
                    return
                }

                this.stopTween("content/btm/matchInfo/countdown/num")
                this.close()
            })
        }
    }

    onPressDetail() {
        UIMgr.OpenUI("igaoshou", "component/matchDetail/MatchDetail", { param: { match: this._match } })
    }

    onJoinMatch() {
        if (this._bPause) {
            this._bOnJoin = true
            return
        }

        MatchSvr.StartGame()
    }

    setItems(name, items: TItems) {
        this.setActive(name + "/gold", false)
        this.setActive(name + "/lottery", false)
        this.setActive(name + "/credits", false)
        let idx = 0
        for (let i in items) {
            if (items[i].id === Constants.ITEM_INDEX.GOLD) {
                this.setActive(name + "/gold", true)
                this.setLabelValue(name + "/gold/num", Helper.FormatNumWYCN(items[i].num))
                this.getNodeComponent(name + "/gold", cc.Layout).updateLayout()
            } else if (items[i].id === Constants.ITEM_INDEX.LOTTERY) {
                this.setActive(name + "/lottery", true)
                this.setLabelValue(name + "/lottery/num", Helper.FormatNumWYCN(items[i].num))
                this.getNodeComponent(name + "/lottery", cc.Layout).updateLayout()
            } else if (items[i].id === Constants.ITEM_INDEX.CREDITS) {
                this.setActive(name + "/credits", true)
                this.setLabelValue(name + "/credits/num", Helper.FormatNumWYCN(items[i].num))
                this.setActive(name + "/credits/add", idx > 0)
                this.getNodeComponent(name + "/credits", cc.Layout).updateLayout()
            } else {
                continue
            }
            idx++
        }

        this.getNodeComponent(name, cc.Layout).updateLayout()
    }

    onPause() {
        this._bPause = true
        this.getNode("content/btm/matchInfo/countdown/num").pauseAllActions()
        this.getNode("content/battle/opponent/avatar").pauseAllActions()
        MatchSvr.PauseJoin()
    }

    onResume() {
        this._bPause = false
        this.getNode("content/btm/matchInfo/countdown/num").resumeAllActions()
        this.getNode("content/battle/opponent/avatar").resumeAllActions()
        MatchSvr.ResumeJoin()
        if (this._bOnJoin) {
            this.onJoinMatch()
        }
    }

}
