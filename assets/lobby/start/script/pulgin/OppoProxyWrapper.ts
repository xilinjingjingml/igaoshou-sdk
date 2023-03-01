import { DataMgr } from "../base/DataMgr";
import { Constants } from "../igsConstants";
import { IPluginProxyWrapper } from "./IPluginProxyWrapper";
import { IAdInfo, EAdsType, EAdsResult, ESessionResult, ESocialResult } from "./IPluginProxy";
import { EventMgr } from "../base/EventMgr";
import { User } from "../data/User";

let qg = window["qg"]

export namespace OppoProxyWrapper {
    // 微信接口变量
    let mOppoValid: boolean = window["qg"] ? true : false
    let mRewardedVideoAdData: any = { instance: null, error: null }

    let mShareConfig: any = {
        titles: ["好友来助攻，海量红包进来就领！", "玩游戏就送红包！这是你未玩过的全新版本！", "天降红包，你就是躺着领红包的人！"],
        images: ["static/share1.jpg", "static/share2.jpg"]
    }
    let advertVideo = {}
    const AdvertErr = [1000, 1003, 1004, 1005]

    // pulgin变量
    let _sessionCallback: Function = null
    let _payCallback: Function = null
    let _shareCallback: Function = null
    let _adCallback: Function = null

    export function init() {
    }

    export function getInstance(): IPluginProxyWrapper {
        return OppoProxyWrapper
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
        if (mOppoValid) {
            if (qg.setClipboardData) {
                qg.setClipboardData({
                    data: text,
                    success: function (res) {
                        qg.showToast({
                            message: '已复制到剪贴板'
                        })
                        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.MSG_TIP, "已复制到剪贴板")
                    },
                    fail: function (res) {
                        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.MSG_TIP, "复制到剪贴板失败")
                    }
                })
            } else {
                EventMgr.dispatchEvent(Constants.EVENT_DEFINE.MSG_TIP, "复制到剪贴板失败")
            }
        }
    }

    export function getClipBoardContent(): string { return "" }

    export function initHeadFace(url: string) { }

    export function payForProduct(data: string) {
        let payInfo: any
        try { payInfo = JSON.parse(data) } catch { }
        if (mOppoValid) {

        }
    }
    export function shareWithItems(data: string) {
        let param: any = {}
        try { param = JSON.parse(data) } catch { }

        if (mOppoValid) {
            //oppo没有分享api
            // qg.share()
            _shareCallback?.({ ShareResultCode: ESocialResult.SHARERESULT_SUCCESS })
        } else {
            _shareCallback?.({ ShareResultCode: ESocialResult.SHARERESULT_CANCEL })
        }
    }

    export function jump2ExtendMethod(tag: number, data: string) {
        let param: any = {}
        try { param = JSON.parse(data) } catch {}
    }
    export function StartPushSDKItem(data: string) { }

    export function userItemsLogin(data: string) {
        let cfg: any = {}
        try { cfg = JSON.parse(data) } catch { }

        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.RECORD_POINT, { moduleName: "Oppo", action: "Oppo登录", label: "获取token" })
        if (mOppoValid) {
            qg.login({
                success: function (res) {
                    EventMgr.dispatchEvent(Constants.EVENT_DEFINE.RECORD_POINT, { moduleName: "Oppo", action: "Oppo登录", label: "获取token" })
                    let param = {
                        auth_type: Constants.AUTH_TYPE.OPPO_LOGIN,
                        metadata: {
                            token: res.data.token,
                            user_id: "",
                        }
                    }
                    _sessionCallback?.(JSON.stringify({ SessionResultCode: ESessionResult.SESSIONRESULT_SUCCESS, msg: "", sessionInfo: param }))
                },
                fail: function (res) {
                    EventMgr.dispatchEvent(Constants.EVENT_DEFINE.RECORD_POINT, { moduleName: "Oppo", action: "Oppo登录", label: "获取token失败" })
                    _sessionCallback?.(JSON.stringify({ SessionResultCode: ESessionResult.SESSIONRESULT_FAIL, msg: res.errMsg, sessionInfo: null }))
                }
            })
        } else {
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.RECORD_POINT, { moduleName: "Oppo", action: "Oppo登录", label: "获取jsCode失败" })
            _sessionCallback?.(JSON.stringify({ SessionResultCode: ESessionResult.SESSIONRESULT_FAIL, msg: "环境错误", sessionInfo: null }))
        }
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

        } else if (adInfo.adType === EAdsType.ADS_TYPE_INTER) {

        } else if (adInfo.adType === EAdsType.ADS_TYPE_REWARTVIDEO) {
            initRewardedVideoAd(adInfo.adId)
        }
    }

    export function showAds(data: string) {
        let adInfo: IAdInfo = null
        try { adInfo = JSON.parse(data) } catch { }
        if (!adInfo) {
            return
        }

        if (adInfo.adType === EAdsType.ADS_TYPE_BANNER) {

        } else if (adInfo.adType === EAdsType.ADS_TYPE_INTER) {

        } else if (adInfo.adType === EAdsType.ADS_TYPE_REWARTVIDEO) {
            showRewardedVideoAd(adInfo)
        }
    }

    export function hideAds(adsType: EAdsType) {
        if (adsType === EAdsType.ADS_TYPE_BANNER) {

        } else if (adsType === EAdsType.ADS_TYPE_INTER) {

        } else if (adsType === EAdsType.ADS_TYPE_REWARTVIDEO) {

        }
    }

    export function navigateToMiniGame(appId: string, extraData: any, callback: (succ) => void) {
    }

    export function checkNetwork(callback: (res: any) => void) {
        if (mOppoValid) {
            if (qg.getNetworkType) {
                qg.getNetworkType({
                    success(res) {
                        callback({ type: res.type})
                    },
                    fail(res) {
                        callback({ type: null, value: null })
                    }
                })
            }
        }
    }


    // wx.createRewardedVideoAd >= 2.0.4
    function initRewardedVideoAd(unionid) {
        let data = mRewardedVideoAdData
        if (!data.instance && qg.createRewardedVideoAd) {
            data.instance = qg.createRewardedVideoAd({ adUnitId: unionid })
            data.instance.onLoad((data) => {
                data.error = null
                cc.log("视频广告加载完成")
            })

            data.instance.onError((res) => {
                data.error = "视频广告加载失败 " + res.errMsg
                cc.log("视频广告加载失败", res.errMsg, res.errCode)
            })
        }
    }

    export function createRewardedVideoAd(adInfo: IAdInfo) {
        console.log("createRewardedVideoAd", adInfo.adId)
        if (!advertVideo[adInfo.adId]) {
            const advert = { instance: null, valid: true }
            advert.instance = qg.createRewardedVideoAd({ adUnitId: adInfo.adId })

            advert.instance.onError((res) => {
                console.log("advert onError" + adInfo.adId + " ", res)
                EventMgr.dispatchEvent(Constants.EVENT_DEFINE.RECORD_POINT, { moduleName: "广告点", action: "微信小程序广告", label: "广告错误" + adInfo.adId })
                let param = {
                    adsInfo: adInfo,
                    code: EAdsResult.RESULT_CODE_REWARTVIDEO_FAIL,
                    msg: null,
                }
                if (res) {
                    param.msg = res.errMsg || res.errCode
                }

                if (AdvertErr.indexOf(res.errCode) !== -1) {
                    advert.valid = false
                }

                _adCallback?.(JSON.stringify(param))
            })

            advert.instance.onClose((res) => {
                console.log("advert onClose" + adInfo.adId, res)
                if (!res || res.isEnded) {
                    EventMgr.dispatchEvent(Constants.EVENT_DEFINE.RECORD_POINT, { moduleName: "广告点", action: "微信小程序广告", label: "播放完成" + adInfo.adId })
                    _adCallback?.(JSON.stringify({ adsInfo: adInfo, AdsResultCode: EAdsResult.RESULT_CODE_REWARTVIDEO_SUCCEES, msg: "播放成功" }))
                } else {
                    EventMgr.dispatchEvent(Constants.EVENT_DEFINE.RECORD_POINT, { moduleName: "广告点", action: "微信小程序广告", label: "播放取消" + adInfo.adId })
                    _adCallback?.(JSON.stringify({ adsInfo: adInfo, AdsResultCode: EAdsResult.RESULT_CODE_REWARTVIDEO_CANCEL, msg: "取消播放" }))
                }
            })

            advert.instance.onLoad(() => {
                console.log("advert.instance.onLoad")
                // advert.instance.show()
                // .then(qg.hideLoading)
                // .catch((res) => {
                // 	console.error("视频广告显示", res)
                // 	qg.hideLoading()
                // })
            })

            advertVideo[adInfo.adId] = advert
        }

        return advertVideo[adInfo.adId]
    }

    export function showRewardedVideoAd(adInfo) {
        if (mOppoValid) {
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.RECORD_POINT, { moduleName: "广告点", action: "微信小程序广告", label: "创建广告" + adInfo.adId })
            let advert = createRewardedVideoAd(adInfo)
            if (!advert.valid) {
                _adCallback?.(JSON.stringify({ adsInfo: adInfo, AdsResultCode: EAdsResult.RESULT_CODE_REWARTVIDEO_FAIL, msg: "没有广告" }))
                return
            }

            //播放(1)失败--加载---播放 (2)成功
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.RECORD_POINT, { moduleName: "广告点", action: "微信小程序广告", label: "播放广告" + adInfo.adId })
            advert.instance.show()
                .then(() => {
                    EventMgr.dispatchEvent(Constants.EVENT_DEFINE.RECORD_POINT, { moduleName: "广告点", action: "微信小程序广告", label: "播放成功" + adInfo.adId })
                    console.log("jin---已经播放成功")//,unitid || AdvertUnitId.Video, unitid, AdvertUnitId.Video
                })
                .catch(err => {
                    console.log(err)
                    EventMgr.dispatchEvent(Constants.EVENT_DEFINE.RECORD_POINT, { moduleName: "广告点", action: "微信小程序广告", label: "播放失败" + adInfo.adId + " " + err })
                    qg.showLoading({ title: "加载中", mask: true })
                    advert.instance.load()
                        .then(() => {
                            advert.instance.show()
                                .then(qg.hideLoading)
                                .catch((res) => {
                                    console.log(res)
                                    console.error("视频广告显示", res)
                                    qg.hideLoading()
                                })
                        })
                        .catch(qg.hideLoading)
                })
        } else {
            _adCallback?.(JSON.stringify({ adsInfo: adInfo, AdsResultCode: EAdsResult.RESULT_CODE_REWARTVIDEO_FAIL, msg: "没有广告" }))
        }
    }

    export function getABTestKey(key: string): string {
        return ""
    }
}

if (cc.sys.OPPO_GAME === cc.sys.platform) {
    let igs = window["igs"] || {}
    igs["PluginProxyWrapper"] = OppoProxyWrapper

    EventMgr.once(Constants.EVENT_DEFINE.PLATFORM_INIT, () => OppoProxyWrapper.init())
}