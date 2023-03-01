import { UIMgr } from "../base/UIMgr"
import { Constants } from "../constants"
import { HttpMgr } from "../base/HttpMgr"
import { DataMgr } from "../base/DataMgr"
import { Account } from "./Account"
import WxWrapper from "./WeChatMini"
import { ActivitySrv } from "./ActivitySrv"
import { EventMgr } from "../base/EventMgr"

let _serverTime = 0

export namespace Helper {
    export function CallStaticMethod(clsName: string, methodName: string, methodSig?: string, params?: Function | any, callback?: Function): any {
        cc.log("callStaticMethod clsName = ", clsName, " methodName = ", methodName, " methodSig = ", methodSig)
        if (!callback && typeof params === "function") {
            callback = params
            params = {}
        }

        if (!CC_JSB) {
            callback && callback("no jsb", null)
            return
        }
        try {
            methodSig && params.unshift(methodSig)
            cc.log("callStaticMethod.apply")
            let result = jsb.reflection.callStaticMethod.apply(jsb.reflection, [clsName, methodName].concat(params))
            // callback && callback(null, result)
            return { err: null, result: result }
        } catch (error) {
            cc.log("callStaticMethod", JSON.stringify(error))
            // callback && callback(error, null)
            return { err: error, result: null }
        }
    }

    // 项目内使用的函数
    export function VersionCompare(versionA: string, versionB: string): number {
        const vA = versionA.split('.')
        versionB = versionB || "0.0.0"
        const vB = versionB.split('.')
        for (let i = 0; i < vA.length; ++i) {
            const a = parseInt(vA[i])
            const b = parseInt(vB[i] || '0')
            if (a === b) {
                continue
            } else {
                return a - b
            }
        }
        if (vB.length > vA.length) {
            return -1
        } else {
            return 0
        }
    }

    export function LoadBundle(name: string, callback: Function) {
        cc.assetManager.loadBundle(name, null, (err, bundle) => {
            if (err) {
                cc.error("iGaoShou bundler not found: " + err)
                callback && callback(err)
                return
            }

            callback && callback(bundle)
        })
    }

    export function FormatTimeString(time: string | number, format?: string) {
        if (!time)
            return ""

        if (typeof time === "number")
            time = Math.abs(time)

        let date = new Date(time)
        let year, month, day, hours, minutes, seconds

        if (date.getTime() > 946656000000) {
            year = date.getFullYear();
            month = (date.getMonth() + 1);
            day = date.getDate();
            hours = date.getHours();
            minutes = date.getMinutes();
            seconds = date.getSeconds();
        } else {
            let d = date.getTime()
            year = Math.floor(d / 31536000000)
            month = Math.floor((d / 31536000000) % 2592000000)
            day = Math.floor((d % 2592000000) / 86400000)
            hours = Math.floor((d % 86400000) / 3600000)
            minutes = Math.floor((d % 3600000) / 60000)
            seconds = Math.floor((d % 60000) / 1000)
        }

        return (format || "yyyy-MM-dd hh:mm:ss")
            .replace("yyyy", "" + year)
            .replace("yy", ("" + year).slice(-2))
            .replace("MM", ("00" + month).slice(-2))
            .replace("M", "" + month)
            .replace("dd", ("00" + day).slice(-2))
            .replace("d", "" + day)
            .replace("hh", ("00" + hours).slice(-2))
            .replace("h", "" + hours)
            .replace("mm", ("00" + minutes).slice(-2))
            .replace("m", "" + minutes)
            .replace("ss", ("00" + seconds).slice(-2))
            .replace("s", "" + seconds)
    }

    export function FormatNumKMBT(num: number): string {
        let strNum = "" + num
        let len = strNum.length
        let head = parseInt(strNum.substr(0, 3))
        let point = len % 3
        point = point === 0 ? 3 : point
        let strHead = "" + head / Math.pow(10, (3 - point))
        if (len / 3 > 4)
            return strHead + "t"
        else if (len / 3 > 3)
            return strHead + "b"
        else if (len / 3 > 2)
            return strHead + "m"
        else if (len / 3 > 1)
            return strHead + "k"
        return strNum
    }

    export function FormatNumWY(num: number): string {
        let strNum = "" + num
        let len = strNum.length
        let head = parseInt(strNum.substr(0, 4))
        let point = len % 4
        point = point === 0 ? 4 : point
        let strHead = "" + head / Math.pow(10, (4 - point))
        // if (len / 5 > 4)
        //     return strHead + "t"
        // else if (len / 5 > 3)
        //     return strHead + "b"
        // else 
        if (len / 4 > 2)
            return strHead + "e"
        else if (len / 4 > 1)
            return strHead + "w"
        return strNum
    }

    export function FormatNumQWY(num: number): string {
        let strNum = "" + num
        let len = strNum.length
        let head = parseInt(strNum.substr(0, 4))
        let point = len % 4
        point = point === 0 ? 4 : point
        let strHead = "" + head / Math.pow(10, (4 - point))
        // if (len / 5 > 4)
        //     return strHead + "t"
        // else if (len / 5 > 3)
        //     return strHead + "b"
        // else 
        if (len / 4 > 2)
            return strHead + "e"
        else if (len / 4 > 1)
            return strHead + "w"
        else if (len === 4)
            return Math.floor(num / 1000) + (num % 1000 > 0 ? "." + num % 1000 : "") + "q"
        return strNum
    }

    export function FormatNumPrice(num: number): string {
        if (num >= 10000) {
            return FormatNumWY(num)
        } else {
            return ("" + num.toFixed(2))
        }
    }

    export function FormatNumSplit(num: number): string {
        let strNum = "" + Math.abs(num)
        let len = strNum.length
        let newStr = strNum.substr(-3)
        for (let i = 1; i < len / 3; i++) {
            newStr = strNum.substring(Math.max(len - (i + 1) * 3, 0), len - i * 3) + "," + newStr
        }

        if (num < 0) {
            newStr = "-" + newStr
        }

        return newStr
    }

    export function OpenPageUI(page: string, title: string, icon?: string | cc.SpriteFrame | Function | any, param?: any | Function, callback?: Function) {
        if (!callback && typeof param === "function") {
            callback = param
            param = null
        }

        if (!callback && typeof icon === "function") {
            callback = icon
            icon = null
        }

        if (!param && typeof icon !== "string" && !(icon instanceof cc.SpriteFrame)) {
            param = icon
            icon = null
        }

        if (!param) {
            param = {}
        }

        let uiparam = {
            page: page || param.page,
            title: title || param.title,
            icon: icon || param.icon,
            param: param
        }

        for (let i in param) {
            uiparam[i] = param[i]
        }

        UIMgr.OpenUI("component/Base/GamePage",
            { enterAni: Constants.PAGE_ANI.LEFT_IN, leaveAni: Constants.PAGE_ANI.LEFT_OUT, closeCb: param.closeCb, param: uiparam }, callback)
    }

    export function OpenPopUI(page: string, title: string, icon?: string | cc.SpriteFrame | Function | any, param?: any | Function, callback?: Function) {
        if (!callback && typeof param === "function") {
            callback = param
            param = null
        }

        if (!callback && typeof icon === "function") {
            callback = icon
            icon = null
        }

        if (!param && typeof icon !== "string" && !(icon instanceof cc.SpriteFrame)) {
            param = icon
            icon = null
        }

        let uiparam = {
            page: page || param.page,
            title: title || param.title,
            icon: icon || param.icon,
        }

        for (let i in param) {
            uiparam[i] = param[i]
        }

        UIMgr.OpenUI("component/Base/GamePop", {
            enterAni: Constants.PAGE_ANI.POP_IN, mask: true, maskClose: true,
            position: cc.v3(0, cc.winSize.height * .118), closeCb: param.closeCb, param: uiparam
        }, callback)
    }

    export function OpenTip(msg: string) {
        if (!msg || msg.length === 0)
            return

        UIMgr.OpenUI("component/Base/TipEntry", { single: true, param: { msg: msg } })
    }

    export function OpenFootTip(msg: string) {
        if (!msg || msg.length === 0)
            return

        UIMgr.OpenUI("component/Base/FootTipEntry", { single: true, param: { msg: msg } })
    }

    export function GetURI(key: string): string {
        let search = window.location.search || ""
        var args = {}
        if (search.indexOf('?') != -1) {
            var query = search.substr(1)
            var pairs = query.split('&')
            for (var i = 0; i < pairs.length; i++) {
                var sp = pairs[i].split('=')
                args[sp[0]] = decodeURIComponent(sp[1])
            }
        }
        return args[key]
    }

    export function UUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    export function GetContry(region) {
        let country = DataMgr.getData<TCountryFlag>(Constants.DATA_DEFINE.IGS_REGION_FLAG)
        if (country) {
            return country[region]
        }
    }

    let _delayTag: number = 100000
    export function DelayFun(func: Function, delay: number = 0): number {
        if (!func || typeof func !== "function") {
            cc.warn("DelayFun func err")
            return
        }

        cc.tween(cc.Canvas.instance)
            .tag(_delayTag)
            .delay(delay)
            .call(() => func())
            .start()

        return _delayTag++
    }

    export function StopDelay(tag: number) {
        cc.tween(cc.Canvas.instance).tag(tag).stop()
    }

    export function GetHttp(uri: string, param: any, callback: Function) {
        let openid = DataMgr.getData<IOpenId>(Helper.GetTokenDataKey())
        openid = openid || {}
        let cb = (msg) => {
            if (msg && msg.Code === 500) {
                if (msg.Detail === "invalid user token provided") {
                    Account.login((res) => {
                        GetHttp(uri, param, callback)
                    }, true)
                }
            }
            callback && callback(msg)
        }

        HttpMgr.get("https://" + DataMgr.Config.hostname + "/" + uri,
            { "User-Token": openid.token }, param, cb)
    }

    export function PostHttp(uri: string, param: any, body: any, callback: Function) {
        let openid = DataMgr.getData<IOpenId>(Helper.GetTokenDataKey())
        openid = openid || {}
        let cb = (msg) => {
            if (msg && (msg.Code === 500 || msg.Code === 401 || msg.Code === 403)) {
                if (msg.Detail === "invalid user token provided" || msg.Detail === "invalid token") {
                    let openid = DataMgr.getData<IOpenId>(Helper.GetTokenDataKey())
                    openid.token = null
                    DataMgr.setData(Helper.GetTokenDataKey(), openid)
                    Account.RefreshToken(() => PostHttp(uri, param, body, callback))
                    // Account.login((res) => {
                    //     PostHttp(uri, param, body, callback)
                    // }, true)
                    return
                } else if (msg.Detail === "bad request overtime 5s") {
                    Account.RefreshToken(() => PostHttp(uri, param, body, callback))
                    // Account.login((res) => {
                    //     PostHttp(uri, param, body, callback)
                    // }, true)
                    return
                }
            } else if (msg.err) {
                msg.err = Helper.ParseJson(msg.err)
                if (msg.err.detail === "invalid token" || msg.err.detail === "invalid user token provided") {
                    let openid = DataMgr.getData<IOpenId>(Helper.GetTokenDataKey())
                    openid.token = null
                    DataMgr.setData(Helper.GetTokenDataKey(), openid)
                    Account.RefreshToken(() => PostHttp(uri, param, body, callback))
                    // Account.login((res) => {
                    //     PostHttp(uri, param, body, callback)
                    // }, true)
                    return
                }
            }

            callback && callback(msg)
        }

        let host = DataMgr.Config.hostname
        if (-1 !== uri.indexOf("authen-srv") || -1 !== uri.indexOf("mcbeam-version-api") || -1 !== uri.indexOf("mcbeam-pay-api")) {
            host = host.replace("igaoshou.", "mcbeam.")
        }

        let head = {}
        if (openid && openid.token) {
            let authorization = sign(body, openid.token)
            head = {
                "User-Token": openid.token,
                "User-Authorization": authorization
            }
        }

        HttpMgr.post("https://" + host + "/" + uri, head, param, body, cb)
    }

    export function sign(param, userToken) {
        let now = Math.floor(Date.now() / 1000)
        let ts = now + "" //(now + _serverTime) + ""
        // cc.log("====sign now = " + now + " interval = " + _serverTime + " ts = " + ts)
        let ns = Math.random() + ""

        let keys = []
        for (let k in param) {
            keys.push(k)
        }

        keys.sort((a, b) => {
            for (let i in a) {
                if (a[i] && b[i]) {
                    let k1 = a[i].charCodeAt(0)
                    let k2 = b[i].charCodeAt(0)
                    if (k1 < k2)
                        return -1
                    else if (k1 > k2)
                        return 1
                } else if (a[i] && !b[i]) {
                    return 1
                } else if (!a[i] && b[i]) {
                    return -1
                }
            }
        })

        let str = ""
        for (let k of keys) {
            if (param[k])
                str += k + "=" + param[k] + "&"
        }
        str = str.substr(0, str.length - 1)

        str = ts + "\n" + ns + "\n" + str + "\n"
        // cc.log("signParam = " + str)
        let sign = ""
        let cryptoJs = window["CryptoJS"]
        if (cryptoJs) {
            sign = cryptoJs.HmacSHA256(str, userToken).toString();
        }

        let authorization = {
            ts: ts,
            ns: ns,
            sign: sign,
        }

        // cc.log(authorization)
        return JSON.stringify(authorization)
    }

    export function reportEvent(moduleName, action, label) {
        cc.log(Date.now() + "====Report Event " + moduleName + "_" + action + "_" + label)
        let openid = DataMgr.getData<IOpenId>(Helper.GetTokenDataKey())
        openid = openid || {}
        let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        let newbie = user ? user.newbie : openid.openid ? "false" : "true"
        let str = "新的标签" + moduleName + '_' + action + '_' + label + '_newbie:' + newbie// + "_gameId:" + igs.gameId
        // cc.log(str)
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            let wx = window["wx"]
            if (wx && wx.aldSendEvent) {
                wx.aldSendEvent(str)
            }
        }
    }

    export function copyToClipBoard(str: string, succTip: string = "已复制到剪贴板") {
        if (CC_WECHATGAME) {
            WxWrapper.setClipboardData(str, function (success) {
                success ? OpenTip(succTip) : OpenTip("复制到剪贴板失败")
            })
        } else if (Helper.isNative()) {

        }
        else if (cc.sys.isBrowser) {
            var textArea = document.getElementById("clipBoard")
            if (textArea === null) {
                textArea = document.createElement("textarea")
                textArea.id = "clipBoard"
                textArea.textContent = str
                document.body.appendChild(textArea)
            }
            textArea["select"]()
            try {
                document.execCommand('copy')
                OpenTip(succTip)
                document.body.removeChild(textArea)
            } catch (err) {
                OpenTip("复制到剪贴板失败")
            }
        }
    }

    export function shareInfo(callback?: Function) {
        let share = DataMgr.getData<any>(Constants.DATA_DEFINE.SHARE_INFO)
        const shareData = {
            title: share.share_text,//"一杆全清, 王者出击",
            imageUrl: share.share_pic,//"https://pictures.hiigame.com/qmddz/400.jpg",
            withOpenId: true,
            callback: callback,
        }
        WxWrapper.shareAppMessage(shareData)
    }

    export function setServerTime(time: number) {
        let now = Math.floor(Date.now() / 1000)
        _serverTime = time - Math.floor(Date.now() / 1000)
        cc.log("====Get server time = " + time + " now = " + now + " interval = " + _serverTime)

        let func = Date.now
        Date.now = () : number => {
            let time = func()
            // cc.log("local time = " + time + " serverTime = " + (time + _serverTime))
            return time + _serverTime * 1000
        }  
    }

    export function createWxUserInfo(node: cc.Node, name: string, callback: Function, onCreate?: Function) {
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            onCreate(false)
        }

        if (!node || !name) {
            onCreate(false)
        }

        let userTaskId = 1001
        let func = () => {
            if (node.isValid) {
                // let rect = new cc.Rect()
                // rect.width = node.width
                // rect.height = node.height
                // let pos = node.convertToWorldSpaceAR(cc.Vec2.ZERO)
                // rect.x = pos.x - node.anchorX * rect.width
                // rect.y = pos.y - node.anchorY * rect.height

                // console.log(rect)

                WxWrapper.showUserInfoButton(node, name,
                    (res) => {
                        if (res.errMsg === "getUserInfo:ok") {
                            Account.login({ authType: Constants.LOGIN_TYPE.LOGIN_WECHAT, relogin: true }, () => {
                                ActivitySrv.GetReward(1001)
                                // 关闭所有授权按钮
                                WxWrapper.hideUserInfoButton()
                            })
                        }
                        // 授权回调
                        callback && callback(res.errMsg === "getUserInfo:ok")
                    },
                    () => {
                        // 创建成功
                        onCreate && onCreate(true)
                    })
            }
        }



        let userInfoTask = ActivitySrv.GetActivityById(userTaskId)
        // console.log("baseTop ", userInfoTask)
        if (!userInfoTask) {
            EventMgr.once(Constants.EVENT_DEFINE.REFRESH_ACTIVITY, () => {
                let task = ActivitySrv.GetActivityById(userTaskId)
                if (task && (!task.receive_num || task.receive_num < 1)) {
                    func()
                } else {
                    onCreate(false)
                }
            })
        } else if (userInfoTask && (!userInfoTask.receive_num || userInfoTask.receive_num < 1)) {
            func()
        } else {
            onCreate(false)
        }
    }

    export function TokenAni(start: number, end: number, time?: number | Function, callback?: Function): cc.Tween {
        if (typeof callback !== "function" && typeof time === "function") {
            callback = time
            time = null
        }
        time = time || 2.0
        // let count = Math.abs(start - end)       
        // let delayAvg = Number((Number(time) / count * 5).toFixed(5))
        // let delay = Number((delayAvg / count).toFixed(5))

        // cc.log("=======delayAvg = " + delayAvg + " delay = " + delay)

        // let count = 100
        // let idx = 0

        let t = null
        if (end > start) {
            t = cc.tween()
                .to(0.1, { scale: 1.5 })
                .to(0.1, { scale: 1 })
        } else {
            t = cc.tween().set({ scale: 1 })
        }

        return cc.tween()
            .set({ _tokenNum: start })
            .to(Number(time), { _tokenNum: end }, {
                progress: (start, end, current, t) => {
                    let d = cc.misc.lerp(start, end, t);
                    // d = current + (1 - t * t) * (end - start)        
                    // let d = (1 - t) * .02 * (end - start) + current
                    // if (start <= end && d >= end) { 
                    //     d = end
                    // } else if (start >= end && d <= end) { 
                    //     d = end 
                    // }
                    // cc.log(d, start, end, current, t)           
                    callback && callback(Math.ceil(d))
                    return d
                }
            })
            .then(t)
            .call(() => callback && callback(end))

        // return cc.tween().repeat(count, cc.tween().delay(3.0 / count).call(() => {
        //     start = cc.misc.lerp(start, end, (count - idx) / 100)
        //     idx++
        //     callback && callback(start)
        // }))

    }

    export function ParseJson(json: string) {
        try {
            let msg = JSON.parse(json)
            return msg
        } catch {
        }

        return json
    }

    export function CSVToArray(strData, strDelimiter) {
        strDelimiter = (strDelimiter || ",");
        var objPattern = new RegExp(
            (
                "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
                "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
                "([^\"\\" + strDelimiter + "\\r\\n]*))"
            ),
            "gi"
        );
        var arrData = [[]];
        var arrMatches = null;
        while (arrMatches = objPattern.exec(strData)) {
            var strMatchedDelimiter = arrMatches[1];
            if (
                strMatchedDelimiter.length &&
                (strMatchedDelimiter != strDelimiter)
            ) {
                arrData.push([]);
            }
            if (arrMatches[2]) {
                var strMatchedValue = arrMatches[2].replace(
                    new RegExp("\"\"", "g"),
                    "\""
                );
            } else {
                var strMatchedValue = arrMatches[3];
            }
            arrData[arrData.length - 1].push(strMatchedValue);
        }
        if (arrData.length > 0) {
            arrData.pop();
        }
        return arrData;
    }

    interface IIPLocation {
        status: string
        info: string
        infocode: string
        province: string
        city: string
        adcode: string
        rectangle: string
    }
    export function getIPLocation(callback?: Function) {
        HttpMgr.get("https://restapi.amap.com/v3/ip?key=0113a13c88697dcea6a445584d535837", {}, {}, (res: IIPLocation) => {
            if (res) {
                if (res.status == "1") {
                    callback && callback(res.city)
                } else {
                    callback && callback(null)
                }
            } 
        })
    }

    export function checkPhoneNum(phone:string) {
        var myreg=/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
        if (!myreg.test(phone)) {
            return false
        } 
        return true 
    }

    export function isNative() {
        if (cc.sys.isNative && cc.sys.OPPO_GAME != cc.sys.platform && cc.sys.VIVO_GAME != cc.sys.platform) {  
            return true
        }
        return false
    }

    export function GetTokenDataKey() {
        let env = Number(Helper.GetURI("env")) || DataMgr.getData<number>(Constants.DATA_DEFINE.LAST_ENV) || (DataMgr.Config ? DataMgr.Config.env : 0) 
        if (env === 0) {
            return Constants.DATA_DEFINE.OPEN_ID
        } else {
            return Constants.DATA_DEFINE.OPEN_ID + "_" + env
        }
    }

    //获取手机texture
    export function getPhoneTexture(absolutePath, callback: Function) {
        // var absolutePath = "/dara/data/some/path/to/image.png"
        cc.assetManager.loadRemote(absolutePath, function (err, texture:cc.Texture2D) {
            // Use texture to create sprite frame
            console.log("jin---getPhoneTexture: " , err, texture)
            callback && callback(texture)
        });

    }
    //图片->二进制流
    export function imageToBinary(img) {
        let getBase64Str = getBase64Image(img);
        //获得二进制流
        let getBlobStr = dataURLtoBlob(getBase64Str)
        console.log("jin---imageToBinary: ", getBase64Str, getBlobStr)
        return getBlobStr
    }

    //图片转base64
    function getBase64Image(img) {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
        var dataURL = canvas.toDataURL("image/" + ext);
        return dataURL;
    }

    //base64转二进制
    function dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        // return new Blob([u8arr], {
        //     type: mime
        // });
        return u8arr
    }

    function getBade64Image(imageUrl , callback){
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        var img = new Image()
        img.crossOrigin = 'Anonymous'
        img.src = imageUrl //TODO 路径+文件名 1.文件名？ 2.路径？
        img.onload = () => {
            canvas.height = img.height
            canvas.width = img.width
            ctx.drawImage(img, 0, 0)
            var dataURL = canvas.toDataURL('image/png')
            canvas = null
            callback && callback(dataURL)
        }

    }
}