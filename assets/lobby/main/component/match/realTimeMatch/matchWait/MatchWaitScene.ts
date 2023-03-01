import BaseUI from "../../../../../start/script/base/BaseUI";
import { DataMgr } from "../../../../../start/script/base/DataMgr";
import { Constants } from "../../../../../start/script/igsConstants";
import { MatchSvr } from "../../../../../start/script/system/MatchSvr";
import { UIMgr } from "../../../../../start/script/base/UIMgr";
import { Helper } from "../../../../../start/script/system/Helper";
import { EventMgr } from "../../../../../start/script/base/EventMgr";
import { User } from "../../../../../start/script/data/User";
import { UserSrv } from "../../../../../start/script/system/UserSrv";

const { ccclass, property } = cc._decorator;

const MSG = "正在寻找比赛..."

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
export default class MatchWaitScene extends BaseUI {

    _opponents = []
    _opponentIdx: number = 0
    _updateTime: number = 0

    _opponenetSize = cc.size(120, 120)

    onLoad() {
        let height = DataMgr.getData<number>(Constants.DATA_DEFINE.BASE_CONTENT_HEIGHT)
        this.node.height = height - 100
        this.initEvent()
    }

    initEvent() {
        EventMgr.on(Constants.EVENT_DEFINE.REALTIME_MATCH_CONFIRM, this.openMatchConfirm, this)
        EventMgr.on(Constants.EVENT_DEFINE.JOIN_MATCH_ERR, this.cancelMatch, this)
    }

    onEnable() {
        this.initData()
    }

    initData() {
        let matchs: TMatchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)
        let reqList = DataMgr.getData<string[]>(Constants.DATA_DEFINE.REAL_TIME_LIST) || []
        let list = []
        for (let i in matchs) {
            if (reqList.indexOf(matchs[i].matchId) !== -1) {
                list.push(matchs[i])
            }
        }

        this.setChildParam("MatchTable", { list: list, onShow: true })

        let idx = 0
        this.stopTween("top/state")
        this.runTween("top/state", cc.tween().repeatForever(cc.tween()
            .delay(.5).call(() => {
                this.setLabelValue("top/state", MSG.substring(0, 6 + (idx++ % 4)))
            })))

        this.updateOpponent(MatchSvr.GetOpponentList())
    }

    cancelMatch() {
        MatchSvr.CancelRealTimeMatch(() => {
            UIMgr.OpenUI("lobby", "component/match/realTimeMatch/matchStart/RealTimeMatchStart", { single: true }, () => {
                EventMgr.dispatchEvent(Constants.EVENT_DEFINE.CHANGE_MAIN_TAB, { name: "match" })
            })
        })
    }

    onPressCancel() {
        let param = {
            param: { msg: "\n 是否停止匹配并重新选择赛事？\n" },
            confirmName: "取消",
            cancelName: "确定",
            cancel: () => this.cancelMatch(),
        }
        Helper.OpenPopUI("component/base/MsgEntry", "提示", param)
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
            let idx = Math.floor(Math.random() * 100 % this._opponents.length)
            if (typeof item === "string" && item !== User.OpenID) {
                UserSrv.GetPlyDetail(item, (ply: IPlayerBase) => {
                    this._opponents[idx] = { avatar: ply.avatar, region: ply.region, userName: ply.userName }
                })
            } else {
                this._opponents[idx] = item
            }
        })
    }

    update(dt) {
        this.setLabelValue("top/time", "已用时:" + Helper.FormatTimeString(Date.now() - MatchSvr.getRealTimeStartTime(), "mm:ss"))

        this._updateTime += dt
        if (this._updateTime >= .4) {
            let self = this
            this.stopTween("top/face")
            this.runTween("top/face", cc.tween()
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

                    self.setSpriteFrame("top/face", ply.avatar)
                })
                .to(.3, { opacity: 255 })
            )

            this._updateTime = 0
        }
    }

    openMatchConfirm(msg) {
        if (msg && msg.matchCid && msg.matchId) {
            UIMgr.OpenUI("lobby", "component/match/realTimeMatch/matchConfirm/MatchConfirm", { param: { matchCid: msg.matchCid, matchId: msg.matchId } })            
        }
    }
}