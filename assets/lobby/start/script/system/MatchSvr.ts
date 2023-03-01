import { Constants } from "../igsConstants"
import { DataMgr } from "../base/DataMgr"
import { Helper } from "./Helper"
import match = require("../proto/match")
import gsm = require("../proto/gsb_proto")
// import { GateMgr } from "../base/GateMgr"
import { EventMgr } from "../base/EventMgr"
import { UIMgr } from "../base/UIMgr"
import { Match } from "../api/matchApi"
import { PlatformApi } from "../api/platformApi"
import { UserSrv } from "./UserSrv"
import { ActivitySrv } from "./ActivitySrv"
import { Util } from "../api/utilApi"
import { AdSrv } from "./AdSrv"
import { User } from "../data/User"
import { NewGateMgr } from "../base/NewGateMgr"
import { ESocialResult } from "../pulgin/IPluginProxy"
import { PushSvr } from "./PushSvr"
import { IgsBundles } from "../data/IgsBundles"

const MATCH_SVR = "match_svr"

const JOIN_MATCH = "igaoshou-match-srv/match/joinMatch"
const ENTER_MATCH = "igaoshou-match-srv/match/enterMatch"
const CANCEL_MATCH = "igaoshou-match-srv/match/cancelMatch"
const SUBMIT_SCORE = "igaoshou-match-srv/match/submitScore"
const GET_MATCH = "igaoshou-match-srv/match/getMatch"
const GET_ROUND = "igaoshou-match-srv/match/getRound"
const GET_MATCH_AWARD = "igaoshou-match-srv/match/getMatchAward"
const GET_MATCH_DETAIL = "igaoshou-match-srv/match/getMatchDetails"

const GET_ACTIVITY_MATCH = "igaoshou-match-srv/match/getActivityMatch"
const GET_ACTIVITY_RANK_LIST = "igaoshou-match-srv/match/activityMatchRankList"
const GET_NEXT_ACTIVIY_MATCH = "igaoshou-match-srv/match/getNextActivityMatch"

const GET_PROGRESS_LIST = "igaoshou-match-srv/match/getInProgressList"
const GET_COMPLETED_LIST = "igaoshou-match-srv/match/getCompletedList"

const GET_PLAYER_PROFILE = "igaoshou-match-srv/match/getPlayerProfile"

const GET_MATCH_CONFIG = "api/mcbeam-version-api/config/loadMatchConfig"

const MATCH_CONFIRM = "igaoshou-match-srv/match/matchConfirm"

const DELAY_TIME = 5500

let _curMatchCid: string = null
let _curMatchId: string = null
let _curRoundId: string = null
let _curRoomInfo: any = null
let _curOpponent: string | IPlayerBase | IPlayerBase[] = null
let _curOpponents: string[] = null
let _delayTag: number = -1
let _matchReq: boolean = false
let _matchReqTime: number = -1

let _matching: boolean = false
let _submit: boolean = false
let _submitMatchId: string = null

let _pause: boolean = false

let _igsBoot = null
let _igsMatch = false
let _igsJoin = false

let _realTimeStartTime: number = 0

export namespace MatchSvr {

    export function init() {
        _matchSvrRegister()
    }

    function _matchSvrRegister() {
        NewGateMgr.setProto("match", match)
        NewGateMgr.setProto("gsm", gsm)
        EventMgr.on("JoinMatchNot", JoinMatchNotHandle, MATCH_SVR)
        EventMgr.on("MatchCandidatesNot", MatchCandidatesNotHandle, MATCH_SVR)
        EventMgr.on("JoinRoomRsp", JoinRoomRspHandle, MATCH_SVR)
        EventMgr.on("LeaveRoomRsp", LeaveRoomRspHandle, MATCH_SVR)
        EventMgr.on("LeaveRoomNot", LeaveRoomNotHandle, MATCH_SVR)
        EventMgr.on("DismissNot", DismissNotHandle, MATCH_SVR)
        EventMgr.on("ConfirmationRequestNot", ConfirmationRequestNotHandle, MATCH_SVR)
        EventMgr.on("MatchConfirmNot", MatchConfirmNotHandle, MATCH_SVR)

        EventMgr.on(Constants.EVENT_DEFINE.ON_DATA, OnDataHandle, MATCH_SVR)
    }

    // handler接口 
    export function JoinMatchNotHandle(msg) {
        msg = msg.packet
        console.log(msg)
        // if (!_matchReq) {
        //     return
        // }
        _curMatchCid = msg.matchCid
        _curMatchId = msg.matchId
        _curRoundId = msg.roundId
        _curRoomInfo = msg.roomInfo
        // _curOpponent = msg.opponentUid        

        if (msg.opponentList.length === 1) {
            for (let i in msg.opponentList) {
                // if (msg.opponentList[i].openid !== User.OpenID) {
                _curOpponent = {
                    userName: msg.opponentList[i].nickname,
                    openId: msg.opponentList[i].openid,
                    avatar: msg.opponentList[i].headimage,
                    region: msg.opponentList[i].areaInfo,
                }
                // }
            }
        } else {
            _curOpponent = []
            for (let i in msg.opponentList) {
                if (msg.opponentList[i].openid !== User.OpenID) {
                    _curOpponent.push({
                        userName: msg.opponentList[i].nickname,
                        openId: msg.opponentList[i].openid,
                        avatar: msg.opponentList[i].headimage,
                        region: msg.opponentList[i].areaInfo,
                    })
                }
            }
        }


        Util.SetSeed(msg.randSeed)
        _realTimeMatchJoin = false

        // let delayTime = (_matchReqTime + DELAY_TIME) - Date.now()
        // if (delayTime < 0)
        //     delayTime = 0
        // _matchReq = false
        // _delayTag = Helper.DelayFun(() => {
        //     EventMgr.dispatchEvent(Constants.EVENT_DEFINE.JOIN_MATCH_NOT, { matchId: msg.matchId })
        //     // Match.StartGame(msg.matchId)
        //     StartGame()
        // }, delayTime / 1000)        
        StartGame()
    }

    export function MatchCandidatesNotHandle(msg) {
        msg = msg.packet
        if (msg.matchCid === _curMatchCid) {
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.UPDATE_OPPONENT, msg.uidList)
        }
    }

    export function JoinRoomReq(roomInfo: any = null) {
        if (null === roomInfo) {
            roomInfo = _curRoomInfo
        }

        NewGateMgr.notify(roomInfo.serverId + "." + roomInfo.gameGid + ".GsBase.JoinRoom", "JoinRoomReq", {
            roomId: roomInfo.roomId
        })
    }

    export function LeaveRoomReq(roomInfo: any = null) {
        if (null === roomInfo) {
            roomInfo = _curRoomInfo
        }

        NewGateMgr.notify(roomInfo.serverId + "." + roomInfo.gameGid + ".GsBase.LeaveRoom", "LeaveRoomReq", {
        })
    }

    export function JoinRoomRspHandle(msg) {
        msg = msg.packet
        console.log(msg)
        if (msg.err) {
            let err = Helper.ParseJson(msg.err)
            if (err?.detail === "room not found") {
                Helper.OpenTip("房间不存在")
            }

            // 错误处理
            _curMatchCid = null
            console.warn("=== joinRoomRsp is err")
            _curMatchId = null
            _curRoundId = null
            _curRoomInfo = null
            _curOpponent = null
            _curOpponents = []
            return
        }

        // let matchs: TMatchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)
        // let data = matchs[_curMatchCid]
        // let data = GetMatchInfo(_curMatchCid)
        let players: string[] = []
        if (msg.room && msg.room.players) {
            msg.room.players.forEach(i => i.openid && players.push(i.openid))
        }
        // Match.onJoin(players, msg.room)
        GameJoin(players, _curRoomInfo) //msg.room)

        PushSvr.GsbHeartbeatStart(_curRoomInfo.serverId, _curRoomInfo.gameGid)
    }

    export function LeaveRoomRspHandle(msg) {
        msg = msg.packet
        cc.log(msg)

        if (msg.err) {
            _igsBoot && _igsBoot?.onLeave?.(false)
            return
        }

        PushSvr.GsbHeartbeatEnd()
        _igsBoot && _igsBoot?.onLeave?.(true)
    }

    export function JoinRoomNotHandle(msg) {
        msg = msg.packet
        cc.log(msg)

        // Match.onPlayerJoin(msg.openid)
        _igsBoot && _igsBoot?.onPlayerJoin?.(msg.openid)
    }

    export function LeaveRoomNotHandle(msg) {
        msg = msg.packet
        cc.log(msg)

        _igsBoot && _igsBoot?.onPlayerLeave?.(msg.plyId)
    }

    export function DismissNotHandle(msg) {
        msg = msg.packet
        cc.log(msg)

        PushSvr.GsbHeartbeatEnd()
        _igsBoot && _igsBoot?.onDismiss?.(msg)
    }

    export function OnDataHandle(msg) {
        // Match.onData(msg)
        cc.log("=== MatchSvr onDatahandle " + msg)
        if (msg && msg.name === "SocketState") {
            if (msg.packet?.msg === "HEART_BEAT_TIME_OUT") {
                _igsBoot?.onNetTimeout?.()
                return
            } else if (msg.packet?.msg === "SOCKET_CONNECT") {
                _igsBoot?.onNetConnect?.()
                return
            } else if (msg.packet?.msg === "SOCKET_RECONNECT") {
                _igsBoot?.onNexReconnect?.()
                PushSvr.GsbHeartbeatRestart()
                return
            } else if (msg.packet?.msg === "SOCKET_CLOSE") {
                _igsBoot?.onNetClose?.()
                return
            } else if (msg.packet?.msg === "SOCKET_FAIL") {
                _igsBoot?.onNetFail?.()
                return
            } else if (msg.packet?.msg === "SOCKET_ERROR") {
                _igsBoot?.onNetError?.()
                return
            }
        }

        if (_igsBoot && _igsBoot.onData) {
            _igsBoot.onData(msg.name, msg.packet)
        }
    }

    export function ConfirmationRequestNotHandle(msg) {
        msg = msg.packet
        if (_curMatchId) {
            return
        }

        if (msg && msg.matchCid && msg.matchId) {
            _curMatchCid = msg.matchCid
            _curMatchId = msg.matchId

            console.log("===ConfirmationRequestNot")
            console.log(msg)

            if (msg.opponentList.length === 1) {
                for (let i in msg.opponentList) {
                    // if (msg.opponentList[i].openid !== User.OpenID) {
                    _curOpponent = {
                        userName: msg.opponentList[i].nickname,
                        openId: msg.opponentList[i].openid,
                        avatar: msg.opponentList[i].headimage,
                        region: msg.opponentList[i].areaInfo,
                    }
                    // }
                }
            } else {
                _curOpponent = []
                for (let i in msg.opponentList) {
                    if (msg.opponentList[i].openid !== User.OpenID) {
                        _curOpponent.push({
                            userName: msg.opponentList[i].nickname,
                            openId: msg.opponentList[i].openid,
                            avatar: msg.opponentList[i].headimage,
                            region: msg.opponentList[i].areaInfo,
                        })
                    }
                }
            }

            clearTimeout(_reJoinReq)
            _reJoinReq = null
            // cc.assetManager.loadBundle("realTime", (err, bundle) => {
            //     if (err) {
            //         return
            //     }

            //     UIMgr.OpenUI(bundle, "component/matchConfirm/MatchConfirm", { param: { matchCid: msg.matchCid, matchId: msg.matchId } }, () => initGame())
            // })
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.REALTIME_MATCH_CONFIRM, { matchCid: msg.matchCid, matchId: msg.matchId })
        }
    }

    export function MatchConfirmNotHandle(msg) {
        msg = msg.packet
        console.log(msg)

        if (msg.matchCid !== _curMatchCid) {
            return
        }

        if (!msg.op) {
            _curMatchCid = null
            console.warn("=== matchConfirmNot op === 0")
            _curMatchId = null
            _curOpponent = null
        }

        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.REALTIME_MATCH_CONFIRM_NOT, msg)
    }

    export function SendData(route: string, packetName: string, msg: any) {
        if (!_curRoomInfo) {
            cc.warn("MatchSvr SendData err: not found game room!")
            return
        }

        let roomInfo = _curRoomInfo
        NewGateMgr.notify(roomInfo.serverId + "." + roomInfo.gameGid + "." + route, packetName, msg)
    }

    export function checkGateMoney(matchCid: string): boolean {
        // let matchs: TMatchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)
        let data = GetMatchInfo(matchCid)
        if (!data) {
            return false
        }

        return UserSrv.CheckItem(data.gateMoney)
    }

    export function unenoughtPop(data, callback?: Function) {
        if (DataMgr.data.Config.platId == 3) {
            return
        }
        if (data.gateMoney[0].id === Constants.ITEM_INDEX.LOTTERY) {
            // name = "G币"
            let name = UserSrv.GetItemInfo(data.gateMoney[0].id)?.name || ""
            ActivitySrv.GetActivityConfig(0, (res: any[]) => {
                res = res || []
                let list = new Array()
                for (let data of res) {
                    if (data.broke_place == 1 || data.broke_place == 2) {
                        list.push(data)
                    }
                }
                UIMgr.OpenUI("lobby", "component/activity/broke/Broke", { single: true, param: { activityConfig: list, page: 2, name: name, brokeCb: callback } })
            })
        } else if (data.gateMoney[0].id === Constants.ITEM_INDEX.GOLD) {
            UIMgr.OpenUI("lobby", "component/activity/broke/BrokeGold", { single: true, param: { brokeCb: callback } })
        }

        UserSrv.UpdateItem()
    }

    function joinReq(matchCid: string, callback?: Function, failCallback?: Function) {
        let param = {
            match_cid: matchCid,
        }

        _matchReq = true
        //Helper.reportEvent("比赛", "请求比赛", "请求")//"MatchCid:" + matchCid)
        UIMgr.OpenUI("lobby", "component/base/LockPop", { single: true, index: 999 })
        Helper.PostHttp(JOIN_MATCH, null, param, (res, event) => {
            if (res) {
                UIMgr.CloseUI("component/base/LockPop")
                console.log(JSON.stringify(res))

                if (res.match_cid && res.match_id) {
                    EnterRealTimeMatch(res.match_cid, res.match_id, null)
                    return
                }

                if (res.err) {
                    _matchReq = false
                    let m = Helper.ParseJson(res.err, "joinReq")//JSON.parse(res.err)
                    if (m && m.code === 4001) {
                        let matchs: TMatchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)
                        matchs && matchs[matchCid] && unenoughtPop(matchs[matchCid])
                        return
                    } else if (m && m.detail) {
                        Helper.OpenTip(m.detail)
                    } else {
                        Helper.OpenTip(m)
                    }

                    failCallback && failCallback(res.err)
                    return
                }

                //Helper.reportEvent("比赛", "请求比赛", "成功")

                _curMatchCid = res.match_cid
                _curOpponents = res.opponents
                // _matchReq = true
                _matchReqTime = Date.now()

                let matchs: TMatchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)
                let data = matchs && matchs[_curMatchCid] && matchs[_curMatchCid]
                if (data) {
                    if (data.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
                        EnterMatch(_curMatchCid, null, (res) => {
                            if (res) {
                                StartGame()
                            }
                            callback && callback()
                        })
                    } else if (data.roundPlayer > 2) {
                        Helper.OpenPageUI("component/match/multiplayer/MultiplayerMatchStart", "", "image/icon/tubiao-saishi1",
                            { matchId: _curMatchCid, opponents: res.opponents }, callback)
                    } else {
                        UIMgr.OpenUI("igaoshou", "component/matchStart/MatchStart", { single: true, param: { matchId: _curMatchCid, opponents: res.opponents }, closeCb: callback })
                    }
                } else {
                    UIMgr.OpenUI("igaoshou", "component/matchStart/MatchStart", { single: true, param: { matchId: _curMatchCid, opponents: res.opponents }, closeCb: callback })
                }

                initGame()

            } else {
                _matchReq = false
            }
        })
    }

    // http接口
    export function JoinMatch(matchCid: string, matchId: string = null, callback?: Function, failCallback?: Function, msg?: any) {
        if (_realTimeMatchJoin) {
            Helper.OpenTip("您正在匹配实时赛, 无法进行其他比赛!")
            return
        }

        Helper.checkNetwork(() => {
            if (_matchReq) {
                return
            }

            Helper.reportEvent("首局结算-5.4、请求进入第二局")

            isSingleMatch(matchCid) && (matchCid = null)

            let matchs: TMatchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)
            let data = matchs && matchs[matchCid]
            if (data) {
                // if (User.PlayGame < 10 && data.type === Constants.MATCH_TYPE.BATTLE_MATCH) {
                //     for (let i in data.gateMoney) {
                //         if (data.gateMoney[i].id === Constants.ITEM_INDEX.DIAMOND && data.gateMoney[i].num > 100) {
                //             let param = {
                //                 buttons: 1,
                //                 cancelName: "确定",
                //                 param: { msg: "您正在新人保护期内，\n再进行" + (10 - User.PlayGame) + "局对战赛后开启本赛事！" }
                //             }
                //             Helper.OpenPopUI("component/base/MsgEntry", "提示", param)
                //             return
                //         }
                //     }
                // }

                if (!UserSrv.CheckItem(data.gateMoney)) {
                    unenoughtPop(data)
                    return
                }

                if (data.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
                    if (data.startTime > Date.now() / 1000) {
                        let param = {
                            buttons: 1,
                            cancelName: "确定",
                            param: { msg: "本赛事还未开始\n请选择其他比赛进行游戏!" }
                        }
                        Helper.OpenPopUI("component/base/MsgEntry", "提示", param)
                        return
                    }
                    if (data.curTimes >= data.maxTimes) {
                        let param = {
                            buttons: 1,
                            cancelName: "确定",
                            param: { msg: "本赛事今日参与次数已用完\n请选择其他比赛进行游戏!" }
                        }
                        Helper.OpenPopUI("component/base/MsgEntry", "提示", param)
                        return
                    }
                }

                if (data.freeAd) {
                    if (data.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
                        Helper.reportEvent("广告点", "比赛", "活动赛")
                    } else {
                        Helper.reportEvent("广告点", "比赛", "免费赛")
                    }

                    let activity = ActivitySrv.GetActivityById(1010)
                    console.log(activity)
                    if (activity && activity.ad_aid > 0) {
                        let num = (activity.receive_num || 0)
                        let bJoin = false
                        // 游戏币+次数检查
                        if (data.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
                            bJoin = true
                        } else if (User.Lottery <= 160000 && num < 30) {
                            bJoin = true
                        } else if (User.Lottery <= 400000 && num < 10) {
                            bJoin = true
                        } else if (User.Lottery > 400000 && num < 5) {
                            bJoin = true
                        }

                        if (num < activity.day_times && bJoin) {
                            if (Helper.isOpenShare() && data.type === Constants.MATCH_TYPE.ACTIVITY_MATCH && (!data.curTimes || data.curTimes == 0)) {
                                Helper.shareInfo((res) => {
                                    if (res.ShareResultCode == ESocialResult.SHARERESULT_SUCCESS) {
                                        joinReq(matchCid, callback, failCallback)
                                    }
                                })
                            } else {
                                AdSrv.createAdOrder(activity.ad_aid, JSON.stringify(activity), (res: IPlayAdCallBack) => {
                                    if (res && res.order_no && res.order_no.length > 0) {
                                        AdSrv.completeAdOrder((res) => {
                                            ActivitySrv.GetActivityConfig(1010)
                                            if (res && res.code == "00000") {
                                                joinReq(matchCid, callback, failCallback)
                                            }
                                        })
                                    }
                                })
                            }
                        } else {
                            let param = {
                                buttons: 1,
                                cancelName: "确定",
                                param: { msg: "本赛事今日参与次数已用完\n请选择其他比赛进行游戏!" }
                            }
                            Helper.OpenPopUI("component/base/MsgEntry", "提示", param)
                        }
                    }
                } else {
                    joinReq(matchCid, callback, failCallback)
                }
            } else {
                joinReq(matchCid, callback, failCallback)
            }
        })
    }

    export function EnterMatch(matchCid: string, matchId?: string, callback?: Function) {
        if (_realTimeMatchJoin) {
            return
        }

        let param = {
            match_id: matchId || _curMatchId,
            match_cid: matchCid || _curMatchCid
        }

        let matchs: TMatchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)
        let data = matchs[param.match_cid]
        if (data.gameId !== DataMgr.data.Config.gameId) {
            UserSrv.GetGameInfo(data.gameId, (res) => {
                let param = {
                    buttons: 1,
                    cancelName: "确定",
                    param: { msg: "请先切换到<" + res.game_name + ">再尝试进入" }
                }
                Helper.OpenPopUI("component/base/MsgEntry", "提示", param)
            })
            return
        }

        //Helper.reportEvent("比赛", "进入游戏", "请求")//"MatchCid:" + _curMatchCid)
        Helper.PostHttp(ENTER_MATCH, null, param, (res, event) => {
            if (res) {
                console.log(JSON.stringify(res))
                let matchs: TMatchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)
                let data = matchs[param.match_cid]
                if (res.err) {
                    cc.warn("EnterMatch err:" + res.err)
                    let m = Helper.ParseJson(res.err, "enterMatch")
                    if (m && (m.code === 4001 || m.code === 12003)) {
                        unenoughtPop(data)
                    } else if (m && m.code === 4009) {
                        let param = {
                            buttons: 1,
                            cancelName: "确定",
                            param: { msg: "本赛事还未开始\n请选择其他比赛进行游戏!" }
                        }
                        Helper.OpenPopUI("component/base/MsgEntry", "提示", param)
                    } else if (m && m.code === 3001) {
                        let param = {
                            buttons: 1,
                            cancelName: "确定",
                            param: { msg: "本赛事今日参与次数已用完\n请选择其他比赛进行游戏!" }
                        }
                        Helper.OpenPopUI("component/base/MsgEntry", "提示", param)
                    } else if (m && m.detail) {
                        Helper.OpenTip(m.detail)
                    } else {
                        Helper.OpenTip(m)
                    }

                    callback && callback(null)
                    _matchReq = false
                    return
                }

                if (res.round) {
                    _curMatchCid = res.round.match_cid
                    _curMatchId = res.round.match_id
                    _curRoundId = res.round.round_id
                    _curRoomInfo = res.round.room_info

                    if (data && data.roundPlayer > 2) {
                        _curOpponent = res.round.opponent_list
                    } else if (res.round.opponent_uid) {
                        _curOpponent = res.round.opponent_uid
                        if (typeof _curOpponent === "string") {
                            UserSrv.GetPlyDetail(res.round.opponent_uid, (player) => {
                                _curOpponent = player
                            })
                        }
                    }

                    // DataMgr.setData<number>(Constants.DATA_DEFINE.RAND_SEED, res.round.rand_seed)
                    Util.SetSeed(res.round.rand_seed)
                    EventMgr.dispatchEvent(Constants.EVENT_DEFINE.SET_OPPONENT, res.round.opponent_uid)
                    EventMgr.dispatchEvent(Constants.EVENT_DEFINE.JOIN_MATCH_NOT, { matchId: _curMatchId })

                    // _matching = true

                    if (User.AllGame === 1) {
                        Helper.reportEvent("第二局-6.2、进入第二局")
                    }

                    //Helper.reportEvent("比赛", "进入游戏", "成功")

                    callback && callback(res.round)
                }
            }
        })
    }

    export function PauseJoin() {
        _pause = true
    }

    export function ResumeJoin() {
        _pause = false
    }

    export function GameMatch(matchInfo, opponent, _curRoomInfo) {
        if (_igsBoot) {
            _igsBoot.onMatch(matchInfo, opponent, _curRoomInfo)
        } else {
            console.log("====wait igs boot=====")
            _igsMatch = true
        }
    }

    export function GameJoin(players, roomInfo) {
        console.log("====match svr join=====")

        UIMgr.clearAll()
        let baseScene = cc.find("Canvas/BaseScene")
        baseScene && (baseScene.active = false)
        let node = cc.find("Canvas/node")
        node && (node.active = false)
        let logo = cc.find("Canvas/BG/logo")
        logo && (logo.active = true)
        let loading = cc.find("Canvas/BG/loading")
        loading && (loading.active = true)
        IgsBundles.Preload("igaoshou", "result")
        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.CHANGE_SKIN, { skin: 0 })

        _matching = true

        DataMgr.setData(Constants.DATA_DEFINE.GAME_RUNNING, true)
        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.HIDE_BANNER)
        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.GAME_START)
        if (_igsBoot) {
            console.log("====have igs boot=====")
            _igsBoot.onJoin(players, roomInfo)

            DataMgr.setData(Constants.DATA_DEFINE.REALTIME_ROOM_INFO, { matchCid: _curMatchCid, matchId: _curMatchId, roundId: _curRoundId, roomInfo: _curRoomInfo }, true)
        } else {
            console.log("====wait igs boot=====")
            _igsJoin = true
        }
        // WxWrapper.hideUserInfoButton()
        cc.audioEngine.stopMusic()
    }

    export async function StartGame() {
        if (_pause) {
            return
        }

        let matchs: TMatchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)
        let data = isSingleMatch(_curMatchCid) ? getSingleMatch() : matchs[_curMatchCid]

        let matchInfo = {
            matchId: _curMatchId,
            matchName: data.name,
            matchType: data.type,
            minPlayer: data.minPlayer,
            maxPlayer: data.maxPlayer,
            matchAwards: data.awards,
            labals: data.labals,

            isSingle: isSingleMatch(_curMatchCid),
        }
        let func = () => {
            GameMatch(matchInfo, _curOpponent, _curRoomInfo)
            if (_curRoomInfo) {
                JoinRoomReq()
            } else {
                console.log("=== start Game join====")
                GameJoin([User.OpenID, _curOpponent], _curRoomInfo)
            }
        }
        func()
    }

    // 退出比赛
    export function CancelMatch(matchId?: string | Function, callback?: Function) {
        if (!callback && typeof matchId === "function") {
            callback = matchId
            matchId = null
        }

        Helper.StopDelay(_delayTag)
        let param = {
            match_cid: matchId// || _curMatchId
        }
        //Helper.reportEvent("比赛", "退出游戏", "")//"MatchCid:" + _curMatchCid)
        Helper.PostHttp(CANCEL_MATCH, null, param, (res, event) => {
            if (res && res.err) {
                callback(res.err)
            } else if (res && res.id && res.id === "CANCEL_MATCH_FAILED") {
                callback(res.id)
            } else {
                cc.log(res)
                _curMatchId = null
                _curRoomInfo = null
                _matchReq = false
                callback(null)
            }
        })
    }

    // 上传比赛积分
    export function SubmitScore(matchId: string | number, type: number, score?: number | Function, callback?: Function) {
        if (typeof callback !== "function" && typeof score === "function") {
            callback = score
            score = null
        }

        if ((undefined === score || null === score) && typeof matchId === "number" && undefined !== type && null !== type) {
            score = type
            type = matchId
            matchId = null
        }

        if (typeof matchId === "number" && (undefined === type || null === type) && (undefined === type || null === type)) {
            score = matchId
            type = 0
            matchId = null
        }

        if (!matchId) {
            matchId = _curMatchId
        }

        // let md5 = window["md5"]
        // window["" + md5(matchId)] = score
        // // 单机提交分数 多人的由服务器提交
        if (_curRoomInfo) {
            LeaveRoomReq(_curRoomInfo)
        }
        // // leaveGame()
        // // } else {

        //     let check = () => {
        //         // TODO 自动生成方法存根
        //         let s: string = window["" + md5(matchId)] + ""
        //         let array = ""
        //         for (let i = 0; i < s.length; i++) {
        //             array += s.charCodeAt(i)^60//对每个数组元素进行异或运算
        //         }
        //         return array
        //     }


        //Helper.reportEvent("比赛", "提交分数", "请求")//"MatchCid:" + _curMatchCid + " score:" + score)
        console.log("===_curMatchCid " + _curMatchCid)
        let data = GetMatchInfo(_curMatchCid)
        console.log(data)
        if (data.type === Constants.MATCH_TYPE.REALTIME_MATCH && !window["isGameTest"]) {
            _submitMatchId = _curMatchCid

            UserSrv.UpdateItem(() => {
                MatchSvr.GetPlayerProfile(() => {
                    EventMgr.dispatchEvent(Constants.EVENT_DEFINE.MATCH_SUBMIT_FINISH, { matchId: _submitMatchId })
                })
            })
            callback?.()
        } else {
            _submit = true
            _submitMatchId = null
            let param = {
                match_id: isSingleMatch(matchId + "") ? null : matchId,
                // score: check()
                score: score,
                // type: type || 0
            }
            //console.log(param)
            Helper.PostHttp(SUBMIT_SCORE, null, param, (res, event) => {
                console.log("submit scroe")
                console.log(res)
                _submit = false
                if (res && res.err) {
                    cc.warn(res)
                }

                if (res) {
                    //Helper.reportEvent("比赛", "提交分数", "成功")
                }

                _submitMatchId = res?.match_id
                // EventMgr.dispatchEvent(Constants.EVENT_DEFINE.MATCH_SUBMIT_FINISH, { matchId: _submitMatchId })
                // UserSrv.UpdateItem()
                // MatchSvr.GetPlayerProfile()
                UserSrv.UpdateItem(() => {
                    MatchSvr.GetPlayerProfile(() => {
                        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.MATCH_SUBMIT_FINISH, { matchId: _submitMatchId })
                    })
                })
                callback?.()
            })
        }
    }

    // function _LeaveGame(code: number = 0) {
    export function LeaveGame(score: number) {
        Util.SetSeed(null)
        // if (code === 0) {
        DataMgr.setData(Constants.DATA_DEFINE.MATCH_RESULT, {
            matchCid: _curMatchCid,
            matchId: _curMatchId,
            roundId: _curRoundId,
            score: score,
            opponent: _curOpponent,
        })
        // } else {
        //     DataMgr.setData(Constants.DATA_DEFINE.SUBMIT_ERR, code)
        // }
        if (isSingleMatch(_curMatchCid) && User.PlayGame > 0) {
        } else {
            SubmitScore(_curMatchId, 0, score)
        }
        DataMgr.setData(Constants.DATA_DEFINE.GAME_RUNNING, false)
        PlatformApi.GameBack()

        DataMgr.setData(Constants.DATA_DEFINE.REALTIME_ROOM_INFO, null, true)

        _curMatchCid = null
        console.warn("=== leaveGame")
        _curMatchId = null
        _curRoundId = null
        _curRoomInfo = null
        _curOpponent = null
        _curOpponents = []
        _matchReq = false

        _matching = false

        NewGateMgr.ready()
    }

    export function GetSubmitState(): any {
        return { finish: _submit, matchId: _submitMatchId }
    }

    function retrySubmit() {

    }

    // 获取进行中的比赛列表
    export function GetInProgressList(callback?: Function) {
        Helper.PostHttp(GET_PROGRESS_LIST, null, null, (res, event) => {
            if (res) {
                cc.log(res)
                _initProgressMatch(res)
                if (!DataMgr.getData<number>(Constants.DATA_DEFINE.PROGRESS_FIRST_TIME)) {
                    DataMgr.setData(Constants.DATA_DEFINE.PROGRESS_FIRST_TIME, Date.now())
                }
                callback && callback()
            }
        })
    }

    // 获取已完成的比赛列表
    export function GeCompletedList(callback?: Function) {
        Helper.PostHttp(GET_COMPLETED_LIST, null, null, (res, event) => {
            if (res) {
                cc.log(res)
                _initCompletedMatch(res)
                if (!DataMgr.getData<number>(Constants.DATA_DEFINE.COMPLETED_FIRST_TIME)) {
                    DataMgr.setData(Constants.DATA_DEFINE.COMPLETED_FIRST_TIME, Date.now())
                }
                callback && callback()
            }
        })
    }

    //获取比赛
    export function GetMatch(matchCid: string, matchId: string, roundId: string, callback?: Function) {
        if (!matchId) {
            cc.log("GetMatch matchId is null")
            return
        }

        let body = {
            match_id: matchId
        }
        Helper.PostHttp(GET_MATCH, null, body, (res, event) => {
            if (res) {
                cc.log(res)
                if (!res || res.err) {
                    cc.log(res.err)
                    callback && callback(null)
                    return
                }

                roundId = roundId || res.current_round
                if (!res || !res.rounds || !roundId || !res.rounds[roundId]) {
                    callback && callback(null)
                    return
                }
                let roundInfo = res.rounds[roundId]
                if (!roundInfo) {
                    callback && callback(null)
                    return
                }
                roundInfo.vs.forEach(i => i.rank = Number(i.rank) || (roundInfo.winner ? i.openid === roundInfo.winner ? 1 : 2 : undefined))
                let result = _initMatchDetail({
                    matchCid: matchCid,
                    matchId: matchId,
                    roundId: roundId,

                    matchState: res.status || 0,
                    roundState: res.state || Constants.MATCH_ROUND_STATE.ROUND_STATE_WATTING,
                    rounds: res.rounds,
                    totalStage: res.stages.length,
                    currentStage: res.current_stage || 0,
                    stages: res.stages.map(s => s = s.round_list),
                    playerState: res.ply_status || 0,
                    expireAt: roundInfo.expire_at || 0,
                    createAt: roundInfo.create_at || roundInfo.gaming_time,
                    players: roundInfo.vs
                })
                for (let i in res.rounds) {
                    let r = res.rounds[i]
                    result.rounds[i] = r.vs.map(p => p = {
                        openid: p.openid,
                        score: Number(p.score) || 0,
                        state: p.status || 0,
                        rank: Number(p.rank) || (p.openid === r.winner ? 1 : 2),
                        win: p.openid === r.winner
                    })
                    if (i === roundId) {
                        result.isWin = r.winner === User.OpenID
                        result.time = r.gaming_time

                        r.room_info && (result.roomInfo = {
                            gameGid: r.room_info.game_gid,
                            serverId: r.room_info.server_id,
                            roomId: r.room_info.room_id
                        })

                        result.randseed = r.rand_seed
                    }
                    if (r.expire_at) {
                        result.expireTime = r.expire_at
                    }
                }
                callback && callback(result)
            }
        })
    }

    //获取回合
    export function GetRound(roundId: string, callback?: Function) {
        if (!roundId) {
            cc.log("GetRound roundId is null")
            return
        }

        let body = {
            round_id: roundId
        }
        Helper.PostHttp(GET_ROUND, null, body, (res, event) => {
            if (res) {
                cc.log(res)
                callback && callback(res)
            }
        })
    }

    //获取奖励
    export function GetMatchAward(matchId: string, callback?: Function) {
        let body = {
            match_id: matchId
        }
        Helper.PostHttp(GET_MATCH_AWARD, null, body, (res, event) => {
            if (res) {
                cc.log(res)
                callback && callback(res)
            }
        })
    }

    //获取活动赛
    export function GetActivityMatch(matchId: string, callback?: Function) {
        let body = {
            match_id: matchId
        }
        Helper.PostHttp(GET_ACTIVITY_MATCH, null, body, (res, event) => {
            if (res) {
                cc.log(res)
                if (!res || res.err) {
                    cc.log(res.err)
                    callback && callback(null)
                    return
                }

                let matchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)

                if (res.status == -1) {
                    callback && callback({
                        name: (matchs && matchs[res.match_cid]) ? matchs[res.match_cid].name : "",
                        matchId: res.match_cid,
                        matchUuid: matchId,
                        curStage: 0
                    })
                    return
                }

                let result = _initMatchDetail({
                    matchCid: res.match_cid,
                    matchId: matchId,
                    roundId: "",

                    playerState: res.status || 0,
                    matchState: res.matchStatus || 0,
                    roundState: Constants.MATCH_ROUND_STATE.ROUND_STATE_MATCHING,
                    rounds: [],
                    totalStage: res.max_join_times || 1,
                    currentStage: res.join_times || 0,
                    stages: [],
                    expireAt: Number(res.stop_time),
                    createAt: Number(res.begin_time),
                    players: [],

                    score: Number(res.last_score) || 0,
                    topScore: Number(res.top_score) || 0
                })

                if (matchs && matchs[res.match_cid]) {
                    matchs[res.match_cid].curTimes = result.curStage
                    DataMgr.setData(Constants.DATA_DEFINE.MATCH_CONFIG, matchs)
                }

                callback && callback(result)
            }

            callback && callback(null)
        })
    }

    export function GetActivityMatchRankList(matchId: string, start: number, end: number, callback?: Function) {
        let body = {
            match_id: matchId,
            start: start,
            end: end
        }
        Helper.PostHttp(GET_ACTIVITY_RANK_LIST, null, body, (res, event) => {
            if (res) {
                cc.log(res)
                if (!res || res.err) {
                    cc.log(res.err)
                    callback && callback(null)
                    return
                }

                let rows: IActivityMatchRankRow[] = []
                for (let i in res.rank_list) {
                    let rl = res.rank_list[i]
                    let rank = Number(rl.rank) || 0
                    rows[rank] = {
                        rank: rank,
                        score: Number(rl.score) || 0,
                        user: {
                            userName: rl.nickname,
                            openId: rl.openid,
                            avatar: rl.head_image,
                            region: rl.area_info,
                        }
                    }
                }

                let self: IActivityMatchRankRow = null
                if (res.my_rank) {
                    self = {
                        rank: (Number(res.my_rank.rank) || 0),
                        score: res.my_rank.score,
                        user: {
                            userName: res.my_rank.nickname,
                            openId: res.my_rank.openid,
                            avatar: res.my_rank.head_image,
                            region: res.my_rank.area_info,
                        }
                    }
                }

                let result = {
                    self: self,
                    rows: rows
                }

                callback && callback(result)
            }
        })
    }

    export function GetNextActivityMatch(matchCid: string, callback?: Function) {
        let body = {
            match_cid: matchCid,
        }
        Helper.PostHttp(GET_NEXT_ACTIVIY_MATCH, null, body, (res, event) => {
            let matchs: TMatchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)
            if (res && res.err) {   // 有错误
                if (matchs[matchCid]) {
                    matchs[matchCid].startTime = null
                    matchs[matchCid].endTime = null
                    matchs[matchCid].curMatchId = null
                }
            } else if (!res) {      // 范围为空
                if (matchs[matchCid]) {
                    matchs[matchCid].startTime = null
                    matchs[matchCid].endTime = null
                    matchs[matchCid].curMatchId = null
                }
            } else if (Date.now() / 1000 > Number(res.end_time)) { // 已经结束了
                if (matchs[matchCid]) {
                    matchs[matchCid].startTime = null
                    matchs[matchCid].endTime = null
                    matchs[matchCid].curMatchId = null
                }
            } else if (res.begin_time && res.end_time) {    // 有下一场
                if (matchs[matchCid]) {
                    matchs[matchCid].startTime = Number(res.begin_time)
                    matchs[matchCid].endTime = Number(res.end_time)
                    matchs[matchCid].curMatchId = res.match_id
                }
            } else {    // 其他数据都填null
                if (matchs[matchCid]) {
                    matchs[matchCid].startTime = null
                    matchs[matchCid].endTime = null
                    matchs[matchCid].curMatchId = null
                }
            }

            DataMgr.setData(Constants.DATA_DEFINE.MATCH_CONFIG, matchs)
            callback && callback(matchs[matchCid])
        })
    }

    export function LoadMatchConfig(gameId: string, callback?: Function) {
        //console.log("===loadMatchConfig " + gameId)
        let body = {
            game_gid: gameId,
            plat_aid: DataMgr.data.Config.platId,
            ns: "igaoshou",
        }
        Helper.PostHttp(GET_MATCH_CONFIG, null, body, (res, event) => {
            if (res && res.data) {
                initMatch(res.data, gameId)
                callback?.(res)
                return
            }

            callback?.(null)
        })
    }

    export function GetMatchDetails(matchCid: string, callback?: Function) {
        let body = {
            match_cid: matchCid
        }

        Helper.PostHttp(GET_MATCH_DETAIL, null, body, (res, event) => {
            if (res) {
                let matchs: TMatchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG) || {}
                let match: IMatchInfo = {
                    gameId: DataMgr.data.Config.gameId,
                    matchId: matchCid,
                    type: 0,
                    name: res.name,
                    desc: res.desc,
                    minPlayer: 2,
                    maxPlayer: 2,
                    startTime: -1,
                    endTime: -1,
                    gateMoney: [],
                    awards: [],
                    highLight: false,
                    hide: true,

                    roundPlayer: 0
                }

                if (res.entry_fee) {
                    for (let i of res.entry_fee) {
                        match.gateMoney.push({ id: i.id, num: Number(i.num) || 0 })
                    }
                }

                if (res.award_list) {
                    for (let i of res.award_list) {
                        let award: IMatchAward = {
                            start: i.range.start,
                            end: i.range.end,
                            items: [],
                        }
                        for (let k of i.items) {
                            award.items.push({ id: k.id, num: Number(k.num) })
                        }
                        match.awards.push(award)
                    }
                }

                if (res.type === 1) {
                    match.type = Constants.MATCH_TYPE.PRACTICE_MATCH
                } else if (res.type === 2) {
                    match.type = Constants.MATCH_TYPE.BATTLE_MATCH
                } else if (res.type === 3) {
                    match.type = Constants.MATCH_TYPE.TOURNEY_MATCH
                } else if (res.type === 4) {
                    match.type = Constants.MATCH_TYPE.ACTIVITY_MATCH
                }

                matchs[matchCid] = match
                DataMgr.setData(Constants.DATA_DEFINE.MATCH_CONFIG, matchs, true)

                callback?.(match)
                return
            }

            // if (match.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
            //     if (m.metadata && m.metadata.join_times_limit) {
            //         match.maxTimes = m.metadata.join_times_limit || 0
            //         match.curTimes = m.metadata.join_times || 0
            //     }
            // }

            // if (m.metadata) {
            //     match.hide = m.metadata.hide || match.hide
            //     match.showBeginTime = m.metadata.show_begin_time
            //     match.showEndTime = m.metadata.show_end_time
            //     match.forwordShowTime = Number(m.metadata.forword_show_ts) || 0
            // }
            callback?.(null)
        })
    }

    export function initMatch(data, gameId = null) {
        if (!data) {
            return
        }

        console.log("====initMatch " + data)
        // let cfg = JSON.parse(data.match_detail)
        let cfg = Helper.ParseJson(data, "initMatch")
        if (!cfg) {
            return
        }

        if (!gameId) {
            gameId = DataMgr.data.Config.gameId
        }

        cc.log(cfg)

        let activityMatchs = []

        let matchs: TMatchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG) || {}
        for (let idx in matchs) {
            if (matchs[idx].gameId === gameId) {
                delete matchs[idx]
            }
        }

        let list: IMatchInfo[] = []
        for (let idx in cfg) {
            let m = cfg[idx]
            let id = m.match_cid
            let match: IMatchInfo = {
                gameId: m.game_gid,
                matchId: id,
                type: 0,
                name: m.name,
                desc: m.desc,
                minPlayer: m.min_ply_num,
                maxPlayer: m.max_ply_num,
                startTime: m.begin_time,
                endTime: m.end_time,
                gateMoney: [],
                awards: [],
                highLight: false,
                hide: true,

                roundPlayer: m.num_of_round,
            }

            for (let i of m.entry_fee) {
                match.gateMoney.push({ id: i.item_id, num: i.item_num })
            }

            for (let i of m.award_list) {
                let award: IMatchAward = {
                    start: i.range.start,
                    end: i.range.end,
                    items: [],
                }
                for (let k of i.items) {
                    award.items.push({ id: k.item_id, num: k.item_num })
                }
                match.awards.push(award)
            }

            match.labals = m.labals || ""
            let labs = m.labels.split("|")
            for (let l of labs) {
                if (l === "type:1") {
                    match.type = Constants.MATCH_TYPE.PRACTICE_MATCH
                } else if (l === "type:2") {
                    match.type = Constants.MATCH_TYPE.BATTLE_MATCH
                } else if (l === "type:3") {
                    match.type = Constants.MATCH_TYPE.TOURNEY_MATCH
                } else if (l === "type:4") {
                    match.type = Constants.MATCH_TYPE.ACTIVITY_MATCH
                } else if (l === "type:5") {
                    // match.type = Constants.MATCH_TYPE.MULTIPLAYER_MATCH
                    match.isMultiplayer = true
                } else if (l === "type:6") {
                    match.type = Constants.MATCH_TYPE.REALTIME_MATCH
                    match.realTime = true
                } else if (l.indexOf("order:") !== -1) {
                    match.order = Number(l.substr(6))
                } else if (l === "enter_fee:\"ad\"") {
                    match.freeAd = true
                } else if (l === "enter_fee:\"free\"") {
                    match.free = true
                } else if (l === "real_time:1") {
                    match.type = Constants.MATCH_TYPE.REALTIME_MATCH
                    match.realTime = true
                } else if (l.indexOf("level:") >= 0) {
                    match.level = Number(l.substr(l.indexOf("level:") + 1))
                }
            }

            if (match.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
                if (m.metadata && m.metadata.join_times_limit) {
                    match.maxTimes = m.metadata.join_times_limit || 0
                    match.curTimes = m.metadata.join_times || 0
                }
            }

            // match.freeAd = match.gateMoney.filter(i => i.id === Constants.ITEM_INDEX.LOTTERY && i.num > 0).length === 0

            if (m.metadata) {
                match.hide = m.metadata.hide || match.hide
                match.showBeginTime = m.metadata.show_begin_time
                match.showEndTime = m.metadata.show_end_time
                match.forwordShowTime = Number(m.metadata.forword_show_ts) || 0
            }

            // matchs[match.matchId] = match
            list.push(match)

            if (match.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
                activityMatchs.push(match.matchId)
            }
        }

        list.sort((a, b) => {
            return !a.gateMoney[0] ? -1 : !b.gateMoney[0] ? 1 : a.gateMoney[0].num < b.gateMoney[0].num ? -1 : 1
        })

        list.forEach(i => matchs[i.matchId] = i)


        DataMgr.setData(Constants.DATA_DEFINE.MATCH_CONFIG, matchs, true)

        // activityMatchs.forEach(i => GetNextActivityMatch(i))

        UpdateMatch()
    }

    export function UpdateMatch() {
        let data = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)
        if (!data) {
            return
        }

        let minBattleMatch: IMatchInfo = null
        let min6BattleMatch: IMatchInfo = null
        let minPracticeMatch: IMatchInfo = null

        let checkType = DataMgr.data.OnlineParam.breathing_tips || Constants.MATCH_TYPE.PRACTICE_MATCH

        for (let i in data) {
            let cfg = data[i]
            if (cfg) {
                // 剔除非当前游戏的比赛
                if (cfg.gameId !== DataMgr.data.Config.gameId) {
                    continue
                }

                if (!cfg.gateMoney || cfg.gateMoney.length <= 0) {
                    continue
                }

                if (cfg.type === checkType) {
                    if (!minPracticeMatch || minPracticeMatch.gateMoney[0].num > cfg.gateMoney[0].num) {
                        if (!cfg.freeAd) {
                            minPracticeMatch = cfg
                        }
                    }
                    if ((!min6BattleMatch || min6BattleMatch.gateMoney[0].num < cfg.gateMoney[0].num) &&
                        User.Items[cfg.gateMoney[0].id].num / 3 >= cfg.gateMoney[0].num) {
                        if (User.PlayGame >= 3) {
                            min6BattleMatch = cfg
                        }
                    }
                }
                cfg.highLight = false
                cfg.highMsg = null
            }
        }

        if (minBattleMatch) {
            data[minBattleMatch.matchId].highLight = true
            data[minBattleMatch.matchId].highMsg = "开始比赛获得更多奖励！"
        } else if (min6BattleMatch) {
            data[min6BattleMatch.matchId].highLight = true
            data[min6BattleMatch.matchId].highMsg = "开始比赛获得更多奖励！"
        } else if (minPracticeMatch) {
            data[minPracticeMatch.matchId].highLight = true
            data[minPracticeMatch.matchId].highMsg = "开始比赛获得更多奖励！"
        }

        DataMgr.setData(Constants.DATA_DEFINE.MATCH_CONFIG, data)
    }

    export function GetAwards(matchCid: string, rank: number): IItemInfo[] {
        let items: IItemInfo[] = []
        let matchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)
        let match = isSingleMatch(matchCid) ? getSingleMatch() : matchs[matchCid]
        if (match) {
            for (let i of match.awards) {
                if (i.start <= rank && i.end >= rank) {
                    i.items.forEach(a => items.push(a))
                }
            }
        }

        return items
    }

    export function GetMatchInfo(matchCid: string) {
        let matchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)
        if (!matchs) {
            return null
        }

        let match = isSingleMatch(matchCid) ? getSingleMatch() : matchs[matchCid]
        if (match) {
            return match
        }

        return null
    }

    export function GetMatchsByGame(gameId: string) {
        let matchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)
        let list: TMatchs = {}
        for (let i in matchs) {
            if (matchs[i].gameId === gameId) {
                list[i] = matchs[i]
            }
        }

        return matchs
    }

    function _initProgressMatch(data) {
        if (!data || !data.items) {
            DataMgr.setData(Constants.DATA_DEFINE.MATCH_PROGRESS, [])
            return
        }

        let results: TResults = []

        for (let idx in data.items) {
            let d = data.items[idx]
            let r = _initMatchDetail({
                matchCid: d.match_cid,
                matchId: d.match_id,
                roundId: d.round_id,
                matchState: d.match_status || 0,
                roundState: d.round_status || 0,
                totalStage: d.total_stage || 1,
                currentStage: d.current_stage || 0,
                stages: [],
                playerState: d.ply_status || 0,
                expireAt: d.expire_at,
                createAt: d.create_at || d.expire_at,
                players: d.players || [],
                score: d.metadata ? Number(d.metadata.top_score) : undefined,
                rank: d.metadata ? Number(d.metadata.current_rank) : undefined,
            })
            r && results.push(r)
        }

        DataMgr.setData(Constants.DATA_DEFINE.MATCH_PROGRESS, results)
    }

    function _initCompletedMatch(data) {
        if (!data || !data.items) {
            DataMgr.setData(Constants.DATA_DEFINE.MATCH_COMPLETED, [])
            return
        }

        let results: TResults = []

        for (let idx in data.items) {
            let d = data.items[idx]
            let gradeDate
            if (d.metadata && d.metadata.tags) {
                gradeDate = Helper.ParseJson(d.metadata.tags, "initCompleteMatch")
            }
            let r = _initMatchDetail({
                matchCid: d.match_cid,
                matchId: d.match_id,
                roundId: d.round_id,
                matchState: d.match_status || 0,
                roundState: d.round_status || 0,
                totalStage: d.total_stage || 1,
                currentStage: d.current_stage || 0,
                stages: [],
                playerState: d.ply_status || 0,
                expireAt: d.expire_at,
                createAt: d.create_at || d.expire_at,
                finishTime: d.finish_time,
                players: d.players || [],
                score: d.metadata ? Number(d.metadata.top_score) : undefined,
                rank: d.metadata ? Number(d.metadata.current_rank) : undefined,
                gradeDate: gradeDate,
            })

            if (d.type === 5 && r) {
                for (let p of r.players) {
                    if (p.openid === User.OpenID) {
                        r.score = p.score
                        r.rank = p.rank - 1
                    }
                }
            }

            r && results.push(r)
        }

        // results.sort((a, b) => {
        //     return a.time > b.time ? -1 : 1
        // })

        DataMgr.setData(Constants.DATA_DEFINE.MATCH_COMPLETED, results)
    }

    function _initMatchDetail(data): IMatchDetail {
        let match = GetMatchInfo(data.matchCid)
        if (match) {
            let matchDetail: IMatchDetail = {
                matchId: match.matchId,
                name: match.name,
                type: match.type,
                playerNum: match.maxPlayer,
                matchUuid: data.matchId,
                roundId: data.roundId,
                score: data.score,
                players: [],
                awards: match.awards,
                gateMoney: match.gateMoney,
                matchState: data.matchState,// || Constants.MATCH_STATE.NONE,
                roundState: data.roundState,// || Constants.MATCH_ROUND_STATE.ROUND_STATE_GAMEOVER,
                rounds: {},
                totalStage: data.totalStage,// || 1,
                curStage: data.currentStage,// || 1,
                stages: data.stages,
                playerState: data.playerState,// || Constants.PLAYER_MATCH_STATE.PLAYER_MATCH_STATE_GAMEOVER,
                battleState: Constants.PLAYER_BATTLE_STATE.NONE,
                expireTime: data.expireAt,
                time: data.finishTime || data.createAt || data.gamingTime,
                createTime: data.createAt || data.gaming_time,

                topScore: data.topScore,
                rank: data.rank,
                gradeDate: data.gradeDate,
                // GetMatchAward: match.GetMatchAward

                realTime: match.realTime
            }
            for (let p of data.players) {
                if (p.openid === User.OpenID) {
                    matchDetail.score = Number(p.score || 0)
                    matchDetail.battleState = Number(p.state) || Number(p.status) || 0
                    matchDetail.isWin = p.win
                }
                matchDetail.players.push({
                    openid: p.openid,
                    avatar: p.head_image,
                    userName: p.nickname,
                    region: p.area_info,
                    score: Number(p.score) || 0,
                    state: Number(p.state) || Number(p.status) || 0,
                    rank: p.rank,
                    win: p.win,
                    rebattleScore: Number(p.rebattle_score) || 0,
                    props: []
                })
                if (p.props) {
                    for (let v of p.props) {
                        matchDetail.players[matchDetail.players.length - 1].props[v.id] = v
                        matchDetail.players[matchDetail.players.length - 1].props[v.id].expireAt = v.expire_at
                    }
                }
            }

            return matchDetail
        }
        return null
    }

    export function OpenMatchDetail(matchCid: string, matchId: string, roundId: string, closeCb?: Function) {
        let bActivityMatch = false
        let matchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)
        if (matchs && matchs[matchCid]) {
            let match = matchs[matchCid]
            bActivityMatch = match.type === Constants.MATCH_TYPE.ACTIVITY_MATCH
        }

        if (bActivityMatch) {
            // 活动赛流程
            GetActivityMatch(matchId, (result: IMatchDetail) => {
                if (!result) {
                    closeCb && closeCb()
                }
                if (matchs[matchCid].maxTimes === 1) {
                    UIMgr.OpenUI("lobby", "component/match/activityMatch/ActivityMatchList", {
                        param: { data: result }, closeCb: () => {
                            closeCb && closeCb()
                        }
                    })
                } else {
                    UIMgr.OpenUI("igaoshou", "component/matchDetail/matchDetail", {
                        param: {
                            result: result, closeCb: () => {
                                closeCb && closeCb()
                            },
                            showLuckyRedPacket: true,
                            isSettle: true
                        }
                    })
                }
            })
        } else {
            // 普通比赛流程
            GetMatch(matchCid, matchId, roundId, (result: IMatchDetail) => {
                if (!result) {
                    closeCb && closeCb()
                }
                if (result.playerState === Constants.PLAYER_MATCH_STATE.PLAYER_MATCH_STATE_AWARD) {
                    GetMatchAward(matchId)
                }
                UIMgr.OpenUI("stigaoshouart", "component/matchDetail/MatchDetail", {
                    param: {
                        result: result, closeCb: () => {
                            closeCb && closeCb()
                        },
                        showLuckyRedPacket: true,
                        isSettle: true
                    }
                })
            })
        }
    }

    //获取局数
    export function GetPlayerProfile(callback?: Function) {
        Helper.PostHttp(GET_PLAYER_PROFILE, null, null, (res, event) => {
            if (res) {
                User.AllGame = Number(res.total_game_count) || User.AllGame
                User.PlatGame = Number(res.plat_game_count) || User.PlatGame
                User.PlayGame = Number(res.round_count) || User.PlayGame
                User.WinNum = Number(res.champion_game_count) || User.WinNum
                User.WinCon = Number(res.max_continue_win_count) || User.WinCon
                User.Records = res.latest_win_lost || User.Records

                DataMgr.setData("max_score", Number(res.best_record?.max_score) || 0)
                DataMgr.setData("continue_win_count", Number(res.continue_win_count) || 0)

                callback && callback()
            } else {
                callback && callback(null)
            }
        })
    }

    export function GetCurMatch(): string {
        return _curMatchCid
    }

    export function GetOpponentList(): string[] {
        return _curOpponents
    }

    // 获取对手
    export function GetCurOpponent(): string | IPlayerBase | IPlayerBase[] {
        return _curOpponent
    }

    export function IsMatching(): boolean {
        return _matching
    }

    export function initGame() {
        Helper.reportEvent("匹配-3.2、加载游戏资源")
        // 游戏初始化 
        _igsBoot = null
        _igsJoin = false

        let igs = window["igs"]
        let bundle = DataMgr.getData(Constants.DATA_DEFINE.GAME_BUNDLE) || DataMgr.data.Config.bootConfig?.mainGameBundle
        let boot = new igs.bundle.BundleConfig(bundle, bundle, 1, igs.consts.Event.ENTER_GAME, false, false)
        igs.bundle.bootBundle(boot, null, (bt, params) => {
            console.log("===igs.bundle.bootBundle" + JSON.stringify(params))
            if (params && params.success) {
                _igsBoot = bt
                if (_igsMatch) {
                    // let matchs: TMatchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)
                    // let data = matchs[_curMatchCid]
                    let data = GetMatchInfo(_curMatchCid)
                    let matchInfo = {
                        matchId: _curMatchId,
                        matchName: data.name,
                        matchType: data.type,
                        minPlayer: data.minPlayer,
                        maxPlayer: data.maxPlayer,
                        matchAwards: data.awards,
                        labals: data.labals,
                    }
                    GameMatch(matchInfo, _curOpponent, _curRoomInfo)
                }

                if (_igsJoin) {
                    console.log("===gameInit==== onJoin")
                    GameJoin([User.OpenID, _curOpponent], _curRoomInfo)
                }
            }
        })
    }

    // 单机
    const _singleMatchId = "single_match"

    export function isSingleMatch(matchCid: string) {
        return matchCid === _singleMatchId
    }

    export function getSingleMatch(): IMatchInfo {
        return {
            gameId: DataMgr.data.Config.gameId,
            matchId: _singleMatchId,
            type: Constants.MATCH_TYPE.PRACTICE_MATCH,
            name: "练习赛",
            desc: "练习赛",
            minPlayer: 2,
            maxPlayer: 2,
            gateMoney: [{ id: Constants.ITEM_INDEX.LOTTERY, num: 600, }],
            awards: [{ start: 1, end: 1, items: [{ id: Constants.ITEM_INDEX.LOTTERY, num: 1000 }] }],
            roundPlayer: 2
        }
    }

    export function JoinSingleMatch() {
        _curMatchCid = _singleMatchId
        _curOpponents = []

        initGame()
    }

    export function EnterSingleMatch(callback?: Function) {
        _curMatchId = _singleMatchId
        _curRoundId = _singleMatchId
        _curRoomInfo = null

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

        let idx = Math.floor(Math.random() * 100 % FACES.length)

        _curOpponent = {
            userName: FACES[idx].userName,
            openId: "10001",
            avatar: FACES[idx].avatar,
            region: FACES[idx].region,
        }

        // DataMgr.setData<number>(Constants.DATA_DEFINE.RAND_SEED, res.round.rand_seed)
        Util.SetSeed(Date.now())
        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.SET_OPPONENT, _curOpponent)
        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.JOIN_MATCH_NOT, { matchId: _curMatchId })

        // _matching = true

        Helper.reportEvent("匹配-3.5、进入第一局")

        callback?.({
            match_cid: _curMatchCid,
            match_id: _curMatchId,
            round_id: _curRoundId,
            room_info: _curRoomInfo,
            opponent_uid: _curOpponent
        })
    }

    // realTime Match     
    let _realTimeMatchJoin = false
    let _realTimeMatchReqList: string[] = []

    let _reJoinReq: number = 0

    export function checkRealTimeMatch(callback?: Function) {
        MatchSvr.GetInProgressList(() => {
            let data = DataMgr.getData<TResults>(Constants.DATA_DEFINE.MATCH_PROGRESS)
            for (let i in data) {
                if (data[i].realTime && (data[i].playerState === Constants.PLAYER_MATCH_STATE.PLAYER_MATCH_STATE_GAMING) &&
                    (data[i].battleState === Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_WAITING || data[i].battleState === Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_GAMING)) {
                    let param = {
                        single: true,
                        param: { msg: "\n 连接断开，是否恢复上局游戏？\n" },
                        confirmName: "取消",
                        cancelName: "确定",
                        cancel: () => {
                            MatchSvr.EnterRealTimeMatch(data[i].matchId, data[i].matchUuid, data[i].roundId, () => { MatchSvr.StartGame() })
                            callback?.(false)
                        },
                        confirm: () => {
                            callback?.(true)
                        }
                    }
                    Helper.OpenPopUI("component/base/MsgEntry", "提示", param)
                    return
                }
            }

            callback?.(null)
        })
    }

    export function JoinRealTimeMatch(matchs: string[], callback?: Function, reReq: boolean = false) {
        // for (let i in matchs) {
        //     if (!checkGateMoney(matchs[i])) {
        //         callback?.("no enought")
        //         return
        //     }
        // }

        let gaming = DataMgr.getData<boolean>(Constants.DATA_DEFINE.GAME_RUNNING)
        if (gaming) {
            callback?.(true)
            return
        }

        let join = () => {
            let param = {
                match_list: matchs,
            }

            _realTimeMatchJoin = true
            Helper.PostHttp(JOIN_MATCH, null, param, (res, event) => {
                if (res) {
                    if (res.match_cid && res.match_id) {
                        EnterRealTimeMatch(res.match_cid, res.match_id, null)
                        return
                    } else if (!res.err) {
                        if (!reReq) {
                            _curMatchCid = null
                            console.warn("=== JoinRealTimeMatch is reReq")
                            _curMatchId = null
                            _curRoundId = null
                            _curRoomInfo = null

                            _curOpponents = res.opponents
                            _realTimeMatchReqList = matchs

                            callback?.()
                        }
                    }
                }

                _realTimeMatchJoin = false

                if (res && res.err) {
                    if (res.err === "timeout" || res.err.code === 12003) {
                        callback?.()
                    } else {
                        Helper.OpenTip("匹配失败" + (res.err?.code || "") + ", 请稍后再试")
                        callback?.(true)
                    }
                }

                EventMgr.dispatchEvent(Constants.EVENT_DEFINE.JOIN_MATCH_ERR)
            })
        }

        Helper.checkNetwork(() => join(), () => callback("no netwrok"))
    }

    export function CancelRealTimeMatch(callback?: Function) {
        if (_reJoinReq) {
            clearTimeout(_reJoinReq)
            _reJoinReq = null
        }

        CancelMatch(_curMatchCid, () => {
            _realTimeMatchJoin = false
            _realTimeMatchReqList = []
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.CANCEL_REALTIME_MATCH_WAIT)
            callback?.()
        })
    }

    export function MatchConfirm(matchCid: string, matchId: string, confirm?: boolean | Function, callback?: Function) {
        console.log("====Match Confirm====")
        if (typeof confirm === "function") {
            callback = confirm
            confirm = true
        }

        let body = {
            match_cid: matchCid,
            match_id: matchId,
            confirmed: confirm ? 1 : 0,
        }
        Helper.PostHttp(MATCH_CONFIRM, null, body, (res) => {
            if (!res?.err) {
                // _curMatchCid = res.match_cid
                callback?.(res)

                if (confirm) {
                    initGame()
                }
                return
            }

            callback?.(null)
        })
    }

    export function getRealTimeMatchReqList() {
        return _realTimeMatchReqList
    }

    export function getRealTimeStartTime() {
        return _realTimeStartTime
    }

    export function EnterRealTimeMatch(matchCid: string, matchId: string, roundId: string, callback?: Function) {
        let match = GetMatchInfo(matchCid)
        if (!match || !match.realTime) {
            return
        }

        GetMatch(matchCid, matchId, roundId, (res: IMatchDetail) => {
            if (res) {
                console.log(res)
                if (res.roomInfo) {
                    _curMatchCid = res.matchId
                    _curMatchId = res.matchUuid
                    _curRoundId = res.roundId
                    _curRoomInfo = res.roomInfo

                    initGame()

                    for (let i in res.players) {
                        if (res.players[i].openid !== User.OpenID) {
                            _curOpponent = res.players[i].openid
                            if (typeof _curOpponent === "string") {
                                UserSrv.GetPlyDetail(_curOpponent, (player) => {
                                    _curOpponent = player
                                })
                            }
                        }
                    }

                    Util.SetSeed(res.randseed)
                    StartGame()
                }
            }
        })
    }

    export function JoinMatchByCond(matchType: number, matchLevel?: number) {
        let matchs: TMatchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)
        for (let i in matchs) {
            if (matchs[i].type === matchType) {
                if (undefined !== matchLevel && matchs[i].level === matchLevel) {
                    continue
                }

                JoinMatch(matchs[i].matchId)
                return
            }
        }
    }
}

MatchSvr.init()