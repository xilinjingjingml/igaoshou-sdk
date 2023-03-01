import { IPluginProxyWrapper } from "./IPluginProxyWrapper"
import { EventMgr } from "../base/EventMgr"
import { Constants } from "../igsConstants"
import { IAdInfo, EAdsType, ESessionResult, EAdsResult, ESocialResult } from "./IPluginProxy"
import { DataMgr } from "../base/DataMgr"
import { Helper } from "../system/Helper"

export namespace H5ProxyWrapper {
    // pulgin变量
    let _sessionCallback: Function = null
    let _payCallback: Function = null
    let _shareCallback: Function = null
    let _adCallback: Function = null

    export function init() {
        console.log('===H5ProxyWrapper init')
    }

    export function getInstance(): IPluginProxyWrapper {
        return H5ProxyWrapper
    }

    export function getPluginsPlist(): any {
        return null
    }

    export function setPluginEnv(env: number) { }
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
        _shareCallback?.({ ShareResultCode: ESocialResult.SHARERESULT_SUCCESS })
    }

    export function jump2ExtendMethod(tag: number, data: string) { }
    export function StartPushSDKItem(data: string) { }

    export function userItemsLogin(data: string) {
        let account = DataMgr.getData<IAccount>(Helper.GetTokenDataKey()) || {}
        let param = {
            auth_type: Constants.AUTH_TYPE.GUEST_LOGIN,
            metadata: {
                account: account ? account.account : null,
                password: account ? account.key : null
            },
        }

        _sessionCallback?.(JSON.stringify({ SessionResultCode: ESessionResult.SESSIONRESULT_SUCCESS, msg: "", sessionInfo: param }))
    }
    export function logout() { }
    export function logEvent(type: number, name: string, param?: any) { }

    export function initAds(data: string) {
        let adInfo: IAdInfo = null
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
        let adInfo: IAdInfo = null
        try { adInfo = JSON.parse(data) } catch { }
        if (!adInfo) {
            return
        }

        if (adInfo.adType === EAdsType.ADS_TYPE_BANNER) {
            showBannerAd(adInfo)
        } else if (adInfo.adType === EAdsType.ADS_TYPE_INTER) {
            // showInterstitialAd()
        } else if (adInfo.adType === EAdsType.ADS_TYPE_REWARTVIDEO) {
            // showRewardedVideoAd(adInfo)
        }
    }

    export function hideAds(adsType: EAdsType) {
        if (adsType === EAdsType.ADS_TYPE_BANNER) {
            // hideBannerAd()
        } else if (adsType === EAdsType.ADS_TYPE_INTER) {

        } else if (adsType === EAdsType.ADS_TYPE_REWARTVIDEO) {

        }
    }

    function showBannerAd(adInfo) {
        adInfo = adInfo || {}
        adInfo.bannerHeight = 189
        _adCallback?.(JSON.stringify({ AdsResultCode: EAdsResult.RESULT_CODE_BANNER_SUCCESS, msg: "广告播放成功", adsInfo: adInfo }))
    }

    export function navigateToMiniGame(appId: string, extraData: any, callback: (succ) => void) {

    }

    export function checkNetwork(callback: (res: any) => void) {
        let navigator = window["navigator"]
        let connection = navigator["connection"] || navigator["mozConnection"] || navigator["webkitConnection"] || { tyep: 'unknown' };
        cc.log(connection)
        callback({ type: navigator.onLine ? connection.effectiveType : "none" })
    }

    export function getABTestKey(key: string): string {
        return Helper.GetURI("abtest")
    }
}

let h52345Game = window["starGame"]
if (cc.sys.isBrowser && !h52345Game) {
    let igs = window["igs"] || {}
    igs["PluginProxyWrapper"] = H5ProxyWrapper

    EventMgr.once(Constants.EVENT_DEFINE.PLATFORM_INIT, () => H5ProxyWrapper.init())
}