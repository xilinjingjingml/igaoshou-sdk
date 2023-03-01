/*
 * @Description: 主界面
 * @Version: 1.0
 * @Autor: sonke
 * @Date: 20210330 1528
 * @LastEditors: sonke
 * @LastEditTime: 20210330 1529
 */

import BaseUI from "../base/BaseUI";
import { MatchSvr } from "../system/MatchSvr";
import { DataMgr } from "../base/DataMgr";
import { Constants } from "../constants";
import { UIMgr } from "../base/UIMgr";
import { LeagueSvr } from "../system/LeagueSvr";
import { Helper } from "../system/Helper";
import { Util } from "../api/utilApi";
import { User } from "../system/User";

const { ccclass, property } = cc._decorator;

// const RESULT_CHECK = "resultCheck"

@ccclass
export default class BaseScene extends BaseUI {

    onOpen() {
        // cc.log("Base Scene open " + Date.now())
        this.initData()
    }    

    onEnterBegin() {
        // cc.log("BaseScene")
        Util.PlayBackgroundMusic()
    }

    initData() {
        let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        if (user.histroy.allGame > 3) {
            // this.getMatchResult(() => {
                this.getLeagueResult(Constants.LEAGUE_TYPE.PROFESSION_LEAGUE, () => {
                    this.getLeagueResult(Constants.LEAGUE_TYPE.PRACTICE_LEAGUE)
                })
            // })
        }            

        let showCoin2Ticket = DataMgr.getData<boolean>("showCoin2Ticket") || false
        if (user.histroy.allGame > 3 && DataMgr.Config.platId == 5 && !showCoin2Ticket) {
            DataMgr.setData("showCoin2Ticket", true)
            let wcoin = 0
            for (let idx in user.items) {
                let i = user.items[idx]
                if (i.id === Constants.ITEM_INDEX.WCOIN) {
                    wcoin += i.num
                }
            }            
            if(wcoin > 0){
                UIMgr.OpenUI("component/Activity/Coin2Ticket", { param: {wcoin : wcoin}})
            }
        }
        // ActivitySrv.GetActivityConfig(0, (res) => {
        //     let now = Date.now() / 1000        
        //     for (let info of res) {
        //         let data = info
        //         if (undefined === data.shop_place) {
        //             continue
        //         }
        //         if (data.activity_id === 1002 && data.receive_num === 1) {
        //             continue
        //         }
    
        //         if (info.day_times && info.receive_num && info.receive_num >= info.day_times) {                
        //         } else if (info.receive_time && now - info.receive_time < info.interval_time * 60) {
        //         } else {

        //         }
        //     }
        // })
        // MatchSvr.GetPlayerProfile()
    }

    // getMatchResult(callback?: Function) {
    //     let bCheck = DataMgr.getData<boolean>(RESULT_CHECK)
    //     if (!bCheck) {
    //         MatchSvr.GeCompletedList(() => {
    //             let data = DataMgr.getData<TResults>(Constants.DATA_DEFINE.MATCH_COMPLETED)
    //             if (!data) {
    //                 callback && callback()
    //                 return
    //             }
    
    //             let results: TResults = data.filter(item => item.playerState === Constants.PLAYER_MATCH_STATE.PLAYER_MATCH_STATE_AWARD)
    //             if (results.length > 0) {
    //                 UIMgr.OpenUI("component/Match/MatchOfflineEntry", { param: results, closeCb: () => { callback && callback() } })
    //                 } else {                   
    //                     // UIMgr.OpenUI("component/Match/MatchResultPush", { param: results, closeCb: () => { callback && callback() } })
    //                 }
    //             }
    
    //             callback && callback()
    //         })
    //         DataMgr.setData(RESULT_CHECK, true)
    //     }        
    // }

    getLeagueResult(type: Constants.LEAGUE_TYPE, callback?: Function) {
        LeagueSvr.GetCurLeague(type, (res) => {
            let data = DataMgr.getData<any>(Constants.DATA_DEFINE.LEAGUE_RESULT)
            if (!data || (data && data.last_league_award && data.last_league_award.type !== type)) {
                callback && callback()
                return
            }
            let param = {
                confirmName: "分享",
                cancelName: "知道了",
                confirmIcon: "image/button/common-lvanniou",
                confirm: () => { Helper.shareInfo() },
                closeCb: () => {
                    callback && callback()
                },
                type: type,
            }
            Helper.OpenPopUI("component/League/LeagueSettlement", type === Constants.LEAGUE_TYPE.PRACTICE_LEAGUE ? "联赛结算" : "专业联赛结算", param)
        })
    }
}
