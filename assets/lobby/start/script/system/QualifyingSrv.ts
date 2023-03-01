import { Constants } from "../igsConstants"
import { DataMgr } from "../base/DataMgr"
import { Helper } from "./Helper"
import { User } from "../data/User"
import { igs } from "../../../../igs"


// 赛季信息获取
const GET_CUR_SEASON = "igaoshou-match-srv/grade/GetCurSeason"
// 开启新赛季
const SEASON_SETTLE = "igaoshou-match-srv/grade/SeasonSettle"
// 获取当前比赛结算后，星级变化(段位/星级) 最新段位
const GET_CHANGE_LOG = "igaoshou-match-srv/grade/GetChangeLog"
// 段位配置
const GET_QUALIFYING_CONFIG = "igaoshou-match-srv/grade/ListConfig"
// 段位奖励配置
const GET_LIST_REWARD_CONFIG = "igaoshou-match-srv/grade/ListRewardConfig"
// 获取段位奖励列表 (领取状态)
const GET_LIST_REWARD_STATUS = "igaoshou-match-srv/grade/ListRewardStatus"
// 领取段位奖励
const GET_REWARD = "igaoshou-match-srv/grade/GetReward"
// 获取段位排行 （点赞数）
const GET_RANK_LIST = "igaoshou-match-srv/grade/ListRank"
// 点赞(不可为自己点赞)
const RANK_LIKE = "igaoshou-match-srv/grade/Like"
// 当前点赞记录 (赛季、日期、玩家ID列表)
const GET_TODAY_LIKE_RECORD = "igaoshou-match-srv/grade/TodayLikeRecord"
// 荣誉之旅 历史段位
const GET_GRADE_RECORD = "igaoshou-match-srv/grade/ListGradeRecord"
// 获取玩家段位信息
const GET_PLAYER_GRADE = "igaoshou-match-srv/grade/GetGrade"
// 保星(保星卡使用)
const PROTECT_STAR = "igaoshou-match-srv/grade/ProtectStar"


let _init: boolean = false

export namespace QualifyingSrv {
    export function init() {
        if (!_init) {
            if (igs.odc.init) {
                igs.odc.init(null)
            }

            GetCurSeason()
            _init = true
        }
    }

    export function resetGradeData(grade: IGradeData) {
        if (grade) {
            let config = GetQualifyingByMinor(grade.major, grade.minor)
            grade.major = grade.major || 1
            grade.minor = grade.minor || 1
            grade.star = grade.star || 0
            grade.maxStar = config ? config.maxStar : 0
            grade.name = config ? config.name : ""
            grade.icon = config ? config.icon : ""
            grade.level = config ? config.level : 1
        }
    }

    export function GetCurSeason(callback?: Function, fail?: Function) {
        GetQualifyingConfig(() => {
            Helper.PostHttp(GET_CUR_SEASON, null, null, (res, event) => {
                console.log("GET_CUR_SEASON", res)
                if (res) {
                    if (res && res.err) {
                        fail && fail()
                    } else {
                        res.rank = res.rank || 0
                        resetGradeData(res.grade)
                        if (res.last_settle) {
                            resetGradeData(res.last_settle.grade)
                        }
                        callback && callback(res)
                    }
                }
            })
        })
    }

    export function SeasonSettle(callback?: Function) {
        Helper.PostHttp(SEASON_SETTLE, null, null, (res, event) => {
            console.log("SEASON_SETTLE", res)
            res = {

            }
            if (res) {
                callback && callback(res)
            }
        })
    }

    export function GetChangeLog(param, callback?: Function) {
        GetQualifyingConfig(() => {
            Helper.PostHttp(GET_CHANGE_LOG, null, param, (res, event) => {
                console.log("GET_CHANGE_LOG", res)
                if (res && !res.err) {
                    resetGradeData(res.before)
                    resetGradeData(res.after)
                    callback && callback(res)
                } else {
                    callback && callback(null)
                }
            })
        })
    }

    export function GetQualifyingConfig(callback?: Function) {
        let grades: IGradeData[] = DataMgr.getData<IGradeData[]>(Constants.DATA_DEFINE.QUALIFYING_CONFIG)
        if (grades) {
            callback && callback(grades)
            return
        }
        Helper.PostHttp(GET_QUALIFYING_CONFIG, null, null, (res, event) => {
            console.log("GET_QUALIFYING_CONFIG", res)
            if (res && res.grades) {
                for (let v of res.grades) {
                    v.maxStar = v.max_star
                }
                DataMgr.setData<IGradeData[]>(Constants.DATA_DEFINE.QUALIFYING_CONFIG, res.grades)
                callback && callback(res.grades)
            } else {
                Helper.OpenTip("获取段位配置信息失败！请稍后再试")
            }
        })
    }

    export function GetQualifyingByMinor(major: number, minor: number): IGradeData {
        let grades: IGradeData[] = DataMgr.getData<IGradeData[]>(Constants.DATA_DEFINE.QUALIFYING_CONFIG)
        if (grades) {
            for (let v of grades) {
                if (v.major == major && v.minor == minor) {
                    return v
                }
            }
        }
        return null
    }

    export function GetQualifyingMaxStarByMinor(major: number, minor: number): number {
        let grades: IGradeData[] = DataMgr.getData<IGradeData[]>(Constants.DATA_DEFINE.QUALIFYING_CONFIG)
        if (grades) {
            for (let v of grades) {
                if (v.major == major && v.minor == minor) {
                    return v.maxStar
                }
            }
        }
        return 0
    }

    export function GetListRewardConfig(callback?: Function) {
        let award_list = DataMgr.getData(Constants.DATA_DEFINE.QUALIFYING_REWARD_CONFIG)
        if (award_list) {
            callback && callback(award_list)
            return
        }
        Helper.PostHttp(GET_LIST_REWARD_CONFIG, null, null, (res) => {
            console.log("GET_LIST_REWARD_CONFIG", res)
            if (res && res.award_list) {
                for (let i = 0; i < res.award_list.length; i++) {
                    if (res.award_list[i].award_list) {
                        for (let j = 0; j < res.award_list[i].award_list.length; j++) {
                            if (res.award_list[i].award_list[j].id == Constants.ITEM_INDEX.ProtectStarCard) {
                                res.award_list[i].award_list.splice(j, 1)
                            }
                        }
                    }
                }
                DataMgr.setData(Constants.DATA_DEFINE.QUALIFYING_REWARD_CONFIG, res.award_list)
                callback && callback(res.award_list)
            }
        })
    }

    export function GetListRewardStatus(callback?: Function) {
        GetListRewardConfig((award_list) => {
            for (let c of award_list) {
                c.grade = {
                    major: c.major,
                    minor: c.minor
                }
                resetGradeData(c.grade)
            }
            Helper.PostHttp(GET_LIST_REWARD_STATUS, null, null, (res) => {
                console.log("GET_LIST_REWARD_STATUS", res)
                if (res) {
                    if (res.status_list && res.status_list.length > 0) {
                        for (let c of award_list) {
                            for (let v of res.status_list) {
                                if (c.award_id == v.award_id) {
                                    c.status = v.status
                                    break
                                }
                            }
                        }
                    }
                    callback && callback(award_list)
                }
            })
        })
    }

    export function GetReward(param, callback?: Function) {
        Helper.PostHttp(GET_REWARD, null, param, (res) => {
            console.log("GET_REWARD", res)
            if (res) {
                if (res.err) {

                } else {
                    if (res.award_list) {
                        for (let i = 0; i < res.award_list.length; i++) {
                            if (res.award_list[i].id == Constants.ITEM_INDEX.ProtectStarCard) {
                                res.award_list.splice(i, 1)
                            }
                        }
                        for (let v of res.award_list) {
                            v.item_id = v.item_id || v.id
                            v.item_num = v.item_num || v.num
                        }
                    }
                    callback && callback(res)
                }
            }
        })
    }

    export function GetRankList(param, callback?: Function) {
        GetTodayLikeRecord((record) => {
            Helper.PostHttp(GET_RANK_LIST, null, param, (res) => {
                console.log("GET_RANK_LIST", res)
                if (res) {
                    if (res.my_rank) {
                        resetGradeData(res.my_rank.grade)
                        res.my_rank.rank = res.my_rank.rank || 0
                        res.my_rank.like_star = res.my_rank.like_star || 0
                        res.my_rank.today_like = false
                        let league = User.League || []
                        league[Constants.LEAGUE_TYPE.QUALIFYING] = {
                            type: Constants.LEAGUE_TYPE.QUALIFYING,
                            rank: Number(res.my_rank.rank) || 0,
                            medal: 0
                        }
                        User.League = league
                        User.GradeRank = res.my_rank
                    }
                    let league = DataMgr.getData<ILeagueInfo>(Constants.DATA_DEFINE.LEAGUE_PRACTICE + Constants.LEAGUE_TYPE.QUALIFYING) || { rows: [] }
                    res.list = res.list || []
                    for (let v of res.list) {
                        resetGradeData(v.grade)
                        v.rank = v.rank || 0
                        v.like_star = v.like_star || 0
                        v.today_like = false
                        if (record.records) {
                            for (let r of record.records) {
                                if (r.openid == v.openid) {
                                    v.today_like = true
                                }
                            }
                        }
                        let info: ILeagueRow = {
                            type: res.type,
                            rank: Number(v.rank) || 0,
                            medal: 0 || 0,
                            awards: [],
                            user: {
                                userName: v.nickname,
                                openId: v.openid,
                                avatar: v.head_image,
                                region: "",
                                gradeRank: v,
                            },
                            props: []
                        }

                        if (v.props) {
                            for (let v1 of v.props) {
                                info.props[v1.id] = v1
                                info.props[v1.id].expireAt = v1.expire_at
                            }
                        }

                        league.rows[info.rank] = info
                    }
                    DataMgr.setData(Constants.DATA_DEFINE.LEAGUE_PRACTICE + Constants.LEAGUE_TYPE.QUALIFYING, league)

                    callback && callback(res)
                }
            })
        })
    }

    export function RankLike(param, callback?: Function) {
        Helper.PostHttp(RANK_LIKE, null, param, (res) => {
            console.log("RANK_LIKE", res)
            if (res) {
                if (res.err) {
                    if (res.err.code == 13016) {
                        Helper.OpenTip("今日次数用完")
                    } else {
                        Helper.OpenTip("点赞失败")
                    }
                } else {
                    callback && callback(res)
                }
            }
        })
    }

    export function GetTodayLikeRecord(callback?: Function) {
        let record = DataMgr.getData(Constants.DATA_DEFINE.QUALIFYING_LOKE_RECORD)
        if (record) {
            callback && callback(record)
            return
        }
        Helper.PostHttp(GET_TODAY_LIKE_RECORD, null, null, (res) => {
            console.log("GET_TODAY_LIKE_RECORD", res)
            if (res) {
                if (res.err) {
                } else {
                    DataMgr.setData(Constants.DATA_DEFINE.QUALIFYING_LOKE_RECORD, res)
                    callback && callback(res)
                }
            }
        })
    }

    export function GetGradeRecord(param, callback?: Function) {
        Helper.PostHttp(GET_GRADE_RECORD, null, param, (res) => {
            console.log("GET_GRADE_RECORD", res)
            if (res) {
                if (res.records) {
                    for (let v of res.records) {
                        v.win_cnt = v.win_cnt || 0
                        v.total_cnt = v.total_cnt || 0
                        v.max_win_streak_cnt = v.max_win_streak_cnt || 0
                        resetGradeData(v.grade)
                    }
                }
                callback && callback(res)
            }
        })
    }

    export function ProtectStar(callback?: Function) {
        Helper.PostHttp(PROTECT_STAR, null, null, (res) => {
            console.log("PROTECT_STAR", res)
            if (res) {
                if (res.err) {

                } else {
                    callback && callback(res)
                }
            }
        })
    }

}

// QualifyingSrv.init()