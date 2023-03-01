import { Helper } from "./Helper"
import { Constants } from "../igsConstants"
import { DataMgr } from "../base/DataMgr"
import { User } from "../data/User"


const LEAGUE_SVR = "league_svr"

const GET_CUR_LEAGUE = "igaoshou-match-srv/match/getCurLeague"
const LEAGUE_RANK_LIST = "igaoshou-match-srv/match/leagueRankList"
const GET_LEAGUE_AWARDS = "igaoshou-match-srv/match/getLeagueAwardConfig"
const GET_LEAGUE_AWARD = "igaoshou-match-srv/match/getLeagueAward"

let _init: boolean = false

export namespace LeagueSvr {
    export function GetCurLeague(type: Constants.LEAGUE_TYPE, callback?: Function) {
        let param = {
            league_type: type
        }
        Helper.PostHttp(GET_CUR_LEAGUE, null, param, (res, event) => {
            if (res) {
                cc.log(res)
                if (res.err) {
                    cc.warn("getCurLeague err:" + res.err)
                    return
                }
                res.type = type
                _initSelfLeague(res)
                callback && callback(res)
            }
        })
    }

    export function GetLeagueByLeagueId(leagueId: string, start: number, end: number, callback?: Function) {
        let param = {
            league_id: leagueId,
            start: start,
            end: end,
        }
        Helper.PostHttp(LEAGUE_RANK_LIST, null, param, (res, event) => {
            if (res) {
                cc.log(res)
                if (res.err) {
                    cc.warn("getLeagueList err:" + res.err)
                    return
                }
                callback && callback(res)
            }
        })
    }

    export function GetLeagueList(type: number, start: number, end: number, callback?: Function) {
        let league = DataMgr.getData<ILeagueInfo>(Constants.DATA_DEFINE.LEAGUE_PRACTICE + type)
        if (!league || !league.leagueId) {
            cc.warn("no leagueId in list")
            // return
            GetCurLeague(type, (res) => {
                if (!res) {
                    return
                }
                GetLeagueList(type, start, end, callback)
            })
            return
        }

        GetLeagueByLeagueId(league.leagueId, start, end, (res) => {
            res.type = type
            _initLeagueList(res)

            callback && callback(res)
        })
    }

    export function GetLeagueAwardConfig(type: number, leagueId?: string, callback?: Function, reTry?: boolean) {
        let league = DataMgr.getData<ILeagueInfo>(Constants.DATA_DEFINE.LEAGUE_PRACTICE + type)
        if (!leagueId && (!league || !league.leagueId)) {
            cc.warn("no leagueId in list")
            GetCurLeague(type, (res) => {
                if (!res) {
                    return
                }
                if (reTry !== false)
                    GetLeagueAwardConfig(type, leagueId, callback, false)
            })
            return
        }

        let id = leagueId || league.leagueId

        let leagueAward = DataMgr.getData((Constants.DATA_DEFINE.LEAGUE_PRACTICE_AWARD_CONFIG + type) + id)
        if (leagueAward) {
            callback && callback()
            return
        }

        let param = {
            league_id: id,
        }
        Helper.PostHttp(GET_LEAGUE_AWARDS, null, param, (res, event) => {
            if (res) {
                cc.log(res)
                if (res.err) {
                    cc.warn("getLeagueAwardConfig err:" + res.err)
                    return
                }
                res.type = type
                res.league_id = id
                _initLeagueAward(res)
                callback && callback(res)
            }
        })
    }

    export function GetLeagueAwardConfigByRank(type: number, rank: number, leagueId?: string | Function, callback?: Function) {
        if (!callback && typeof leagueId === "function") {
            callback = leagueId
            leagueId = null
        }

        let league = DataMgr.getData<ILeagueInfo>(Constants.DATA_DEFINE.LEAGUE_PRACTICE + type)
        if (!leagueId && (!league || !league.leagueId)) {
            // cc.warn("no leagueId in list")            
            return null
        }

        let id = leagueId as string || league.leagueId

        let leagueAward = DataMgr.getData<ILeagueAward>((Constants.DATA_DEFINE.LEAGUE_PRACTICE_AWARD_CONFIG + type) + id)
        if (!leagueAward) {
            GetLeagueAwardConfig(type, id, () => {
                GetLeagueAwardConfigByRank(type, rank, id, callback)
            })
            return null
        }

        let items = []
        for (let i of leagueAward.awards) {
            if (i.start <= rank && i.end >= rank) {
                i.items.forEach(a => items.push({ id: Number(a.id) || 0, num: Number(a.num) || 0 }))
            }
        }

        callback(items)
        // return items
    }

    export function GetLeagueAward(leagueId: string) {
        let param = {
            league_id: leagueId,
        }
        Helper.PostHttp(GET_LEAGUE_AWARD, null, param, (res, event) => {
            if (res) {
                cc.log(res)
                if (res.err) {
                    cc.warn("getLeagueAwardConfig err:" + res.err)
                    return
                }
            }
        })
    }

    function _initSelfLeague(res) {
        let league = User.League || []
        league[res.type] = {
            type: res.type,
            rank: Number(res.rank) || 0,
            medal: Number(res.medal_num) || 0,
        }
        User.League = league

        let leagues: ILeagueInfo = {
            type: res.type,
            leagueId: res.league_id,
            time: res.end_time,
            totalBouns: [],
            rows: [],
        }

        if (res.total_bonus) {
            res.total_bonus.map(i => leagues.totalBouns.push({ id: Number(i.id) || 0, num: Number(i.num) || 0 }))
        }

        let tmp = DataMgr.getData<ILeagueInfo>(Constants.DATA_DEFINE.LEAGUE_PRACTICE + res.type)
        if(tmp && tmp.rows){
            leagues.rows = tmp.rows
        }
        DataMgr.setData(Constants.DATA_DEFINE.LEAGUE_PRACTICE + res.type, leagues)

        if (res.last_league_award) {
            res.last_league_award.type = res.type
            DataMgr.setData(Constants.DATA_DEFINE.LEAGUE_RESULT, res.last_league_award)
        }
    }

    function _initLeagueList(res) {
        if (!res || !res.rank_list) {
            return
        }

        let league = DataMgr.getData<ILeagueInfo>(Constants.DATA_DEFINE.LEAGUE_PRACTICE + res.type)
        for (let idx in res.rank_list) {
            let d = res.rank_list[idx]
            let info: ILeagueRow = {
                type: res.type,
                rank: Number(d.rank) || 0,
                medal: Number(d.medal_num) || 0,
                awards: [],
                user: {
                    userName: d.nickname,
                    openId: d.openid,
                    avatar: d.head_image,
                    region: d.area_info,
                },
                props:[]
            }

            if(d.props){
                for(let v of d.props){
                    info.props[v.id] = v
                    info.props[v.id].expireAt = v.expire_at
                }
            }

            league.rows[info.rank] = info
        }
        DataMgr.setData(Constants.DATA_DEFINE.LEAGUE_PRACTICE + res.type, league)
    }

    function _initLeagueAward(res) {
        if (!res || !res.award_list) {
            return
        }

        let leagueAward: ILeagueAward = {
            type: res.type,
            awards: []
        }
        for (let idx in res.award_list) {
            let d = res.award_list[idx]
            let info: IMatchAward = {
                start: d.start,
                end: d.end,
                items: [],
            }
            // d.items.map(i => i = {id: i.id, num: i.num})
            for (let k of d.item_list) {
                info.items.push({ id: k.id, num: k.num })
            }

            leagueAward.awards.push(info)
        }
        DataMgr.setData((Constants.DATA_DEFINE.LEAGUE_PRACTICE_AWARD_CONFIG + res.type) + res.league_id, leagueAward)//, true)
    }
}