/*
 * @Description: API 接口定义
 * @Version: 1.0
 * @Autor: sonke
 * @Date: 20210330 1528
 * @LastEditors: sonke
 * @LastEditTime: 20210330 1529
 */

import { PlatformApi } from "./api/platformApi"
import { Util } from "./api/utilApi"
import { Match } from "./api/matchApi"
import { Player } from "./api/playerApi"
import { GateMgr } from "./base/GateMgr"

// api
export namespace IGaoShouAPI {

    // 平台相关
    export let Initialize = PlatformApi.Initialize
    export let LaunchPlatform = PlatformApi.LaunchPlatform
    export let SDKVersion = PlatformApi.SDKVersion
    export let GetEnv = Util.GetEnv

    // // 工具接口
    export let Random = Util.Random
    export let SetBackgroundMusic = Util.SetBackgroundMusic
    export let SetMusicVolume = Util.SetMusicVolume
    export let SetEffectVolume = Util.SetEffectVolume
    export let GetMusicVolume = Util.GetMusicVolume
    export let GetEffectVolume = Util.GetEffectVolume
    export let SetBackgroundImage = Util.SetBackgroundImage

    // // 玩家信息    
    export let GetSelf = Player.GetSelf
    export let GetPlayer = Player.GetPlayer
    // export let GetSelfDetail = Player.GetSelfDetail
    // export let GetPlayer = Player.GetPlayer
    // export let GetPlayerDetail = Player.GetPlayerDetail

    // // 比赛
    // export let SetGameStartDelegate = Match.SetGameStartDelegate
    export let GameDelegate = Match.GameDelegate
    export let AbortMatch = Match.AbortMatch
    // export let GetMatchRules = Match.GetMatchRules
    // export let GetMatchInfo = Match.GetMatchInfo
    // export let UpdateCurrentScore = Match.UpdateCurrentScore
    export let ReportFinalScore = Match.ReportFinalScore
    export let GetOpponents = Match.GetOpponents

    export let SetProto = Util.SetProto
    export let UnsetProto = Util.UnsetProto
    export let SendData = Match.SendData

    // // 同步
    // export let IsMatchInProgress = Sync.IsMatchInProgress
    // export let IsMatchCompleted = Sync.IsMatchCompleted
    // export let SetSyncDelegate = Sync.SetSyncDelegate
    // export let GetConnectedPlayerCount = Sync.GetConnectedPlayerCount
    // export let GetCurrentPlayerId = Sync.GetCurrentPlayerId
    // export let GetCurrentOpponentPlayerId = Sync.GetCurrentOpponentPlayerId
    // export let GetServerTime = Sync.GetServerTime
    // export let GetTimeLeftForReconnection = Sync.GetTimeLeftForReconnection
    // export let SendData = Sync.SendData

    export let GetPromotion = Util.GetPromotion

    // 微信小程序
    export let NativeGame = Util.NativeGame
    export let CheckWxVersion = Util.CheckWxVersion

    // 广告    
    export let PlayAD = Util.PlayAD
}

window["iGaoShouApi"] = IGaoShouAPI
// if (!CC_EDITOR)
// PlatformApi.Initialize()
