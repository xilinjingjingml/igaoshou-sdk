import { EPluginType, IAdInfo, EAdsType, EAdsResult, IShareInfo, ESessionResult, ESocialResult } from "../pulgin/IPluginProxy"
import { Helper } from "../system/Helper"
import { EventMgr } from "./EventMgr"
import { DataMgr } from "./DataMgr"
import { Constants } from "../igsConstants"
import { User } from "../data/User"
import { IPluginProxyWrapper } from "../pulgin/IPluginProxyWrapper"
import { UIMgr } from "./UIMgr"
import { AdSrv } from "../system/AdSrv"

export enum EPlatformEvent {
    GET_CLIPBOARD_SUCCESS = 21, //获取剪切板内容成功
    GET_OPENINSTALL_PARAMS = 50, //获取openinstall参数
}

interface IPlugin {
    name: string
    type: string
    tag: string
    mid: string
}

const PLUGIN_MGR = "plugin_mgr"

export namespace PluginMgr {
    let isBind: number = 0
    let _pluginProxy: IPluginProxyWrapper
    let _iapPluginList: IPlugin[]
    let _showBanner: boolean = false
    let _pauseBanner: boolean = false

    let _bannerAds: IAdInfo[] = []
    let _plugAds: IAdInfo[] = []

    let _showAds: boolean = false
    let _callBanner: boolean = false
    let _showPlugAds: boolean = false

    let _hidePlugAds: boolean = false

    export let pluginConfig: { game: { PacketName: string }[], plugins: IPlugin[] }

    export function setIsBind(bind: number) {
        isBind = bind
    }

    export function onInit(callback?: Function): void {
        console.log("[PluginManager.onInit]")
        console.log("[PluginManager.onInit] cc.sys.isNative", cc.sys.isNative)
        console.log("[PluginManager.onInit] cc.sys.os", cc.sys.os)
        console.log("[PluginManager.onInit] cc.sys.OS_ANDROID", cc.sys.OS_ANDROID)

        if (Helper.isNative()) {
            console.log("[PluginManager.onInit] CC_JSB is true  1")
            _pluginProxy = jsb["PluginProxyWrapper"].getInstance()
            console.log("[PluginManager.onInit] CC_JSB is true  2")
            // Java回调
            window['JavascriptJavaCallBack'] = _onJavascriptJavaCallBack
        } else {
            let igs = window["igs"]
            if (igs) {
                _pluginProxy = igs["PluginProxyWrapper"].getInstance()
                console.log("[PluginManager.onInit] igs wrapper is true")
            }
        }

        // 登陆回调
        _pluginProxy.setSessionCallBack(onSessionCallBack)
        // 支付回调
        _pluginProxy.setIapCallBack(onIapCallBack)
        // 分享回调
        _pluginProxy.setSocialCallBack(onSocialCallBack)
        // 平台回调
        _pluginProxy.setPlatformCallBack(onPlatformCallBack)
        // 广告回调
        _pluginProxy.setAdsCallBack && _pluginProxy.setAdsCallBack(onAdsCallBack)

        _loadPluginPlist(callback)

        EventMgr.on(Constants.EVENT_DEFINE.SHOW_BANNER, showBanner, PLUGIN_MGR)
        EventMgr.on(Constants.EVENT_DEFINE.HIDE_BANNER, hideBanner, PLUGIN_MGR)
        EventMgr.on(Constants.EVENT_DEFINE.PAUSE_BANNER, pauseBanner, PLUGIN_MGR)
        EventMgr.on(Constants.EVENT_DEFINE.RESUME_BANNER, resumeBanner, PLUGIN_MGR)
    }

    function _loadPluginPlist(callback?: Function) {
        console.log("PluginManager._loadPluginPlist")
        if (Helper.isNative()) {
            let plist = _pluginProxy.getPluginsPlist()
            console.log("PluginManager._loadPluginPlist plist", plist)
            let result = plist
            if (cc.sys.os == cc.sys.OS_ANDROID) {//安卓返回的是xml需要解析
                result = cc["plistParser"].parse(plist);
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                result = Helper.ParseJson(plist, "plist")
            }
            if (result) {
                console.log("PluginManager._loadPluginPlist result", result)
                console.log("PluginManager._loadPluginPlist result", JSON.stringify(result))
                console.log("PluginManager._loadPluginPlist result", JSON.stringify(result.config))
                console.log("PluginManager._loadPluginPlist result", JSON.stringify(result.plugins))
                _setPluginEnv(result)
                _setPluginConfig(result)
            }
            callback && callback()
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.PLUGIN_FINISH)
        } else {
            // let bundle = DataMgr.data.Bundle
            // if (bundle) {
            //     console.log("PluginManager._loadPluginPlist bundle true")
            //     bundle.load("thirdparty/plugins", (err, data: any) => {
            //         if (err) {
            //             console.log("PluginManager thirdparty/plugins err = ", err.message)
            //         } else {
            //             console.log("PluginManager thirdparty/plugins data = ", data)
            //             console.log("PluginManager thirdparty/plugins data _nativeAsset = ", data._nativeAsset)
            //             if (data && data._nativeAsset && data._nativeAsset.plugins) {
            //                 _setPluginConfig(data._nativeAsset)
            //             }
            //         }
            //         callback && callback()
            //     })
            // }
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.PLUGIN_FINISH)
        }

        EventMgr.on(Constants.EVENT_DEFINE.PLUGIN_INIT, () => EventMgr.dispatchEvent(Constants.EVENT_DEFINE.PLUGIN_FINISH), PLUGIN_MGR)

    }

    function _setPluginEnv(config: any): void {
        const game_env = localStorage.getItem("GAME_ENV")
        if (game_env != null) {
            DataMgr.data.Config.env = parseInt(game_env)
        }

        // _pluginProxy.setPluginEnv(DataMgr.data.Config.env)
    }

    export function getConfig(name: string): string {
        return DataMgr.data.Config[name]
    }

    function _setPluginConfig(config: any): void {
        console.log("[PluginManager.pluginConfig]", JSON.stringify(config))
        pluginConfig = config

        if (_pluginProxy) {
            if (!cc.sys.isBrowser && cc.sys.os == cc.sys.OS_ANDROID) {
                // let res = Helper.CallStaticMethod("org/cocos2dx/javascript/Luaj", "getChannelName", "()Ljava/lang/String;")
                // if (res && res.err) {
                //     console.warn(res.err)
                // } else if (res.result) {
                //     cfg.pn = res.result
                // }
            }
            else {
                // cfg.pn = config.game[0].PacketName
            }

            if (cc)
                cc.log("[PluginManager.pluginConfig] packetName", DataMgr.data.Config.pn)
            // _pluginProxy.setPackageName(cfg.pn)
            cc.log("[PluginManager.pluginConfig] CurENV", DataMgr.data.Config.env)
            // _pluginProxy.switchPluginXRunEnv(cfg.env)

            for (const plugin of pluginConfig.plugins) {
                if (plugin.name != "SessionPhone" && plugin.name != "SessionGuest") {
                    _loadPlugin(plugin.name, parseInt(plugin.type))
                }
            }
        }
        _loadPayModeList()

        // 检测是否有广告插件
        DataMgr.setData("noAD", hasPluginByType(EPluginType.kPluginAds))
        DataMgr.setData("pluginFinish", true)

        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.PLUGIN_FINISH)
    }

    export function getPluginListByType(type: number) {
        let plugins: IPlugin[] = []
        for (const plugin of pluginConfig.plugins) {
            if (parseInt(plugin.type) == type) {
                plugins.push(plugin)
            }
        }
        return plugins
    }

    function _loadPlugin(name: string, type: EPluginType): void {
        _pluginProxy.loadPlugin(name, 0, type)
    }

    function _loadPluginByTag(tag: number, type: EPluginType): void {
        for (const plugin of pluginConfig.plugins) {
            if (parseInt(plugin.tag) == tag && parseInt(plugin.type) == type) {
                _loadPlugin(plugin.name, parseInt(plugin.type))
                break
            }
        }
    }

    function _loadPayModeList(): void {
        _iapPluginList = []
        for (const plugin of pluginConfig.plugins) {
            if (plugin.type == EPluginType.kPluginIAP.toString()) {
                _iapPluginList.push(plugin)
            }
        }
    }

    // { SessionResultCode: number, msg: string, sessionInfo: any }
    export function onSessionCallBack(data: string): void {
        cc.log("[PluginManager.onSessionCallBack] data:", data)
        // console.log("[PluginManager.onSessionCallBack] data:", data)
        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.RECORD_POINT, { moduleName: "登录", action: "登录回调", label: "onSessionCallBack" })
        let sessionData = Helper.ParseJson(data, "session")
        if (sessionData.SessionResultCode == ESessionResult.SESSIONRESULT_SUCCESS) {
            let sessionInfo = sessionData.sessionInfo
            sessionData.metadata && (sessionData.metadata = Helper.ParseJson(sessionData.metadata))
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.LOGIN_PARAM_CALLBACK, sessionInfo)
        } else {
            Helper.OpenTip(sessionData.msg)
        }
        setIsBind(0)
    }

    // { PayResultCode: number, msg: string, payInfo: any }
    export function onIapCallBack(data: string): void {
        cc.log("[PluginManager.onIapCallBack] data:", data)
        // NetManager.Instance.onMessage({ opcode: "PluginIapCallBack", data: data })
        // pluginPayResult(data)
        EventMgr.dispatchEvent("PluginIapCallBack", data)
    }

    // { ShareResultCode: number, msg: string, shareResultInfo: any }
    export function onSocialCallBack(data: string): void {
        console.log("[PluginManager.onSocialCallBack] data:", data)
        // NetManager.Instance.onMessage({ opcode: "PluginSocialCallBack", data: data })
        let socialData = Helper.ParseJson(data, "social")
        if (socialData.ShareResultCode == ESocialResult.SHARERESULT_SUCCESS) {
            console.log("[PluginManager.onSocialCallBack] SHARERESULT_SUCCESS")
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.SHARE_CALLBACK, socialData)
        } else if (socialData.ShareResultCode == ESocialResult.SHARERESULT_DEFAULT_CALLBACK) {
            console.log("PluginManager.onSocialCallBack 默认回调不做处理")
        } else {
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.SHARE_CALLBACK, socialData)
            Helper.OpenTip(socialData.msg)
        }
    }

    // { PlatformResultCode: number, msg: string, url: any }
    export function onPlatformCallBack(data: string): void {
        cc.log("[PluginManager.onPlatformCallBack] data:", data)
        // NetManager.Instance.onMessage({ opcode: "PluginPlatformCallBack", data: data })
        EventMgr.dispatchEvent("PluginPlatformCallBack", Helper.ParseJson(data, "onPlatformCallBack"))
    }

    // { AdsResultCode: number, msg: string }
    export function onAdsCallBack(data: string): void {
        cc.log("[PluginManager.onAdsCallBack] data:", data)
        // NetManager.Instance.onMessage({ opcode: "PluginAdsCallBack", data: data })
        // pluginAdsResult(data)
        // if (PlatformApi.isForeground) {
        //     EventMgr.dispatchEvent("PluginAdsCallBack", JSON.parse(data))
        // } else {
        //     EventMgr.dispatchEvent("save_ad_callback_event", data)
        // }
        _delayCallBack(() => {
            cc.audioEngine.resumeMusic()
            console.log("[PluginManager.onAdsCallBack] dispatchEvent PluginAdsCallBack", data)
            let msg = Helper.ParseJson(data)
            console.log("AdsResultCode :" + msg.AdsResultCode)
            if (msg.AdsResultCode === EAdsResult.RESULT_CODE_BANNER_SUCCESS) {
                console.log(JSON.stringify(msg.adsInfo))
                if (msg.adsInfo.bannerHeight) {
                    msg.adsInfo.bannerHeight = Number(msg.adsInfo.bannerHeight) || 0
                    DataMgr.setData(Constants.DATA_DEFINE.BANNER_HEIGHT, msg.adsInfo.bannerHeight)
                    EventMgr.dispatchEvent(Constants.EVENT_DEFINE.BANNER_HEIGHT, msg.adsInfo.bannerHeight)
                }
            } else if (msg.AdsResultCode === EAdsResult.RESULT_CODE_REWARTVIDEO_CLOSE || msg.AdsResultCode === EAdsResult.RESULT_CODE_REWARTVIDEO_FAIL) {
                console.log("====RESULT_CODE_REWARTVIDEO_CLOSE")
                _showAds = false
                resumeBanner()
            } else if (msg.AdsResultCode === EAdsResult.RESULT_CODE_INTER_CLOSE || msg.AdsResultCode === EAdsResult.RESULT_CODE_INTER_FAIL) {
                console.log("====RESULT_CODE_INTER_CLOSE")
                _showPlugAds = false
                resumeBanner()
            }

            EventMgr.dispatchEvent("PluginAdsCallBack", msg)
        }, null, 0.1)
    }

    function _onJavascriptJavaCallBack(message: { opcode: string, data: string }): void {
        cc.log("[PluginManager.onJavascriptJavaCallBack] data:", JSON.stringify(message))
        // NetManager.Instance.onMessage(message)
        EventMgr.dispatchEvent(message.opcode, message.data)
    }

    export function getPluginVersion(): string {
        if (_pluginProxy) {
            return _pluginProxy.getPluginVersion("PlatformWP", 1, 9)
        } else {
            return "1.0.0"
        }
    }

    export function getDeviceIMEI(): string {
        if (_pluginProxy) {
            return _pluginProxy.getDeviceIMEI()
        } else {
            return Helper.GetURI("imei")
        }
    }

    export function getSystemInfo(): any {
        return null
    }

    export function getMacAddress(): string {
        if (_pluginProxy) {
            return _pluginProxy.getMacAddress()
        } else {
            return "fa64d01eb8cfbdb9"
        }
    }

    export function getVersionCode(): number {
        return _pluginProxy ? Number(_pluginProxy.getVersionCode()) : 0
    }

    export function getDeviceName(): string {
        if (_pluginProxy) {
            return _pluginProxy.getDeviceName()
        } else {
            return "Device"
        }
    }

    export function startUpdatingLocation(): void {
        if (_pluginProxy) {
            return _pluginProxy.startUpdatingLocation()
        }
    }

    export function copyToClipboard(text: string): void {
        if (_pluginProxy) {
            _pluginProxy.copyToClipboard(text)
        }
    }

    export function getClipBoardContent(): void {
        if (_pluginProxy) {
            _pluginProxy.getClipBoardContent()
        } else {
            onPlatformCallBack(JSON.stringify({ PlatformResultCode: EPlatformEvent.GET_CLIPBOARD_SUCCESS, msg: "获取剪切板内容成功", url: "" }))
        }
    }

    export function initHeadFace(url: string): void {
        cc.log("[PluginManager.initHeadFace] url:", url)
        _pluginProxy.initHeadFace(JSON.stringify({
            UpLoadURL: url
        }))
    }

    export function getPayTypeByMid(mid: number): string {
        if (!pluginConfig) {
            return
        }

        if (!_iapPluginList) {
            _loadPayModeList()
        }
        for (const plugin of _iapPluginList) {
            if (plugin.mid == mid.toString()) {
                return plugin.name
            }
        }
    }

    export function getOnlyPayType(): string | false {
        if (!pluginConfig) {
            return false
        }

        if (!_iapPluginList) {
            _loadPayModeList()
        }

        if (_iapPluginList.length == 1) {
            return _iapPluginList[0].name
        }

        return false
    }

    export function hasPluginByName(name: string): boolean {
        if (pluginConfig) {
            for (const plugin of pluginConfig.plugins) {
                if (plugin.name == name) {
                    return true
                }
            }
        }
        return false
    }

    export function hasPluginByType(eType: EPluginType): boolean {
        if (pluginConfig) {
            for (const plugin of pluginConfig.plugins) {
                if (plugin.type == eType.toString()) {
                    return true
                }
            }
        }
        return false
    }

    interface ILoginInfo {
        sessionType: string
        [key: string]: string
    }
    /**
     * 插件登陆
     */
    export function login(loginInfo: ILoginInfo) {
        cc.log("[PluginManager.login] sessionType:", JSON.stringify(loginInfo))
        cc.log("[PluginManager.login] _pluginProxy:", _pluginProxy)
        if (Helper.isNative() && !loginInfo.sessionType) {
            // if (!UIMgr.FindUI("component/Personal/SessionPop")) {
            //     UIMgr.OpenUI("component/Personal/SessionEntry", { param: { hideBg: true } })
            // }
            UIMgr.OpenUI("lobby", "component/account/SessionPop/SessionPop", { single: true })
        } else if (_pluginProxy) {
            loginInfo = loginInfo || { sessionType: null }
            loginInfo.plat_aid = DataMgr.data.Config.platId + ""
            loginInfo.game_gid = DataMgr.data.Config.gameId
            loginInfo.area_info = ""
            _loadPlugin(loginInfo.sessionType, EPluginType.kPluginSession)
            _pluginProxy.userItemsLogin(JSON.stringify(loginInfo))
        }
    }

    /**
     * 插件登出
     */
    export function logout(): void {
        cc.log("[PluginManager.logout]")
        if (_pluginProxy) {
            _pluginProxy.logout()
        }
    }

    /**
     * 插件支付
     */
    export function pay(payType: number | string, payInfo: any): void {
        if (_pluginProxy) {
            if (typeof payType === "number")
                payType = getPayTypeByMid(payType)

            _loadPlugin(payType, EPluginType.kPluginIAP)
            // payInfo.IapHost = izx.httpUrl
            cc.log("[PluginManager.share]", JSON.stringify(payInfo))
            _pluginProxy.payForProduct(JSON.stringify(payInfo))
        } else {
            _delayCallBack(onIapCallBack, JSON.stringify({
                PayResultCode: 0,
                msg: "支付完成",
                payInfo: {}
            }))
        }
    }

    /**
     * 插件分享
     */
    export function share(shareInfo: IShareInfo): void {
        if (_pluginProxy) {
            cc.log("[PluginManager.share]", JSON.stringify(shareInfo))
            if (!Helper.isIosAudit()) {
                setHidePlugAds(true)
                _pluginProxy.shareWithItems(JSON.stringify(shareInfo))
            }
        } else {
            _delayCallBack(onSocialCallBack, JSON.stringify({
                ShareResultCode: 0,
                msg: "分享成功",
                shareResultInfo: {}
            }))
        }
    }

    /**
     * 打开客服
     */
    // export function openKeFu(): void {
    //     _jump2ExtendMethod(3)
    // }

    export function openKeFu(): void {
        if (_pluginProxy) {
            _loadPlugin("ExtendQIYUKF", EPluginType.kPluginExend)
            let params = {}
            params["uid"] = User.OpenID
            _pluginProxy.jump2ExtendMethod(3, JSON.stringify(params))
        }
    }

    export function _jump2ExtendMethod(tag: number): void {
        cc.log("[PluginManager.jump2ExtendMethod]", tag)
        if (_pluginProxy) {
            _loadPluginByTag(tag, EPluginType.kPluginExend)
            _pluginProxy.jump2ExtendMethod(tag, JSON.stringify({}))
        }
    }

    /**
     * 登陆完成后通知推送插件 让它去注册推送
     */
    export function StartPushSDK(): void {
        cc.log("[PluginManager.StartPushSDK]")

        if (_pluginProxy) {
            _pluginProxy.StartPushSDKItem(JSON.stringify({ PushHost: DataMgr.data.Config.hostname }))
        }
    }

    /**
     * 友盟 统计事件
     */
    export function logEvent(name: string, param?: any): void {
        if (_pluginProxy) {
            cc.log("[PluginManager.logEvent]", name, JSON.stringify(param))
            _loadPlugin("AnalyticsUmeng", 2)
            cc.log("_loadPlugin AnalyticsUmeng end")
            _pluginProxy.logEvent(1, name, JSON.stringify(param) || '')
        }
    }

    /**
     * 获取 OpenInstall 参数
     */
    export function getOpenInstallParms(): void {
        cc.log("[PluginManager.getOpenInstallParms]")
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            Helper.CallStaticMethod("org/cocos2dx/javascript/Luaj", "getOpenInstallParms", "()V")
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            Helper.CallStaticMethod("LuaObjc", "getOpenInstallParms")
        } else if (CC_PREVIEW) {
            _delayCallBack(onPlatformCallBack, JSON.stringify({
                PlatformResultCode: EPlatformEvent.GET_OPENINSTALL_PARAMS,
                msg: "获取app安装参数",
                url: JSON.stringify({
                    inviteCode: "111474"
                }),
            }))
        }
    }

    //预加载广告
    export function preloadVideoAdvert(unitid: string, callback?: Function) {
        if (cc.sys.WECHAT_GAME === cc.sys.platform) {
            // WxWrapper.createRewardedVideoAd(unitid)
        }
    }

    export function initAds(adInfo: IAdInfo): void {
        if (_pluginProxy && _pluginProxy.initAds) {
            _pluginProxy.initAds(JSON.stringify(adInfo))
        }

        if (adInfo.adType === EAdsType.ADS_TYPE_BANNER) {
            _bannerAds.push(adInfo)
            console.log("_bannerAds " + _bannerAds.length)
        } else if (adInfo.adType === EAdsType.ADS_TYPE_INTER) {
            _plugAds.push(adInfo)
            console.log("_plugAds " + _plugAds.length)
        }
    }

    /**
     * 展示广告
     */
    export function showAds(adInfo: IAdInfo): void {
        cc.log("[PluginManager.showAds]", adInfo)
        if (adInfo.adPlugin == null || adInfo.adPlugin.length == 0) {
            return
        }
        if (adInfo.adId == null || adInfo.adId.length == 0) {
            return
        }

        if (adInfo.adType === EAdsType.ADS_TYPE_BANNER) {
            _callBanner = true
            setTimeout(() => {
                _callBanner = false
            }, 1);
        } else if (adInfo.adType === EAdsType.ADS_TYPE_REWARTVIDEO) {
            _showAds = true
            pauseBanner()
        }

        cc.audioEngine.pauseMusic()
        if (_pluginProxy) {
            cc.log("[PluginManager.showAds]", JSON.stringify(adInfo))
            _loadPlugin(adInfo.adPlugin, EPluginType.kPluginAds)
            _pluginProxy.showAds(JSON.stringify(adInfo))
        } else {
            _delayCallBack(onAdsCallBack, JSON.stringify({
                AdsResultCode: EAdsResult.RESULT_CODE_REWARTVIDEO_SUCCEES,
                adsInfo: adInfo,
                msg: "广告播放成功"
            }), 3)
        }
    }

    export function showAdsNoConfig(adInfo: IAdInfo): void {
        cc.log("[PluginManager.showAdsNoConfig]", adInfo)
        cc.audioEngine.pauseMusic()
        if (_pluginProxy) {
            cc.log("[PluginManager.showAdsNoConfig]", JSON.stringify(adInfo))
            _loadPlugin(adInfo.adPlugin, EPluginType.kPluginAds)
            _pluginProxy.showAds(JSON.stringify(adInfo))
        } else {
            _delayCallBack(onAdsCallBack, JSON.stringify({
                AdsResultCode: EAdsResult.RESULT_CODE_REWARTVIDEO_SUCCEES,
                adsInfo: adInfo,
                msg: "广告播放成功"
            }), 3)
        }
    }

    /**
     * 隐藏广告
     */
    export function hideAds(adsType: EAdsType): void {
        cc.log("[PluginManager.hideAds]", adsType)
        if (_pluginProxy) {
            _pluginProxy.hideAds(adsType)
        }
    }

    export function initBanner(adUnitId: string) {
        if (cc.sys.WECHAT_GAME === cc.sys.platform) {
            // WxWrapper.initBannerAd(adUnitId)
            return
        }
    }

    export function showBanner(callback?: Function) {
        if (_pluginProxy && _pluginProxy.showAds && (!_showBanner || _pauseBanner)) {
            _showBanner = true
            _callBanner = true
            setTimeout(() => {
                _callBanner = false
            }, 15);
            let id = Math.floor(Math.random() * 100 % _bannerAds.length)
            let adInfo: IAdInfo = _bannerAds[id]
            if (adInfo) {
                console.log("showBanner " + id + " : " + JSON.stringify(adInfo))
                _loadPlugin(adInfo?.adPlugin, EPluginType.kPluginAds)
                _pluginProxy.showAds(JSON.stringify(adInfo))
            }
        }
    }

    export function hideBanner() {
        if (_pluginProxy && _pluginProxy.hideAds) {
            _showBanner = false
            _pauseBanner = false
            console.log("===hideBanner")
            _pluginProxy.hideAds(EAdsType.ADS_TYPE_BANNER)
        }
    }

    export function pauseBanner() {
        if (_showBanner) {
            _pauseBanner = true
            console.log("===pauseBanner")
            _pluginProxy.hideAds(EAdsType.ADS_TYPE_BANNER)
        }
    }

    export function resumeBanner() {
        if (_pauseBanner) {
            console.log("===resumeBanner")
            showBanner()
            _pauseBanner = false
        }
    }

    export function initPluginAd(adUnitId: string) {
        if (cc.sys.WECHAT_GAME === cc.sys.platform) {
            // WxWrapper.initInterstitialAd(adUnitId)
            return
        }
    }

    export function showPluginAd(callback?: Function) {
        if (_pluginProxy && _pluginProxy.showAds && !_showPlugAds && _plugAds.length > 0) {
            let id = Math.floor(Math.random() * 100 % _plugAds.length)
            let adInfo: IAdInfo = _plugAds[id]
            if (adInfo) {
                console.log("showPluginAd " + id + " : " + JSON.stringify(adInfo))
                _showPlugAds = true
                pauseBanner()
                _loadPlugin(adInfo?.adPlugin, EPluginType.kPluginAds)
                _pluginProxy.showAds(JSON.stringify(adInfo))
            }
        }
    }

    function _delayCallBack(callback: Function, data: any, time: number = 0.5) {
        // if (_pluginProxy) {
        //     return
        // }

        cc.Canvas.instance.node.runAction(cc.sequence(cc.delayTime(time), cc.callFunc(() => {
            callback(data)
        })))
    }

    export function navigateToMiniGame(appId: string, extraData: any = null, callback?: (succ: boolean) => void) {
        _pluginProxy.navigateToMiniGame && _pluginProxy.navigateToMiniGame(appId, extraData, callback)
    }

    /**
     * 获取刘海屏刘海高度
     */
    export function getNotchHeight(): number {
        if (Helper.isNative() && cc.sys.os == cc.sys.OS_ANDROID) {
            let res = Helper.CallStaticMethod("org/cocos2dx/javascript/Luaj", "getNotchHeight", "()I")
            if (res && res.result) {
                return res.result
            }
        }

        return 0
    }

    export function checkNetwork() {
        return new Promise((rlv, rjt) => {
            if (_pluginProxy && _pluginProxy.checkNetwork) {
                _pluginProxy.checkNetwork((res) => {
                    if (res.type === "none") {
                        return rjt()
                    } else {
                        rlv(true)
                    }
                })
            } else {
                rlv(true);
            }
        })
    }

    export function getABTestKey(key: string): string {
        if (_pluginProxy && _pluginProxy.getABTestKey) {
            return _pluginProxy.getABTestKey(key)
        }

        return undefined
    }

    export function isH52345Game() {
        let h52345Game = window["starGame"]
        return !!h52345Game
    }

    export function checkPlugAd() {
        if (_showAds) {
            console.log("_showAds is true")
        }

        if (_callBanner) {
            console.log("_callBanner is true")
        }

        return _showAds || _callBanner || _hidePlugAds
    }

    export function setHidePlugAds(hide: boolean) {
        _hidePlugAds = hide
    }

    /**
     * 获取SIM卡是否可用
     */
    export function getSimState(): boolean {
        cc.log("[PluginManager.getSimState]" + cc.sys.os)
        if (cc.sys.isBrowser) {
            return true
        } else if (cc.sys.os === cc.sys.OS_ANDROID || cc.sys.os === cc.sys.OS_IOS) {
            if (!jsb["getSimState"]) {
                console.log("===not found jsb.getSimState===")
                return true
            }

            console.log(jsb["getSimState"])
            return jsb["getSimState"]()
        }

        return true
    }
}

EventMgr.once(Constants.EVENT_DEFINE.PLUGIN_INIT, () => PluginMgr.onInit())