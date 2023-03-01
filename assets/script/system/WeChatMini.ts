import { DataMgr } from "../base/DataMgr";
import { Constants } from "../constants";
import { Helper } from "./Helper";
import { HttpMgr } from "../base/HttpMgr";

const GET_WX_OPENID = "mcbeam-authen-srv/auth/weChatMiniSessionKey"
const WX_PAY_URL = "tencentapp/intl/pay?pid={pid}&ticket={ticket}&boxid={boxid}&appid={appid}&openid={openid}&openkey={openkey}&pay_token={pay_token}&pf={pf}&pfkey={pfkey}&sessionId={sessionId}&sessionType={sessionType}&envFlag={envFlag}&sdkFlag={sdkFlag}"
const WX_PAY_SURE_URL = "tencentapp/midas/pay/sure?pid={pid}&ticket={ticket}&appid={appid}&openid={openid}&order={order}&offer_id={offer_id}&pf={pf}&envFlag={envFlag}"

let wx = window["wx"]

namespace WxWrapper {
	let mButtonInfo: any = null
	let mUserInfoButton: { [index: string]: any } = {}
	let mOpenSettingButton: any = null
	let mRewardedVideoAdData: any = { instance: null, error: null }
	let mInterstitialAdData: any = { instance: null, error: null }
	let mBannerAdData: any = { instance: null, error: null }
	let mWxValid: boolean = window["wx"] ? true : false
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
		mWxValid = cc.sys.WECHAT_GAME === cc.sys.platform	
		console.log("mWxValid", mWxValid)	
		if (mWxValid) {
			checkAppUpdate()
			showShareMenu(false)
			setKeepScreenOn(true)
			hideUserInfoButton()
			// initRewardedVideoAd()
			// initInterstitialAd()
			// initBannerAd()
			onWxEvent()
		}
	}

	function errorMsg(prefix, res, err, def?) {
		return prefix + ":" + (res ? (res.tips || res.msg) : (err || def || "unknown"))
	}

	export function login(callback, noOption?) {
		cc.log("===wechat login===")
		if (mWxValid) {
			cc.log("===wechat mWxValid===")
			code2Session(function (err, session) {
				if (err) {
					cc.log("===wechat code2Session===" + err)
					callback(err, null)
					return
				}

				cc.log("===wechat mWxValid===" + session.openid + " unionid " + session.unionid)

				let option = noOption ? null : wx.getLaunchOptionsSync()
				let query = option && (typeof option == "object") ? option.query : {}
				DataMgr.setData("WeChatQuery", query)

				let cb = (err, res) => {
					cc.log("===wx getUserInfo " + err)
					res = res || {}
					res.openid = session.openid
					res.unionid = session.unionid
					res.bindOpenId = query.openId && (query.openId != session.openid) ? query.openId : ""
					res.code = res && res.code ? res.code : ""
					res.rawdata = res && res.rawData ? res.rawData : ""
					res.signature = res && res.signature ? res.signature : ""
					// callback(err, res)
					callback(null, res)
				}

				getUserInfo(cb)
			})
		} else {
			callback && callback("wechat is not valid")
		}
	}

	function code2Session(callback, time: number = 0) {
		wx.login({
			success: function (res) {
				let param = {
					pn: DataMgr.Config.pn,
					gameGid: DataMgr.Config.gameId,
					jsCode: res.code,
				}
				let host = DataMgr.Config.hostname
				host = host.replace("igaoshou.", "mcbeam.")
				HttpMgr.post("https://" + host + "/" + GET_WX_OPENID, null, null, param, (res) => {
					if (res && res.openid) {
						callback(null, { openid: res.openid, unionid: res.unionid })
						return
					} else if (time < 2) {
						Helper.DelayFun(() => code2Session(callback, time + 1), .2)
					} else {
						let param = {
							confirmName: "退出",
							cancelName: "重试",
							cancel: callback,
							confirm: () => { cc.game.end() },
							param: { msg: "获取微信登录错误" }
						}
						Helper.OpenPopUI("component/Base/MsgEntry", "登录失败", param)
					}
					callback(res.err, null)
				})
			},
			fail: function (res) { callback(res.errMsg, null) },
		})
	}

	// scope.userInfo 用户信息授权
	export function checkUserScope(scope, callback) {
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
				callback(res.authSetting || {})
			}
		})
	}

	export function getUserInfo(callback) {
		if (mWxValid) {
			wx.getUserInfo({
				// openIdList: ["selfOpenId"],
				lang: "zh_CN",
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

							mUserInfoButton[name].onTap(function (res) {
								callback && callback(res)
							})
						}
					}
				}

				if (mUserInfoButton && mUserInfoButton[name]) {
					mUserInfoButton[name].show()
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
	export function checkAppUpdate() {
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

	export function payOrder(payInfo, callback) {
		if (mWxValid) {
			let makeOrder = function () {
				let param = {
					appid: DataMgr.Config.wxAPPID,
					boxid: payInfo.boxid,
					openkey: "",
					pay_token: "",
					pf: "",
					pfkey: "",
					sessionId: "",
					sessionType: "",
					envFlag: "",
					sdkFlag: "ysdk"
				}
				Helper.PostHttp(WX_PAY_URL, null, param, (res) => {
					if (res && res.ret == 0) {
						setBackToShowAd(false)
						payInfo.order = res.order
						requestMidasPayment(payInfo, callback)
					} else {
						callback({ ret: -201, tips: errorMsg("RequestOrderFailed", res, null) })
					}
				})
			}

			checkSession(function (valid) {
				valid ? makeOrder() : callback({ ret: -200, tips: "CheckSessionFailed" })
			})
		}
	}

	function requestMidasPayment(payInfo, callback) {
		wx.requestMidasPayment({
			mode: "game",
			env: 0, // 0正式 1沙箱
			offerId: DataMgr.Config.wxMIDASID,
			currencyType: "CNY",
			platform: "android",
			buyQuantity: payInfo.price,
			zoneId: "2", // 后台必须配置
			success: function (res) {
				let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
				let param = {
					appid: DataMgr.Config.wxAPPID,
					offer_id: DataMgr.Config.wxMIDASID,
					pid: user.userId,
					// ticket: user.userId,
					openid: user.openId,
					order: payInfo.order,
					pf: "android",
					envFlag: "office" // office正式 sandBox沙箱
				}
				Helper.PostHttp(WX_PAY_SURE_URL, null, param, () => { })
				callback({ ret: 0, tips: "Pay Success" })
			},
			fail: function (res) {
				callback({ ret: res.errCode, tips: res.errMsg })
			}
		})
	}

	function shareMessage(shareData) {
		let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
		shareData = shareData || {}

		shareData.query = shareData.query || {}

		if (shareData.withOpenId) {
			shareData.query.openId = user.openId
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
		if (mWxValid) {
			let data = shareMessage(param)
			wx.shareAppMessage(data)
			param.callback && (mOnShare = param.callback)
			param.callback && (mShareTime = Date.now() / 1000)
		} else {
			param.callback && param.callback()
		}
	}

	// wx.setClipboardData >= 1.1.0
	export function setClipboardData(data, callback) {
		if (mWxValid) {
			if (wx.setClipboardData) {
				wx.setClipboardData({
					data: data,
					success: function (res) {
						if (callback) callback(true)
					},
					fail: function (res) {
						if (callback) callback(false)
					}
				})
			} else {
				callback(false)
			}
		}
	}

	// wx.createRewardedVideoAd >= 2.0.4
	function initRewardedVideoAd() {
		let data = mRewardedVideoAdData
		if (!data.instance && wx.createRewardedVideoAd) {
			data.instance = wx.createRewardedVideoAd({ adUnitId: "adunit-efe436952d2ef6fc" })
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

	export function createRewardedVideoAd(unitid) {
		console.log("createRewardedVideoAd", unitid)
		if (!advertVideo[unitid]) {
			const advert = { instance: null, valid: true, callback: null }
			advert.instance = wx.createRewardedVideoAd({ adUnitId: unitid, multiton: true })

			advert.instance.onError((res) => {
				console.log("advert onError" + unitid, res)
				if (res && res.errCode) {
					Helper.OpenFootTip(unitid + "-" + res.errCode + res.errMsg)
				} else if (res && res.errMsg) {
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
				console.log("advert onClose" + unitid, res)
				if (advert.callback) {
					if (!res || res.isEnded) {
						advert.callback(0)
					} else {
						advert.callback(1)
					}
					advert.callback = null
				}
			})

			advertVideo[unitid] = advert
		}

		return advertVideo[unitid]
	}

	export function showRewardedVideoAd(adInfo, callback) {
		if (mWxValid) {
			let advert = createRewardedVideoAd(adInfo.adId)
			if (!advert.valid) {
				callback(2)
				return
			}

			advert.callback = callback

			//播放(1)失败--加载---播放 (2)成功
			advert.instance.show()
				.then(() => {
					console.log("jin---已经播放成功")//,unitid || AdvertUnitId.Video, unitid, AdvertUnitId.Video
					// wx.hideLoading()
				})
				.catch(err => {
					// console.log("jin---需要加载才能播放",unitid || AdvertUnitId.Video, unitid, AdvertUnitId.Video)
					wx.showLoading({ title: "加载中", mask: true })
					advert.instance.load()
						.then(() => {
							advert.instance.show()
								.then(wx.hideLoading)
								.catch((res) => {
									console.error("视频广告显示", res)
									wx.hideLoading()
								})
						})
						.catch(wx.hideLoading)
				})
		} else {
			callback(0, "视频广告播放完成")
		}
	}

	// wx.createInterstitialAd >= 2.6.0
	function initInterstitialAd() {
		let data = mInterstitialAdData
		if (!data.instance && wx.createInterstitialAd) {
			data.instance = wx.createInterstitialAd({
				adUnitId: 'adunit-5a57b7b03655a08b'
			})

			data.instance.onLoad(() => {
				data.error = null
				cc.log("插屏广告加载完成")
			})

			data.instance.onError((res) => {
				data.error = "插屏广告加载失败 " + res.errMsg
				cc.log("插屏广告加载失败", res.errMsg, res.errCode)
			})
		}
	}

	function showInterstitialAd() {
		let data = mInterstitialAdData
		if (data.instance && !data.error) {
			data.instance.show().catch((err) => {
				cc.log(err)
			})
		}
	}

	// wx.createBannerAd >= 2.0.4
	export function initBannerAd(adUnitId: string) {
		let data = mBannerAdData
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
				})
			}
		}
	}

	export function showBannerAd(callback?: Function) {
		if (mWxValid) {
			let data = mBannerAdData
			if (data.instance && !data.error) {
				data.instance.show()
				.then(() => {
					console.log("===ShowBannerAd===")
					callback && callback()
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
				data.instance.hide()
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

		let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
		wx.onShareAppMessage(function () {
			let titles = mShareConfig.titles
			let images = mShareConfig.images
			let query = "openId=" + user.openId

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
			if (mOnShare) {
				if ((Date.now() / 1000 - mShareTime) > 3) {
					mOnShare()
				} else {
					showModal("分享失败，请换个群试试。")
				}
				mOnShare = null
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

	export function navigateToMiniProgram(miniGameId: string, extraData: any = null) {
		if (mWxValid) {
			wx.navigateToMiniProgram({
				appId: miniGameId,
				path: null,
				// extraData: {
				//     foo: 'QMDDZ-AD-CLIENT'
				// },
				extraData: extraData,
				envVersion: 'release',
				success(res) {
					// cc.log("jin---navigateToMiniProgram success")
				},
				fail() {
					cc.log("jin---navigateToMiniProgram fail")
				}
			})
		}
	}
}

export default WxWrapper


// auth_info: {"plat_aid":2,"imei":"03855d05-b75e-4f5c-ace0-99086f4599bb","pn":"com.gaoshou.billiard","game_gid":"7d6f4675-fef4-b226-4d13-e0970e2a5ab4","device":"","auth_type":3,"metadata":"{\"errMsg\":\"getUserInfo:ok\",\"rawData\":\"{\\\"nickName\\\":\\\"Sonke\\\",\\\"gender\\\":1,\\\"language\\\":\\\"zh_CN\\\",\\\"city\\\":\\\"浦东新区\\\",\\\"province\\\":\\\"上海\\\",\\\"country\\\":\\\"中国\\\",\\\"avatarUrl\\\":\\\"https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLx6knCGlekuxibSbOAQTn1e5JuoFN6Agia06ic5icM1kwYhto8xOka4CzzwgjNAfRQEzD9Ewt9Hmyasg/132\\\"}\",\"userInfo\":{\"nickName\":\"Sonke\",\"gender\":1,\"language\":\"zh_CN\",\"city\":\"浦东新区\",\"province\":\"上海\",\"country\":\"中国\",\"avatarUrl\":\"https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLx6knCGlekuxibSbOAQTn1e5JuoFN6Agia06ic5icM1kwYhto8xOka4CzzwgjNAfRQEzD9Ewt9Hmyasg/132\"},\"signature\":\"98c9ba1d3c84691d9ed9b7dfff9d6919702a4b10\",\"encryptedData\":\"34zXFa0bDeIqKhIOfYqUdN05kNqi6OXuGOAVrvAA0BlTQuY/hXlZbzoPaURDr72mmX MDf8LLfF dDKHky8ZXEdj5QHk7Byru pGLf9oUe17yddakRQt7cXmEi3g5axJMGZMaQxb9zt nnHCdwyrBM2frxQ9DMiG7GPJXlk8tq8GXQ9OqCBW99xMCzTccCFwmsywKLjbQS9kNkrhegEu3/X4 qvXhwHaoSK5ZGieBu2PQBTtWIVWXchkWc9DDCSPSR/sydHcFz0 7j/XAUdm1TSilkvVpezKgATdI7h5Vu0faOdJjHPXCSE7WExLh69fGMRpKvzqaVff37XGKc03Q2TapbnNJqdhZfi8ZbvIWQhSHEmNAEPQHo7FD1FH/6m49r3hOzW2u6MTwYrrCLVFnVwwSHr3AHRGWRsdHQ48tQjq0U30MflXSW3wDcfRNm3qc6U2qTgSku4LYHm5/4R37OFVYDJ0lzRz37BfRjOHI6qj19yhL4J861xzy2719OmRYjtWjaatYeSvvGbPYhBZ/MrekETjMyF1JLMJP6mWXpc=\",\"iv\":\"92Hu6tsoYzTJYhsr9B/iDA==\",\"cloudID\":\"46_xfdrNJQu82wXb7UoifzXVDV5hCvfo0Au0-1hLR48a-a9_8-v7i8_OpNI0uc\",\"openid\":\"oGnvh4jQ528werkD2MumJ55SJ0G4\",\"bindOpenId\":\"\",\"code\":\"\",\"rawdata\":\"{\\\"nickName\\\":\\\"Sonke\\\",\\\"gender\\\":1,\\\"language\\\":\\\"zh_CN\\\",\\\"city\\\":\\\"浦东新区\\\",\\\"province\\\":\\\"上海\\\",\\\"country\\\":\\\"中国\\\",\\\"avatarUrl\\\":\\\"https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLx6knCGlekuxibSbOAQTn1e5JuoFN6Agia06ic5icM1kwYhto8xOka4CzzwgjNAfRQEzD9Ewt9Hmyasg/132\\\"}\",\"appid\":\"wx1fa2f9d9c35f0400\"}"}