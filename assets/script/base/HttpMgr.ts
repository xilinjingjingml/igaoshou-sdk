/*
 * @Description: 
 * @Version: 1.0
 * @Autor: sonke
 * @Date: 20210330 1528
 * @LastEditors: sonke
 * @LastEditTime: 20210330 1529
 */

import { Helper } from "../system/Helper"

let _isHttps: boolean = true
let _agencyAddress: string = null

export namespace HttpMgr {
    function _formatUrl(url) {
        let ret = /^(https?:\/\/)(.*)/.exec(url)
        let protocol = ""
        if (ret) {
            protocol = ret[1]
            url = ret[2]
        }

        // return window.location.protocol + "//" + url
        return "https://" + url
    }

    function _linkParam(url, params) {
        let reg = new RegExp("\"", "g")
        if (url.indexOf("?") == -1) {
            url = url + "?"
            for (const key in params) {
                if (typeof params[key] === "string" || typeof params[key] === "number" || typeof params[key] === "boolean") {
                    url = url + key + "=" + encodeURIComponent(params[key]) + "&"
                } else if (typeof params[key] === "object") {
                    url = url + key + "=" + JSON.stringify(params[key]).replace(reg, "\\\"") + "&"
                }
            }

            url = url.substr(0, url.length - 1)
        }
        else {
            for (let key in (params || {})) {
                if (typeof params[key] === "string" || typeof params[key] === "number" || typeof params[key] === "boolean") {
                    url = url.replace('{' + key + '}', encodeURIComponent(params[key]))
                } else if (typeof params[key] === "object") {
                    url = url.replace('{' + key + '}', JSON.stringify(params[key]).replace(reg, "\\\""))
                }
            }
        }

        url = _formatUrl(url)

        if (cc.sys.platform != cc.sys.WECHAT_GAME && _agencyAddress) {
            url = _agencyAddress + encodeURI(url)
        }

        return url
    }

    export function get(url, head, params, callback = null) {        
        let xhr = new XMLHttpRequest()
        xhr.timeout = 5000;

        let request = _linkParam(url, params)

        xhr.open("GET", request, true);
        if (Helper.isNative()) {
            xhr.setRequestHeader("Accept", "text/html");
            xhr.setRequestHeader("Accept-Charset", "utf-8");
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
        }

        if (head) {
            for (let key in head) {
                if (head[key]) {
                    xhr.setRequestHeader(key, head[key])
                }
            }
        }

        xhr.onload = function () {
            if (xhr.status !== 200) {
                Helper.reportEvent("HttpMgr", "get:" + url, " xhr.status:" + xhr.status)
            }
            let res = null
            if (xhr.status == 200) {
                if (params && params.response) {
                    res = xhr.response
                } else {
                    try {
                        let tryJson = JSON.parse(xhr.responseText || "")
                        if (tryJson) {
                            res = tryJson
                        } else {
                            res = xhr.responseText
                        }
                    }
                    catch {
                        res = xhr.responseText
                    }
                }
            }
            if (callback) {
                callback(res)
            }
        }

        xhr.onabort = function () {
            callback(null, 'the request has been aborted')
        }

        xhr.onerror = function (event) {
            Helper.reportEvent("HttpMgr", "get:" + url, " err:" + JSON.stringify(event))
            callback(null, event)
        }

        xhr.ontimeout = function (event) {
            Helper.reportEvent("HttpMgr", "get:" + url, " timeout")
            callback(null, 'timeout')
        }

        xhr.onprogress = function (event) {
            callback(null, event)
        }

        xhr.send();
        return xhr;
    }

    export function post(url, head, params, body, callback = null) {
        let xhr = new XMLHttpRequest()
        xhr.timeout = 5000;
        
        cc.log("http post " + url)
        let request = _linkParam(url, params)
        xhr.open("POST", request, true);
        if (Helper.isNative()) {
            xhr.setRequestHeader("Accept", "text/html");
            xhr.setRequestHeader("Accept-Charset", "utf-8");
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
        }

        if (head) {
            for (let key in head) {
                if (head[key]) {
                    xhr.setRequestHeader(key, head[key])
                } 
            }
        }

        if (body) {
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        }

        xhr.onload = function () {
            if (xhr.status !== 200) {
                Helper.reportEvent("HttpMgr", "post:" + url, " xhr.status:" + xhr.status)
            }
            let res = null
            // cc.log("onload")
            // cc.log(res)
            if (xhr.status == 200 || xhr.status == 500 || xhr.status === 401 || xhr.status === 403) {
                try {
                    let tryJson = JSON.parse(xhr.responseText || "")
                    if (tryJson) {
                        res = tryJson
                    } else {
                        res = xhr.responseText
                    }
                }
                catch {
                    res = xhr.responseText
                }
            } else if (xhr.status == 307) {
                try {
                    let tryJson = JSON.parse(xhr.responseText || "")
                    if (tryJson) {
                        res = tryJson
                    } else {
                        res = xhr.responseText
                    }
                }
                catch {
                    res = xhr.responseText
                }
                if (res.Location) {
                    this.HTTPPostRequest(res.Location, params, callback, xhr.timeout)
                    return
                }
            }
            if (callback) {
                callback(res)
            }
        }.bind(this)

        xhr.onabort = function () {
            callback({err: "the request has been aborted"})
        }

        xhr.onerror = function (event) {
            Helper.reportEvent("HttpMgr", "post:" + url, " err:" + JSON.stringify(event))
            cc.warn("http post onerror " + event)
            // if (xhr.status == 500) {
            //     let res = null
            //     try {
            //         let tryJson = JSON.parse(xhr.responseText || "")
            //         if (tryJson) {
            //             res = tryJson
            //         } else {
            //             res = xhr.responseText
            //         }
            //     }
            //     catch {
            //         res = xhr.responseText
            //     }
            //     callback(null, res)
            // }
            callback({err: "http request err"})
        }

        xhr.ontimeout = () => {
            Helper.reportEvent("HttpMgr", "post:" + url, " timeout")
            callback({err: "timeout"})
        }

        if (body) {
            if (typeof (URLSearchParams) === "function") {
                let urlParams = new URLSearchParams()
                // let reg = new RegExp("\"", "g")
                for (let key in body) {
                    if (typeof body[key] === "string" || typeof body[key] === "number" || typeof body[key] === "boolean") {
                        urlParams.append(key, body[key])
                    } else if (typeof body[key] === "object" && body[key]) {
                        urlParams.append(key, JSON.stringify(body[key]))//.replace(reg, "\\\""))
                    }
                }
                
                //字节post不了参数做修改，其他平台没测 ，先做区分
                if (cc.sys.platform === cc.sys.BYTEDANCE_GAME) {
                    xhr.send(urlParams.toString());
                }else{
                xhr.send(urlParams);
                }
            } else {
                let paramArr = []
                // let reg = new RegExp("\"", "g")
                for (let key in body) {
                    if (typeof body[key] === "string" || typeof body[key] === "number" || typeof body[key] === "boolean") {
                        paramArr.push(key + "=" + encodeURIComponent(body[key]))
                    } else if (typeof body[key] === "object" && body[key]) {
                        paramArr.push(key + "=" + JSON.stringify(body[key]))//.replace(reg, "\\\""))
                    }
                }
                xhr.send(paramArr.join('&'))
            }
        } else {
            xhr.send()
        }
        return xhr;
    }

    export function download(url, params, callback) {
        let xhr = new XMLHttpRequest()
        xhr.timeout = 5000;

        let request = _linkParam(url, params)

        xhr.responseType = "arraybuffer";
        xhr.open("GET", request, true);
        if (Helper.isNative()) {
            xhr.setRequestHeader("Accept", "text/html");
            xhr.setRequestHeader("Accept-Charset", "utf-8");
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
                let buffer = xhr.response;
                let dataview = new DataView(buffer);
                let ints = new Uint8Array(buffer.byteLength);
                for (let i = 0; i < ints.length; i++) {
                    ints[i] = dataview.getUint8(i);
                }
                callback(ints, null);
            }
            else {
                callback(null, xhr.readyState + ":" + xhr.status);
            }
        };
        xhr.send();
        return xhr;
    }
}