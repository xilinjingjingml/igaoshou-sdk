import { IPluginProxyWrapper } from "./IPluginProxyWrapper"
import { EventMgr } from "../base/EventMgr"
import { Constants } from "../igsConstants"
import { IAdInfo, EAdsType, ESessionResult, EAdsResult, ESocialResult } from "./IPluginProxy"
import { DataMgr } from "../base/DataMgr"
import { Helper } from "../system/Helper"


let h52345Game = window["starGame"]

export namespace H52345ProxyWrapper {
    // pulgin变量
    let _sessionCallback: Function = null
    let _payCallback: Function = null
    let _shareCallback: Function = null
    let _adCallback: Function = null

    let loginType = 0  //0未登录 1登录中 2登录成功

    let adFinish = false
    let adInfo:IAdInfo = null

    export function init() {
        console.log('===H52345ProxyWrapper init')

        // 设置激励视频成果展示回调方法
        window["onRewardAdShow"] = function onRewardAdShow(){
            console.log('H52345ProxyWrapper 激励视频广告已展示')
        }

        window["onRewardAdResult"] = function onRewardAdResult(ret){
            console.log('H52345ProxyWrapper onRewardAdResult ret', ret)
            if (ret) {
                
            } else {
                EventMgr.dispatchEvent(Constants.EVENT_DEFINE.RECORD_POINT, { moduleName: "广告点", action: "h52345Game广告", label: "播放失败" + adInfo.adId })
                _adCallback?.(JSON.stringify({ adsInfo: adInfo, AdsResultCode: EAdsResult.RESULT_CODE_REWARTVIDEO_FAIL, msg: "播放失败" }))
            }
        }

        window["onRewardAdClick"] = function onRewardAdClick(){
            console.log('H52345ProxyWrapper onRewardAdClick')
        }

        window["onRewardAdFinish"] = function onRewardAdFinish(){
            console.log('H52345ProxyWrapper onRewardAdFinish')
            adFinish = true
        }

        window["onRewardAdClose"] = function onRewardAdClose(){
            console.log('H52345ProxyWrapper onRewardAdClose')
            if (adFinish) {
                EventMgr.dispatchEvent(Constants.EVENT_DEFINE.RECORD_POINT, { moduleName: "广告点", action: "h52345Game广告", label: "播放完成" + adInfo.adId })
                _adCallback?.(JSON.stringify({ adsInfo: adInfo, AdsResultCode: EAdsResult.RESULT_CODE_REWARTVIDEO_SUCCEES, msg: "播放成功" }))
            } else {
                EventMgr.dispatchEvent(Constants.EVENT_DEFINE.RECORD_POINT, { moduleName: "广告点", action: "h52345Game广告", label: "播放取消" + adInfo.adId })
                _adCallback?.(JSON.stringify({ adsInfo: adInfo, AdsResultCode: EAdsResult.RESULT_CODE_REWARTVIDEO_CANCEL, msg: "取消播放" }))
            }
        }

    }

    export function getInstance(): IPluginProxyWrapper {
        return H52345ProxyWrapper
    }

    export function getPluginsPlist(): any {
        return null
    }

    export function setPluginEnv(env: number) {}
    export function setPluginConfig(data: string) { }
    export function setPackageName(packetName: string) { }
    export function switchPluginXRunEnv(env: number) { }

    export function setSessionCallBack(callback: (data: string) => void) {
        _sessionCallback = callback
    }

    export function setIapCallBack(callback: (data: string) => void) {
        _payCallback = callback
    }

    export function setSocialCallBack(callback: (data: string) => void) {
        _shareCallback = callback
    }

    export function setPlatformCallBack(callback: (data: string) => void) { }

    export function setAdsCallBack(callback: (data: string) => void) {
        _adCallback = callback
    }

    export function getPluginVersion(name: string, idx: number, type: number): string { return "" }
    export function getVersionCode(): number { return 0 }

    export function getDeviceIMEI(): string { return "" }
    export function getMacAddress(): string { return "" }

    export function getDeviceName(): string { return "" }
    export function startUpdatingLocation() { }

    export function loadPlugin(name: string, idx: number, type: number) { }

    export function copyToClipboard(text: string) {
        var textArea = document.getElementById("clipBoard")
        if (textArea === null) {
            textArea = document.createElement("textarea")
            textArea.id = "clipBoard"
            textArea.textContent = text
            document.body.appendChild(textArea)
        }
        textArea["select"]()
        try {
            document.execCommand('copy')
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.GAME_TIP, "已复制到剪贴板")
            document.body.removeChild(textArea)
        } catch (err) {
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.GAME_TIP, "复制到剪贴板失败")
        }
    }

    export function getClipBoardContent(): string { return "" }

    export function initHeadFace(url: string) { }

    export function payForProduct(data: string) {

    }
    export function shareWithItems(data: string) {
        _shareCallback?.({ ShareResultCode: ESocialResult.SHARERESULT_CANCEL })
    }

    export function jump2ExtendMethod(tag: number, data: string) { }
    export function StartPushSDKItem(data: string) { }

    export function userItemsLogin(data: string) {
        console.log("h52345Game userItemsLogin 1")
        code2Session((err, session) => {
            if (err) {
                console.log("===h52345Game code2Session===" + err)
                _sessionCallback?.(JSON.stringify({ SessionResultCode: ESessionResult.SESSIONRESULT_FAIL, msg: err, sessionInfo: null }))
                return
            }
            
            let param = {
                auth_type: Constants.AUTH_TYPE.H52345_LOGIN,
                metadata: {
                    account: session ? session.data.passId : null,
                    // account : "184110442",
                    password: ""
                },
            }

            _sessionCallback?.(JSON.stringify({ SessionResultCode: ESessionResult.SESSIONRESULT_SUCCESS, msg: "", sessionInfo: param }))
        })
    }
    export function logout() { }
    export function logEvent(type: number, name: string, param?: any) { }

    export function initAds(data: string) {
        adInfo = null
        try { adInfo = JSON.parse(data) } catch { }
        if (!adInfo) {
            return
        }

        if (adInfo.adType === EAdsType.ADS_TYPE_BANNER) {
            // initBannerAd(adInfo.adId)
        } else if (adInfo.adType === EAdsType.ADS_TYPE_INTER) {
            // initInterstitialAd(adInfo.adId)
        } else if (adInfo.adType === EAdsType.ADS_TYPE_REWARTVIDEO) {
            // initRewardedVideoAd(adInfo.adId)
        }
    }

    export function showAds(data: string) {
        if(loginType == 1){
            Helper.OpenTip("登录中，请稍后再试！")
            return
        }else if(loginType == 0){
            code2Session((err, session) => {
                if (err) {
                    console.log("===h52345Game code2Session===" + err)
                    Helper.OpenTip("登录失败！")
                    return
                }
                showAds(data)
            })
            return
        }

        try { adInfo = JSON.parse(data) } catch { }
        if (!adInfo) {
            return
        }

        if (adInfo.adType === EAdsType.ADS_TYPE_BANNER) {
            showBannerAd()
        } else if (adInfo.adType === EAdsType.ADS_TYPE_INTER) {
            showInterstitialAd()
        } else if (adInfo.adType === EAdsType.ADS_TYPE_REWARTVIDEO) {
            showRewardedVideoAd(adInfo)
        }
    }

    export function hideAds(adsType: EAdsType) {
        if (adsType === EAdsType.ADS_TYPE_BANNER) {
            hideBannerAd()
        } else if (adsType === EAdsType.ADS_TYPE_INTER) {

        } else if (adsType === EAdsType.ADS_TYPE_REWARTVIDEO) {

        }
    }

    function showBannerAd() {
        var reward = h52345Game.reward
        if(reward){
            reward.showBanner()
        }
    }

    function hideBannerAd() {
        var reward = h52345Game.reward
        if(reward){
            reward.hideBanner()
        }
    }

    function showInterstitialAd() {
        var reward = h52345Game.reward
        if(reward){
            reward.startRewardVideo({
                adPosition: 2  // 广告位类型(1：激励视频广告，2：插屏广告)
            })
        }
    }

    function showRewardedVideoAd(adInfo){
        var reward = h52345Game.reward
        if(reward){
            adFinish = false
            reward.startRewardVideo({
                adPosition: 1  // 广告位类型(1：激励视频广告，2：插屏广告)
            })
        }
    }

    export function navigateToMiniGame(appId: string, extraData: any, callback: (succ) => void) {

    }

    export function checkNetwork(callback: (res: any) => void) {
        let navigator = window["navigator"]
        let connection = navigator["connection"] || navigator["mozConnection"] || navigator["webkitConnection"] || { tyep: 'unknown' };
        cc.log(connection)
        callback({type: navigator.onLine ? connection.effectiveType : "none"})
    }

    export function getABTestKey(key: string): string {
        return Helper.GetURI("abtest")
    }

    function code2Session(callback) {
        console.log("h52345Game code2Session loginType", loginType)
        if(loginType > 0){
            return
        }
        let game_code = 'wp_kdjl'
        if(DataMgr.data.Config["2345-minigame"]){
            game_code = DataMgr.data.Config["2345-minigame"].gameCode
        }
        console.log("h52345Game code2Session game_code", game_code)
        let logic = h52345Game.logic    
        if(logic){
            loginType = 1
            logic.init({ 
                game_code: game_code, // (请联系2345运营提供)
            })
            .then(function(res) {
                    //游戏初始化成功，返回passId 
                    // {code: 200, data: {passId: '1234567890'}, msg: '登录成功'}
                    if (res && res.code === 200 && res.data && res.data.passId) {
                        loginType = 2
                        console.log('h52345Game 登录成功', res)
                        callback?.(null, res)
                    }
                }, function(error) {
                    //游戏初始化失败 
                    loginType = 0
                    console.log('h52345Game 登录失败', error)
                    callback?.(error, null)
                }
            ).catch((err) => {
                loginType = 0
                console.log('h52345Game 登录失败', err)
            })
        }else{
            console.log('h52345Game logic is null')
        }
    }
}

if (cc.sys.isBrowser && h52345Game) {
    let igs = window["igs"] || {}
    igs["PluginProxyWrapper"] = H52345ProxyWrapper

    EventMgr.once(Constants.EVENT_DEFINE.PLATFORM_INIT, () => H52345ProxyWrapper.init())
}