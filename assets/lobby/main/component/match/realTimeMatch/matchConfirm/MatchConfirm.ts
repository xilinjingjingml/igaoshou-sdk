import BaseUI from "../../../../../start/script/base/BaseUI";
import { EventMgr } from "../../../../../start/script/base/EventMgr";
import { Constants } from "../../../../../start/script/igsConstants";
import { MatchSvr } from "../../../../../start/script/system/MatchSvr";
import { UserSrv } from "../../../../../start/script/system/UserSrv";
import { Helper } from "../../../../../start/script/system/Helper";
import { User } from "../../../../../start/script/data/User";


const { ccclass, property } = cc._decorator;

const COUNT_DONW = 15
const MSG = "等待对手确认..."

@ccclass
export default class MatchConfirm extends BaseUI {

    _countdown: number = COUNT_DONW
    _time: number = -1
    _waitTime: number = 0

    _bConfirm: boolean = false

    _timeoutId: number = null

    onOpen() {
        this.initEvent()
        this.initData()
    }

    onClose() {
        this.stopTween(this.node)
    }

    initEvent() {
        EventMgr.once(Constants.EVENT_DEFINE.REALTIME_MATCH_CONFIRM_NOT, this.confirmNot, this)
    }

    initData() {
        console.log("===MatchConfirm == " + JSON.stringify(this.param))

        let match = MatchSvr.GetMatchInfo(this.param.matchCid)

        match.highMsg = null
        match.highLight = false
        this.setChildParam("list/view/content/MatchMode", match)

        this.setSpriteInfo("btm/countdown", { fillRange: .5 })
        this.setLabelValue("btm/time", this._countdown)
        this._time = Date.now()

        // this.runTween(this.node, cc.tween().delay(20).call(() => this.timeout()))
        this.runCountdown()
    }

    onPressConfirm() {
        let self = this
        MatchSvr.MatchConfirm(this.param.matchCid, this.param.matchId, true, (res) => {
            if (res) {
                self._bConfirm = true

                // self._time = 0
                self.setActive("btm/msg0", false)
                self.setActive("btm/time", false)
                self.setActive("top/btnBack", false)
                self.setActive("btm/btnStart", false)

                self.setActive("btm/msg1", true)
                self.setActive("btm/confirmState", true)

                self.setActive("btm/face", true)
                self.setActive("btm/touxiangkuang", true)
                let opponent = MatchSvr.GetCurOpponent()
                if (typeof opponent === "string") {
                    UserSrv.GetPlyDetail(opponent, (ply: IPlayerBase) => {
                        self.setSpriteFrame("btm/face", ply.avatar)        
                    })
                } else if (Array.isArray(opponent)) {
                    self.setSpriteFrame("btm/face", opponent[0].avatar)
                } else if (opponent) {
                    self.setSpriteFrame("btm/face", opponent.avatar)
                }                

                let idx = 0
                this.runTween("btm/msg1", cc.tween().repeatForever(cc.tween()
                    .delay(.5).call(() => {
                        this.setLabelValue("btm/msg1", MSG.substring(0, 6 + (idx++ % 4)))
                    })))
            }
        })
    }

    onPressBack(timeout: boolean = false) {
        let self = this
        this.stopTween("btm/btnStart/Background/time")        
        this.close()
        MatchSvr.MatchConfirm(this.param.matchCid, this.param.matchId, false, () => {
            MatchSvr.CancelRealTimeMatch()
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.REALTIME_MATCH_CONFIRM_BACK, { bJoin: false })
        })        
    }

    onPressCopy() {
        Helper.copyToClipBoard(this.param.matchCid + "@" + this.param.matchId)
    }

    update(dt) {
        // if (this._time > 0) {
        //     this._time -= dt * 1000

        //     this.setSpriteInfo("btm/countdown", { fillRange: (this._time / 1000) / COUNT_DONW })
        //     this.setLabelValue("btm/time", Math.max(0, Math.floor(this._time / 1000)))

        //     if (this._time <= 0) {
        //         this._bConfirm ? this.timeout() : this.onPressBack(true)
        //     }
        // } 
        if (this._time > 0 && Date.now() - this._time >= 20 * 1000) {
            this.stopTween("btm/btnStart/Background/time")
            this.timeout()
        }
    }

    runCountdown() {
        this.setSpriteInfo("btm/countdown", { fillRange: 1 })
        let countdown = this.getNodeComponent("btm/countdown", cc.Sprite)
        cc.tween(countdown).to(15, { fillRange: 0 }).start()
        let idx = COUNT_DONW
        this.runTween("btm/time", cc.tween().repeat(COUNT_DONW,
            cc.tween()
                .call(() => { this.setLabelValue("btm/time", idx--) })
                .delay(1))
            .call(() => {
                // this._bConfirm ? this.timeout() : this.onPressBack(true)
                // !this._bConfirm && this.onPressConfirm()
                // this.timeout()
            }))

        let t = 3;
        this.runTween("btm/btnStart/Background/time", cc.tween().repeat(t,
            cc.tween()
                .call(() => { this.setLabelValue("btm/btnStart/Background/time", "(" + t-- + "s)") })
                .delay(1))
            .call(() => { this.onPressConfirm() })
        )
    }

    confirmNot(msg) {
        if (msg.openid && msg.openid !== User.OpenID) {
            if (msg.op === 0) {
                Helper.OpenTip("对方放弃比赛，系统重新为您寻找比赛")
                this.close()
                EventMgr.dispatchEvent(Constants.EVENT_DEFINE.REALTIME_MATCH_CONFIRM_BACK, { bJoin: true })
            }
        }
    }

    timeout() {
        Helper.OpenTip("对方放弃比赛，系统重新为您寻找比赛")
        this.close()
        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.REALTIME_MATCH_CONFIRM_BACK, { bJoin: true })
    }
}
