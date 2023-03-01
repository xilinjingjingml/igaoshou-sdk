import { EPluginType, IAdInfo, EAdsType, EAdsResult } from "../pulgin/IPluginProxy"
import { Helper } from "../system/Helper"
import { EventMgr } from "./EventMgr"
import { DataMgr } from "./DataMgr"
import { Constants } from "../constants"
import { PlatformApi } from "../api/platformApi"
import WxWrapper from "../system/WeChatMini"
import { Account } from "../system/Account"
import OppoWrapper from "../system/OppoMini"
import ByteDanceWrapper from "../system/ByteDanceMini"

export enum EPlatformEvent {
    INIT_HEADFACE_SUCCESS 	  	 = 0,
	INIT_HEADFACE_FAIL 	 		 = 1,
	UPLOAD_HEADFACE_SUCCESS      = 2,
	UPLOAD_HEADFACE_FAIL 	     = 3,
	
	PLAYSOUND_START				 = 4,
	PLAYSOUND_PAUSE				 = 5,
	PLAYSOUND_RESUME			 = 6,
	PLAYSOUND_STOP				 = 7,
	PLAYSOUND_OVER				 = 8,
	PLAYSOUND_ERROR				 = 9,
	
	RECORDVOICE_START			 = 10,
	RECORDVOICE_CANCEL			 = 11,
	RECORDVOICE_OVER			 = 12,
	RECORDVOICE_UPLOAD_START     = 13,
	RECORDVOICE_UPLOAD_OVER   	 = 14,
	RECORDVOICE_UPLOAD_FAIL		 = 15,
	RECORDVOICE_FAIL			 = 16,
	SAVEIMG_SUCCESS				 = 17,//保存到相册成功
	SAVEIMG_FAIL			 	 = 18,//保存到相册失败
	LOCATION_SUCCESS			 = 19,//定位成功
	LOCATION_FAIL				 = 20,//定位失败
	GET_CLIPBOARD_SUCCESS		 = 21,//获取剪切板内容成功
	GET_USERUID_SUCCESS			 = 22,//获取私人房用户座椅号 
	LOGINWAWAJIROOM_SUCCESS		 = 23,//进入娃娃机房间成功
	WAWAJIROOM_ONPLAY_SUCCESS	 = 24,//娃娃机拉流成功

	GET_CONTACTS_SUCCESS		 = 25,//获取通讯录内容成功
	GET_CONTACTS_FAIL			 = 26,//获取通讯录内容失败
	
	GET_KEFU_FAIL				 = 27,//当前客服服务不可用
	
	UPLOAD_EXTRAPARAM_SUCCESS	 = 28,//上传图片成功
	UPLOAD_EXTRAPARAM_FAIL	 	 = 29,//上传图片失败
	GET_SOCIALURLPARAMS		 	 = 30,//获取url跳转app透传的参数
	GET_OPEN_URL_FAILED		 	 = 31,//打开url失败
    GET_OPENINSTALL_PARAMS       = 50, //获取openinstall参数
}

interface IPlugin {
    name: string
    type: string
    tag: string
    mid: string
}

export namespace PluginMgr {
    let _pluginProxy: any
    let _iapPluginList: IPlugin[]
    export let pluginConfig: { game: { PacketName: string }[], plugins: IPlugin[] }

    let _loginCallback: Function

    export function onInit(callback?: Function): void {
        console.log("[PluginManager.onInit]")
        // _setPluginEnv()

        console.log("[PluginManager.onInit] cc.sys.isNative", cc.sys.isNative)
        console.log("[PluginManager.onInit] cc.sys.os", cc.sys.os)
        console.log("[PluginManager.onInit] cc.sys.OS_ANDROID", cc.sys.OS_ANDROID)
        
        if (Helper.isNative()) {  
            console.log("[PluginManager.onInit] CC_JSB is true  1")
            _pluginProxy = jsb["PluginProxyWrapper"].getInstance()
            console.log("[PluginManager.onInit] CC_JSB is true  2")
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
            // Java回调
            window['JavascriptJavaCallBack'] = _onJavascriptJavaCallBack

            _loadPluginPlist(callback)
        } else {
            console.log("[PluginManager.onInit] CC_JSB is false")
            // _loadPluginPlist(callback)
            callback && callback()
        }
    }

    function _loadPluginPlist(callback?: Function) {
        console.log("PluginManager._loadPluginPlist")
        if(Helper.isNative()){
            let plist = _pluginProxy.getPluginsPlist()
            console.log("PluginManager._loadPluginPlist plist", plist)
            let result = plist
            if(cc.sys.os == cc.sys.OS_ANDROID){//安卓返回的是xml需要解析
                result = cc["plistParser"].parse(plist);
            }else if(cc.sys.os == cc.sys.OS_IOS){
                result = JSON.parse(plist)
            }
            if(result){
                console.log("PluginManager._loadPluginPlist result", result)
                console.log("PluginManager._loadPluginPlist result", JSON.stringify(result))
                console.log("PluginManager._loadPluginPlist result",  JSON.stringify(result.config))
                console.log("PluginManager._loadPluginPlist result",  JSON.stringify(result.plugins))
                _setPluginEnv(result)
                _setPluginConfig(result)
            }
            callback && callback()
        }else{
            let bundle = DataMgr.Bundle
            if (bundle) {            
                console.log("PluginManager._loadPluginPlist bundle true")
                bundle.load("thirdparty/plugins", (err, data: any) => {
                    if(err){
                        console.log("PluginManager thirdparty/plugins err = ", err.message)
                    }else{
                        console.log("PluginManager thirdparty/plugins data = ", data)       
                        console.log("PluginManager thirdparty/plugins data _nativeAsset = ", data._nativeAsset)    
                        if(data && data._nativeAsset && data._nativeAsset.plugins){
                            _setPluginConfig(data._nativeAsset)
                        }
                    }
                    callback && callback()
                })
            }
        }
    }

    function _setPluginEnv(config: any): void {
        const game_env = parseInt(localStorage.getItem("GAME_ENV"))
        if (game_env != null) {
            DataMgr.Config.env = game_env
        }
        let gameId = config.config.gameId
        let pn = config.config.channelname
        let platId = config.config.platId
        let env = config.config.env

        console.log("PluginManager._loadPluginPlist gameId", gameId)
        console.log("PluginManager._loadPluginPlist pn", pn)
        console.log("PluginManager._loadPluginPlist platId", platId)
        console.log("PluginManager._loadPluginPlist env", env)

        DataMgr.Config.gameId = gameId || DataMgr.Config.gameId
        DataMgr.Config.pn = pn || DataMgr.Config.pn
        DataMgr.Config.platId = platId || DataMgr.Config.platId
        DataMgr.Config.env = env || DataMgr.Config.env

        DataMgr.Config.platId = Number(DataMgr.Config.platId)
        DataMgr.Config.env = Number(DataMgr.Config.env)

        console.log("PluginManager._loadPluginPlist DataMgr.Config.gameId", DataMgr.Config.gameId)
        console.log("PluginManager._loadPluginPlist DataMgr.Config.pn", DataMgr.Config.pn)
        console.log("PluginManager._loadPluginPlist DataMgr.Config.platId", DataMgr.Config.platId)
        console.log("PluginManager._loadPluginPlist DataMgr.Config.env", DataMgr.Config.env)

        cc.log("[PluginManager.setPluginEnv] CurENV", DataMgr.Config.env)
    }

    export function getConfig(name: string): string {
        return DataMgr.Config[name]
    }

    function _setPluginConfig(config: any): void {
        console.log("[PluginManager.pluginConfig]", JSON.stringify(config))
        pluginConfig = config
        if (!localStorage.getItem) {
            // cfg.pn = pluginConfig.game[0].PacketName
        }

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

            _pluginProxy.setPluginConfig(JSON.stringify(pluginConfig))
            cc.log("[PluginManager.pluginConfig] packetName", DataMgr.Config.pn)
            // _pluginProxy.setPackageName(cfg.pn)
            cc.log("[PluginManager.pluginConfig] CurENV", DataMgr.Config.env)
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

        EventMgr.dispatchEvent("PLUGIN_LOAD_FINISH")
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
        console.log("[PluginManager.onSessionCallBack] data:", data)
        EventMgr.dispatchEvent("PluginSessionCallBack", JSON.parse(data))
        let sessionData = JSON.parse(data)
        if (sessionData.SessionResultCode == 0) {
            let sessionInfo = JSON.parse(data).sessionInfo

            let token = DataMgr.getData<IOpenId>(Helper.GetTokenDataKey()) || {}
            let param = {
            }

            param["token"] = token.token
            param["auth_method"] = "AccountLogin"
            param["auth_info"] = {
                plat_aid: DataMgr.Config.platId,
                imei: sessionInfo.imei,//token.account,
                pn: sessionInfo.pn,
                game_gid: sessionInfo.game_gid,
                device: sessionInfo.device,
                auth_type: Number(sessionInfo.auth_type),
                metadata: {},
            }
            if (token && token.account && token.key) {
                param["auth_info"]["metadata"] = {
                    account: token.account,
                    password: token.key
                }
            }
            if (sessionInfo && sessionInfo.metadata) {
                param["auth_info"].metadata = sessionInfo.metadata
            }
            Account._loginReq(param)
        } else {
            Helper.OpenTip(sessionData.msg)
        }
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
        cc.log("[PluginManager.onSocialCallBack] data:", data)
        // NetManager.Instance.onMessage({ opcode: "PluginSocialCallBack", data: data })
        EventMgr.dispatchEvent("PluginSocialCallBack", JSON.parse(data))
    }

    // { PlatformResultCode: number, msg: string, url: any }
    export function onPlatformCallBack(data: string): void {
        cc.log("[PluginManager.onPlatformCallBack] data:", data)
        // NetManager.Instance.onMessage({ opcode: "PluginPlatformCallBack", data: data })
        EventMgr.dispatchEvent("PluginPlatformCallBack", JSON.parse(data))
        
    }

    // { AdsResultCode: number, msg: string }
    // { SessionResultCode: number, msg: string, sessionInfo: any }
    export function onAdsCallBack(data: string): void {
        cc.log("[PluginManager.onAdsCallBack] data:", data)
        // NetManager.Instance.onMessage({ opcode: "PluginAdsCallBack", data: data })
        // pluginAdsResult(data)
        // if (PlatformApi.isForeground) {
        //     EventMgr.dispatchEvent("PluginAdsCallBack", JSON.parse(data))
        // } else {
        //     EventMgr.dispatchEvent("save_ad_callback_event", data)
        // }

        _delayCallBack(()=>{
            console.log("[PluginManager.onAdsCallBack] dispatchEvent PluginAdsCallBack", data)
            EventMgr.dispatchEvent("PluginAdsCallBack", JSON.parse(data))
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
            return "5.0.0"
        }
    }

    export function getDeviceIMEI(): string {
        if (_pluginProxy) {
            return _pluginProxy.getDeviceIMEI()
        } else {
            return Helper.GetURI("imei")
        }
    }

    export function getMacAddress(): string {
        if (_pluginProxy) {
            return _pluginProxy.getMacAddress()
        } else {
            return "fa64d01eb8cfbdb9"
        }
    }

    export function getVersionCode(): number {
        return _pluginProxy ? parseInt(_pluginProxy.getVersionCode()) : 0
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

    /**
        initHeadFace透传参数如下：
            UpLoadURL：头像云端保存地址。
            ModifyUserInfoUrl：通知服务器修改头像地址。
            extraParam：头像云端保存带的透传参数。
            isAutoUpload：是否自动上传头像，true上传，false不上传，默认false。
            rectWidth：图片裁剪宽度，>0使用rectWidth，<0默认100，=0不裁剪
            rectHeight：图片裁剪高度，>0使用rectHeight，<0默认100，=0不裁剪
    */
    export function initHeadFace(url: string, isAutoUpload: boolean, rectWidth: number, rectHeight: number): void {
        cc.log("[PluginManager.initHeadFace] url:", url, isAutoUpload, rectWidth, rectHeight)
        _pluginProxy.initHeadFace(JSON.stringify({
            UpLoadURL: url,
            isAutoUpload: isAutoUpload,
            rectWidth: rectWidth,
            rectHeight: rectHeight
        }))
    }

    /*
        传参：以"|"分割关键内容的字符串。例如："data/data/aa.png|data/data/aa1.png|data/data/aa3.png"

    */
    export function uploadHeadFace(urls: string): void {
        cc.log("[PluginManager.initHeadFace] url:", urls)
        _pluginProxy.initHeadFace(JSON.stringify({
            urls: urls
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
    export function login(loginInfo: ILoginInfo): boolean {
        cc.log("[PluginManager.login] sessionType:", JSON.stringify(loginInfo))
        cc.log("[PluginManager.login] _pluginProxy:", _pluginProxy)
        if (_pluginProxy) {
            // loginInfo.LoginHost = izx.httpUrl
            // loginInfo.PlatformHost = izx.httpUrl
            loginInfo.plat_aid = DataMgr.Config.platId.toString()
            loginInfo.game_gid = DataMgr.Config.gameId
            loginInfo.area_info = ""
            _loadPlugin(loginInfo.sessionType, EPluginType.kPluginSession)
            _pluginProxy.userItemsLogin(JSON.stringify(loginInfo))
        }

        return false
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

    interface IShareInfo {
        ShareWay: string
        ShareTaskType: string
        ShareTitle: string
        ShareText: string
        ShareUrl: string
        ShareType: string
        gameid: string
        SharedImg?: string
    }
    /**
     * 插件分享
     */
    export function share(shareInfo: IShareInfo): void {
        if (_pluginProxy) {
            cc.log("[PluginManager.share]", JSON.stringify(shareInfo))
            _pluginProxy.shareWithItems(JSON.stringify(shareInfo))
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
            let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
            if (user && user.userId) {
                params["uid"] = user.userId
            }
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
            _pluginProxy.StartPushSDKItem(JSON.stringify({ PushHost: DataMgr.Config.hostname }))
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
            WxWrapper.createRewardedVideoAd(unitid)
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
        if (cc.sys.WECHAT_GAME === cc.sys.platform) {
            WxWrapper.showRewardedVideoAd(adInfo, (state, msg) => {
                let code = EAdsResult.RESULT_CODE_REWARTVIDEO_FAIL
                if (state === 0) {
                    code = EAdsResult.RESULT_CODE_REWARTVIDEO_SUCCEES
                } else if (state === 1) {
                    code = EAdsResult.RESULT_CODE_REWARTVIDEO_CANCEL
                }
                console.log("WxWrapper.showVideoAd callback")
                _delayCallBack(onAdsCallBack, JSON.stringify({
                    AdsResultCode: code,
                    adsInfo: adInfo,
                    msg: msg
                }) , .5)
            })
            return
        }else if (cc.sys.OPPO_GAME === cc.sys.platform) {
            OppoWrapper.showRewardedVideoAd(adInfo, (state, msg) => {
                let code = EAdsResult.RESULT_CODE_REWARTVIDEO_FAIL
                if (state === 0) {
                    code = EAdsResult.RESULT_CODE_REWARTVIDEO_SUCCEES
                }else if (state === 1) {
                    code = EAdsResult.RESULT_CODE_REWARTVIDEO_CANCEL
                }
                console.log("OppoWrapper.showVideoAd callback")
                _delayCallBack(onAdsCallBack, JSON.stringify({
                    AdsResultCode: code,
                    adsInfo: adInfo,
                    msg: msg
                }),.5)
                    
            })
            return
        }else if (cc.sys.BYTEDANCE_GAME === cc.sys.platform) {
            ByteDanceWrapper.showRewardedVideoAd(adInfo, (state, msg) => {
                let code = EAdsResult.RESULT_CODE_REWARTVIDEO_FAIL
                if (state === 0) {
                    code = EAdsResult.RESULT_CODE_REWARTVIDEO_SUCCEES
                } else if (state === 1) {
                    code = EAdsResult.RESULT_CODE_REWARTVIDEO_CANCEL
                }
                console.log("WxWrapper.showVideoAd callback")
                _delayCallBack(onAdsCallBack, JSON.stringify({
                    AdsResultCode: code,
                    adsInfo: adInfo,
                    msg: msg
                }) , .5)
            })
            return
        }
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
            WxWrapper.initBannerAd(adUnitId)
            return
        }
    }

    export function showBanner(callback?: Function) {
        if (cc.sys.WECHAT_GAME === cc.sys.platform) {
            WxWrapper.showBannerAd(callback)
            return
        }
    }

    export function hideBanner() {
        if (cc.sys.WECHAT_GAME === cc.sys.platform) {
            WxWrapper.hideBannerAd()
            return
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

    export function navigateToMiniGame(miniGameId: string, extraData: any = null) {
        if (cc.sys.WECHAT_GAME === cc.sys.platform) {
            WxWrapper.navigateToMiniProgram(miniGameId)
        }
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


}