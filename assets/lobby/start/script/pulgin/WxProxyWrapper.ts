import { DataMgr } from "../base/DataMgr";
import { Constants } from "../igsConstants";
import { IPluginProxyWrapper } from "./IPluginProxyWrapper";
import { IAdInfo, EAdsType, EAdsResult, ESessionResult, ESocialResult } from "./IPluginProxy";
import { EventMgr } from "../base/EventMgr";
import { User } from "../data/User";
import { Helper } from "../system/Helper";

const GET_WX_OPENID = "mcbeam-authen-srv/auth/weChatMiniSessionKey"
const WX_PAY_URL = "tencentapp/intl/pay?pid={pid}&ticket={ticket}&boxid={boxid}&appid={appid}&openid={openid}&openkey={openkey}&pay_token={pay_token}&pf={pf}&pfkey={pfkey}&sessionId={sessionId}&sessionType={sessionType}&envFlag={envFlag}&sdkFlag={sdkFlag}"
const WX_PAY_SURE_URL = "tencentapp/midas/pay/sure?pid={pid}&ticket={ticket}&appid={appid}&openid={openid}&order={order}&offer_id={offer_id}&pf={pf}&envFlag={envFlag}"

let wx = window["wx"]

export namespace WxProxyWrapper {
    // 微信接口变量
    let mButtonInfo: any = null
    let mUserInfoButton: { [index: string]: any } = {}
    let mOpenSettingButton: any = null
    let mRewardedVideoAdData: any = { instance: null, error: null }
    let mInterstitialAdData: any = { instance: null, error: null }
    let mBannerAdData: any = { instance: null, error: null, adUnitId: "" }
    let mWxValid: boolean = window["wx"] ? true : false
    let mShareTime: number = 0
    let mBackToShowAd: boolean = true
    let mShareConfig: any = {
        titles: ["好友来助攻，海量红包进来就领！", "玩游戏就送红包！这是你未玩过的全新版本！", "天降红包，你就是躺着领红包的人！"],
        images: ["static/share1.jpg", "static/share2.jpg"]
    }
    let advertVideo = {}
    let mFeedbackButton = null
    let mGameClubButton: { [index: string]: any } = {}

    const AdvertErr = [1000, 1003, 1004, 1005]

    // pulgin变量
    let _sessionCallback: Function = null
    let _payCallback: Function = null
    let _shareCallback: Function = null
    let _adCallback: Function = null

    export function init() {
        mWxValid = cc.sys.WECHAT_GAME === cc.sys.platform
        console.log("mWxValid", mWxValid)
        if (mWxValid) {
            checkAppUpdate()
            showShareMenu(false)
            setKeepScreenOn(true)
            hideUserInfoButton()
            onWxEvent()

            checkScreenCut()
        }
    }

    export function getInstance(): IPluginProxyWrapper {
        return WxProxyWrapper
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
        if (mWxValid) {
            let tip = (msg) => {
                wx.showModal({
                    title: "提示",
                    content: msg,
                    success: function (res) { }
                })
            }

            if (wx.setClipboardData) {
                wx.setClipboardData({
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
        if (mWxValid) {
            let makeOrder = function () {
                // let param = {
                //     appid: DataMgr.data.Config.wxAPPID,
                //     boxid: payInfo.boxid,
                //     openkey: "",
                //     pay_token: "",
                //     pf: "",
                //     pfkey: "",
                //     sessionId: "",
                //     sessionType: "",
                //     envFlag: "",
                //     sdkFlag: "ysdk"
                // }
                // Helper.PostHttp(WX_PAY_URL, null, param, (res) => {
                //     if (res && res.ret == 0) {
                //         setBackToShowAd(false)
                //         payInfo.order = res.order
                //         requestMidasPayment(payInfo, callback)
                //     } else {
                //         callback({ ret: -201, tips: errorMsg("RequestOrderFailed", res, null) })
                //     }
                // })
            }

            checkSession(function (valid) {
                valid ? makeOrder() : _payCallback({ ret: -200, tips: "CheckSessionFailed" })
            })
        }
    }
    export function shareWithItems(data: string) {
        let param: any = {}
        try { param = JSON.parse(data) } catch { }
        console.log(param)
        if (mWxValid) {
            wx.shareAppMessage({
                title: param.ShareTitle,
                imageUrl: param.SharedImg,
                query: param.shareOpenId
            })
            mShareTime = Date.now() / 1000
        } else {
            _shareCallback?.({ ShareResultCode: ESocialResult.SHARERESULT_CANCEL })
        }
    }

    export function jump2ExtendMethod(tag: number, data: string) {
        let param: any = {}
        try { param = JSON.parse(data) } catch { }
        if (tag === 0) {
            showUserInfoButton(param.node, param.name, param.callback, param.loadCb)
        } else if (tag === 1) {
            hideUserInfoButton()
        }
    }
    export function StartPushSDKItem(data: string) { }

    export function userItemsLogin(data: string) {
        let cfg: any = {}
        try { cfg = JSON.parse(data) } catch { }

        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.RECORD_POINT, { moduleName: "微信", action: "微信登录", label: "获取jsCode" + (cfg.async ? "同步数据" : "") })
        wx.login({
            success: function (res) {
                EventMgr.dispatchEvent(Constants.EVENT_DEFINE.RECORD_POINT, { moduleName: "微信", action: "微信登录", label: "获取jsCode成功" + (cfg.async ? "同步数据" : "") })
                let param = {
                    auth_type: Constants.AUTH_TYPE.WECHAT_LOGIN,
                    metadata: {
                        code: "",
                        rawdata: "",
                        signature: "",
                        js_code: res.code,
                        isQq: isQQMini() ? 1 : null
                    }
                }

                // 同步授权
                if (cfg.async) {
                    EventMgr.dispatchEvent(Constants.EVENT_DEFINE.RECORD_POINT, { moduleName: "微信", action: "微信登录", label: "同步用户信息" })
                    let cb = (err, info) => {
                        if (!err && info) {
                            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.RECORD_POINT, { moduleName: "微信", action: "微信登录", label: "同步用户信息成功" })
                            param.metadata.code = info.code ? info.code : ""
                            param.metadata.rawdata = info.rawData ? info.rawData : ""
                            param.metadata.signature = info.signature ? info.signature : ""
                        } else {
                            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.RECORD_POINT, { moduleName: "微信", action: "微信登录", label: "同步用户信息失败" + JSON.stringify(err) })
                        }
                        _sessionCallback?.(JSON.stringify({ SessionResultCode: ESessionResult.SESSIONRESULT_SUCCESS, msg: "", sessionInfo: param }))
                    }
                    getUserInfo(cb)
                } else {
                    _sessionCallback?.(JSON.stringify({ SessionResultCode: ESessionResult.SESSIONRESULT_SUCCESS, msg: "", sessionInfo: param }))
                }
            },
            fail: function (res) {
                EventMgr.dispatchEvent(Constants.EVENT_DEFINE.RECORD_POINT, { moduleName: "微信", action: "微信登录", label: "获取jsCode失败" + (cfg.async ? "同步数据" : "") })
                _sessionCallback?.(JSON.stringify({ SessionResultCode: ESessionResult.SESSIONRESULT_FAIL, msg: res.errMsg, sessionInfo: null }))
            },
        })
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
        if (mWxValid) {
            wx.navigateToMiniProgram({
                appId: appId,
                path: null,
                // extraData: {
                //     foo: 'QMDDZ-AD-CLIENT'
                // },
                extraData: extraData,
                envVersion: 'release',
                success(res) {
                    // cc.log("jin---navigateToMiniProgram success")
                    callback?.(true)
                },
                fail() {
                    // cc.log("jin---navigateToMiniProgram fail")
                    callback?.(false)
                }
            })
        }
    }

    export function checkNetwork(callback: (res: any) => void) {
        if (mWxValid) {
            if (wx.getNetworkType) {
                wx.getNetworkType({
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

    // scope.userInfo 用户信息授权
    function checkUserScope(scope, callback) {
        if (mWxValid) {
            getSetting(function (setting) {
                callback(setting["scope." + scope] == true)
            })
        } else {
            callback(false)
        }
    }

    function getSetting(callback) {
        wx.getSetting({
            complete: function (res) {
                console.log("wx setting" + JSON.stringify(res))
                callback(res.authSetting || {})
            }
        })
    }

    export function getUserInfo(callback) {
        if (mWxValid) {
            wx.getUserInfo({
                // openIdList: ["selfOpenId"],
                lang: "zh_CN",
                withCredentials: true,
                success: function (res) { callback(null, res) },
                fail: function (res) { callback(res, null) }
            })
        }
    }

    function getButtonInfo() {
        if (!mButtonInfo) {
            let screenSzie = cc.view.getFrameSize()
            let designSize = cc.view.getDesignResolutionSize()
            let ratio = Math.min(screenSzie.width / designSize.width, screenSzie.height / designSize.height)

            let imgWidth = 260 * ratio
            let imgHeight = 96 * ratio

            let left = (screenSzie.width - imgWidth) / 2
            let top = screenSzie.height * 0.7

            mButtonInfo = {
                left: left,
                top: top,
                imgWidth: imgWidth,
                imgHeight: imgHeight
            }
        }

        return mButtonInfo
    }

    // wx.createUserInfoButton >= 2.0.1
    export function showUserInfoButton(node, name, callback?: Function, loadCb?: Function) {
        if (mWxValid && wx.createUserInfoButton) {
            checkUserScope("userInfo", function (canUse) {
                if (!canUse) {
                    if (!mUserInfoButton || !mUserInfoButton[name]) {
                        if (node) {
                            let rect = new cc.Rect()
                            rect.width = node.width
                            rect.height = node.height
                            let pos = node.convertToWorldSpaceAR(cc.Vec2.ZERO)
                            rect.x = pos.x - node.anchorX * rect.width
                            rect.y = pos.y - node.anchorY * rect.height

                            let screenSzie = cc.view.getFrameSize()
                            let designSize = cc.view.getDesignResolutionSize()
                            let ratio = Math.max(screenSzie.width / designSize.width, screenSzie.height / designSize.height)

                            // console.log("ratio = " + ratio)

                            let width = rect.width * ratio
                            let height = rect.height * ratio

                            let adaptWidth = window['winSize'] ? window['winSize'].width - cc.winSize.width : 0 //cc.winSize.width - cc.winSize.width

                            // console.log("adaptWidth = " + adaptWidth)

                            let left = (adaptWidth / 2 + rect.x) * ratio
                            let top = screenSzie.height - rect.y * ratio - height

                            console.log("left = " + left + " top = " + top)

                            mUserInfoButton[name] = wx.createUserInfoButton({
                                type: "text",
                                text: '',
                                style: {
                                    left: left,
                                    top: top,
                                    width: width,
                                    height: height,
                                    backgroundColor: "#00000000"
                                }
                            })

                            mUserInfoButton[name].onTap((res) => callback?.(res))
                        }
                    } else if (mUserInfoButton && mUserInfoButton[name]) {
                        mUserInfoButton[name].show()
                    }
                } else if (mUserInfoButton && mUserInfoButton[name]) {
                    mUserInfoButton[name].hide()
                }
            })
        }

        loadCb && loadCb()
    }

    export function hideUserInfoButton(name: string = null) {
        if (name && mWxValid && mUserInfoButton && mUserInfoButton[name]) {
            mUserInfoButton[name].hide()
            return
        }

        if (mWxValid && mUserInfoButton) {
            for (let i in mUserInfoButton) {
                mUserInfoButton[i].hide()
            }
        }
    }

    export function setUserInfoButtonPos(node, name) {
        if (mWxValid && wx.createUserInfoButton) {
            if (mUserInfoButton && mUserInfoButton[name]) {
                let rect = new cc.Rect()
                rect.width = node.width
                rect.height = node.height
                let pos = node.convertToWorldSpaceAR(cc.Vec2.ZERO)
                rect.x = pos.x - node.anchorX * rect.width
                rect.y = pos.y - node.anchorY * rect.height

                let screenSzie = cc.view.getFrameSize()
                let designSize = cc.view.getDesignResolutionSize()
                let ratio = Math.max(screenSzie.width / designSize.width, screenSzie.height / designSize.height)

                let width = rect.width * ratio
                let height = rect.height * ratio

                let adaptWidth = window['winSize'] ? window['winSize'].width - cc.winSize.width : 0

                let left = (adaptWidth / 2 + rect.x) * ratio
                let top = screenSzie.height - rect.y * ratio - height

                mUserInfoButton[name].style.left = left
                mUserInfoButton[name].style.top = top
            }
        }
    }

    // wx.createOpenSettingButton >= 2.0.7
    export function openSetting(scope, callback) {
        if (mWxValid) {
            if (wx.createOpenSettingButton) {
                if (!mOpenSettingButton) {
                    let info = getButtonInfo()
                    mOpenSettingButton = wx.createOpenSettingButton({
                        type: "image",
                        image: "static/btn_open_setteing.png",
                        style: {
                            left: info.left,
                            top: info.top,
                            width: info.imgWidth,
                            height: info.imgHeight
                        }
                    })
                }

                mOpenSettingButton.show()

                let onTap = function () {
                    mOpenSettingButton.hide()
                    mOpenSettingButton.offTap(onTap)
                    checkUserScope(scope, callback)
                }

                mOpenSettingButton.onTap(onTap)
            } else {
                wx.openSetting({
                    complete: function (res) {
                        checkUserScope(scope, callback)
                    }
                })
            }
        }
    }

    // wx.setKeepScreenOn >= 1.4.0
    function setKeepScreenOn(status) {
        wx.setKeepScreenOn && wx.setKeepScreenOn({ keepScreenOn: status })
    }

    // wx.getUpdateManager >= 1.9.9
    function checkAppUpdate() {
        if (mWxValid && wx.getUpdateManager) {
            let updateManager = wx.getUpdateManager()
            updateManager.onCheckForUpdate(function (res) {
                if (res.hasUpdate) {
                    updateManager.onUpdateReady(function () {
                        wx.showModal({
                            title: "更新提示",
                            content: "新版本已经准备好,是否重启应用?",
                            success: function (res) {
                                if (res.confirm) {
                                    updateManager.applyUpdate()
                                }
                            }
                        })
                    })

                    updateManager.onUpdateFailed(function () {
                        wx.showModal({
                            title: "已经有新版本了",
                            content: "新版本已经上线啦,请您删除当前小程序,重新搜索打开",
                        })
                    })
                }
            })
        }
    }

    // export function payOrder(payInfo, callback: Function) {
    //     // payInfo.pay_plat = 7
    //     Helper.PostHttp("api/mcbeam-pay-api/payApi/payOrder", null, payInfo, (res, event) => {
    //         console.log("payOrder1", res)
    //         if (res && res.errcode == 0) {
    //             if (res.bill_no) {
    //                 // 用米大师余额扣款成功
    //                 callback?.({ code: 0, msg: '' })
    //             } else {
    //                 // 客户端调米大师支付
    //                 requestMidasPayment(payInfo, callback, res)
    //             }
    //         } else {
    //             callback?.({ code: res.Code, msg: res.Detail })
    //         }
    //     })
    // }

    export function payOrderByCustome(payInfo, callback?: Function) {
        if (wx.openCustomerServiceConversation) {
            payInfo["game_gid"] = DataMgr.data.Config.gameId
            payInfo["pn"] = DataMgr.data.Config.pn
            payInfo["openid"] = User.OpenID
            console.log(payInfo)
            wx.openCustomerServiceConversation({
                showMessageCard: true,
                sendMessageTitle: payInfo.goods_name,
                sendMessageImg: payInfo.goods_pic,
                sendMessagePath: "index?payParam=" + JSON.stringify(payInfo),
                success: (res) => callback?.({ code: 1, msg: '' }),
                fail: (msg) => callback?.({ code: -1, msg: JSON.stringify(msg) || "支付失败" })
            })
        } else {
            wx.showModal({
                title: "微信版本过低",
                content: "请更新最新版本微信后再试！",
            })
            callback?.({ code: -2, msg: "微信版本过低" })
        }

    }

    export function requestMidasPayment(payInfo, offerId) {
        console.log("requestMidasPayment")
        return new Promise((rlv, rjt) => {
            wx.requestMidasPayment({
                mode: "game",
                env: 0, // 0正式 1沙箱
                offerId: offerId,//result.offerId,
                currencyType: "CNY",
                platform: "android",
                buyQuantity: payInfo.price / 100,
                zoneId: "1", // 后台必须配置
                success: function (res) {
                    console.log("requestMidasPayment_SUCC", res)
                    rlv()
                },
                fail: function (res) {
                    console.log("requestMidasPayment_FAIL", res)
                    rjt(res.code)
                }
            })
        })

    }

    function shareMessage(shareData) {
        shareData = shareData || {}

        shareData.query = shareData.query || {}

        if (shareData.withOpenId) {
            shareData.query.openId = User.OpenID
        }

        let query = ''
        let prefix = ''
        for (let key in shareData.query) {
            query += prefix + key + '=' + shareData.query[key]
            prefix = '&'
        }
        shareData.query = query

        let titles = mShareConfig.titles
        let images = mShareConfig.images

        return {
            title: shareData.title || titles[Math.floor(Math.random() * titles.length)],
            imageUrl: shareData.imageUrl || images[Math.floor(Math.random() * images.length)],
            // query: shareData.query
        }
    }


	/**
	interface shareData {
		title?: string                  // 标题 不传使用随机配置
		imageUrl?: string               // 图片地址 可使用本地路径或网络路径 不传使用随机配置
		withOpenId?: boolean            // 是否带上自己的 openid 用于推广员绑定
		skipCheck?: boolean             // 是否跳过时间检查 默认要检查
		query?: { [k: string]: any }    // 其他额外参数
		callback?: Function             // 回调方法 只在分享成功时回调
	}
	*/
    export function shareAppMessage(param) {

    }

    // wx.setClipboardData >= 1.1.0
    export function setClipboardData(data, callback) {

    }

    // wx.createRewardedVideoAd >= 2.0.4
    function initRewardedVideoAd(unionid) {
        let data = mRewardedVideoAdData
        if (!data.instance && wx.createRewardedVideoAd) {
            data.instance = wx.createRewardedVideoAd({ adUnitId: unionid })
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
            advert.instance = wx.createRewardedVideoAd({ adUnitId: adInfo.adId, multiton: true })

            advert.instance.onError((res) => {
                console.log("advert onError" + adInfo.adId + " ", res)
                EventMgr.dispatchEvent(Constants.EVENT_DEFINE.RECORD_POINT, { moduleName: "广告点", action: "微信小程序广告", label: "广告错误" + adInfo.adId })
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

                _adCallback?.(JSON.stringify({ adsInfo: adInfo, AdsResultCode: EAdsResult.RESULT_CODE_REWARTVIDEO_CLOSE, msg: "广告关闭" }))
            })

            advertVideo[adInfo.adId] = advert
        }

        return advertVideo[adInfo.adId]
    }

    export function showRewardedVideoAd(adInfo) {
        if (mWxValid) {
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
                    wx.showLoading({ title: "加载中", mask: true })
                    advert.instance.load()
                        .then(() => {
                            advert.instance.show()
                                .then(wx.hideLoading)
                                .catch((res) => {
                                    console.log(res)
                                    console.error("视频广告显示", res)
                                    wx.hideLoading()
                                    _adCallback?.(JSON.stringify({ adsInfo: adInfo, AdsResultCode: EAdsResult.RESULT_CODE_REWARTVIDEO_FAIL, msg: err }))
                                })
                        })
                        .catch((err) => {
                            wx.hideLoading()
                            _adCallback?.(JSON.stringify({ adsInfo: adInfo, AdsResultCode: EAdsResult.RESULT_CODE_REWARTVIDEO_FAIL, msg: err }))
                        })
                })
        } else {
            _adCallback?.(JSON.stringify({ adsInfo: adInfo, AdsResultCode: EAdsResult.RESULT_CODE_REWARTVIDEO_FAIL, msg: "没有广告" }))
        }
    }

    // wx.createInterstitialAd >= 2.6.0
    export function initInterstitialAd(adUnitId: string) {
        let data = mInterstitialAdData
        if (!data.instance && wx.createInterstitialAd) {
            data.instance = wx.createInterstitialAd({
                adUnitId: adUnitId
            })

            data.instance.onLoad(() => {
                data.error = null
                console.log("插屏广告加载完成")
            })

            data.instance.onError((res) => {
                data.error = "插屏广告加载失败 " + res.errMsg
                console.log("插屏广告加载失败", res.errMsg, res.errCode)
                _adCallback?.(JSON.stringify({ adsInfo: { adsType: EAdsType.ADS_TYPE_INTER }, AdsResultCode: EAdsResult.RESULT_CODE_INTER_FAIL, msg: "广告关闭" }))
            })

            data.instance.onClose((res) => {
                _adCallback?.(JSON.stringify({ adsInfo: { adsType: EAdsType.ADS_TYPE_INTER }, AdsResultCode: EAdsResult.RESULT_CODE_INTER_CLOSE, msg: "广告关闭" }))
            })
        }
    }

    export function showInterstitialAd() {
        let data = mInterstitialAdData
        if (data.instance && !data.error) {
            data.instance.show().catch((err) => {
                console.log(err)
                _adCallback?.(JSON.stringify({ adsInfo: { adsType: EAdsType.ADS_TYPE_INTER }, AdsResultCode: EAdsResult.RESULT_CODE_INTER_FAIL, msg: err }))
            })
        }
    }

    // wx.createBannerAd >= 2.0.4
    export function initBannerAd(adUnitId: string) {
        let data = mBannerAdData
        data.adUnitId = adUnitId
        if (mWxValid) {
            if (!data.instance && wx.createBannerAd) {
                let screenSzie = cc.view.getFrameSize()
                data.instance = wx.createBannerAd({
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
                    data.error = "Banner广告加载失败 " + res.errMsg
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

    export function showBannerAd(adInfo: any) {
        if (mWxValid) {
            let data = mBannerAdData
            if (data.instance && !data.error) {
                data.instance.show()
                    .then(() => {
                        console.log("===ShowBannerAd===")
                        // callback && callback()
                        //_adCallback?.(JSON.stringify({ AdsResultCode: EAdsResult.RESULT_CODE_BANNER_SHOW }))
                        adInfo = adInfo || {}
                        adInfo.bannerHeight = DataMgr.getData<number>(Constants.DATA_DEFINE.BANNER_HEIGHT)
                        _adCallback?.(JSON.stringify({ adsInfo: adInfo, AdsResultCode: EAdsResult.RESULT_CODE_BANNER_SUCCESS, msg: "播放banner" }))
                    })
                    .catch((err) => {
                        cc.log(err)
                    })
                return true
            }
        }
        return false
    }

    export function hideBannerAd() {
        if (mWxValid) {
            let data = mBannerAdData
            if (data.instance && !data.error) {
                data.instance.destroy()
                data.instance = null
                // _adCallback?.(JSON.stringify({ AdsResultCode: EAdsResult.RESULT_CODE_BANNER_HIDE }))
                _adCallback?.(JSON.stringify({ adsInfo: { adType: EAdsType.ADS_TYPE_BANNER }, AdsResultCode: EAdsResult.RESULT_CODE_BANNER_CLOSE, msg: "关闭banner" }))
                initBannerAd(data.adUnitId)
            }
        }
    }

    // wx.setEnableDebug >= 1.4.0
    export function setEnableDebug(enable) {
        if (mWxValid) {
            wx.setEnableDebug && wx.setEnableDebug({ enableDebug: enable })
        }
    }

    export function exitMiniProgram() {
        if (mWxValid) {
            wx.exitMiniProgram({
                success: function () {
                    cc.log("wx.exitMiniProgram success")
                },
                fail: function () {
                    cc.log("wx.exitMiniProgram fail")
                }
            })
        }
    }

    // wx.showShareMenu >= 1.1.0
    function showShareMenu(withShareTicket) {
        wx.showShareMenu && wx.showShareMenu({ withShareTicket: withShareTicket || false })

        wx.onShareAppMessage(function () {
            let titles = mShareConfig.titles
            let images = mShareConfig.images
            let query = "openId=" + User.OpenID

            return {
                title: titles[Math.floor(Math.random() * titles.length)],
                imageUrl: images[Math.floor(Math.random() * images.length)],
                query: query
            }
        })
    }

    export function setBackToShowAd(show) {
        mBackToShowAd = show
    }

    function onWxEvent() {
        wx.onShow((res) => {
            if ((Date.now() / 1000 - mShareTime) > 3) {
                _shareCallback?.({ ShareResultCode: ESocialResult.SHARERESULT_SUCCESS })
            } else {
                _shareCallback({ ShareResultCode: ESocialResult.SHARERESULT_CANCEL })
                showModal("分享失败，请换个群试试。")
            }
            setBackToShowAd(true)
        })
    }

    function checkSession(callback) {
        wx.checkSession({
            success: function (res) { callback(true) },
            fail: function (res) { callback(false) }
        })
    }

    function showModal(message) {
        wx.showModal({
            title: "系统提示",
            content: message,
            showCancel: false
        })
    }

    export function isVideoAdValid() {
        if (mWxValid) {
            let data = mRewardedVideoAdData
            if (data.instance && !data.error) {
                return true
            }
            return false
        }
        return true
    }

    export function captureScreen(param, callback) {
        if (!mWxValid) {
            callback(false)
            return
        }

        param.success = (res) => { callback(true, res.tempFilePath) }
        param.fail = () => { cc.log('screenshot fail'); callback(false) }
        cc.game.canvas["toTempFilePath"](param)
    }

    export function getSystemInfoSync(): any {
        if (mWxValid) {
            return wx.getSystemInfoSync()
        }
        return null
    }

    export function isQQMini(): boolean {
        if (cc.sys.WECHAT_GAME === cc.sys.platform) {
            if (mWxValid) {
                if (wx.getSystemInfoSync().AppPlatform == "qq") {
                    return true
                }
            }
        }
        return false
    }

    // wx.createFeedbackButton >= 2.1.0
    export function showFeedBackButton(node: cc.Node, callback?: Function, loadCb?: Function) {
        if (mWxValid && wx.createFeedbackButton) {
            if (!mFeedbackButton) {
                if (node) {
                    let rect = new cc.Rect()
                    rect.width = node.width
                    rect.height = node.height
                    let pos = node.parent.convertToWorldSpaceAR(node.position)
                    rect.x = pos.x - node.anchorX * rect.width
                    rect.y = pos.y - node.anchorY * rect.height

                    let screenSize = cc.view.getFrameSize()
                    let designSize = cc.view.getDesignResolutionSize()
                    let ratio = Math.max(screenSize.width / designSize.width, screenSize.height / designSize.height)

                    // rect.y -= designSize.height - cc.sys.getSafeAreaRect().height - cc.sys.getSafeAreaRect().y

                    let width = rect.width * ratio
                    let height = rect.height * ratio

                    let adaptWidth = window['winSize'] ? window['winSize'].width - cc.winSize.width : 0 //cc.winSize.width - cc.winSize.width


                    let left = (adaptWidth / 2 + rect.x) * ratio
                    let top = screenSize.height - rect.y * ratio - height

                    console.log("left = " + left + " top = " + top)

                    mFeedbackButton = wx.createFeedbackButton({
                        type: "text",
                        text: '',
                        style: {
                            left: left,
                            top: top,
                            width: width,
                            height: height,
                            backgroundColor: "#00000000"
                        }
                    })

                    mFeedbackButton.onTap(function (res) {
                        callback && callback(res)
                    })
                }
            } else if (mFeedbackButton) {
                mFeedbackButton.show()
            }
        }

        loadCb && loadCb()
    }

    export function hideFeedbackButton() {
        if (mWxValid && mFeedbackButton) {
            mFeedbackButton.hide()
            return
        }
    }

    export function showGameClubButton(node: cc.Node, callback?: Function, ) {
        if (mWxValid && wx.createGameClubButton && node) {
            if (!mGameClubButton[node.name]) {
                if (node) {
                    let rect = new cc.Rect()
                    rect.width = node.width
                    rect.height = node.height
                    let pos = node.convertToWorldSpaceAR(cc.Vec2.ZERO)
                    rect.x = pos.x - node.anchorX * rect.width
                    rect.y = pos.y - node.anchorY * rect.height

                    let screenSzie = cc.view.getFrameSize()
                    let designSize = cc.view.getDesignResolutionSize()
                    let ratio = Math.max(screenSzie.width / designSize.width, screenSzie.height / designSize.height)

                    // console.log("ratio = " + ratio)

                    let width = rect.width * ratio
                    let height = rect.height * ratio

                    let adaptWidth = window['winSize'] ? window['winSize'].width - cc.winSize.width : 0 //cc.winSize.width - cc.winSize.width

                    // console.log("adaptWidth = " + adaptWidth)

                    let left = (adaptWidth / 2 + rect.x) * ratio
                    let top = screenSzie.height - rect.y * ratio - height

                    console.log("createGameClubButton rect.x = " + rect.x + " rect.y = " + rect.y)
                    console.log("createGameClubButton left = " + left + " top = " + top)

                    mGameClubButton[node.name] = wx.createGameClubButton({
                        type: "text",
                        text: '',
                        style: {
                            left: left,
                            top: top,
                            width: width,
                            height: height,
                            backgroundColor: "#00000000"
                        }
                    })

                    mGameClubButton[node.name].onTap(() => {
                        callback?.()
                    })
                }
            } else if (mGameClubButton[node.name]) {
                mGameClubButton[node.name].show()
            }
        }
    }

    export function hideGameClubButton(name) {
        if (mWxValid && mGameClubButton[name]) {
            mGameClubButton[name].hide()
            return
        }
    }

    export function updateGameClubButton(node) {
        if (mWxValid && node && mGameClubButton[node.name]) {
            let rect = new cc.Rect()
            rect.width = node.width
            rect.height = node.height
            let pos = node.convertToWorldSpaceAR(cc.Vec2.ZERO)
            rect.x = pos.x - node.anchorX * rect.width
            rect.y = pos.y - node.anchorY * rect.height

            let screenSzie = cc.view.getFrameSize()
            let designSize = cc.view.getDesignResolutionSize()
            let ratio = Math.max(screenSzie.width / designSize.width, screenSzie.height / designSize.height)

            let width = rect.width * ratio
            let height = rect.height * ratio

            let adaptWidth = window['winSize'] ? window['winSize'].width - cc.winSize.width : 0 //cc.winSize.width - cc.winSize.width

            let left = (adaptWidth / 2 + rect.x) * ratio
            let top = screenSzie.height - rect.y * ratio - height


            mGameClubButton[node.name].style.left = left
            mGameClubButton[node.name].style.top = top
        }
    }

    export function getABTestKey(key: string): string {
        if (mWxValid) {
            console.log("====get AB Test key====" + key)
            const res = wx.getExptInfoSync([key])
            console.log("res", res)
            return res[key]
        }
    }

    // wx.requestSubscribeMessage >= 2.4.4
    export function requestSubscribeMessage(templateId, callback) {
        if (mWxValid && wx.requestSubscribeMessage) {
            wx.requestSubscribeMessage({
                tmplIds: [templateId],
                complete: (res) => {
                    if (res.errMsg == "requestSubscribeMessage:ok" && res[templateId] == "accept") {
                        callback(true)
                    } else {
                        console.error(res.errCode + res.errMsg)
                        callback(false)
                    }
                }
            })
        } else {
            callback(false)
        }
    }

    export function getLaunchOptionsSync() {
        if (mWxValid && wx.getLaunchOptionsSync) {
            let res = wx.getLaunchOptionsSync()
            res && console.log(res)
            return res?.scene
        }

        return 0
    }

    export function getWxLaunchOptionsSync() {
        if (mWxValid && wx.getLaunchOptionsSync) {
            let res = wx.getLaunchOptionsSync()
            res && console.log(res)
            return res?.query
        }

        return {
            scene: 0,
            shareOpenId: ""
        }
    }

    export function getPhonePlatform(callback: Function) {
        if (mWxValid && wx.getSystemInfo) {
            wx.getSystemInfo({
                success(res) {
                    console.log(res)
                    callback?.(res.system)
                }
            })
        } else {
            callback?.("")
        }
    }

    export function checkScreenCut() {
        //监听用户主动截图
        if (wx.onUserCaptureScreen) {
            wx.onUserCaptureScreen(function (res) {
                console.log('jin---用户截屏了', res)
                //TODO 标记状态为纯净版状态
                localStorage.setItem("isPureMode", "true")
                wx.exitMiniProgram((res) => {
                    console.log("jin---exitMiniProgram isPureMode", res)
                })

            })
        }
    }
}

if (cc.sys.WECHAT_GAME === cc.sys.platform) {
    let igs = window["igs"] || {}
    igs["PluginProxyWrapper"] = WxProxyWrapper

    cc.sys.platform = WxProxyWrapper.isQQMini() ? Constants.sys.WECHAT_GAME_QQ : cc.sys.WECHAT_GAME

    EventMgr.once(Constants.EVENT_DEFINE.PLATFORM_INIT, () => WxProxyWrapper.init())
}