import { DataMgr } from "../base/DataMgr";
import { Constants } from "../igsConstants";
import { IPluginProxyWrapper } from "./IPluginProxyWrapper";
import { IAdInfo, EAdsType, EAdsResult, ESessionResult, ESocialResult } from "./IPluginProxy";
import { EventMgr } from "../base/EventMgr";
import { User } from "../data/User";
import { HttpMgr } from "../base/HttpMgr";
import { Helper } from "../system/Helper";

const GET_BYTEDANCE_OPENID = "mcbeam-authen-srv/auth/byteDanceMiniSessionKey"

let tt = window["tt"]

export namespace ByteDanceProxyWrapper {
    // 字节接口变量
    let mValid: boolean = false
    let mRewardedVideoAdData: any = { instance: null, error: null }
    let mInterstitialAdData: any = { instance: null, error: null }
    let mBannerAdData: any = { instance: null, error: null, adUnitId: "" }

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
    let _curAdInfo:any = null

    export function init() {
        mValid = cc.sys.BYTEDANCE_GAME === cc.sys.platform
        console.log("ByteDanceWrapper mValid", mValid)
    }

    export function getInstance(): IPluginProxyWrapper {
        return ByteDanceProxyWrapper
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
        if (mValid) {
            let tip = (msg) => {
                tt.showModal({
                    title: "提示",
                    content: msg,
                    showCancel: false,
                    success: function (res) { }
                })
            }

            if (tt.setClipboardData) {
                tt.setClipboardData({
                    data: text,
                    success: function (res) {
                        tip("复制成功")
                    },
                    fail: function (res) {
                        tip("复制失败")
                    }
                })
            } else {
                tip("复制失败")
            }
        }
    }

    export function getClipBoardContent(): string { return "" }

    export function initHeadFace(url: string) { }

    export function payForProduct(data: string) {
        let payInfo: any
        try { payInfo = JSON.parse(data) } catch { }
        if (mValid) {

        }
    }
    export function shareWithItems(data: string) {
        let param: any = {}
        try { param = JSON.parse(data) } catch { }
        console.log(param)
        if (mValid) {
            tt.shareAppMessage({
                title: param.ShareTitle,
                imageUrl: param.SharedImg,
                success() {
                    _shareCallback?.({ ShareResultCode: ESocialResult.SHARERESULT_SUCCESS })
                },
                fail(e) {
                    _shareCallback?.({ ShareResultCode: ESocialResult.SHARERESULT_CANCEL })
                },
            })
        } else {
            _shareCallback?.({ ShareResultCode: ESocialResult.SHARERESULT_CANCEL })
        }
    }

    export function jump2ExtendMethod(tag: number, data: string) {
        let param = JSON.parse(data)
    }
    export function StartPushSDKItem(data: string) { }

    export function userItemsLogin(data: string) {
        let cfg: any = {}
        try { cfg = JSON.parse(data) } catch { }

        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.RECORD_POINT, { moduleName: "ByteDance", action: "ByteDance登录", label: "获取code" })
        if (mValid) {
            code2Session((err, session) => {
                if (err) {
                    console.log("===ByteDance code2Session===" + err)
                    _sessionCallback?.(JSON.stringify({ SessionResultCode: ESessionResult.SESSIONRESULT_FAIL, msg: err, sessionInfo: null }))
                    return
                }

                let param = {
                    auth_type: Constants.AUTH_TYPE.BYTEDANCE_LOGIN,
                    metadata: {
                        openid: session.openid,
                        bindOpenId: null,
                        code: "",
                        rawdata: "",
                        signature: "",
                    }
                }

                console.log("===ByteDance mValid===" + session.openid)

                let option = cfg.option ? null : tt.getLaunchOptionsSync()
                let query = option && (typeof option == "object") ? option.query : {}
                DataMgr.setData("ByteDanceQuery", query)

                param.metadata.bindOpenId = query.openId && (query.openId != session.openid) ? query.openId : ""

                EventMgr.dispatchEvent(Constants.EVENT_DEFINE.RECORD_POINT, { moduleName: "ByteDance", action: "ByteDance登录", label: "同步用户信息" })
                let cb = (err, res) => {
                    console.log("===ByteDanceQuery getUserInfo err" + err)
                    console.log("===ByteDanceQuery getUserInfo res" + res)
                    if (!err && res) {
                        param.metadata.code = res && res.code ? res.code : ""
                        param.metadata.rawdata = res && res.rawData ? Helper.ParseJson(res.rawData) : ""
                        param.metadata.signature = res && res.signature ? res.signature : ""
                    } else {
                        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.RECORD_POINT, { moduleName: "ByteDance", action: "ByteDance登录", label: "同步用户信息失败" + JSON.stringify(err) })
                    }
                    _sessionCallback?.(JSON.stringify({ SessionResultCode: ESessionResult.SESSIONRESULT_SUCCESS, msg: "", sessionInfo: param }))
                }
                getUserInfo(cb)
            })
        } else {
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.RECORD_POINT, { moduleName: "ByteDance", action: "ByteDance登录", label: "获取Code失败" })
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
            initBannerAd(adInfo.adId)
        } else if (adInfo.adType === EAdsType.ADS_TYPE_INTER) {
            initInterstitialAd(adInfo.adId)
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
            showBannerAd(adInfo)
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

    export function navigateToMiniGame(appId: string, extraData: any, callback: (succ) => void) {
    }

    export function checkNetwork(callback: (res: any) => void) {
        if (mValid) {
            if (tt.getNetworkType) {
                tt.getNetworkType({
                    success(res) {
                        callback({ type: res.networkType, value: res.signalStrength })
                    },
                    fail(res) {
                        callback({ type: null, value: null })
                    }
                })
            }
        }
    }

    export function initInterstitialAd(adUnitId: string) {
        let data = mInterstitialAdData
        if (!data.instance && tt.createInterstitialAd) {
            data.instance = tt.createInterstitialAd({
                adUnitId: adUnitId
            })

            data.instance.onLoad(() => {
                data.error = null
                cc.log("插屏广告加载完成")
            })

            data.instance.onError((res) => {
                // data.error = "插屏广告加载失败 " + res.errMsg
                console.log("插屏广告加载失败", res.errMsg, res.errCode)
            })
        }
    }

    export function showInterstitialAd() {
        console.log("showInterstitialAd")
        let data = mInterstitialAdData
        if (data.instance && !data.error) {
            data.instance.show().catch((err) => {
                console.log(err)
            })
        }else{
            console.log("showInterstitialAd err")
        }
    }

    export function initBannerAd(adUnitId: string) {
        let data = mBannerAdData
        data.adUnitId = adUnitId
        if (mValid) {
            if (!data.instance && tt.createBannerAd) {
                let screenSzie = cc.view.getFrameSize()
                data.instance = tt.createBannerAd({
                    adUnitId: adUnitId,//'adunit-6706df99e776ccbb',
                    adIntervals: 30,
                    style: {
                        top: 0,
                        left: 0,
                        width: cc.winSize.width
                    }
                })

                data.instance.onLoad(() => {
                    data.error = null
                    console.log("Banner广告加载完成")
                })

                data.instance.onError((res) => {
                    // data.error = "Banner广告加载失败 " + res.errMsg
                    console.log("Banner广告加载失败", res.errMsg, res.errCode)
                })

                data.instance.onResize((res) => {
                    let screenSzie = cc.view.getFrameSize()
                    data.instance.style.left = (screenSzie.width - res.width) / 2
                    data.instance.style.top = screenSzie.height - res.height

                    console.log("====banner height = " + res.height + " design " + cc.view.getDesignResolutionSize().height + " screen " + screenSzie.height)

                    let height = res.height // screenSzie.height

                    DataMgr.setData(Constants.DATA_DEFINE.BANNER_HEIGHT, height)
                    EventMgr.dispatchEvent(Constants.EVENT_DEFINE.BANNER_HEIGHT, height)
                })
            }
        }
    }

    export function showBannerAd(adInfo) {
        if (mValid) {
            let data = mBannerAdData
            if (data.instance && !data.error) {
                data.instance.show()
                    .then(() => {
                        console.log("===ShowBannerAd===")
                        // callback && callback()
                        adInfo = adInfo || {}
                        adInfo.bannerHeight = DataMgr.getData<number>(Constants.DATA_DEFINE.BANNER_HEIGHT)
                        _adCallback?.(JSON.stringify({ adsInfo: adInfo, AdsResultCode: EAdsResult.RESULT_CODE_BANNER_SUCCESS, msg: "播放banner" }))
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                return true
            }
        }
        return false
    }

    export function hideBannerAd() {
        if (mValid) {
            let data = mBannerAdData
            if (data.instance && !data.error) {
                data.instance.hide()
                // data.instance.destroy()
                // data.instance = null
                _adCallback?.(JSON.stringify({ adsInfo: { adType: EAdsType.ADS_TYPE_BANNER }, AdsResultCode: EAdsResult.RESULT_CODE_BANNER_CLOSE, msg: "关闭banner" }))
                // initBannerAd(data.adUnitId)
            }
        }
    }

    function initRewardedVideoAd(unionid) {
        let data = mRewardedVideoAdData
        if (!data.instance && tt.createRewardedVideoAd) {
            data.instance = tt.createRewardedVideoAd({ adUnitId: unionid })
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
            advert.instance = tt.createRewardedVideoAd({ adUnitId: adInfo.adId , multiton: true })

            advert.instance.onError((res) => {
                console.log("advert onError" + adInfo.adId + " ", res)
                if(_curAdInfo && _curAdInfo.adId == adInfo.adId){
                    _curAdInfo = null
                    EventMgr.dispatchEvent(Constants.EVENT_DEFINE.RECORD_POINT, { moduleName: "广告点", action: "字节小程序广告", label: "广告错误" + adInfo.adId })
                    let param = {
                        adsInfo: adInfo,
                        AdsResultCode: EAdsResult.RESULT_CODE_REWARTVIDEO_FAIL,
                        msg: null,
                    }
                    if (res) {
                        param.msg = res.errMsg || res.errCode
                    }

                    if (AdvertErr.indexOf(res.errCode) !== -1) {
                        advert.valid = false
                    }

                    _adCallback?.(JSON.stringify(param))
                }
            })

            advert.instance.onClose((res) => {
                console.log("advert onClose" + adInfo.adId, res)
                if(_curAdInfo && _curAdInfo.adId == adInfo.adId){
                    _curAdInfo = null
                    if (!res || res.isEnded) {
                        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.RECORD_POINT, { moduleName: "广告点", action: "字节小程序广告", label: "播放完成" + adInfo.adId })
                        _adCallback?.(JSON.stringify({ adsInfo: adInfo, AdsResultCode: EAdsResult.RESULT_CODE_REWARTVIDEO_SUCCEES, msg: "播放成功" }))
                    } else {
                        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.RECORD_POINT, { moduleName: "广告点", action: "字节小程序广告", label: "播放取消" + adInfo.adId })
                        _adCallback?.(JSON.stringify({ adsInfo: adInfo, AdsResultCode: EAdsResult.RESULT_CODE_REWARTVIDEO_CANCEL, msg: "取消播放" }))
                    }
                }
            })

            advertVideo[adInfo.adId] = advert
        }

        return advertVideo[adInfo.adId]
    }

    export function showRewardedVideoAd(adInfo) {
        if (mValid) {
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.RECORD_POINT, { moduleName: "广告点", action: "字节小程序广告", label: "创建广告" + adInfo.adId })
            let advert = createRewardedVideoAd(adInfo)
            if (!advert.valid) {
                _adCallback?.(JSON.stringify({ adsInfo: adInfo, AdsResultCode: EAdsResult.RESULT_CODE_REWARTVIDEO_FAIL, msg: "没有广告" }))
                return
            }
            _curAdInfo = adInfo
            //播放(1)失败--加载---播放 (2)成功
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.RECORD_POINT, { moduleName: "广告点", action: "字节小程序广告", label: "播放广告" + adInfo.adId })
            advert.instance.show()
                .then(() => {
                    EventMgr.dispatchEvent(Constants.EVENT_DEFINE.RECORD_POINT, { moduleName: "广告点", action: "字节小程序广告", label: "播放成功" + adInfo.adId })
                    console.log("jin---已经播放成功")//,unitid || AdvertUnitId.Video, unitid, AdvertUnitId.Video
                })
                .catch(err => {
                    console.log(err)
                    EventMgr.dispatchEvent(Constants.EVENT_DEFINE.RECORD_POINT, { moduleName: "广告点", action: "字节小程序广告", label: "播放失败" + adInfo.adId + " " + err })
                    tt.showLoading({ title: "加载中", mask: true })
                    advert.instance.load()
                        .then(() => {
                            advert.instance.show()
                                .then(tt.hideLoading)
                                .catch((res) => {
                                    console.log(res)
                                    console.error("视频广告显示", res)
                                    tt.hideLoading()
                                })
                        })
                        .catch(tt.hideLoading)
                })
        } else {
            _adCallback?.(JSON.stringify({ adsInfo: adInfo, AdsResultCode: EAdsResult.RESULT_CODE_REWARTVIDEO_FAIL, msg: "没有广告" }))
        }
    }

    function code2Session(callback) {
        new Promise((rlv, rjt) => {
            tt.login({
                success: function (res) {
                    console.log("ByteDanceWrapper login success", res)
                    let param = {
                        pn: DataMgr.data.Config.pn,
                        jsCode: res.code,
                    }
                    console.log("ByteDanceWrapper login param", param)
                    let host = DataMgr.data.Config.hostname
                    host = host.replace("igaoshou.", "mcbeam.")
                    HttpMgr.post("https://" + host + "/" + GET_BYTEDANCE_OPENID, null, null, param, (res) => {
                        console.log("ByteDanceWrapper GET_BYTEDANCE_OPENID", res)
                        if (res && res.openid) {
                            rlv({ openid: res.openid, unionid: res.unionid })
                            return
                        }
                        rjt(res.err)
                    })
                },
                fail: function (res) {
                    rjt(res.errMsg)
                },
            })
        })
            .then((res) => {
                callback?.(null, res)
            })
            .catch((err) => {
                callback?.(err, null)
            })
    }

    function getUserInfo(callback) {
        if (mValid) {
            tt.getUserInfo({
                withCredentials: true,
                success: function (res) { callback(null, res) },
                fail: function (res) { callback(res, null) }
            })
        }
    }

    export function getABTestKey(key: string): string {
        return ""
    }
}

if (cc.sys.BYTEDANCE_GAME === cc.sys.platform) {
    let igs = window["igs"] || {}
    igs["PluginProxyWrapper"] = ByteDanceProxyWrapper

    EventMgr.once(Constants.EVENT_DEFINE.PLATFORM_INIT, () => ByteDanceProxyWrapper.init())
}