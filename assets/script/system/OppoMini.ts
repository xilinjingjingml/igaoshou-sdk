import { DataMgr } from "../base/DataMgr";
import { Constants } from "../constants";
import { Helper } from "./Helper";
import { Account } from "./Account";
import { HttpMgr } from "../base/HttpMgr";

const GET_WX_OPENID = "mcbeam-authen-srv/auth/weChatMiniSessionKey"
const WX_PAY_URL = "tencentapp/intl/pay?pid={pid}&ticket={ticket}&boxid={boxid}&appid={appid}&openid={openid}&openkey={openkey}&pay_token={pay_token}&pf={pf}&pfkey={pfkey}&sessionId={sessionId}&sessionType={sessionType}&envFlag={envFlag}&sdkFlag={sdkFlag}"
const WX_PAY_SURE_URL = "tencentapp/midas/pay/sure?pid={pid}&ticket={ticket}&appid={appid}&openid={openid}&order={order}&offer_id={offer_id}&pf={pf}&envFlag={envFlag}"

let qg = window["qg"]

namespace OppoWrapper {
	let mButtonInfo: any = null
	let mUserInfoButton: { [index: string]: any } = {}
	let mOpenSettingButton: any = null
	let mRewardedVideoAdData: any = { instance: null, error: null }
	let mInterstitialAdData: any = { instance: null, error: null }
	let mBannerAdData: any = { instance: null, error: null }
	let mOppoValid: boolean = window["qg"] ? true : false
	let mOnShare: any = null
	let mShareTime: number = 0
	let mBackToShowAd: boolean = true
	let mShareConfig: any = {
		titles: ["好友来助攻，海量红包进来就领！", "玩游戏就送红包！这是你未玩过的全新版本！", "天降红包，你就是躺着领红包的人！"],
		images: ["static/share1.jpg", "static/share2.jpg"]
	}
	let advertVideo = {}
	const AdvertErr = [1000, 1003, 1004, 1005]

	export function init() {
		if (mOppoValid) {
		}
	}

	function errorMsg(prefix, res, err, def?) {
		return prefix + ":" + (res ? (res.tips || res.msg) : (err || def || "unknown"))
	}

	export function login(callback) {
		cc.log("===oppo login===")
		if (mOppoValid) {
			qg.login({
				success: function(res) {
					// Helper.OpenFootTip("oppo login success" + JSON.stringify(res.data))
					let data = {
						token : res.data.token,
						user_id : "",
					}
					callback(null, data)
				},
				fail: function(res) {
					callback(res.errMsg, null)
				}
			})
		} else {
			callback && callback("oppo is not valid")
		}
	}

	export function createRewardedVideoAd(unitid) {
		console.log("createRewardedVideoAd" , unitid)
		if (!advertVideo[unitid]) {
			const advert = { instance: null, valid: true, callback: null }
			advert.instance = qg.createRewardedVideoAd({ adUnitId: unitid})
	
			advert.instance.onError((res) => {
                console.error("视频广告" + unitid, res)
				if(res && res.errCode){
					Helper.OpenFootTip(unitid + "-" + res.errCode)
				}else if(res && res.errMsg){
					Helper.OpenFootTip(unitid + "-" + res.errMsg)
				}
				if (AdvertErr.indexOf(res.errCode) !== -1) {
                    advert.valid = false
                }

                if (advert.callback) {
                    advert.callback(2)
                    advert.callback = null
                }
            })

            advert.instance.onClose((res) => {
				console.log("createRewardedVideoAd onClose" , res)
                if (advert.callback) {
					if (!res || res.isEnded) {
                        advert.callback(0)
					} else {
                        advert.callback(1)
					}
                    advert.callback = null
				}
			})

			advert.instance.onLoad(()=>{
				console.log("advert.instance.onLoad")
				// advert.instance.show()
				// .then(qg.hideLoading)
				// .catch((res) => {
				// 	console.error("视频广告显示", res)
				// 	qg.hideLoading()
				// })
			})

            advertVideo[unitid] = advert
		}

		return advertVideo[unitid]
					}

	export function showRewardedVideoAd(adInfo ,callback) {
		if (mOppoValid) {
			let advert = createRewardedVideoAd(adInfo.adId)
			if (!advert.valid) {
                callback(2)
                return
			}

			advert.callback = callback

            // wx.showLoading({ title: "加载中", mask: true })

            //原逻辑：加载---播放
            // advert.instance.load()
            //     .then(() => {
            //         advert.instance.show()
            //             .then(wx.hideLoading)
            //             .catch((res) => {
            //                 console.error("视频广告显示", res)
            //                 wx.hideLoading()
            //             })
            //     })
            //     .catch(wx.hideLoading)

            //播放(1)失败--加载---播放 (2)成功
            // advert.instance.show()
            // .then(()=>{
            //     console.log("jin---已经播放成功")//,unitid || AdvertUnitId.Video, unitid, AdvertUnitId.Video
			// })
            // .catch(err =>{
                // console.log("jin---需要加载才能播放",unitid || AdvertUnitId.Video, unitid, AdvertUnitId.Video)
                qg.showLoading({ title: "加载中", mask: true })
                advert.instance.load()
					.then(() => {
						advert.instance.show()
							.then(qg.hideLoading)
							.catch((res) => {
								console.error("视频广告显示", res)
								qg.hideLoading()
				})
							})
					.catch(qg.hideLoading)
			// })
		} else {
			callback(0, "视频广告播放完成")
		}
	}
}

export default OppoWrapper


// auth_info: {"plat_aid":2,"imei":"03855d05-b75e-4f5c-ace0-99086f4599bb","pn":"com.gaoshou.billiard","game_gid":"7d6f4675-fef4-b226-4d13-e0970e2a5ab4","device":"","auth_type":3,"metadata":"{\"errMsg\":\"getUserInfo:ok\",\"rawData\":\"{\\\"nickName\\\":\\\"Sonke\\\",\\\"gender\\\":1,\\\"language\\\":\\\"zh_CN\\\",\\\"city\\\":\\\"浦东新区\\\",\\\"province\\\":\\\"上海\\\",\\\"country\\\":\\\"中国\\\",\\\"avatarUrl\\\":\\\"https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLx6knCGlekuxibSbOAQTn1e5JuoFN6Agia06ic5icM1kwYhto8xOka4CzzwgjNAfRQEzD9Ewt9Hmyasg/132\\\"}\",\"userInfo\":{\"nickName\":\"Sonke\",\"gender\":1,\"language\":\"zh_CN\",\"city\":\"浦东新区\",\"province\":\"上海\",\"country\":\"中国\",\"avatarUrl\":\"https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLx6knCGlekuxibSbOAQTn1e5JuoFN6Agia06ic5icM1kwYhto8xOka4CzzwgjNAfRQEzD9Ewt9Hmyasg/132\"},\"signature\":\"98c9ba1d3c84691d9ed9b7dfff9d6919702a4b10\",\"encryptedData\":\"34zXFa0bDeIqKhIOfYqUdN05kNqi6OXuGOAVrvAA0BlTQuY/hXlZbzoPaURDr72mmX MDf8LLfF dDKHky8ZXEdj5QHk7Byru pGLf9oUe17yddakRQt7cXmEi3g5axJMGZMaQxb9zt nnHCdwyrBM2frxQ9DMiG7GPJXlk8tq8GXQ9OqCBW99xMCzTccCFwmsywKLjbQS9kNkrhegEu3/X4 qvXhwHaoSK5ZGieBu2PQBTtWIVWXchkWc9DDCSPSR/sydHcFz0 7j/XAUdm1TSilkvVpezKgATdI7h5Vu0faOdJjHPXCSE7WExLh69fGMRpKvzqaVff37XGKc03Q2TapbnNJqdhZfi8ZbvIWQhSHEmNAEPQHo7FD1FH/6m49r3hOzW2u6MTwYrrCLVFnVwwSHr3AHRGWRsdHQ48tQjq0U30MflXSW3wDcfRNm3qc6U2qTgSku4LYHm5/4R37OFVYDJ0lzRz37BfRjOHI6qj19yhL4J861xzy2719OmRYjtWjaatYeSvvGbPYhBZ/MrekETjMyF1JLMJP6mWXpc=\",\"iv\":\"92Hu6tsoYzTJYhsr9B/iDA==\",\"cloudID\":\"46_xfdrNJQu82wXb7UoifzXVDV5hCvfo0Au0-1hLR48a-a9_8-v7i8_OpNI0uc\",\"openid\":\"oGnvh4jQ528werkD2MumJ55SJ0G4\",\"bindOpenId\":\"\",\"code\":\"\",\"rawdata\":\"{\\\"nickName\\\":\\\"Sonke\\\",\\\"gender\\\":1,\\\"language\\\":\\\"zh_CN\\\",\\\"city\\\":\\\"浦东新区\\\",\\\"province\\\":\\\"上海\\\",\\\"country\\\":\\\"中国\\\",\\\"avatarUrl\\\":\\\"https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLx6knCGlekuxibSbOAQTn1e5JuoFN6Agia06ic5icM1kwYhto8xOka4CzzwgjNAfRQEzD9Ewt9Hmyasg/132\\\"}\",\"appid\":\"wx1fa2f9d9c35f0400\"}"}