import { Helper } from "./Helper"
import { Constants } from "../igsConstants"
import { DataMgr } from "../base/DataMgr"
import { UIMgr } from "../base/UIMgr";
import { EventMgr } from "../base/EventMgr"
import { PluginMgr } from "../base/PluginMgr";
import { IAdInfo, EAdsType, EAdsResult, ESocialResult } from "../pulgin/IPluginProxy"
import { User } from "../data/User";
import { UserSrv } from "./UserSrv";

const LOAD_AD_CONFIG_URI = "igaoshou-ad-srv/ad/loadAdConfig"
const CREATE_AD_ORDER_URI = "igaoshou-ad-srv/ad/createAdOrder"
const COMPLETE_AD_ORDER_URI = "igaoshou-ad-srv/ad/completeAdOrder"

const AD_INTERVAL_TIME = 30 * 1000

let _init = false
let _lastAdTime: number = 0
let _ad_playing: boolean = false

export namespace AdSrv {
    let _ad_aid = 0
    let order_no = ""
    let createAdOrderCallback: { [index: number]: Function } = {}

    export function init(callback?: Function) {
        if (!_init) {
            EventMgr.on("PluginAdsCallBack", pluginAdsCallBack)
            _init = true
        }

        let ads = DataMgr.getData(Constants.DATA_DEFINE.AD_CONFIG)
        if (!ads) {
            LoadAdConfig(callback)
        }
    }

    function pluginAdsCallBack(msg) {
        console.log("===AdSrv pluginAdsCallBack adsResultCode " + msg?.AdsResultCode)
        // msg = msg
        if (msg.AdsResultCode == EAdsResult.RESULT_CODE_REWARTVIDEO_SUCCEES) {
            msg.order_no = order_no
            createAdOrderCallback[msg.adsInfo?.id] && createAdOrderCallback[msg.adsInfo?.id](msg)
            createAdOrderCallback[msg.adsInfo?.id] = null
        } else if (msg.AdsResultCode == EAdsResult.RESULT_CODE_REWARTVIDEO_FAIL) {
            if (_ad_aid < 2000) {
                let param = {
                    buttons: 1,
                    confirmName: "我知道了",
                    confirmIconSize: { width: 300 },
                    param: { msg: "\n广告还没有准备好，请稍后再试！\n" }
                }
                Helper.OpenPopUI("component/base/MsgEntry", "提示", param)
            }
            createAdOrderCallback[msg.adsInfo?.id] && createAdOrderCallback[msg.adsInfo?.id](msg)
            createAdOrderCallback[msg.adsInfo?.id] = null
        } else if (msg.AdsResultCode == EAdsResult.RESULT_CODE_REWARTVIDEO_CANCEL) {
            if (_ad_aid < 2000) {
                Helper.OpenTip("完整观看视频才可以领取奖励哦")
            }
            createAdOrderCallback[msg.adsInfo?.id] && createAdOrderCallback[msg.adsInfo?.id](msg)
            createAdOrderCallback[msg.adsInfo?.id] = null
        } 
        // else {
        //     createAdOrderCallback[msg.adsInfo?.id] && createAdOrderCallback[msg.adsInfo?.id](msg)
        //     createAdOrderCallback[msg.adsInfo?.id] = null
        // }
    }

    export function LoadAdConfig(callback?: Function) {
        Helper.PostHttp(LOAD_AD_CONFIG_URI, null, {is_pn: 1}, (res) => {
            console.log("LOAD_AD_CONFIG_URI res", JSON.stringify(res))
            if (res && res.ad_config) {
                let ad_config = Helper.ParseJson(res.ad_config, "loadAdConfig")
                if (ad_config) {
                    // console.log("===ad_config.adText:" + (typeof ad_config.adText))
                    if (ad_config.adText && ad_config.adText.length > 0) {
                        ad_config.adText = Helper.ParseJson(ad_config.adText, "adText")
                    }
                    // console.log("===parse ad_config.adText:" + (typeof ad_config.adText))
                    if (ad_config.adText && ad_config.adText.ad_sources) {
                        let tmp = JSON.stringify(ad_config.adText.ad_sources)
                        while (tmp.length > 0) {
                            console.log(tmp.substr(0, 100))
                            tmp = tmp.substr(100)
                        }
                        // console.log("ad_config.adText.ad_sources" + JSON.stringify(ad_config.adText.ad_sources))
                        if (Helper.isNative() || cc.sys.isBrowser) {
                            let AdsQQAds = ad_config.adText.ad_sources.AdsQQAds
                            // console.log("AdsQQAds" + AdsQQAds) 
                            initNative(AdsQQAds, "AdsQQAds")
                            let AdsTTAds = ad_config.adText.ad_sources.AdsTTAds
                            // console.log("AdsTTAds" + AdsTTAds)
                            initNative(AdsTTAds, "AdsTTAds")
                        } else if (cc.sys.platform === cc.sys.WECHAT_GAME) {
                            let adsWechat = ad_config.adText.ad_sources.adsWechat
                            initPlatform(adsWechat)
                        } else if(cc.sys.BYTEDANCE_GAME === cc.sys.platform){
                            let ByteDanceAds =ad_config.adText.ad_sources.ByteDanceAds
                            initPlatform(ByteDanceAds)
                        } else if(cc.sys.VIVO_GAME === cc.sys.platform){
                            let VIVOAds =ad_config.adText.ad_sources.VIVOAds
                            initPlatform(VIVOAds)
                        }
                    }

                }
                DataMgr.setData(Constants.DATA_DEFINE.AD_CONFIG, ad_config)
                callback?.()
            }
        })
    }

    export function initPlatform(ads) {
        if (ads) {
            for (let i in ads) {
                let v = ads[i]
                if (i === "banner" && v.adId) {
                    if (User.AllGame <= 2 && v.adId_new && v.adId_new.length > 0) {
                        PluginMgr.initAds({
                            adPlugin: "",
                            adArea: 0,
                            adType: EAdsType.ADS_TYPE_BANNER,
                            adId: v.adId_new,
                            adOid: ""
                        })
                    } else if(v.adId.length > 0){
                        PluginMgr.initAds({
                            adPlugin: "",
                            adArea: 0,
                            adType: EAdsType.ADS_TYPE_BANNER,
                            adId: v.adId,
                            adOid: ""
                        })
                    }
                } else if (i === "pluginad" && v.adId) {
                    if (User.AllGame <= 2 && v.adId_new && v.adId_new.length > 0) {
                        PluginMgr.initAds({
                            adPlugin: "",
                            adArea: 0,
                            adType: EAdsType.ADS_TYPE_INTER,
                            adId: v.adId_new,
                            adOid: ""
                        })
                    } else if(v.adId.length > 0){
                        PluginMgr.initAds({
                            adPlugin: "",
                            adArea: 0,
                            adType: EAdsType.ADS_TYPE_INTER,
                            adId: v.adId,
                            adOid: ""
                        })
                    }
                }
            }
        }
    }

    export function initNative(Ads, plugin) {
        // console.log("====initNative " + JSON.stringify(Ads))
        if (Ads) {
            if (Ads["banner"]) {
                console.log("Ads[banner] " + JSON.stringify(Ads["banner"]))
                PluginMgr.initAds({
                    adPlugin: plugin,
                    adArea: 0,
                    adType: EAdsType.ADS_TYPE_BANNER,
                    adId: Ads["banner"].adId,
                    adOid: ""
                })
            }
            
            if (Ads["pluginad"]) {
                console.log("Ads[pluginad] " + JSON.stringify(Ads["pluginad"]))
                PluginMgr.initAds({
                    adPlugin: plugin,
                    adArea: 0,
                    adType: EAdsType.ADS_TYPE_INTER,
                    adId: Ads["pluginad"].adId,
                    adOid: ""
                })
            }
        }
    }

    export function canPlayAd() {
        return true//!_ad_playing && !(_lastAdTime + AD_INTERVAL_TIME >= Date.now())
    }

    export function createAdOrder(ad_aid: number, ad_param: string, callback?: Function) {
        // if (_lastAdTime + AD_INTERVAL_TIME >= Date.now()) {
        //     callback?.()
        //     return
        // }

        Helper.reportEvent("广告点", "播放广告", "创建订单" + ad_aid)

        _ad_playing = true

        ad_param = Helper.ParseJson(ad_param)

        console.log("createAdOrder ad_param", ad_param)
        let param = {
            ad_aid: ad_aid,
            ad_param: ad_param,
            is_pn: 1
        }
        console.log("createAdOrder param", param)
        Helper.PostHttp(CREATE_AD_ORDER_URI, null, param, (res) => {
            console.log("createAdOrder res", res)
            if (res && res.order_no) {
                _ad_aid = ad_aid
                order_no = res.order_no
                let cb = (res) => {
                    _ad_playing = false
                    callback?.(res)
                }
                createAdOrderCallback[ad_aid] = cb

                checkShowAds(ad_aid, cb)
            } else {
                Helper.OpenTip("广告创建失败！请稍后再试 \n" + JSON.stringify(res))
                _ad_playing = false
                callback({ AdsResultCode: EAdsResult.RESULT_CODE_CREATE_ORDER_FAIL })
            }
        })
    }

    export function completeAdOrder(callback?: Function) {
        Helper.reportEvent("广告点", "播放广告", "完成订单")
        let param = {
            order_no: order_no
        }
        console.log("completeAdOrder param", param)
        Helper.PostHttp(COMPLETE_AD_ORDER_URI, null, param, (res) => {
            console.log("COMPLETE_AD_ORDER_URI res", JSON.stringify(res))
            if (res) {
                if (res.code === "00000") {
                    _lastAdTime = Date.now()
                }

                if (callback) {
                    UserSrv.UpdateItem(() => callback(res))
                } else {
                    if (res.code == "00000") {
                        if (res.award_list) {
                            let res1 = Helper.ParseJson(res.award_list, "completeAdOrder")
                            if (res1 && res1.err_code == 1) {
                                UserSrv.UpdateItem(() => UIMgr.OpenUI("lobby", "component/activity/getAwardPop/GetAwardPop", { param: { awards: res1.award_item } }))
                            }
                        }
                    }
                }
            }

            // _ad_playing = false
        })
    }

    export function PlayAD(ad_aid: number, ad_param: string) {
        return new Promise((resolve, reject) => {
            createAdOrder(ad_aid, ad_param, (res: IPlayAdCallBack) => {
                if (res && res.order_no && res.order_no !== "") {
                    completeAdOrder((res) => {
                        console.log(JSON.stringify(res))
                        if (res && res.code === "00000") {
                            res.award_list && (res.award_list = Helper.ParseJson(res.award_list))
                            console.log(res.award_list)
                            return resolve(res)
                        } else {
                            return reject(1)
                        }
                    })
                } else {
                    return reject(2)
                }
            })
        })
    }

    function checkShowAds(ad_aid: number, callback?: Function) {
        // Helper.reportEvent("广告点", "播放广告", "检查广告" + ad_aid)        
        console.log("checkShowAds is h52345Game", PluginMgr.isH52345Game())
        if (PluginMgr.isH52345Game()) {
            let adInfo: IAdInfo = {
                adPlugin: "",
                adArea: 0,
                adType: EAdsType.ADS_TYPE_REWARTVIDEO,
                adId: "",
                adOid: order_no,
                adWidth: 0,
                adHeight: 0,

                id: ad_aid,
            }
            // Helper.reportEvent("广告点", "播放广告", "展示广告" + ad_aid)
            PluginMgr.showAdsNoConfig(adInfo)
            return
        }

        let ads: any = null
        let method: number[] = [] //0免费 1分享 2广告 默认2看广告

        let ad_config: any = DataMgr.getData(Constants.DATA_DEFINE.AD_CONFIG)
        if (!ad_config) {
            // Helper.OpenTip("广告加载失败！请稍后再试")
            init(() => {
                checkShowAds(ad_aid, callback)
            })
            return
        }
        let adSources: any = {}
        if (ad_config && ad_config.adText && ad_config.adText.ad_sources) {
            adSources = ad_config.adText.ad_sources
        }

        if (Constants.sys.WECHAT_GAME_QQ === cc.sys.platform) {

        } else if (cc.sys.WECHAT_GAME === cc.sys.platform) {
            if (adSources.adsWechat &&
                adSources.adsWechat[ad_aid]) {
                ads = adSources.adsWechat[ad_aid]
                ads.adPlugin = "wechat"
            }
        } else if (cc.sys.OPPO_GAME === cc.sys.platform) {
            if (adSources.OPPOAds &&
                adSources.OPPOAds[ad_aid]) {
                ads = adSources.OPPOAds[ad_aid]
                ads.adPlugin = "oppo"
            }
        } else if (cc.sys.VIVO_GAME === cc.sys.platform) {
            if (adSources.VIVOAds &&
                adSources.VIVOAds[ad_aid]) {
                ads = adSources.VIVOAds[ad_aid]
                ads.adPlugin = "vivo"
            }
        } else if (cc.sys.BYTEDANCE_GAME === cc.sys.platform) {
            if (adSources.ByteDanceAds &&
                adSources.ByteDanceAds[ad_aid]) {
                ads = adSources.ByteDanceAds[ad_aid]
                ads.adPlugin = "ByteDanceAds"
            }
        } else {
            let totalWeight = 0
            let adsList: any[] = []
            for (let v in adSources) {
                console.log("v", v)
                console.log("adSources.v", adSources[v])
                if (PluginMgr.hasPluginByName(v) && adSources[v][ad_aid]) {
                    adSources[v][ad_aid].adPlugin = v
                    adsList.push(adSources[v])
                    adSources[v][ad_aid].weight += totalWeight
                    totalWeight = adSources[v][ad_aid].weight
                }
            }

            let rnum = Math.random()
            let weight = totalWeight * rnum
            for (let v of adsList) {
                if (weight < v[ad_aid].weight) {
                    ads = v[ad_aid]
                    break
                }
            }

            if (!ads && adsList[0]) {
                ads = adsList[0][ad_aid]
            }
        }

        if (ad_config && ad_config.adText && ad_config.adText.method) {
            method = ad_config.adText.method[ad_aid]
        }

        console.log("checkShowAds ads", ads)
        console.log("checkShowAds method", method)

        if (!ad_config) {
            // Helper.reportEvent("广告点", "播放广告", "没有广告配置" + ad_aid)
            callback?.({ AdsResultCode: EAdsResult.RESULT_CODE_ERROR_CONFIG })
        } else if (ads && ads.adId) {
            let adInfo: IAdInfo = {
                adPlugin: ads.adPlugin,
                adArea: 0,
                adType: EAdsType.ADS_TYPE_REWARTVIDEO,
                adId: ads.adId,
                adOid: order_no,
                adWidth: 0,
                adHeight: 0,

                id: ad_aid,
            }
            if (User.AllGame <= 2 && ads.adId_new && ads.adId_new.length > 0) {
                adInfo.adId = ads.adId_new
            }
            // Helper.reportEvent("广告点", "播放广告", "展示广告" + ad_aid)
            PluginMgr.showAds(adInfo)
        } else {
            // Helper.reportEvent("广告点", "播放广告", "分享" + ad_aid)
            if (Constants.sys.WECHAT_GAME_QQ === cc.sys.platform) {
                Helper.shareInfo((res) => {
                    if (res.ShareResultCode == ESocialResult.SHARERESULT_SUCCESS) {
                        callback && callback({ adsInfo: { id: ad_aid }, AdsResultCode: EAdsResult.RESULT_CODE_REWARTVIDEO_SUCCEES, order_no: order_no })
                    } else {
                        callback && callback({ adsInfo: { id: ad_aid }, AdsResultCode: EAdsResult.RESULT_CODE_REWARTVIDEO_FAIL })
                    }
                })
            } else {
                callback && callback({ adsInfo: { id: ad_aid }, AdsResultCode: EAdsResult.RESULT_CODE_REWARTVIDEO_SUCCEES, order_no: order_no })
            }
        }
    }

    export function getMethod(ad_aid): number[]{
        let ad_config: any = DataMgr.getData(Constants.DATA_DEFINE.AD_CONFIG)
        let method: number[] = [] //0免费 1分享 2广告 默认2看广告
        console.log("Array.isArray(ad_config.adText.method) = ", Array.isArray(ad_config.adText.method))
        if (ad_config && ad_config.adText && ad_config.adText.method && Array.isArray(ad_config.adText.method)) {
            for(let v of ad_config.adText.method){
                if(v.regInterval){
                    console.log("Math.floor(Date.now() / 1000) = ", Math.floor(Date.now() / 1000))
                    console.log("User.Data.regTime = ", User.Data.regTime)
                    if(Math.floor(Date.now() / 1000) - User.Data.regTime < v.regInterval){
                        method = v.config[ad_aid] || method
                        break
                    }
                }else{
                    method = v.config[ad_aid] || method
                    break
                }
            }
        }
        return method
    }
}

EventMgr.once(Constants.EVENT_DEFINE.LOGIN_SUCCESS, AdSrv.init)