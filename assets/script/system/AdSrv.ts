import { Helper } from "./Helper"
import { Constants } from "../constants"
import { DataMgr } from "../base/DataMgr"
import { MatchSvr } from "./MatchSvr"
import { ShopSvr } from "./ShopSvr"
import { UIMgr } from "../base/UIMgr";
import { EventMgr } from "../base/EventMgr"
import WxWrapper from "./WeChatMini"
import { PluginMgr } from "../base/PluginMgr";
import { EPluginType, IAdInfo, EAdsType, EAdsResult } from "../pulgin/IPluginProxy"
import { User } from "./User"

const LOAD_AD_CONFIG_URI = "igaoshou-ad-srv/ad/loadAdConfig"
const CREATE_AD_ORDER_URI = "igaoshou-ad-srv/ad/createAdOrder"
const COMPLETE_AD_ORDER_URI = "igaoshou-ad-srv/ad/completeAdOrder"


export namespace AdSrv {
    let order_no = ""
    let createAdOrderCallback: Function = null

    export function init() {
        EventMgr.on("PluginAdsCallBack", pluginAdsCallBack)
        LoadAdConfig()
    }

    function pluginAdsCallBack(msg) {
        msg = msg
        console.log("pluginAdsCallBack", msg)
        if (msg.AdsResultCode == EAdsResult.RESULT_CODE_REWARTVIDEO_SUCCEES) {
            createAdOrderCallback && createAdOrderCallback(order_no)
        } else if (msg.AdsResultCode == EAdsResult.RESULT_CODE_REWARTVIDEO_FAIL) {
            //TODO 添加ABTest（默认2）: 1.分享提示 2.没有准备好广告

            //引导分享
            // let shareFunc = () => {
            //     let share = DataMgr.getData<any>(Constants.DATA_DEFINE.SHARE_INFO)
            //     const shareData = {
            //         title: share.share_text,//"一杆全清, 王者出击",
            //         imageUrl: share.share_pic,//"https://pictures.hiigame.com/qmddz/400.jpg",
            //         withOpenId: true,
            //         callback: () => {}
            //     }
            //     WxWrapper.shareAppMessage(shareData)
            // }

            // let param = {
            //     buttons: 1,
            //     confirmName: "分享",
            //     confirmUnclose: true,
            //     functionIcon:"image/button/feixianganniou",
            //     confirm: () => {shareFunc()},
            //     confirmIconSize: {width : 300},
            //     param: { msg: " 广告还没有准备好，分享游戏到\n微信群即可领取奖励" }
            // }
            // Helper.OpenPopUI("component/Base/MsgEntry", "提示", null, param) 

            //失败
            let param = {
                buttons: 1,
                confirmName: "我知道了",
                confirmIconSize: { width: 300 },
                param: { msg: "\n广告还没有准备好，请稍后再试！\n" }
            }
            Helper.OpenPopUI("component/Base/MsgEntry", "提示", param)

        } else if (msg.AdsResultCode == EAdsResult.RESULT_CODE_REWARTVIDEO_CANCEL) {
            Helper.OpenTip("完整观看视频才可以领取奖励哦")
            createAdOrderCallback && createAdOrderCallback("")
        }
    }

    export function LoadAdConfig() {
        Helper.PostHttp(LOAD_AD_CONFIG_URI, null, null, (res) => {
            console.log("LOAD_AD_CONFIG_URI res", res)
            if (res && res.ad_config) {
                let ad_config = JSON.parse(res.ad_config)
                if (ad_config) {
                    if (ad_config.adText && ad_config.adText.length > 0) {
                        ad_config.adText = JSON.parse(ad_config.adText)
                    }
                    let adsWechat = null
                    if (ad_config && ad_config.adText && ad_config.adText.ad_sources && ad_config.adText.ad_sources.adsWechat) {
                        adsWechat = ad_config.adText.ad_sources.adsWechat
                    }
                    for (let i in adsWechat) {
                        let v = adsWechat[i]
                        if (i === "banner" && v.adId) {
                            PluginMgr.initBanner(v.adId)
                        }
                        // if(v.adId){
                        //     PluginMgr.preloadVideoAdvert(v.adId)
                        // }

                        // if(v.adId_new){
                        //     PluginMgr.preloadVideoAdvert(v.adId_new)
                        // }
                    }
                    DataMgr.setData(Constants.DATA_DEFINE.AD_CONFIG, ad_config)
                }
            }
        })
    }

    export function createAdOrder(ad_aid: number, ad_param: string, callback?: Function) {
        console.log("createAdOrder ad_param", ad_param)
        let param = {
            ad_aid: ad_aid,
            ad_param: ad_param
        }
        console.log("createAdOrder param", param)
        Helper.PostHttp(CREATE_AD_ORDER_URI, null, param, (res) => {
            console.log("createAdOrder res", res)
            if (res && res.order_no) {
                order_no = res.order_no
                createAdOrderCallback = callback

                checkShowAds(ad_aid, callback)
            }
        })
    }

    export function completeAdOrder(callback?: Function) {
        let param = {
            order_no: order_no
        }
        console.log("completeAdOrder param", param)
        Helper.PostHttp(COMPLETE_AD_ORDER_URI, null, param, (res) => {
            console.log("COMPLETE_AD_ORDER_URI res", res)
            if (res) {
                if (callback) {
                    User.UpdateItem(() => callback(res))
                } else {
                    if (res.code == "00000") {
                        if (res.award_list) {
                            let res1 = JSON.parse(res.award_list)
                            if (res1 && res1.err_code == 1) {
                                User.UpdateItem(() => UIMgr.OpenUI("component/Shop/GetAwardEntry", { param: { awards: res1.award_item } }))
                            }
                        }
                    }
                }
            }
        })
    }

    function checkShowAds(ad_aid: number, callback?: Function) {
        let ads: any = null
        let method: number[] = [] //0免费 1分享 2广告 默认2看广告

        let ad_config: any = DataMgr.getData(Constants.DATA_DEFINE.AD_CONFIG)
        console.log("jin---checkShowAds ad_config", ad_config)
        let adSources = null
        if (ad_config && ad_config.adText && ad_config.adText.ad_sources) {
            adSources = ad_config.adText.ad_sources
        }

        if (cc.sys.WECHAT_GAME === cc.sys.platform) {
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

        if (ads && ads.adId) {
            let adInfo: IAdInfo = {
                adPlugin: ads.adPlugin,
                adArea: 0,
                adType: EAdsType.ADS_TYPE_REWARTVIDEO,
                adId: ads.adId,
                adOid: order_no,
                adWidth: 0,
                adHeight: 0,
            }
            PluginMgr.showAds(adInfo)
        } else {
            callback && callback(order_no)
        }
    }
}