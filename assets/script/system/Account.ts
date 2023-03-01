import { Constants } from "../constants";
import { DataMgr } from "../base/DataMgr";
import { Helper } from "./Helper";
import { PushSvr } from "./PushSvr";
import { HttpMgr } from "../base/HttpMgr";
import { PluginMgr } from "../base/PluginMgr";
import WxWrapper from "./WeChatMini";
import OppoWrapper from "./OppoMini";
import VivoWrapper from "./VivoMini"
import { MatchSvr } from "./MatchSvr";
import { GateMgr } from "../base/GateMgr";
import { EventMgr } from "../base/EventMgr"
import { User } from "./User";
import { UIMgr } from "../base/UIMgr";
import ByteDanceWrapper from "./ByteDanceMini";
import { LocalMgr } from "../base/LocalMgr";

//https://igaoshou.mcbeam.cc/igaoshou-lobby/lobby/login?auth_method=AccountLogin&gameId=test&auth_info={\"imei\":\"igaoshou-jafjas\",\"mid\":100,\"pn\":\"test)\", \"auth_type\":1}

let _callback: Function = null

const GUEST_LOGIN = "igaoshou-lobby-srv/lobby/login"//?token={token}&auth_method=AccountLogin&auth_info={auth_info}"
const REFRESH_TOKEN = "igaoshou-lobby-srv/lobby/refreshToken"
const GET_PHONE_CODE = "mcbeam-authen-srv/Auth/sendPhoneCode"
const SEND_EMAIL = "mcbeam-authen-srv/Auth/sendEmail"
const UPDATE_ACCOUNT_INFO = "mcbeam-authen-srv/Auth/UpdateAccountInfo"

const REPROT_PROBLEAM = "mcbeam-authen-srv/User/ReportProblem"
const LOAD_REPORT = "mcbeam-authen-srv/User/LoadReport"

const enum AUTH_TYPE {
    GUEST_LOGIN = 1,
    PHONE_LOGIN,
    WECHAT_LOGIN,
    HUAWEI_LOGIN,
    EMAIL_LOGIN,
    BYTEDANCE_LOGIN = 6,
    OPPO_LOGIN = 7,
    VIVO_LOGIN = 11,
}

export namespace Account {
    export function login(authInfo: any | Function, callback?: Function | boolean, refresh: boolean = false) {
        if (typeof callback === "boolean") {
            refresh = callback
            callback = null
        }
        if (typeof callback !== "function" && typeof authInfo === "function") {
            callback = authInfo
            authInfo = null
        }

        if (typeof callback === "function") {
            _callback = callback
        }

        let lastAccount = DataMgr.getData<number>(Constants.DATA_DEFINE.LAST_ACCOUNT)
        console.log("jin---lastAccount: ", lastAccount)
        if (!authInfo) {
            if (lastAccount) {
                authInfo = {
                    authType: lastAccount
                }
            } else if (Helper.isNative()) {
                let token = DataMgr.getData<IOpenId>(Helper.GetTokenDataKey()) || {}
                if (token.token) {
                    _loginGuest(authInfo)
                } else {
                    if (PluginMgr.getPluginListByType(5).length == 0) {
                        _loginGuest(authInfo)
                    } else {
                        if (!UIMgr.FindUI("component/Personal/SessionPop")) {
                            UIMgr.OpenUI("component/Personal/SessionPop", { param: {} })
                        }
                    }
                }
                return
            } else if (cc.sys.platform === cc.sys.WECHAT_GAME) {
                authInfo = {
                    authType: Constants.LOGIN_TYPE.LOGIN_WECHAT
                }
            } else if (cc.sys.platform === cc.sys.OPPO_GAME) {
                authInfo = {
                    authType: Constants.LOGIN_TYPE.LOGIN_OPPO
                }
            } else if (cc.sys.platform === cc.sys.BYTEDANCE_GAME) {
                authInfo = {
                    authType: Constants.LOGIN_TYPE.LOGIN_BYTEDANCE
                }
            } else if (cc.sys.platform === cc.sys.VIVO_GAME) {
                authInfo = {
                    authType: Constants.LOGIN_TYPE.LOGIN_VIVO
                }
            } else {
                authInfo = {
                    authType: Constants.LOGIN_TYPE.LOGIN_GUSET
                }
            }
        }

        // _callback = callback

        // if (refresh) {
        // _refreshToken(authInfo)
        // } else 
        if (authInfo.authType === Constants.LOGIN_TYPE.LOGIN_GUSET) {
            _loginWithPlugin(authInfo)
        } else if (authInfo.authType === Constants.LOGIN_TYPE.BING_PHONE) {
            _bindPhone(authInfo)
        } else if (authInfo.authType === Constants.LOGIN_TYPE.LOGIN_PHONE) {
            _loginPhone(authInfo)
        } else if (authInfo.authType === Constants.LOGIN_TYPE.BIND_EMAIL) {
            _bindEmail(authInfo)
        } else if (authInfo.authType === Constants.LOGIN_TYPE.LOGIN_EMAIL) {
            _loginEmail(authInfo)
        } else if (authInfo.authType === Constants.LOGIN_TYPE.BIND_WEIXIN) {
            _bindWeChat(authInfo)
        } else if (authInfo.authType === Constants.LOGIN_TYPE.LOGIN_WECHAT) {
            _loginWeChat(authInfo)
        } else if (authInfo.authType === Constants.LOGIN_TYPE.LOGIN_HUAWEI) {

        } else if (authInfo.authType === Constants.LOGIN_TYPE.LOGIN_DEFAULT) {
            _loginAny(authInfo)
        } else if (authInfo.authType === Constants.LOGIN_TYPE.LOGIN_OPPO) {
            _loginOppoGame(authInfo)
        } else if (authInfo.authType === Constants.LOGIN_TYPE.LOGIN_VIVO) {
            _loginVivoGame(authInfo)
        } else if (authInfo.authType === Constants.LOGIN_TYPE.LOGIN_BYTEDANCE) {
            _loginByteDance(authInfo)
        } else {
            _loginGuest(authInfo)
        }
    }

    function _loginErrMsg(msg, callback) {
        let running = DataMgr.getData<boolean>(Constants.DATA_DEFINE.GAME_RUNNING)
        if (running) {
            cc.warn("===login err " + msg + "! current game is running")
            return
        }
        let param = {
            confirmName: "退出",
            cancelName: "重试",
            cancel: callback,
            confirm: () => { cc.game.end() },
            param: { msg: msg }
        }
        Helper.OpenPopUI("component/Base/MsgEntry", "登录失败", param)
    }

    function _loginTipMsg(title, msg) {
        let param = {
            buttons: 1,
            cancelName: "退出",
            param: { msg: msg }
        }
        Helper.OpenPopUI("component/Base/MsgEntry", title, param)
    }

    export function _loginReq(param, relogin: boolean = true) {
        // let func = (areaInfo: string) => {
        cc.log("_loginReq")
        let url = "https://" + DataMgr.Config.hostname + "/" + GUEST_LOGIN
        let loginBody = {}

        let version = DataMgr.getData<string>("ver")
        if (version !== Constants.version) {
            param.token = null
        }

        if (param.auth_info && param.auth_info.metadata && param.auth_info.metadata.isBind === 1) {
            loginBody["auth_info"] = param.auth_info
            loginBody["auth_method"] = param.auth_method
            loginBody["token"] = param.token
        } else if (param.token) {
            loginBody["token"] = param.token
        } else {
            loginBody["auth_info"] = param.auth_info
            loginBody["auth_method"] = param.auth_method
        }

        if (loginBody["auth_info"] && typeof loginBody["auth_info"].metadata === "object") {
            loginBody["auth_info"].metadata = JSON.stringify(loginBody["auth_info"].metadata)
        }

        // if (loginBody["autn_info"]) {
        //     loginBody["autn_info"]["area_info"] = areaInfo
        // }

        Helper.reportEvent("平台初始化", "login登录", "请求")
        HttpMgr.post(url, null, null, loginBody, (res) => {
            cc.log("jin---平台",res, loginBody)
            if (res && !res.Code && !res.err) {
                Helper.reportEvent("平台初始化", "login登录", "成功")
                //TODO 存account
                let histroyAccount = DataMgr.getData<IHISTROY_ACCOUNT_INFO>(Constants.DATA_DEFINE.HISTROY_ACCOUNT)
                let account = ""
                let password = ""
                let email = ""
                let phone = ""
                let facebook = ""
                let apple = ""
                let headImage = res.headimage
                if(res.metadata.guest){
                    let guest = res.metadata.guest
                    let tmpArr = guest.split("|")
                    console.log("jin---tmp: ", tmpArr)
                    account = tmpArr[0]
                    password = tmpArr[1]
                    email = res.metadata.email
                    phone = res.metadata.phone
                }
                if(param && param.auth_info.metadata && param.auth_info.metadata.account){
                    account = param.auth_info.metadata.account
                    password = param.auth_info.metadata.password
                }   
                
                console.log("jin---histroyAccount: ", histroyAccount, param)
                // DataMgr.setData<IHISTROY_ACCOUNT_INFO>(Constants.DATA_DEFINE.HISTROY_ACCOUNT, null, true)
                if(!histroyAccount){
                    
                    let self: IHISTROY_ACCOUNT_INFO = {
                        history_account:[
                            {
                            account: account,
                            password: password,
                            headImage: headImage,
                            email: email,
                            phone: phone,
                            facebook: facebook,
                            apple: apple
                                }
                        ]
                    }
                    DataMgr.setData<IHISTROY_ACCOUNT_INFO>(Constants.DATA_DEFINE.HISTROY_ACCOUNT, self, true)
                    let sss = DataMgr.getData<IHISTROY_ACCOUNT_INFO>(Constants.DATA_DEFINE.HISTROY_ACCOUNT)
                    console.log("jin---sss: ", sss)
                }else{
                    let save: boolean = true
                        if(histroyAccount){
                            for(let curAccount of histroyAccount.history_account){
                                if(curAccount.account === account){
                                    save = false
                                    console.log("jin---遇到相同数据")
                                    curAccount.account = account
                                    curAccount.password = password
                                    curAccount.headImage = headImage
                                    curAccount.email = email
                                    curAccount.phone = phone
                                    curAccount.facebook = facebook
                                    curAccount.apple = apple

                                }
                            }
                            if(save && account && password){
                                histroyAccount.history_account.push(
                                    {
                                        account: account,
                                        password: password,
                                        headImage: headImage,
                                        email: email,
                                        phone: phone,
                                        facebook: facebook,
                                        apple: apple
                                    }
                                )
                                
                            }
                            DataMgr.setData<IHISTROY_ACCOUNT_INFO>(Constants.DATA_DEFINE.HISTROY_ACCOUNT, histroyAccount, true)
                    }
                   
                }

                console.log("jin---param: ", param,res)
                if (param && param.auth_info && param.auth_info.metadata && param.auth_info.metadata.isBind) {
                    _onBind(res)
                } else {
                    _onLogin(res)
                }

                DataMgr.setData(Constants.DATA_DEFINE.LAST_ACCOUNT, param["auth_info"].auth_type)

                EventMgr.dispatchEvent(Constants.EVENT_DEFINE.LOGIN_SUCCESS)
                return
            }

            if (res && (res.Code === 500 || res.Code === 400 || res.Code === 403)) {
                if (res.Detail === "invalid user token provided" && relogin) {
                    param["token"] = null
                    _loginReq(param, false)
                    return
                } else if (res.Detail === "bad request overtime 5s") {
                    param["token"] = null
                    _loginReq(param, false)
                    return
                }

                if (param && param.auth_info && param.auth_info.metadata && param.auth_info.metadata.isBind) {
                    _loginTipMsg("绑定失败", "绑定失败, 请稍后再试!")
                }else {
                    _loginErrMsg("登录失败, 请您稍后再试!", () => _loginReq(param))
                }
                return
            }

            if (res && res.err) {
                cc.warn(res.err)
                let errInfo = res.err
                res.err = Helper.ParseJson(res.err)
                if (res.err.detail === "invalid token" || res.err.detail === "invalid user token provided") {
                    param["token"] = null
                    if (relogin) {
                        _loginReq(param, false)
                    } else {
                        _loginErrMsg("登录失败, 请您稍后再试!", () => _loginReq(param))
                    }
                    return
                } else if (res.err.detail && res.err.detail.indexOf("account is exists") !== -1) {
                    if (param.auth_info.auth_type === AUTH_TYPE.PHONE_LOGIN) {
                        _loginTipMsg("绑定失败", "您所绑定手机号码已存在")
                    } else if (param.auth_info.auth_type === AUTH_TYPE.EMAIL_LOGIN) {
                        _loginTipMsg("绑定失败", "您所绑定邮箱已存在")
                    } else if (param.auth_info.auth_type === AUTH_TYPE.WECHAT_LOGIN) {
                        _loginTipMsg("绑定失败", "该微信已绑定过账号")
                    }
                    return
                } else if (res.err.detail && res.err.detail.indexOf("code expire") !== -1) {
                    _loginTipMsg("绑定失败", LocalMgr.GetMessage("Phone_1011"))
                    return
                } else if(res.err.detail && res.err.detail === "account or password is error"){
                        // _loginTipMsg("登录失败", "account or password is error!")
                        _loginErrMsg(LocalMgr.GetMessage("Login_1008"), () => _loginReq(param))
                        return
                } 

                let msg = "登录失败, 请您稍后再试! \n" + errInfo
                if (res.err === "timeout") {
                    msg = "登录超时, 请检测您的网络!"
                }
                _loginErrMsg(msg, () => _loginReq(param))
                return
            }
        })
        // }

        // Helper.getIPLocation(func)
    }

    export function _loginGuest(authInfo: any, callback?: Function) {
        // let login = (areaInfo: string) => {
        let token = DataMgr.getData<IOpenId>(Helper.GetTokenDataKey()) || {}
        console.log("jin---token: ", token ,Helper.GetTokenDataKey())
        let param = {
        }
        if(authInfo.metadata && !authInfo.metadata.loginOtherAccount){
           param["token"] = token.token 
        }
        param["auth_method"] = "AccountLogin"
        param["auth_info"] = {
            plat_aid: DataMgr.Config.platId,
            imei: Helper.GetURI("imei") || Helper.UUID(),//token.account,
            pn: DataMgr.Config.pn,
            game_gid: DataMgr.Config.gameId,
            device: "",
            auth_type: AUTH_TYPE.GUEST_LOGIN,
            // area_info: areaInfo,
            metadata: {},
        }
        if (token && token.account && token.key) {
            param["auth_info"]["metadata"] = {
                account: token.account,
                password: token.key
            }
        }
        if (authInfo && authInfo.metadata) {
            param["auth_info"].metadata = authInfo.metadata
        }
        _loginReq(param)
        // }

        // Helper.getIPLocation(login)
    }

    function _bindPhone(authInfo: any) {
        let token = DataMgr.getData<IOpenId>(Helper.GetTokenDataKey()) || {}
        let param = {
            auth_info: {
                plat_aid: DataMgr.Config.platId,
                imei: Helper.GetURI("imei") || Helper.UUID(),//token.account,
                pn: DataMgr.Config.pn,
                game_gid: DataMgr.Config.gameId,
                device: "",
                auth_type: AUTH_TYPE.PHONE_LOGIN,
                metadata: {
                    isBind: 1,
                    password: authInfo.password || "",
                    phone: authInfo.phone,
                    phone_code: authInfo.code,
                    /**
                     * phone_type  0：国内 1：国际
                    */
                    phone_type: 0
                },
            },
            auth_method: "AccountLogin"
        }

        if (DataMgr.Config.env === 2) {
            param.auth_info.metadata["phone_type"] = 1
        }

        if (token && token.token) {
            param["token"] = token.token
        }
        _loginReq(param)
    }

    export function _loginPhone(authInfo: any) {
        let param = {
            auth_info: {
                plat_aid: DataMgr.Config.platId,
                imei: Helper.GetURI("imei") || Helper.UUID(),//token.account,
                pn: DataMgr.Config.pn,
                game_gid: DataMgr.Config.gameId,
                device: "",
                auth_type: AUTH_TYPE.PHONE_LOGIN,
                metadata: {
                    password: authInfo.password || "",
                    phone: authInfo.phone,
                    phone_code: authInfo.code,
                    phone_type: 0,//0:国内 1:国际
                }
            },
            auth_method: "AccountLogin"
        }

        if (DataMgr.Config.env !== 2) {//国外 手机只需要手机号、密码登陆
            // param.auth_info.metadata.phone_type = 1 //TODOT 
            if (authInfo.code == null || authInfo.code.length == 0) {
                param.auth_info.metadata["account"] = authInfo.phone
            }
        }else{
            //密码登录account=authInfo.phone
            if (authInfo.password.length > 0 && (authInfo.code == null || authInfo.code.length == 0)) {
                param.auth_info.metadata["account"] = authInfo.phone
            }
        }

        
        _loginReq(param)
    }

    function _bindEmail(authInfo: any) {
        let token = DataMgr.getData<IOpenId>(Helper.GetTokenDataKey()) || {}
        let param = {
            auth_info: {
                plat_aid: DataMgr.Config.platId,
                imei: Helper.GetURI("imei") || Helper.UUID(),//token.account,
                pn: DataMgr.Config.pn,
                game_gid: DataMgr.Config.gameId,
                device: "",
                auth_type: AUTH_TYPE.EMAIL_LOGIN,
                metadata: {
                    isBind: 1,
                    account: authInfo.email || "",
                    password: authInfo.password || "",
                },
            },
            auth_method: "AccountLogin"
        }
        if (token && token.token) {
            param["token"] = token.token
        }
        _loginReq(param)
    }

    function _loginEmail(authInfo: any) {
        let token = DataMgr.getData<IOpenId>(Helper.GetTokenDataKey()) || {}
        let param = {
            auth_info: {
                plat_aid: DataMgr.Config.platId,
                imei: Helper.GetURI("imei") || Helper.UUID(),//token.account,
                pn: DataMgr.Config.pn,
                game_gid: DataMgr.Config.gameId,
                device: "",
                auth_type: AUTH_TYPE.EMAIL_LOGIN,
                metadata: {
                    account: authInfo.email || "",
                    password: authInfo.password || "",
                }
            },
            auth_method: "AccountLogin"
        }
        _loginReq(param)
    }

    function _loginWithPlugin(authInfo: any) {
        if (!PluginMgr.login(authInfo)) {
            console.log("jin--其他方式登陆",authInfo)
            _loginGuest(authInfo)
            return
        }

        // _loginReq(param)
    }

    function _bindWeChat(authInfo: any) {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            Helper.reportEvent("平台初始化", "微信登录", "登录")
            WxWrapper.login((err, res) => {
                if (err) {
                    cc.warn(err)
                    Helper.reportEvent("平台初始化", "微信登录", "失败" + err)
                    return
                }

                Helper.reportEvent("平台初始化", "微信登录", "成功")

                let token = DataMgr.getData<IOpenId>(Helper.GetTokenDataKey()) || {}

                res = res || {}
                res.isBind = 1
                res.appid = DataMgr.Config.wxAPPID

                let param = {}
                param["token"] = token.token
                param["auth_method"] = "AccountLogin"
                param["auth_info"] = {
                    plat_aid: DataMgr.Config.platId,
                    imei: Helper.GetURI("imei") || Helper.UUID(),
                    pn: DataMgr.Config.pn,
                    game_gid: DataMgr.Config.gameId,
                    device: "",
                    auth_type: AUTH_TYPE.WECHAT_LOGIN,
                    metadata: res,
                }

                if (token && token.account && token.key) {
                    param["auth_info"]["metadata"] = {
                        account: token.account,
                        password: token.key
                    }
                }
                if (authInfo && authInfo.metadata) {
                    param["auth_info"].metadata = authInfo.metadata
                }

                _loginReq(param)
            }, true)
        }
    }

    function _loginWeChat(authInfo: any) {
        Helper.reportEvent("平台初始化", "微信登录", "登录")
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            WxWrapper.login((err, res) => {
                console.log("err " + err)
                if (err) {
                    cc.warn(err)
                    Helper.reportEvent("平台初始化", "微信登录", "失败" + err)
                    _loginErrMsg(err, () => {
                        _loginWeChat(authInfo)
                    })
                    return
                }

                Helper.reportEvent("平台初始化", "微信登录", "成功")

                // cc.log("_loginWeChat")
                // cc.log(res)

                let token = DataMgr.getData<IOpenId>(Helper.GetTokenDataKey()) || {}

                res = res || {}
                res.appid = DataMgr.Config.wxAPPID

                let param = {}
                if (!authInfo.relogin) {
                    param["token"] = token.token
                }
                param["auth_method"] = "AccountLogin"
                param["auth_info"] = {
                    plat_aid: DataMgr.Config.platId,
                    imei: Helper.GetURI("imei") || Helper.UUID(),
                    pn: DataMgr.Config.pn,
                    game_gid: DataMgr.Config.gameId,
                    device: "",
                    auth_type: AUTH_TYPE.WECHAT_LOGIN,
                    metadata: res,
                }

                if (authInfo && authInfo.metadata) {
                    param["auth_info"].metadata = authInfo.metadata
                }

                _loginReq(param)
            })

        } else {
            _loginGuest(authInfo)
        }
    }

    function _loginOppoGame(authInfo: any) {
        if (cc.sys.platform === cc.sys.OPPO_GAME) {
            OppoWrapper.login((err, res) => {
                cc.log("err " + err)
                if (err) {
                    cc.warn(err)
                }

                let token = DataMgr.getData<IOpenId>(Helper.GetTokenDataKey()) || {}

                res = res || {}

                let param = {}
                param["token"] = ""
                if (!authInfo.relogin) {
                    param["token"] = token.token
                }
                param["auth_method"] = "AccountLogin"
                param["auth_info"] = {
                    plat_aid: DataMgr.Config.platId,
                    imei: Helper.GetURI("imei") || Helper.UUID(),
                    pn: DataMgr.Config.pn,
                    game_gid: DataMgr.Config.gameId,
                    device: "",
                    auth_type: AUTH_TYPE.OPPO_LOGIN,
                    metadata: res,
                }

                if (authInfo && authInfo.metadata) {
                    param["auth_info"].metadata = authInfo.metadata
                }

                _loginReq(param)
            })

        } else {
            _loginGuest(authInfo)
        }
    }

    function _loginVivoGame(authInfo: any) {
        console.log("===_loginVivoGame===")
        if (cc.sys.platform === cc.sys.VIVO_GAME) {
            VivoWrapper.login((err, res) => {
                cc.log("err " + err)
                if (err) {
                    cc.warn(err)
                }

                let token = DataMgr.getData<IOpenId>(Helper.GetTokenDataKey()) || {}

                res = res || {}

                let param = {}
                param["token"] = ""
                if (!authInfo.relogin) {
                    param["token"] = token.token
                }
                param["auth_method"] = "AccountLogin"
                param["auth_info"] = {
                    plat_aid: DataMgr.Config.platId,
                    imei: Helper.GetURI("imei") || Helper.UUID(),
                    pn: DataMgr.Config.pn,
                    game_gid: DataMgr.Config.gameId,
                    device: "",
                    auth_type: AUTH_TYPE.VIVO_LOGIN,
                    metadata: res,
                }

                if (authInfo && authInfo.metadata) {
                    param["auth_info"].metadata = authInfo.metadata
                }

                _loginReq(param)
            })

        } else {
            _loginGuest(authInfo)
        }
    }

    function _loginByteDance(authInfo: any) {
        console.log("_loginByteDance")
        if (cc.sys.platform === cc.sys.BYTEDANCE_GAME) {
            ByteDanceWrapper.login((err, res) => {
                console.log("_loginByteDance err " + err)
                if (err) {
                    cc.warn(err)
                    Helper.reportEvent("平台初始化", "字节登录", "失败" + err)
                    _loginErrMsg(err, () => {
                        _loginByteDance(authInfo)
                    })
                    return
                }

                Helper.reportEvent("平台初始化", "字节登录", "成功")

                // cc.log("_loginWeChat")
                // cc.log(res)

                let token = DataMgr.getData<IOpenId>(Helper.GetTokenDataKey()) || {}

                res = res || {}
                let param = {}
                if (!authInfo.relogin) {
                    param["token"] = token.token
                }
                param["auth_method"] = "AccountLogin"
                param["auth_info"] = {
                    plat_aid: DataMgr.Config.platId,
                    imei: Helper.GetURI("imei") || Helper.UUID(),
                    pn: DataMgr.Config.pn,
                    game_gid: DataMgr.Config.gameId,
                    device: "",
                    auth_type: AUTH_TYPE.BYTEDANCE_LOGIN,
                    metadata: res,
                }

                if (authInfo && authInfo.metadata) {
                    param["auth_info"].metadata = authInfo.metadata
                }

                _loginReq(param)
            })
        } else {
            _loginGuest(authInfo)
        }
    }

    function _loginAny(authInfo: any) {
        let token = DataMgr.getData<IOpenId>(Helper.GetTokenDataKey()) || {}
        let param = {
            auth_info: {
                plat_aid: DataMgr.Config.platId,
                imei: Helper.GetURI("imei") || Helper.UUID(),//token.account,
                pn: DataMgr.Config.pn,
                game_gid: DataMgr.Config.gameId,
                device: "",
                auth_type: "",
                metadata: authInfo
            },
            auth_method: "AccountLogin"
        }
        if (token && token.token && !authInfo.relogin) {
            param["token"] = token.token
        }
        _loginReq(param)
    }

    export function RefreshToken(callback?: Function) {
        // let login = (areaInfo: string) => {
        let token = DataMgr.getData<IOpenId>(Helper.GetTokenDataKey()) || {}
        let param = {
        }

        param["auth_method"] = "AccountLogin"
        param["auth_info"] = {
            plat_aid: DataMgr.Config.platId,
            imei: Helper.GetURI("imei") || Helper.UUID(),//token.account,
            pn: DataMgr.Config.pn,
            game_gid: DataMgr.Config.gameId,
            device: "",
            auth_type: DataMgr.getData<number>(Constants.DATA_DEFINE.LAST_ACCOUNT) || AUTH_TYPE.GUEST_LOGIN,
            metadata: {},
        }
        if (token && token.account && token.key) {
            param["auth_info"]["metadata"] = {
                account: token.account,
                password: token.key
            }
        }
        // if (param["auth_info"].metadata) {
        //     param["auth_info"].metadata = "\"" + JSON.stringify(param["auth_info"].metadata) + "\""
        // }

        let url = "https://" + DataMgr.Config.hostname + "/" + REFRESH_TOKEN
        HttpMgr.post(url, null, null, param, (res) => {
            if (res && !res.err && res.Code !== 500 && res.Code !== 400 && res.Code !== 401 && res.Code !== 403) {
                let token = DataMgr.getData<IOpenId>(Helper.GetTokenDataKey())
                if (token) {
                    token.token = res.token
                    DataMgr.setData(Helper.GetTokenDataKey(), token, true)
                }
                callback && callback()
            }
        })
        // }

        // Helper.getIPLocation(login)
    }

    function _onLogin(data: any) {
        if (!data) {
            cc.warn("Login data is null")
            return
        }

        // let user = 
        _initUserInfo(data)

        LoginRspHandler(data)

        let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        if (user.region === "") {
            User.GetPlyDetail()
        }
    }

    function _onBind(data: any) {
        if (!data) {
            cc.warn("Login data is null")
            return
        }

        // let user = 
        _initUserInfo(data)
        // DataMgr.setData(Constants.DATA_DEFINE.USER_INFO, user)

        _callback && _callback(data)
        _callback = null
    }

    function _initUserInfo(data) {
        Helper.reportEvent("平台初始化", "初始化用户", "初始化")
        let player: IPlayerData = {
            userName: data.nickname || "",
            userId: data.openid || 0,
            avatar: data.headimage || "",
            region: data.region || "",
            openId: data.openid || 0,
            joinTime: data.join_time || 0,
            regTime: data.reg_time || 0,
            userLife: Math.floor((Date.now() / 1000 - data.reg_time) / 86400),
            lottery: Number(data.ticket_z || 0),
            wcoin: Number(data.score || 0),
            diamond: Number(data.cash || 0),
            items: [
                { id: Constants.ITEM_INDEX.WCOIN, num: 0 },
                { id: Constants.ITEM_INDEX.LOTTERY, num: 0 },
                { id: Constants.ITEM_INDEX.DIAMOND, num: 0 },
            ],
            histroy: {
                playGame: Number(data.game_round_count) || 0,
                allGame: Number(data.game_count) || 0,
                platGame: Number(data.plat_game_count) || 0,
                winCon: 0,
                winNum: 0,
                records: [],
            },
            levels: _initLevelInfo(data),
            metaData: {},
            newbie: data.newbie || false,
        }

        if (null !== data.plat_game_count && undefined !== data.plat_game_count) {
            player.newbie = data.plat_game_count < 3
        }

        let c = 0

        if (data && data.item_list) {
            for (let i of data.item_list) {
                let id = i.id || 0
                player.items[id] = {
                    id: id,
                    num: Number(i.num || 0),
                    expireAt: Number(i.expire_at || 0)
                }

                if (id === Constants.ITEM_INDEX.DIAMOND) {
                    player.items[id].num
                }

                c += player.items[id].num
            }
        }

        if (c === 0) {
            Helper.reportEvent("账号疑似错误", "OpenId", player.openId)
        }

        if (data && data.metadata) {
            for (let key in data.metadata) {
                player.metaData[key] = data.metadata[key]
            }
        }

        // return player
        DataMgr.setData(Constants.DATA_DEFINE.USER_INFO, player)
        MatchSvr.UpdateMatch()
        // User.GetPlyDetail()

        Helper.reportEvent("平台初始化", "初始化用户", "完成")
    }

    function _initLevelInfo(data): TLevels {
        let levels: TLevels = {}
        levels["igaoshou"] = {
            type: "igaoshou",
            name: "平台等级",
            icon: "",
            lv: data.plat_level || 0,
            exp: data.plat_exp || 0,
            maxExp: data.max_plat_exp || 0,
        }

        levels[DataMgr.Config.gameId] = {
            type: DataMgr.Config.gameId,
            name: DataMgr.Config.gameName,
            icon: "",
            lv: data.level || 0,
            exp: data.exp || 0,
            maxExp: data.max_exp || 0,
        }

        return levels
    }

    export function onSessionResult(data: string) {
        let param = JSON.parse(data)
        _loginReq(param)
        // _onLogin(JSON.parse(data))
    }

    export function LoginRspHandler(data) {
        Helper.reportEvent("平台初始化", "loginRsp", "开始")
        // cc.log(data)

        PushSvr.Register()
        Helper.reportEvent("平台初始化", "loginRsp", "register push svr")

        // 记录token        
        let token = DataMgr.getData<IOpenId>(Helper.GetTokenDataKey()) || {}
        token.token = data.token
        token.openid = data.openid
        token.newbie = data.newbie
        if (data.metadata) {
            // 处理游客账号
            if (data.metadata.guest) {
                let v = (data.metadata.guest as string).split("|")
                token.account = v[0] || token.account
                token.key = v[1] || token.key
            }
        }
        DataMgr.setData(Helper.GetTokenDataKey(), token, true)
        DataMgr.setData("ver", Constants.version, true)

        if (data.server_time) {
            Helper.setServerTime(Number(data.server_time))
        }

        Helper.reportEvent("平台初始化", "loginRsp", "完成")
        _callback && _callback(data)
        _callback = null
    }

    //**********************
    // 其他auth接口

    export function getPhoneCode(phone: string, callback?: Function) {
        let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        let param = {
            uuid: user && user.userId || "",
            phone: phone,
            phone_type: 0,//0:国内 1:国际
        }
        if (DataMgr.Config.env === 2) {
            param.phone_type = 1
        }
        // HttpMgr.post(url, null, null, param, (res) => {
        Helper.PostHttp(GET_PHONE_CODE, null, param, (res) => {
            console.log("jin---GET_PHONE_CODE: ", res)
            if(res.msg === "text/voice sms hits the delivery frequency limit policy"){
                Helper.OpenTip("text/voice sms hits the delivery frequency limit policy")
                callback && callback(false)
                return
            }
            if (!res || res.err) {
                cc.warn("获取验证码失败")
                callback && callback(false)
                return
            }
            DataMgr.setData(Constants.DATA_DEFINE.PHONE_CODE_TIME, Date.now() + 60000)
            // let param = {
            //     buttons: 1,
            //     cancelName: "确定",
            //     param: { msg: "验证码已发送到您的手机" }
            // }
            Helper.OpenTip(LocalMgr.GetMessage("Phone_1004"))
            callback && callback(true)
        })
    }
    //发送邮件
    export function getSendEmailCode(data, callback?: Function) {
        let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        let param = {
            email: data.email,
            flag: data.type  //1.验证 2.重置密码
        }
        
        // HttpMgr.post(url, null, null, param, (res) => {
        Helper.PostHttp(SEND_EMAIL, null, param, (res) => {
            if (!res || res.err) {
                cc.warn("邮箱验证失败")
                return
            }
            console.log("jin---res: ", res)
            DataMgr.setData(Constants.DATA_DEFINE.SEND_EMAIL_TIME, Date.now() + 60000)
            Helper.OpenTip("邮件已发至您的邮箱")
            callback && callback(res)
        })
    }

    //TODO 发送问题请求 回复官方回答需要添加 report_gid
    export function reportProblem(data, callback?: Function) {
        //TODO 1.提交问题 2.举报 add report_nickname 3.回复官方回复 report_gid
        let param = {}
        
        if(data.report_nickname){//举报
            param = {
                type: data.type,
                match_id: data.match_id,
                report_nickname: data.report_nickname,
                issue: data.issue,
                images: data.images
            }
        }else if(data.report_gid){//回复官方回复
            param = {
                issue: data.issue,
                images: data.images,
                report_gid: data.report_gid
            }
        }else{//常规提交
            param = {
                type: data.type,
                match_id: data.match_id,
                issue: data.issue,
                images: data.images
            }
        }

        Helper.PostHttp(REPROT_PROBLEAM, null, param, (res) => {
            if(res){
                console.log("jin---res发送问题: ", res)
                // callback && callback()
            }
        })
    }

    //TODO 获取我的问题以及官方回复信息
    export function LoadReport(data, callback?: Function) {
        let param = {
            report_gid: data.report_gid
        }

        Helper.PostHttp(LOAD_REPORT, null, param, (res) => {
            if(res){
                console.log("jin---res官方回复: ", res)
                callback && callback(res)
            }
        })

    }

    //TODO 上传相册图片
    export function uploadImage(data, callback?: Function) {
        let url = "upload.mcbeam.cc/upload/file"

        let loginBody = {
            fileType: "image",
            iamge: data.image
        }

        HttpMgr.post(url, null, null,  JSON.stringify(loginBody), (res) => {
            if(res){
                console.log("jin---res: ", res)
                callback && callback(res)
            }
        })

    }

    //TODO 修改账号信息
    export function UpdateAccountInfo(data, callback?: Function){
        let param = {
            nickname: data.nickname,
            headimgurl: data.headimgurl
        }

        Helper.PostHttp(UPDATE_ACCOUNT_INFO, null,  param, (res) => {
            if (res && !res.err && res.Code !== 500 && res.Code !== 400 && res.Code !== 401 && res.Code !== 403) {
                let token = DataMgr.getData<IOpenId>(Helper.GetTokenDataKey())
                if (token) {
                    token.token = res.token
                    DataMgr.setData(Helper.GetTokenDataKey(), token, true)
                }
                callback && callback(res)
            }
        })
    }

    // 离线上线处理
    export function Offline() {
        let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        if (!user) {
            return
        }

        // console.log("user offline")

        // GateMgr.close()
    }

    export function Online() {
        let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        if (!user) {
            return
        }

        // console.log("user online")

        // Helper.DelayFun(() =>login(null), 1)
        Helper.DelayFun(() => {
            console.log("user online")
            if (!GateMgr.ready()) {
                console.log("user relogin")
                User.UpdateItem()
            }
        }, 1)
    }
}