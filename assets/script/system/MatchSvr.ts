import { Constants } from "../constants"
import { DataMgr } from "../base/DataMgr"
import { Helper } from "./Helper"
import match = require("../proto/match")
import gsm = require("../proto/gsb_proto")
import { GateMgr } from "../base/GateMgr"
import { EventMgr } from "../base/EventMgr"
import { UIMgr } from "../base/UIMgr"
import { Match } from "../api/matchApi"
import { PlatformApi } from "../api/platformApi"
import { User } from "./User"
import { ActivitySrv } from "./ActivitySrv"
import { Util } from "../api/utilApi"
import { AdSrv } from "./AdSrv"

const MATCH_SVR = "match_svr"

const JOIN_MATCH = "igaoshou-match-srv/match/joinMatch"
const ENTER_MATCH = "igaoshou-match-srv/match/enterMatch"
const CANCEL_MATCH = "igaoshou-match-srv/match/cancelMatch"
const SUBMIT_SCORE = "igaoshou-match-srv/match/submitScore"
const GET_MATCH = "igaoshou-match-srv/match/getMatch"
const GET_ROUND = "igaoshou-match-srv/match/getRound"
const GET_MATCH_AWARD = "igaoshou-match-srv/match/getMatchAward"

const GET_ACTIVITY_MATCH = "igaoshou-match-srv/match/getActivityMatch"
const GET_ACTIVITY_RANK_LIST = "igaoshou-match-srv/match/activityMatchRankList"
const GET_NEXT_ACTIVIY_MATCH = "igaoshou-match-srv/match/getNextActivityMatch"

const GET_PROGRESS_LIST = "igaoshou-match-srv/match/getInProgressList"
const GET_COMPLETED_LIST = "igaoshou-match-srv/match/getCompletedList"

const GET_PLAYER_PROFILE = "igaoshou-match-srv/match/getPlayerProfile"

const DELAY_TIME = 5500

let _curMatchCid: string = null
let _curMatchId: string = null
let _curRoundId: string = null
let _curRoomInfo: any = null
let _curOpponent: string | IPlayerBase = null
let _delayTag: number = -1
let _matchReq: boolean = false
let _matchReqTime: number = -1

let _pause: boolean = false

export namespace MatchSvr {

    export function init() {
        _matchSvrRegister()
    }

    function _matchSvrRegister() {
        GateMgr.setProto("match", match)
        GateMgr.setProto("gsm", gsm)
        EventMgr.on("JoinMatchNot", JoinMatchNotHandle, MATCH_SVR)
        EventMgr.on("MatchCandidatesNot", MatchCandidatesNotHandle, MATCH_SVR)
        EventMgr.on("JoinRoomRsp", JoinRoomRspHandle, MATCH_SVR)
        EventMgr.on("LeaveRoomRsp", LeaveRoomRspHandle, MATCH_SVR)
        EventMgr.on("LeaveRoomNot", LeaveRoomNotHandle, MATCH_SVR)
        EventMgr.on("DismissNot", DismissNotHandle, MATCH_SVR)

        EventMgr.on(Constants.EVENT_DEFINE.ON_DATA, OnDataHandle, MATCH_SVR)
    }

    // handler接口 
    export function JoinMatchNotHandle(msg) {
        msg = msg.packet
        if (!_matchReq) {
            return
        }
        _curMatchCid = msg.matchCid
        _curMatchId = msg.matchId
        _curRoundId = msg.roundId
        _curRoomInfo = msg.roomInfo
        _curOpponent = msg.opponentUid
        let delayTime = (_matchReqTime + DELAY_TIME) - Date.now()
        if (delayTime < 0)
            delayTime = 0
        _matchReq = false
        _delayTag = Helper.DelayFun(() => {
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.JOIN_MATCH_NOT, { matchId: msg.matchId })
            // Match.StartGame(msg.matchId)
            StartGame()
        }, delayTime / 1000)
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

        GateMgr.notify(roomInfo.server_id + "." + roomInfo.game_gid + ".GsBase.JoinRoom", "JoinRoomReq", {
            roomId: roomInfo.room_id
        })
    }

    export function LeaveRoomReq(roomInfo: any = null) {
        if (null === roomInfo) {
            roomInfo = _curRoomInfo
        }

        GateMgr.notify(roomInfo.server_id + "." + roomInfo.game_gid + ".GsBase.LeaveRoom", "LeaveRoomReq", {
        })
    }

    export function JoinRoomRspHandle(msg) {
        msg = msg.packet
        cc.log(msg)
        if (msg.err) {
            // 错误处理
            return
        }

        let matchs: TMatchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)
        let data = matchs[_curMatchCid]
        let players: string[] = []
        if (msg.room && msg.room.players) {
            msg.room.players.forEach(i => i.openid && players.push(i.openid))
        }
        Match.onJoin(players, msg.room)
    }

    export function LeaveRoomRspHandle(msg) {
        msg = msg.packet
        cc.log(msg)

        if (msg.err) {
            Match.onLeave(false)
            return
        }

        Match.onLeave(true)
        _leaveGame()
    }

    export function JoinRoomNotHandle(msg) {
        msg = msg.packet
        cc.log(msg)

        Match.onPlayerJoin(msg.openid)
    }

    export function LeaveRoomNotHandle(msg) {
        msg = msg.packet
        cc.log(msg)

        Match.onPlayerLeave(msg.plyId)
    }

    export function DismissNotHandle(msg) {
        msg = msg.packet
        cc.log(msg)

        Match.onDismiss()
    }

    export function OnDataHandle(msg) {
        Match.onData(msg)
    }

    export function SendData(route: string, packetName: string, msg: any) {
        if (!_curRoomInfo) {
            cc.warn("MatchSvr SendData err: not found game room!")
            return
        }

        let roomInfo = _curRoomInfo
        GateMgr.notify(roomInfo.server_id + "." + roomInfo.game_gid + "." + route, packetName, msg)
    }

    export function checkGateMoney(matchCid: string): boolean {
        let matchs: TMatchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)
        let data = matchs[matchCid]
        if (!data) {
            return false
        }

        return User.CheckItem(data.gateMoney)
    }

    function unenoughtPop(data) {
        if (DataMgr.Config.platId == 3) {
            return
        }
        let item = data.gateMoney[0].id
        let name = User.GetItemInfo(item).name
        let page = 2
        if (item === Constants.ITEM_INDEX.WCOIN) {
            // name = "G币"
            page = 2
        } else if (item === Constants.ITEM_INDEX.DIAMOND) {
            // name = "钻石"
            page = 3
        }

        ActivitySrv.GetActivityConfig(0, (res: any[]) => {
            if (!res) return

            let list = new Array()
            for (let data of res) {
                if (data.broke_place == 1 || data.broke_place == page) {
                    list.push(data)
                }
            }
            UIMgr.OpenUI("component/Activity/Broke", { param: { activityConfig: list, page: page, name: name } })
        })

        User.UpdateItem()
    }

    // http接口
    export function JoinMatch(matchCid: string, matchId: string = null, callback?: Function, failCallback?: Function) {
        if (_matchReq) {
            return
        }

        let matchs: TMatchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)
        let data = matchs[matchCid]
        if (!data) {
            return
        }

        let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        if (user.histroy.allGame < 10 && data.type === Constants.MATCH_TYPE.BATTLE_MATCH) {
            for (let i in data.gateMoney) {
                if (data.gateMoney[i].id === Constants.ITEM_INDEX.DIAMOND && data.gateMoney[i].num > 100) {
                    let param = {
                        buttons: 1,
                        cancelName: "确定",
                        param: { msg: "您正在新人保护期内，\n再进行" + (10 - user.histroy.allGame) + "局对战赛后开启本赛事！" }
                    }
                    Helper.OpenPopUI("component/Base/MsgEntry", "提示", param)
                    return
                }
            }
        }

        if (!User.CheckItem(data.gateMoney)) {
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
                Helper.OpenPopUI("component/Base/MsgEntry", "提示", param)
                return
            }
            if (data.curTimes >= data.maxTimes) {
                let param = {
                    buttons: 1,
                    cancelName: "确定",
                    param: { msg: "本赛事今日参与次数已用完\n请选择其他比赛进行游戏!" }
                }
                Helper.OpenPopUI("component/Base/MsgEntry", "提示", param)
                return
            }
        }

        let param = {
            match_cid: matchCid,
        }

        let join = () => {
            _matchReq = true
            Helper.reportEvent("比赛", "请求比赛", "")//"MatchCid:" + matchCid)
            Helper.PostHttp(JOIN_MATCH, null, param, (res, event) => {
                if (res) {
                    // cc.log(res)
                    if (res.err) {
                        _matchReq = false
                        let m = Helper.ParseJson(res.err)//JSON.parse(res.err)
                        if (m && m.code === 4001) {
                            unenoughtPop(data)
                            return
                        } else if (m && m.detail) {
                            Helper.OpenTip(m.detail)
                        } else {
                            Helper.OpenTip(m)
                        }

                        failCallback && failCallback(res.err)
                        return
                    }
                    _curMatchCid = matchCid
                    // _matchReq = true
                    _matchReqTime = Date.now()
                    if (data.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
                        EnterMatch(matchCid, null, (res) => {
                            if (res) {
                                StartGame()
                            }
                            callback && callback()
                        })
                    } else {
                        Helper.OpenPageUI("component/Match/MatchStartEntry", "", "image/icon/tubiao-saishi1",
                            { matchId: matchCid, opponents: res.opponents }, callback)
                    }
                } else {
                    _matchReq = false
                }
            })
        }

        // 处理广告进场
        if (data.freeAd) {
            let activity = ActivitySrv.GetActivityById(1010)
            console.log(activity)
            if (activity && activity.ad_aid > 0) {
                if ((activity.receive_num || 0) < activity.day_times) {
                    AdSrv.createAdOrder(activity.ad_aid, JSON.stringify(activity), (order_no: string) => {
                        if (order_no && order_no.length > 0) {
                            AdSrv.completeAdOrder((res) => {
                                ActivitySrv.GetActivityConfig(1010)
                                if (res && res.code == "00000") {
                                    join()
                                }
                            })
                        }
                    })
                } else {
                    let param = {
                        buttons: 1,
                        cancelName: "确定",
                        param: { msg: "本赛事今日参与次数已用完\n请选择其他比赛进行游戏!" }
                    }
                    Helper.OpenPopUI("component/Base/MsgEntry", "提示", param)
                }
            }
        } else {
            join()
        }
    }

    export function EnterMatch(matchCid: string, matchId?: string, callback?: Function) {
        let param = {
            match_id: matchId || _curMatchId,
            match_cid: matchCid || _curMatchCid
        }
        Helper.reportEvent("比赛", "进入游戏", "")//"MatchCid:" + _curMatchCid)
        Helper.PostHttp(ENTER_MATCH, null, param, (res, event) => {
            if (res) {
                cc.log(res)
                let matchs: TMatchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)
                let data = matchs[_curMatchCid]
                if (res.err) {
                    cc.warn("EnterMatch err:" + res.err)
                    let m = Helper.ParseJson(res.err)
                    if (m && m.code === 4001) {
                        unenoughtPop(data)
                    } else if (m && m.code === 4009) {
                        let param = {
                            buttons: 1,
                            cancelName: "确定",
                            param: { msg: "本赛事还未开始\n请选择其他比赛进行游戏!" }
                        }
                        Helper.OpenPopUI("component/Base/MsgEntry", "提示", param)
                    } else if (m && m.code === 3001) {
                        let param = {
                            buttons: 1,
                            cancelName: "确定",
                            param: { msg: "本赛事今日参与次数已用完\n请选择其他比赛进行游戏!" }
                        }
                        Helper.OpenPopUI("component/Base/MsgEntry", "提示", param)
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

                    _curOpponent = res.round.opponent_uid
                    if (_curOpponent) {
                        User.GetPlyDetail(res.round.opponent_uid, (player) => {
                            _curOpponent = player
                        })
                    }

                    // DataMgr.setData<number>(Constants.DATA_DEFINE.RAND_SEED, res.round.rand_seed)
                    Util.SetSeed(res.round.rand_seed)
                    EventMgr.dispatchEvent(Constants.EVENT_DEFINE.SET_OPPONENT, res.round.opponent_uid)
                    EventMgr.dispatchEvent(Constants.EVENT_DEFINE.JOIN_MATCH_NOT, { matchId: _curMatchId })

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

    export function StartGame() {
        if (_pause) {
            return
        }

        // Match.StartGame(_curMatchId, _curRoomInfo)
        let opponent = null
        if (undefined !== _curOpponent && null !== _curOpponent) {
            opponent = typeof _curOpponent === "string" ? _curOpponent : _curOpponent.userId ? _curOpponent.userId : null
        }
        let matchs: TMatchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)
        let data = matchs[_curMatchCid]
        let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)

        let matchInfo = {
            matchId: _curMatchId,
            matchName: data.name,
            matchType: data.type,
            minPlayer: data.minPlayer,
            maxPlayer: data.maxPlayer,
            matchAwards: data.awards
        }
        Match.onMatch(matchInfo, opponent, _curRoomInfo)
        if (_curRoomInfo) {
            JoinRoomReq()
        } else {
            Match.onJoin([user.openId, opponent], _curRoomInfo)
        }
    }

    // 退出比赛
    export function CancelMatch(matchId?: string | Function, callback?: Function) {
        if (!callback && typeof matchId === "function") {
            callback = matchId
            matchId = null
        }

        Helper.StopDelay(_delayTag)
        let param = {
            match_cid: matchId || _curMatchId
        }
        Helper.reportEvent("比赛", "退出游戏", "")//"MatchCid:" + _curMatchCid)
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
    export function SubmitScore(matchId: string | number, type: number, score?: number) {
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

        // 单机提交分数 多人的由服务器提交
        // if (_curRoomInfo) {
        //     LeaveRoomReq(_curRoomInfo)
        //     // leaveGame()
        // } else {
        Helper.reportEvent("比赛", "提交分数", "")//"MatchCid:" + _curMatchCid + " score:" + score)
        let param = {
            match_id: matchId,
            score: score,
            // type: type || 0
        }
        Helper.PostHttp(SUBMIT_SCORE, null, param, (res, event) => {
            console.log("submit scroe")
            console.log(res)
            if (res && res.err) {
                cc.warn(res)
            }

            if (res && res.status_code) {
                // if (res.status_code === 4002) {
                //     // let pop = function () {
                //     //     let param = {
                //     //         buttons: 1,
                //     //         cancelName: "确定",
                //     //         param: { msg: "由于本次比赛已结束, 您本次\n的提交分数无效，您的入场费\n已经返还。" }
                //     //     }
                //     //     Helper.OpenPopUI("component/Base/MsgEntry", "提示", param)
                //     // }
                //     // Helper.DelayFun(pop, 5)
                //     // Helper.OpenTip("本次比赛已结束, 您提交的分数无效，您的入场费已经返还！")
                //     _leaveGame(false)
                //     return
                // } else if (res.status_code === 4003) {
                //     // let pop = function () {
                //     //     let param = {
                //     //         buttons: 1,
                //     //         cancelName: "确定",
                //     //         param: { msg: "重复提交分数。" }
                //     //     }
                //     //     Helper.OpenPopUI("component/Base/MsgEntry", "提示", param)
                //     // }
                //     // Helper.DelayFun(pop, 5)
                //     _leaveGame(false)
                //     return
                // } else if (res.status_code === 4004) {
                //     // let pop = function () {
                //     //     let param = {
                //     //         buttons: 1,
                //     //         cancelName: "确定",
                //     //         param: { msg: "比赛不存在。" }
                //     //     }
                //     //     Helper.OpenPopUI("component/Base/MsgEntry", "提示", param)
                //     // }
                //     // Helper.DelayFun(pop, 5)
                //     _leaveGame(false)
                //     return
                // }
                _leaveGame(res.status_code)
                return
            }

            _leaveGame()
        })
    }

    function _leaveGame(code: number = 0) {
        Util.SetSeed(null)
        if (code === 0) {
            DataMgr.setData(Constants.DATA_DEFINE.MATCH_RESULT, {
                matchCid: _curMatchCid,
                matchId: _curMatchId,
                roundId: _curRoundId,
            })
        } else {
            DataMgr.setData(Constants.DATA_DEFINE.SUBMIT_ERR, code)
        }

        _curMatchCid = null
        _curMatchId = null
        _curRoundId = null
        _curRoomInfo = null
        _curOpponent = null
        _matchReq = false

        User.UpdateItem()
        GateMgr.ready()

        MatchSvr.GetPlayerProfile(() => {
            PlatformApi.LaunchPlatform()
        })
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

                let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
                roundId = roundId || res.current_round
                let roundInfo = res.rounds[roundId]
                if (!roundInfo) {
                    callback && callback(null)
                    return
                }
                roundInfo.vs.forEach(i => i.rank = roundInfo.winner ? i.openid === roundInfo.winner ? 1 : 2 : undefined)
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
                        rank: p.openid === r.winner ? 1 : 2,
                        win: p.openid === r.winner
                    })
                    if (i === roundId) {
                        result.isWin = r.winner === user.userId
                        result.time = r.gaming_time
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
                            userId: rl.openid,
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
                            userId: res.my_rank.openid,
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
            if (res && res.err) {
                if (matchs[matchCid]) {
                    matchs[matchCid].startTime = null
                    matchs[matchCid].endTime = null
                    matchs[matchCid].curMatchId = null
                }
            } else {
                if (matchs[matchCid]) {
                    matchs[matchCid].startTime = Number(res.begin_time)
                    matchs[matchCid].endTime = Number(res.end_time)
                    matchs[matchCid].curMatchId = res.match_id
                }
            }

            DataMgr.setData(Constants.DATA_DEFINE.MATCH_CONFIG, matchs)
            callback && callback(matchs[matchCid])
        })
    }

    export function initMatch(data) {
        if (!data || !data.match_detail) {
            return
        }

        let cfg = JSON.parse(data.match_detail)
        if (!cfg) {
            return
        }

        cc.log(cfg)

        let activityMatchs = []

        let matchs: TMatchs = {}
        for (let idx in cfg) {
            let m = cfg[idx]
            let id = m.match_cid
            let match: IMatchInfo = {
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
                } else if (l.indexOf("order:") !== -1) {
                    match.order = Number(l.substr(6))
                } else if (l === "enter_fee:\"ad\"") {
                    match.freeAd = true
                } else if (l === "enter_fee:\"free\"") {
                    match.free = true
                }
            }

            if (match.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
                if (m.metadata && m.metadata.join_times_limit) {
                    match.maxTimes = m.metadata.join_times_limit || 0
                    match.curTimes = m.metadata.join_times || 0
                }
            }

            if (m.metadata) {
                match.hide = m.metadata.hide || match.hide
                match.showBeginTime = m.metadata.show_begin_time
                match.showEndTime = m.metadata.show_end_time
                match.forwordShowTime = Number(m.metadata.forword_show_ts) || 0
            }

            matchs[match.matchId] = match

            if (match.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
                activityMatchs.push(match.matchId)
            }
        }

        DataMgr.setData(Constants.DATA_DEFINE.MATCH_CONFIG, matchs, true)

        activityMatchs.forEach(i => GetNextActivityMatch(i))

        UpdateMatch()
    }

    export function UpdateMatch() {
        let data = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)
        let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)

        let minBattleMatch: IMatchInfo = null
        let min6BattleMatch: IMatchInfo = null
        let minPracticeMatch: IMatchInfo = null
        for (let i in data) {
            let match = data[i]
            if (match) {
                // if (match.type === Constants.MATCH_TYPE.BATTLE_MATCH) {
                //     if (!minBattleMatch || minBattleMatch.gateMoney[0].num > match.gateMoney[0].num) {
                //         if (user.items[match.gateMoney[0].id].num >= match.gateMoney[0].num) {
                //             if (user.histroy.allGame >= 10 || match.gateMoney[0].num < 100) {
                //                 minBattleMatch = match
                //             }
                //         }
                //     }
                // } else 
                if (match.type === Constants.MATCH_TYPE.PRACTICE_MATCH) {
                    if (!minPracticeMatch || minPracticeMatch.gateMoney[0].num > match.gateMoney[0].num) {
                        if (!match.freeAd) {
                            minPracticeMatch = match
                        }
                    }
                    if ((!min6BattleMatch || min6BattleMatch.gateMoney[0].num < match.gateMoney[0].num) &&
                        user.items[match.gateMoney[0].id].num / 3 >= match.gateMoney[0].num) {
                        if (user.histroy.allGame >= 3) {
                            min6BattleMatch = match
                        }
                    }
                }
                match.highLight = false
                match.highMsg = null
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
        if (matchs[matchCid]) {
            for (let i of matchs[matchCid].awards) {
                if (i.start <= rank && i.end >= rank) {
                    i.items.forEach(a => items.push(a))
                }
            }
        }

        return items
    }

    export function GetMatchInfo(matchCid: string) {
        let matchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)
        if (matchs[matchCid]) {
            return matchs[matchCid]
        }

        return null
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
            })
            r && results.push(r)
        }

        results.sort((a, b) => {
            return a.time > b.time ? -1 : 1
        })

        DataMgr.setData(Constants.DATA_DEFINE.MATCH_COMPLETED, results)
    }

    function _initMatchDetail(data): IMatchDetail {
        let matchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)
        if (matchs && matchs[data.matchCid]) {
            let match = matchs[data.matchCid]
            let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)

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
                // GetMatchAward: match.GetMatchAward
            }
            for (let p of data.players) {
                if (p.openid === user.userId) {
                    matchDetail.score = Number(p.score || 0)
                    matchDetail.battleState = Number(p.state) || Number(p.status) || 0
                    matchDetail.isWin = p.win
                }
                matchDetail.players.push({
                    openid: p.openid,
                    avatar: p.head_image,
                    userName: p.nickname,
                    region: p.area_info,
                    score: p.score,
                    state: Number(p.state) || Number(p.status) || 0,
                    rank: p.rank,
                    win: p.win
                })
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
                    UIMgr.OpenUI("component/Match/ActivityMatchList", {
                        param: { data: result }, closeCb: () => {
                            closeCb && closeCb()
                        }
                    })
                } else {
                    Helper.OpenPageUI("component/Match/MatchDetailEntry", "", null, {
                        result: result, closeCb: () => {
                            closeCb && closeCb()
                        },
                        showLuckyRedPacket: true,
                        isSettle: true
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
                Helper.OpenPageUI("component/Match/MatchDetailEntry", "", null, {
                    result: result, closeCb: () => {
                        closeCb && closeCb()
                    },
                    showLuckyRedPacket: true,
                    isSettle: true
                })
            })
        }
    }

    //获取局数
    export function GetPlayerProfile(callback?: Function) {
        Helper.PostHttp(GET_PLAYER_PROFILE, null, null, (res, event) => {
            if (res) {
                let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
                if (user.histroy) {
                    user.histroy.allGame = Number(res.total_game_count) || user.histroy.allGame
                    user.histroy.platGame = Number(res.plat_game_count) || user.histroy.platGame
                    user.histroy.winNum = Number(res.champion_game_count) || user.histroy.winNum
                    user.histroy.winCon = Number(res.max_continue_win_count) || user.histroy.winCon
                    user.histroy.records = res.latest_win_lost || user.histroy.records
                    user.histroy.playGame = res.game_round_count || user.histroy.playGame
                } else {
                    user.histroy = {
                        playGame: Number(res.game_round_count) || 0,
                        allGame: Number(res.total_game_count) || 0,
                        platGame: Number(res.plat_game_count) || 0,
                        winNum: Number(res.champion_game_count) || 0,
                        winCon: Number(res.max_continue_win_count) || 0,
                        records: res.latest_win_lost || []
                    }
                }
                DataMgr.setData(Constants.DATA_DEFINE.USER_INFO + ".histroy", user.histroy)
                callback && callback()
            } else {
                callback && callback(null)
            }
        })
    }

    // 获取对手
    export function GetCurOpponent(): string | IPlayerBase {
        return _curOpponent
    }
}

MatchSvr.init()