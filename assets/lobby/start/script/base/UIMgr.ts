/*
 * @Description: ui管理界面
 * @Version: 1.0
 * @Autor: sonke
 * @Date: 20210330 1528
 * @LastEditors: sonke 
 * @LastEditTime: 20210331 1653
 */

import BaseUI from "./BaseUI"
import { Constants } from "../igsConstants"
import { DataMgr } from "./DataMgr"
import { EventMgr } from "./EventMgr"
import { Helper } from "../system/Helper"
import { IgsBundles } from "../data/IgsBundles"

// let _uiMgr: cc.Node = null
let _scenes: { [index: string]: cc.Node[] } = {}
let _loading: { [index: string]: UIParam } = {}

let _maskTexture: cc.Texture2D = null

export namespace UIMgr {
    export async function OpenUI(bundle: string, name?: string, param?: UIParam | Function, callback?: Function) {
        if (typeof param === "function") {
            callback = param
        }

        if (typeof name !== "string") {
            cc.warn("OpenUI name is not string")
            callback && callback({ err: "name type err" })
            return
        }

        cc.log("UIMgr.OpenUI " + name)

        let uiParam: UIParam = param as UIParam
        if (!uiParam) {
            uiParam = {} as UIParam
        }

        if (uiParam && uiParam.single) {
            if (_loading[name]) {
                _loading[name] = uiParam
                return
            } else if (_scenes[name] && _scenes[name].length > 0) {
                while (_scenes[name].length > 0) {
                    if (!_scenes[name][0] || !_scenes[name][0].isValid) {
                        _scenes[name].shift()
                    } else {
                        let ui = _scenes[name][0].getComponent(BaseUI)
                        ui && ui.setParam(uiParam.param)
                        callback && callback(_scenes[name][0])
                        return
                    }
                }
            }

            _loading[name] = uiParam
        }

        if (uiParam.msg) {
            uiParam.msg.string += "\n" + Date.now() + ":load" + name
        }

        IgsBundles.LoadPrefab(bundle, name, (prefab) => {
            if (!prefab) {
                cc.warn("iGaoShou enter scene " + name + " is null!")
                callback && callback({ err: undefined })
                return
            }

            enter(prefab, name, _loading[name] || uiParam, callback)
            _loading[name] = null
        })

        // // console.log("=====" + Date.now() + ":load" + sname)
        // bundle.load(sname, cc.Prefab, (err, prefab: cc.Prefab) => {
        //     if (err) {
        //         cc.warn("iGaoShou load scene " + sname + " err: " + err)
        //         callback && callback({ err: err })
        //         return
        //     }

        //     if (!prefab) {
        //         cc.warn("iGaoShou enter scene " + sname + " is null!")
        //         callback && callback({ err: undefined })
        //         return
        //     }

        //     if (uiParam.msg) {
        //         uiParam.msg.string += "\n" + Date.now() + ":load finish" + sname
        //     }

        //     enter(prefab, sname, _loading[sname] || uiParam, callback)
        //     _loading[sname] = null
        // })
    }

    export function CloseUI(scene: string | cc.Node) {
        if (typeof scene === "string" && _scenes[scene] && _scenes[scene].length > 0) {
            let obj = _scenes[scene].shift()
            if (!obj || !obj.isValid) {
                CloseUI(scene)
                return
            }

            scene = obj
        } else if (scene instanceof cc.Node) {
            let find = false
            for (let name in _scenes) {
                for (let idx in _scenes[name]) {
                    if (scene === _scenes[name][idx]) {
                        _scenes[name].splice(Number(idx), 1)
                        find = true
                        break
                    }
                }
                if (find) break
            }
        } else {
            cc.warn("close ui " + scene + " not found uid")
            return
        }

        // cc.game.removePersistRootNode(scene)

        if (scene instanceof cc.Node && scene.isValid) {
            let uis = scene.getComponentsInChildren(BaseUI)
            uis = uis.filter(u => u.node !== scene)
            let ui = scene.getComponent(BaseUI)

            uis.forEach(item => item !== ui && CloseUI(item.node))
            ui && ui.onClose()
            EventMgr.offByTag(scene)
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.UI_CLOSE, { sceneName: scene["name"] })
            scene.removeFromParent(true)
        }
    }

    export function FindUI(scene: string, index = 0): cc.Node {
        if (_scenes[scene] && _scenes[scene].length > index) {
            let obj = _scenes[scene][index]
            if (!obj || !obj.isValid) {
                return FindUI(scene, ++index)
            }
            return obj
        }

        return null
    }

    export function clearUI(scene: string) {
        if (_scenes[scene] && _scenes[scene].length > 0) {
            _scenes[scene].forEach(s => s && s.isValid && CloseUI(s))
        }
    }

    export function clearAll() {
        for (let idx in _scenes) {
            if (_scenes[idx] && _scenes[idx].length > 0) {
                _scenes[idx] = _scenes[idx].filter(s => s && s.isValid && CloseUI(s))
            }
        }
    }

    function getMask() {
        if (!_maskTexture) {
            _maskTexture = new cc.Texture2D;
            _maskTexture.initWithData(new Uint8Array([0, 0, 0]), cc.Texture2D.PixelFormat.RGB888, 1, 1);
        }

        let mask = new cc.Node()
        let sprite = mask.addComponent(cc.Sprite)
        mask.addComponent(cc.BlockInputEvents)
        sprite.spriteFrame = new cc.SpriteFrame(_maskTexture)
        sprite.spriteFrame.setRect(cc.rect(0, 0, cc.winSize.width + 20, cc.winSize.height + 20))
        sprite.node.opacity = 180
        mask.position = cc.Vec3.ZERO
        return mask
    }


    function enter(src, name: string, param: UIParam, callback: Function) {
        // cc.log("UIMgr enter name " + name + " " + Date.now())
        // Helper.reportEvent("UIMgr", "enter" + name, "")
        let scene = cc.instantiate(src)
        if (!param) {
            param = {}
        }

        if (param.parent && typeof param.parent === "string") {
            param.parent = cc.find(param.parent, cc.Canvas.instance.node)
        }

        if (!param.parent || !(param.parent instanceof cc.Node)) {
            param.parent = cc.Canvas.instance.node
        }

        if (!param.position || (!(param.position instanceof cc.Vec2) && !(param.position instanceof cc.Vec3))) {
            param.position = cc.Vec3.ZERO
        }

        if (!param.scale || typeof param.scale !== "number") {
            param.scale = 1.0
        }

        if (param.mask) {
            let mask = getMask()
            mask.parent = param.parent

            mask.parent.on(cc.Node.EventType.CHILD_REMOVED, (n) => {
                if (n === scene) {
                    mask.removeFromParent(true)
                }
            })

            if (param.maskClose) {
                mask.on(cc.Node.EventType.TOUCH_END, (t) => {
                    let pos = t.getLocation()
                    for (let node of scene.children) {
                        if (node !== mask) {
                            let rect = node.getBoundingBoxToWorld()
                            if (rect.x < pos.x && rect.x + rect.width > pos.x && rect.y < pos.y && rect.y + rect.height > pos.y)
                                return
                        }
                    }
                    UIMgr.CloseUI(scene)
                })
            }
        }

        if (!param.parent || !param.parent.isValid) {
            cc.warn(param.parent)
        }

        scene.parent = param.parent
        scene.position = cc.v3(param.position)
        scene.scale = param.scale
        // scene.opacity = 0 

        if (param.index) {
            scene.setSiblingIndex(param.index)
        }

        if (param.closeCb) {
            let parent = scene.parent
            let removeEvent = (node) => {
                if (node === scene) {
                    parent.off(cc.Node.EventType.CHILD_REMOVED, removeEvent, true)
                    param.closeCb()
                }
            }
            parent.on(cc.Node.EventType.CHILD_REMOVED, removeEvent, true)
        }

        if (param.name && typeof param.name === "string") {
            scene.name = param.name
        }

        scene["_baseParam"] = param

        if (param.msg) {
            param.msg.string += "\n" + Date.now() + ":enter" + scene.name

        }

        // console.log("=====" + Date.now() + ":load" + scene.name)
        let ui = scene.getComponent(BaseUI)
        if (ui) {
            ui.param = param.param
            Helper.DelayFun(ui.onOpen.bind(ui))
            // ui.onOpen()
        }

        let uis = scene.getComponentsInChildren(BaseUI)
        uis = uis.filter(u => u.node !== scene)
        if (uis) {
            uis.forEach(item => item !== ui && Helper.DelayFun(item.onOpen.bind(item)))
        }

        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.UI_OPEN, { sceneName: scene.name, sceneNode: scene, param: ui && ui.param })

        _scenes[name] = _scenes[name] || []
        _scenes[name].push(scene)

        callback && callback(scene)
    }

    export function hideAllScene() {
        for (let i in _scenes) {
            _scenes[i].forEach(n => n.active = false)
        }
    }
}