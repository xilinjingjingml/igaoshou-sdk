import { EventMgr } from "../base/EventMgr";
import { Constants } from "../igsConstants";
import { PluginMgr } from "../base/PluginMgr";
import { DataMgr } from "../base/DataMgr";
import { Helper } from "./Helper";
import { HttpMgr } from "../base/HttpMgr";
import { UIMgr } from "../base/UIMgr";
import { User } from "../data/User";
import { UserSrv } from "./UserSrv";

const LOGIN_URL = "igaoshou-lobby-srv/lobby/login"
const GET_PHONE_CODE = "mcbeam-authen-srv/Auth/sendPhoneCode"

export namespace AccountSrv {
    let _loginParam: any = {}
    let _retry: number = 0

    export function init() {
        EventMgr.on(Constants.EVENT_DEFINE.ACCOUNT_LOGIN, onLogin)
        EventMgr.on(Constants.EVENT_DEFINE.LOGIN_PARAM_CALLBACK, _loginReq)

        onLogin()
    }

    function onLogin(param: any = null) {
        _retry = 0
        Login(param)
    }

    function Login(param: any = {}) {
        console.log("====login " + JSON.stringify(param))

        _loginParam = param || _loginParam
        // EventMgr.dispatchEvent(Constants.EVENT_DEFINE.RECORD_POINT, { moduleName: "登录", action: "登录开始", label: "" })        
        let account = DataMgr.getData<IAccount>(Helper.GetTokenDataKey()) || {}
        if (_loginParam && _loginParam.async) {
            account = null
        } else if (_loginParam && _loginParam.relogin) {
            account.token = null
        }

        if (account && account.token) {
            _loginToken()
                .then(() => {
                })
                .catch(() => {
                    // PluginMgr.login(_loginParam)
                    Login(param)
                })
        } else if (account && null !== account.type && undefined !== account.type) {
            _loginLast()
        } else {
            PluginMgr.login(_loginParam)
        }
    }

    function _loginLast() {
        let account = DataMgr.getData<IAccount>(Helper.GetTokenDataKey()) || {}
        let param = {
            auth_type: account.type,
            metadata: {
                account: account?.account ? account.account : null,
                password: account?.key ? account.key : ""
            },
            isAccountLogin: true
        }
        console.log("====loginLast " + JSON.stringify(param))
        _loginReq(param)
    }

    function _loginToken() {
        return new Promise((rlv, rjt) => {
            let account = DataMgr.getData<IAccount>(Helper.GetTokenDataKey()) || {}
            let loginBody = {
                token: account.token,
            }

            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.RECORD_POINT, { moduleName: "登录", action: "token登录", label: "请求" })

            console.log("====_loginToken ")

            let url = "https://" + DataMgr.data.Config.hostname + "/" + LOGIN_URL
            HttpMgr.post(url, null, null, loginBody, (res) => {
                console.log(res)
                if (res && !res.Code && !res.err) {
                    EventMgr.dispatchEvent(Constants.EVENT_DEFINE.RECORD_POINT, { moduleName: "登录", action: "token登录", label: "成功" })
                    onLoginSucc(res)
                    return rlv()
                }

                let account = DataMgr.getData<IAccount>(Helper.GetTokenDataKey())
                if (account) {
                    account.token = null
                    DataMgr.setData(Helper.GetTokenDataKey(), account, true)
                }
                rjt()
            })
        })
    }

    function _loginReq(data: any) {
        cc.log(data)
        let loginBody = {
            auth_method: "AccountLogin",
            auth_info: {
                plat_aid: DataMgr.data.Config.platId,
                imei: data.imei || Helper.GetURI("imei") || Helper.UUID(),//token.account,
                pn: DataMgr.data.Config.pn,
                game_gid: DataMgr.data.Config.gameId,
                device: data.device || "",
                auth_type: parseInt(data.auth_type),
                metadata: typeof data.metadata === "string" ? data.metadata : JSON.stringify(data.metadata),
            }
        }

        console.log(loginBody.auth_info.metadata)

        // EventMgr.dispatchEvent(Constants.EVENT_DEFINE.RECORD_POINT, { moduleName: "登录", action: "login请求", label: "请求" + _retry + "次" })
        Helper.reportEvent("匹配-3.3、用户登录请求")

        let url = "https://" + DataMgr.data.Config.hostname + "/" + LOGIN_URL
        HttpMgr.post(url, null, null, loginBody, (res) => {
            console.log("login rsp" + JSON.stringify(res))
            if (res && !res.Code && !res.err) {
                // EventMgr.dispatchEvent(Constants.EVENT_DEFINE.RECORD_POINT, { moduleName: "登录", action: "login请求", label: "成功" + _retry + "次" })
                Helper.reportEvent("匹配-3.3.1、用户登录请求成功")
                res.auth_type = loginBody.auth_info.auth_type
                onLoginSucc(res)
                return
            }

            if (data.isAccountLogin) {
                DataMgr.setData(Helper.GetTokenDataKey(), null, true)
                Login()
                return
            }

            if (_retry < 2 && loginBody.auth_info.auth_type === Constants.AUTH_TYPE.GUEST_LOGIN) {
                setTimeout(() => {
                    Login()
                }, _retry * 1000);
                _retry++
                return
            }

            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.LOGIN_FAILED, { errCode: res && res.Code, errMsg: res && res.err })

            _loginErrMsg("登录失败, 请稍后再试", () => {
                // EventMgr.dispatchEvent(Constants.EVENT_DEFINE.RECORD_POINT, { moduleName: "登录", action: "登录重试确认", label: "" })
                Helper.reportEvent("匹配-3.3.2、用户登录请求失败")
                _retry = 0
                Login()
            })
        })
    }

    function _loginErrMsg(msg, callback) {
        if (!_loginParam || !_loginParam.needTip) {
            return
        }

        // PluginMgr.checkNetwork((res) => {
        //     if (res.type === "none") {
        //         let param = {
        //             msg: "网络异常, 请查看网络",
        //             confirmName: "退出",
        //             cancelName: "重试",
        //             cancel: callback,
        //             confirm: () => { cc.game.end() },
        //         }
        //         UIMgr.OpenUI(cc.assetManager.getBundle("igaoshou"), "prefab/LoginPop", { param: param })
        //     }  else {
        //         let param = {
        //             msg: msg,
        //             confirmName: "退出",
        //             cancelName: "重试",
        //             cancel: callback,
        //             confirm: () => { cc.game.end() },
        //         }
        //         UIMgr.OpenUI(cc.assetManager.getBundle("igaoshou"), "prefab/LoginPop", { param: param })
        //     }
        // })

        // let running = DataMgr.getData<boolean>(Constants.DATA_DEFINE.GAME_RUNNING)
        // if (running) {
        //     cc.warn("===login err " + msg + "! current game is running")
        //     return
        // }        
    }

    function onLoginSucc(data) {
        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.RECORD_POINT, { moduleName: "登录", action: "账号信息处理", label: "" })

        // 记录token        
        let account = DataMgr.getData<IAccount>(Helper.GetTokenDataKey()) || {}
        if (null !== data.auth_type && undefined !== data.auth_type) {
            if (data.metadata) {
                // 处理游客账号
                if (data.metadata.guest) {
                    let v = (data.metadata.guest as string).split("|")
                    account.account = v[0] || ""//account.account
                    account.key = v[1] || ""//account.key
                }
            }
            account.type = data.auth_type
        }

        account.token = data.token
        account.openid = data.openid
        DataMgr.setData(Helper.GetTokenDataKey(), account, true)
        DataMgr.setData("ver", Constants.version, true)

        if (data.server_time) {
            Helper.setServerTime(Number(data.server_time))
        }

        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.RECORD_POINT, { moduleName: "登录", action: "初始化用户", label: "" })
        User.Data = initUserData(data)

        if (User.Region === "") {
            UserSrv.GetPlyDetail(User.OpenID)
        }

        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.LOGIN_SUCCESS)
    }

    function initUserData(data): IPlayerData {
        let items = []
        if (data && data.item_list) {
            for (let i of data.item_list) {
                let id = i.id || 0
                items[id] = {
                    id: id,
                    num: Number(i.num || 0),
                    expireAt: Number(i.expire_at || 0)
                }

                if (id === Constants.ITEM_INDEX.MemberCard) {                   
                    if (Helper.isMember(items[id])) {
                        // 会员道具未过期
                        DataMgr.setData(User.OpenID+Constants.DATA_DEFINE.IS_MEMBER, true)
                    } else {
                        // 会员过期
                        DataMgr.setData(User.OpenID+Constants.DATA_DEFINE.IS_MEMBER, false)
                    }
                }
            }
        }

        return {
            userName: data.nickname || "",
            openId: data.openid || 0,
            avatar: data.headimage || "",
            region: data.region || "",
            joinTime: data.join_time || 0,
            regTime: data.reg_time || 0,
            userLife: Math.floor((Date.now() / 1000 - data.reg_time) / 86400),
            lottery: Number(data.ticket_z || 0),
            wcoin: Number(data.score || 0),
            diamond: Number(data.cash || 0),
            items: items,
            histroy: {
                playGame: Number(data.game_round_count) || 0,
                allGame: Number(data.game_count) || 0,
                platGame: Number(data.plat_game_count) || 0,
                winCon: 0,
                winNum: 0,
                records: [],
            },
            levels: _initLevelInfo(data),
            metaData: data.metadata,
            newbie: data.newbie || false,
        }
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

        levels[DataMgr.data.Config.gameId] = {
            type: DataMgr.data.Config.gameId,
            name: DataMgr.data.Config.gameName,
            icon: "",
            lv: data.level || 0,
            exp: data.exp || 0,
            maxExp: data.max_exp || 0,
        }

        return levels
    }

    export function getPhoneCode(phone: string, callback?: Function) {
        let openid = User.OpenID || ""
        openid = (openid == "10000") ? "" : openid
        let param = {
            uuid: openid,
            phone: phone,
            phone_type: 0,//0:国内 1:国际
        }
        if (DataMgr.data.Config.env === 2) {
            param.phone_type = 1
        }
        let url = "https://" + DataMgr.data.Config.hostname + "/" + GET_PHONE_CODE
        url = url.replace("igaoshou.", "mcbeam.")
        HttpMgr.post(url, null, null, param, (res) => {
            console.log(res)
            if (!res || res.err) {
                cc.warn("获取验证码失败")
                return
            }
            DataMgr.setData(Constants.DATA_DEFINE.PHONE_CODE_TIME, Date.now() + 60000)
            // let param = {
            //     buttons: 1,
            //     cancelName: "确定",
            //     param: { msg: "验证码已发送到您的手机" }
            // }
            Helper.OpenTip("验证码已发送到您的手机")
            callback && callback()
        })
    }

    export function _bindPhone(authInfo: any) {
        let openid = DataMgr.getData<IAccount>(Helper.GetTokenDataKey())
        let param = {
            auth_info: {
                plat_aid: DataMgr.data._config.platId,
                imei: Helper.GetURI("imei") || Helper.UUID(),//token.account,
                pn: DataMgr.data._config.pn,
                game_gid: DataMgr.data._config.gameId,
                device: "",
                auth_type: Constants.AUTH_TYPE.PHONE_LOGIN,
                metadata: JSON.stringify({
                    isBind: 1,
                    // password: authInfo.password || "",
                    phone: authInfo.phone,
                    phone_code: authInfo.code,
                    phone_type: 0
                }),
            },
            auth_method: "AccountLogin"
        }

        if (DataMgr.data._config.env === 2) {
            param.auth_info.metadata["phone_type"] = 1
        }

        if (openid && openid.token) {
            param["token"] = openid.token
        }

        // _loginReq(param.auth_info)
        // EventMgr.dispatchEvent(Constants.EVENT_DEFINE.RECORD_POINT, { moduleName: "登录", action: "login请求", label: "请求" + _retry + "次" })
        Helper.reportEvent("用户绑定手机请求")

        let url = "https://" + DataMgr.data.Config.hostname + "/" + LOGIN_URL
        HttpMgr.post(url, null, null, param, (res) => {
            console.log("login rsp" ,(res))
            console.log("login rsp" + JSON.stringify(res))
            if (res && !res.Code && !res.err) {
                // EventMgr.dispatchEvent(Constants.EVENT_DEFINE.RECORD_POINT, { moduleName: "登录", action: "login请求", label: "成功" + _retry + "次" })
                Helper.reportEvent("用户绑定手机成功")
                EventMgr.dispatchEvent(Constants.EVENT_DEFINE.PHONE_BIND_SUCCESS)
                return
            }

            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.PHONE_BIND_FAILED, { errCode: res && res.Code, errMsg: res && res.err })
        })
    }

    export function _loginPhone(authInfo: any) {
        let param = {
            auth_info: {
                plat_aid: DataMgr.data._config.platId,
                imei: Helper.GetURI("imei") || Helper.UUID(),//token.account,
                pn: DataMgr.data._config.pn,
                game_gid: DataMgr.data._config.gameId,
                device: "",
                auth_type: Constants.AUTH_TYPE.PHONE_LOGIN,
                metadata: {
                    // password: authInfo.password || null,
                    phone: authInfo.phone,
                    phone_code: authInfo.code,
                    phone_type: 0,//0:国内 1:国际
                }
            },
            auth_method: "AccountLogin"
        }

        if (authInfo.password) {
            param.auth_info.metadata["password"] = authInfo.password
        }

        if (DataMgr.data._config.env === 2) {
            param.auth_info.metadata.phone_type = 1
        }

        //密码登录account=authInfo.phone
        if (authInfo?.password?.length > 0 && (authInfo.code == null || authInfo.code.length == 0)) {
            param.auth_info.metadata["account"] = authInfo.phone
        }

        _loginReq(param.auth_info)
    }

    function _bindEmail(authInfo: any) {
        let openid = DataMgr.getData<IAccount>(Helper.GetTokenDataKey())
        let param = {
            auth_info: {
                plat_aid: DataMgr.data._config.platId,
                imei: Helper.GetURI("imei") || Helper.UUID(),//token.account,
                pn: DataMgr.data._config.pn,
                game_gid: DataMgr.data._config.gameId,
                device: "",
                auth_type: Constants.AUTH_TYPE.EMAIL_LOGIN,
                metadata: {
                    isBind: 1,
                    account: authInfo.email || "",
                    password: authInfo.password || "",
                },
            },
            auth_method: "AccountLogin"
        }
        if (openid && openid.token) {
            param["token"] = openid.token
        }
        _loginReq(param.auth_info)
    }

    export function _loginEmail(authInfo: any) {
        let openid = DataMgr.getData<IAccount>(Helper.GetTokenDataKey())
        let param = {
            auth_info: {
                plat_aid: DataMgr.data._config.platId,
                imei: Helper.GetURI("imei") || Helper.UUID(),//token.account,
                pn: DataMgr.data._config.pn,
                game_gid: DataMgr.data._config.gameId,
                device: "",
                auth_type: Constants.AUTH_TYPE.EMAIL_LOGIN,
                metadata: {
                    account: authInfo.email || "",
                    password: authInfo.password || "",
                }
            },
            auth_method: "AccountLogin"
        }
        _loginReq(param.auth_info)
    }
}

EventMgr.once(Constants.EVENT_DEFINE.PLUGIN_FINISH, AccountSrv.init)