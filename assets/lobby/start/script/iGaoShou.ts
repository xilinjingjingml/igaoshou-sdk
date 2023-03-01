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
import { PluginMgr } from "./base/PluginMgr"
import { igs } from "../../../igs"
import { UserSrv } from "./system/UserSrv"

// api
export namespace IGaoShouAPI {

    // 平台相关
    export let Initialize = PlatformApi.Initialize
    // export let LaunchPlatform = PlatformApi.LaunchPlatform
    export let LaunchPlatform = PlatformApi.Launch
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

    // 广告    
    export let PlayAD = Util.PlayAD
    export let ShowBannerAD = PluginMgr.showBanner
    export let HideBannerAD = PluginMgr.hideBanner
    export let ShowPluginAD = PluginMgr.showPluginAd

    //分享
    export let shareInfo = Util.shareInfo


    // new function
    export let Launch = PlatformApi.Launch

    export enum EAdsResult {
        RESULT_CODE_INTER_SUCCEES = 10,         //插屏广告播放成功
        RESULT_CODE_INTER_FAIL = 11,            //插屏广告播放失败
        RESULT_CODE_REWARTVIDEO_SUCCEES = 12,    //激励视频广告播放成功
        RESULT_CODE_REWARTVIDEO_FAIL = 13,      //激励视频广告播放失败
        RESULT_CODE_BANNER_SUCCESS = 14,      //banner广告播放成功
        RESULT_CODE_BANNER_FAIL = 15,         //banner广告播放失败
        RESULT_CODE_REWARTVIDEO_LOAD_FAIL = 16,     //激励视频广告LOAD失败
        RESULT_CODE_REWARTVIDEO_LOAD_SUCCESS = 17,  //激励视频广告LOAD成功
        RESULT_CODE_INTER_CLOSE = 18,         //插屏广告关闭
        RESULT_CODE_NATIVE_SUCCESS = 19,      //原生信息流广告播放成功
        RESULT_CODE_NATIVE_FAIL = 20,         //原生信息流广告播放失败
        RESULT_CODE_NATIVE_CLOSE = 21,        //原生信息流广告关闭
        RESULT_CODE_REWARTVIDEO_CLOSE = 22,   //激励视频广告关闭

        RESULT_CODE_REWARTVIDEO_CANCEL = 101,   //激励视频广告播放取消
        RESULT_CODE_CREATE_ORDER_FAIL = 102,    //创建广告订单失败
        RESULT_CODE_ERROR_CONFIG = 103,         //广告配置错误或没有配置
        RESULT_CODE_BANNER_CLOSE = 104,         //banner关闭
    }

    // 更新道具
    export let UpdateItem = UserSrv.UpdateItemReq
}

window["iGaoShouApi"] = IGaoShouAPI
// if (!CC_EDITOR)
// PlatformApi.Initialize()


// igs注册启动项
export default class iGaoShouMain extends window["igs"].listener.DefaultBundleBooter implements igs.listener.IBundleBatchUpdateListener {
    onCheckRemoteUpdateFailed(bundles: igs.bundle.BundleConfig[]): void {
        igs.log("==onCheckRemoteUpdateFailed==", bundles.length)
    }
    onOneDownloadInfoFailed(ud: igs.hotUpdate.UpdateData): void {
        igs.log("==onOneDownloadInfoFailed==", ud.bundleName)
    }
    onOneDownloadInfoSuccess(ud: igs.hotUpdate.UpdateData): void {
        igs.log("==onOneDownloadInfoSuccess==", ud.bundleName, ud.totalToDownloadBytesCount)
    }
    onAllDownloadInfoSuccess(uds: igs.hotUpdate.UpdateData[]): void {
        // throw new Error("Method not implemented.");
    }
    onSomeDownloadInfoFailed(uds: igs.hotUpdate.UpdateData[]): void {
        igs.log("==onSomeDownloadInfoFailed==", uds.length)
    }
    onOneDownloadSuccess(ud: igs.hotUpdate.UpdateData): void {
        igs.log("==onOneDownloadSuccess==", ud.bundleName, ud.totalToDownloadBytesCount, ud.downloadedByteCount)
    }
    onDownloadProgress(ud: igs.hotUpdate.UpdateData): void {
        // throw new Error("Method not implemented.");
    }
    onAllDownloadSuccess(uds: igs.hotUpdate.UpdateData[]): void {
        // throw new Error("Method not implemented.");
    }
    onSomeDownloadFailed(uds: igs.hotUpdate.UpdateData[]): void {
        igs.log("==onSomeDownloadFailed==")
    }
    onOneLoadSuccess(uds: igs.hotUpdate.UpdateData): void {
        igs.log("==onOneLoadSuccess==", uds.bundleName)
        if (uds.bundleName === "igaoshou") {
            igs.platform.trackEvent(igs.platform.TrackNames.IGS_PRELOAD_BUNDLES_SUCCESS_igaoshou)
        }
        if (uds.bundleName !== "igaoshou" && uds.bundleName !== "main" && uds.bundleName !== "resources") {
            igs.platform.trackEvent(igs.platform.TrackNames.IGS_PRELOAD_BUNDLES_SUCCESS_game)
        }
    }
    onOneLoadFailed(uds: igs.hotUpdate.UpdateData): void {
        igs.log("==onOneLoadFailed==", uds.bundleName)
    }
    onAllLoadSuccess(uds: igs.hotUpdate.UpdateData[]): void {
        igs.log("==onAllLoadSuccess==", uds.length)
        uds.forEach((ud) => {
            igs.log("detail: ", ud.bundleName)
        })
        IGaoShouAPI.LaunchPlatform()
    }
    onSomeLoadFailed(uds: igs.hotUpdate.UpdateData[]): void {
        igs.log("==onSomeLoadFailed==", uds.length)
        let hasigaoshou = false,
            hasgame = false
        for (let i of uds) {
            igs.log("load failed detail", i.ret, i.downloadedByteCount, i.totalToDownloadBytesCount, i.bundleDir, i.bundleName, i.newVersion, i.oldVersion)
            if (i.bundleName === "igaoshou") {
                hasigaoshou = true
            } else if (i.bundleName !== "resources" && i.bundleName !== "main" && i.bundleName !== "igaoshou") {
                hasgame = true
            }
        }
        if (hasigaoshou) {
            igs.platform.trackEvent(igs.platform.TrackNames.IGS_PRELOAD_BUNDLES_FAILED_igaoshou)
        }
        if (hasgame) {
            igs.platform.trackEvent(igs.platform.TrackNames.IGS_PRELOAD_BUNDLES_FAILED_game)
        }

        igs.emit("BUNDLE_LOAD_FAILED")
    }
    onLoadProgress(uptData: igs.bundle.BundleLoadProgress): void {
        igs.log("==onLoadProgress==")
    }

    bundles: igs.bundle.BundleConfig[] = []
    init(params: any): void {
        if (cc.sys.isNative) {
            this.bundles.push(new igs.bundle.BundleConfig("lobby", "lobby", 0, igs.consts.Event.ENTER_IGAOSHOU, false, false))
            // igs.platform.trackEvent(igs.platform.TrackNames.IGS_PRELOAD_BUNDLES)
            igs.bundle.updateBundles(this.bundles, this)
        } else {
            IGaoShouAPI.LaunchPlatform()
        }
    }
}
// 模块中注册
window["igs"].bundle.registerBooter("igaoshou", iGaoShouMain)