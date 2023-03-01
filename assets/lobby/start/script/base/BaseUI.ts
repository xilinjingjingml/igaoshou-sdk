/*
 * @Description: 
 * @Version: 1.0
 * @Autor: sonke
 * @Date: 20210330 1528
 * @LastEditors: sonke
 * @LastEditTime: 20210330 1529
 */

import { UIMgr } from "./UIMgr";
import { DataMgr } from "./DataMgr";
// import FontColor from "../component/Shader/FontColor";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BaseUI extends cc.Component {

    // @property({type: cc.JsonAsset})
    // LangueConfig

    param: any = {}

    static _loadRemoteQueue = []
    static _onLoadRemote: number = 0

    onOpen() {

    }

    onClose() {

    }

    onEnterBegin() {

    }

    onEnterEnd() {

    }

    onLeaveBegin() {

    }

    onLeaveEnd() {

    }

    close() {
        if (this.node && this.node.isValid)
            UIMgr.CloseUI(this.node)
    }

    setParam(param: any) {

    }

    getNode(target: string | cc.Node, parent?: cc.Node) {
        if (!this || !this.node || !this.node.isValid) {
            return new cc.Node()
        }

        let node: cc.Node = null
        if (typeof target === "string") {
            if (parent && parent instanceof cc.Node) {
                node = this["_n" + parent.uuid + target] || cc.find(target, parent)
                this["_n" + parent.uuid + target] = node                
            } else {
                node = this["_n" + target] || cc.find(target, this.node)
                this["_n" + target] = node
            }            
        } else if (target instanceof cc.Node) {
            node = target
        }

        if (!node) {
            node = new cc.Node()
        }
        return node
    }

    getNodeComponent<T extends cc.Component>(target: string | cc.Node, parent: cc.Node | { prototype: T }, type?: { prototype: T }): T | undefined {
        if (!type && !(parent instanceof cc.Node)) {
            type = parent
            parent = null
        }

        let node = this.getNode(target, parent instanceof cc.Node ? parent : null)
        if (node) {
            return node.getComponent(type)
        }

        return null
    }

    setNodeComponentEnabled<T extends cc.Component>(target: string | cc.Node, parent: cc.Node | { prototype: T }, type?: { prototype: T } | boolean, enable?: boolean) {
        if (typeof type === "boolean") {
            enable = type
            type = null
        }

        if (!type && !(parent instanceof cc.Node)) {
            type = parent
            parent = null
        }

        let node = this.getNode(target, parent instanceof cc.Node ? parent : null)
        if (node) {
            let comp = node.getComponent(type as { prototype: T })
            if (comp) {
                comp.enabled = enable
            }
        }
    }

    removeNodeComponent<T extends cc.Component>(target: string | cc.Node, parent: cc.Node | { prototype: T }, type?: { prototype: T }) {
        if (!type && !(parent instanceof cc.Node)) {
            type = parent
            parent = null
        }

        let node = this.getNode(target, parent instanceof cc.Node ? parent : null)
        if (node) {
            let comp = node.getComponent(type as { prototype: T })
            if (comp) {
                node.removeComponent(comp)
            }
        }
    }

    setChildParam(name: string | cc.Node, parent: cc.Node | any, param?: any) {
        if (!param && !(parent instanceof cc.Node)) {
            param = parent
            parent = null
        }

        let node = this.getNode(name, parent instanceof cc.Node ? parent : null)
        if (node) {
            let ui = node.getComponent(BaseUI)
            if (ui) {
                ui.setParam(param)
            }
        }
    }

    runTween(name: string | cc.Node, parent: cc.Node | cc.Tween, tween?: cc.Tween) {
        if (!tween && parent instanceof cc.Tween) {
            tween = parent
            parent = null
        }

        let node = this.getNode(name, parent instanceof cc.Node ? parent : null)
        if (node && tween instanceof cc.Tween) {
            cc.tween(node).then(tween).start()
        }
    }

    stopTween(name: string | cc.Node, parent?: cc.Node | number, tag?: number) {
        if (undefined === tag && typeof parent === "number") {
            tag = parent
            parent = null
        }

        let node = this.getNode(name, parent instanceof cc.Node ? parent : null)
        if (node) {
            if (undefined !== tag) {
                cc.Tween.stopAllByTag(tag)
            } else {
                cc.Tween.stopAllByTarget(node)
            }
        }
    }
    

    setActive(name: string | cc.Node, parent: cc.Node | boolean, value?: boolean) {
        if (!value && typeof parent === "boolean") {
            value = parent
            parent = null
        }

        let node = this.getNode(name, parent instanceof cc.Node ? parent : null)
        if (node) {
            node.active = value !== undefined ? value : node.active
        }
    }

    setOpacity(name: string | cc.Node, parent: cc.Node | number, value?: number) {
        if (!value && typeof parent === "number") {
            value = parent
            parent = null
        }

        let node = this.getNode(name, parent instanceof cc.Node ? parent : null)
        if (node) {
            node.opacity = value !== undefined ? value : node.opacity
        }
    }

    setNodeSize(name: string | cc.Node, parent: cc.Node | number | cc.Size, width?: number | cc.Size, height?: number) {
        if (!width && parent instanceof cc.Size) {
            width = parent
            parent = null
        }

        if (!width && typeof parent === "number") {
            width = parent
            parent = null
        }

        if (!height && typeof width === "number" && typeof parent === "number") {
            height = width
            width = parent
            parent = null
        }

        let node = this.getNode(name, parent instanceof cc.Node ? parent : null)
        if (node) {
            if (width && width instanceof cc.Size) {
                node.setContentSize(width)
            } else if (width && !height) {
                node.setContentSize(width, node.height)
            } else if (width && height) {
                node.setContentSize(width, height)
            }
        }
    }

    setNodeWidth(name: string | cc.Node, parent: cc.Node | number | cc.Size, width?: number | cc.Size) {
        if (!width && (typeof parent === "number" || parent instanceof cc.Size)) {
            width = parent
            parent = null
        }

        let node = this.getNode(name, parent instanceof cc.Node ? parent : null)
        if (node) {
            if (typeof width === "number") {
                node.setContentSize(width, node.height)
            } else if (width instanceof cc.Size) {
                node.setContentSize(width.width, node.height)
            }
        }
    }

    setNodeHeight(name: string | cc.Node, parent: cc.Node | number | cc.Size, height?: number | cc.Size) {
        if (!height && (typeof parent === "number" || parent instanceof cc.Size)) {
            height = parent
            parent = null
        }

        let node = this.getNode(name, parent instanceof cc.Node ? parent : null)
        if (node) {
            if (typeof height === "number") {
                node.setContentSize(node.width, height)
            } else if (height instanceof cc.Size) {
                node.setContentSize(node.width, height.height)
            }
        }
    }

    setNodePosition(name: string | cc.Node, parent: cc.Node | number | cc.Vec2 | cc.Vec3, x?: number | cc.Vec2 | cc.Vec3, y?: number) {
        let pos = cc.Vec3.ZERO
        if (!y && typeof x === "number" && typeof parent === "number") {
            pos = cc.v3(parent, y)
            parent = null
        }

        if (!x && (parent instanceof cc.Vec2 || parent instanceof cc.Vec3)) {
            pos = cc.v3(parent)
            parent = null
        }

        if (!x && typeof parent === "number") {
            pos = cc.v3(parent, y || 0)
            parent = null
        }

        let node = this.getNode(name, parent instanceof cc.Node ? parent : null)
        if (node) {
            node.setPosition(pos)
        }
    }

    setNodePositionX(name: string | cc.Node, parent: cc.Node | number | cc.Vec2 | cc.Vec3, x?: number | cc.Vec2 | cc.Vec3) {
        if (!x && (parent instanceof cc.Vec2 || parent instanceof cc.Vec3)) {
            x = parent.x
            parent = null
        }

        if (!x && typeof parent === "number") {
            x = parent
            parent = null
        }

        if (x instanceof cc.Vec2 || x instanceof cc.Vec3) {
            x = x.x
        }

        let node = this.getNode(name, parent instanceof cc.Node ? parent : null)
        if (node) {
            node.setPosition(cc.v3(x, node.position.y))
        }
    }

    setNodePositionY(name: string | cc.Node, parent: cc.Node | number | cc.Vec2 | cc.Vec3, y?: number | cc.Vec2 | cc.Vec3) {
        if (!y && (parent instanceof cc.Vec2 || parent instanceof cc.Vec3)) {
            y = parent.y
            parent = null
        }

        if (!y && typeof parent === "number") {
            y = parent
            parent = null
        }

        if (y instanceof cc.Vec2 || y instanceof cc.Vec3) {
            y = y.y
        }

        let node = this.getNode(name, parent instanceof cc.Node ? parent : null)
        if (node) {
            node.setPosition(cc.v3(node.position.x, y))
        }
    }

    setLabelValue(name: string | cc.Node, parent: cc.Node | string | number, value?: string | number) {
        if (!value && (typeof parent === "string" || typeof parent === "number")) {
            value = parent
            parent = null
        }
        let node = this.getNode(name, parent instanceof cc.Node ? parent : null)
        if (node) {
            let label = node.getComponent(cc.Label)
            if (!label) {
                // cc.warn(node.name + " not found cc.Label")
                return
            }

            value = "" + value || ""
            label.string = value
        }
    }

    setLabelInfo(name: string | cc.Node, parent: cc.Node | any, info?: any) {
        if (!info && !(parent instanceof cc.Node)) {
            info = parent
            parent = null
        }
        let node = this.getNode(name, parent instanceof cc.Node ? parent : null)
        if (node) {
            let label = node.getComponent(cc.Label)
            if (!label) {
                // cc.warn(node.name + " not found cc.Label")
                return
            }

            // label.font = info.font || label.font
            label.fontSize = info.fontSize || label.fontSize
            label.lineHeight = info.fontSize ? info.fontSize + 3 : label.fontSize + 3
            label.node.color = info.color || label.node.color

            if (label.font && typeof label.font === "string") {
                let bundle = DataMgr.data.Bundle
                if (bundle) {
                    bundle.load(label.font, cc.Font, (err, res) => {
                        if (err) {
                            return
                        }

                        label.font = res
                        // let comp = label.addComponent(FontColor)
                        // comp.Color = info.color || label.node.color
                    })
                }
            }
        }
    }

    setRichTextValue(name: string | cc.Node, parent: cc.Node | string | number, value?: string | number) {
        if (!value && (typeof parent === "string" || typeof parent === "number")) {
            value = parent
            parent = null
        }
        let node = this.getNode(name, parent instanceof cc.Node ? parent : null)
        if (node) {
            let richText = node.getComponent(cc.RichText)
            if (!richText) {
                // cc.warn(node.name + " not found cc.Label")
                return
            }

            value = "" + value || ""
            richText.string = value
        }
    }

    setProgressLength(name: string | cc.Node, parent: cc.Node | number, length?: number) {
        if (!length && typeof parent === "number") {
            length = parent
            parent = null
        }
        let node = this.getNode(name, parent instanceof cc.Node ? parent : null)
        if (node) {
            let progress = node.getComponent(cc.ProgressBar)
            if (!progress) {
                // cc.warn(node.name + " not found cc.ProgressBar")
                return
            }

            progress.node.setContentSize(length, progress.node.height)
            progress.totalLength = length ? length - 2 : 0
        }
    }

    setProgressValue(name: string | cc.Node, parent: cc.Node | number, value?: number) {
        if (!value && typeof parent === "number") {
            value = parent
            parent = null
        }
        let node = this.getNode(name, parent instanceof cc.Node ? parent : null)
        if (node) {
            let progress = node.getComponent(cc.ProgressBar)
            if (!progress) {
                // cc.warn(node.name + " not found cc.ProgressBar")
                return
            }

            progress.progress = value || 0
        }
    }

    setToggleCheck(name: string | cc.Node, parent?: cc.Node | boolean, needEmit?: boolean) {
        if (!needEmit && typeof parent === "boolean") {
            needEmit = parent
            parent = null
        }

        if (undefined === needEmit || null === needEmit) {
            needEmit = true
        }

        let node = this.getNode(name, parent instanceof cc.Node ? parent : null)
        if (node) {
            let toggle = node.getComponent(cc.Toggle)
            if (!toggle) {
                // cc.warn(node.name + " node found cc.Toggle")
                return
            }

            toggle.check()
            if (needEmit) {
                // toggle.clickEvents.forEach(item => item.emit([]))
                for (let i of toggle.checkEvents) {
                    i.emit([])
                }
            }
        }
    }

    _pushRemoteQueue(url: string, func: Function) {
        if (func) {
            BaseUI._loadRemoteQueue.push({ url: url, func: func })
        }

        this._consumeRemote()
    }

    _consumeRemote() {
        if (BaseUI._onLoadRemote <= 10) {
            let data = BaseUI._loadRemoteQueue.shift()
            if (!data) return
            cc.assetManager.loadRemote(data.url, cc.SpriteFrame, (err, res: cc.SpriteFrame) => {
                BaseUI._onLoadRemote--
                this._consumeRemote()
                if (err) {
                    return
                }

                let n = data.url
                while (-1 !== n.indexOf(".")) {
                    n = n.replace(".", ";")
                }
                DataMgr.setData(n, res)
                data.func && typeof data.func === "function" && data.func(res)
            })

            BaseUI._onLoadRemote++
        }
    }

    setSpriteFrame(name: string | cc.Node, parent?: cc.Node | cc.SpriteFrame | string, sprite: cc.SpriteFrame | string | boolean = null, isFixSize: boolean = null) {
        if (!isFixSize && typeof sprite === "boolean") {
            isFixSize = sprite
            sprite = null
        }

        if (parent instanceof cc.SpriteFrame || typeof parent === "string") {
            sprite = parent
        }

        if (undefined === isFixSize || null === isFixSize) {
            isFixSize = true
        }

        let updateFrame = (src) => {
            if (!this.node || !this.node.isValid) {
                return
            }

            let node = this.getNode(name, parent instanceof cc.Node ? parent : null)
            if (!node || !src || !node.isValid) {
                return
            }

            let sprite = node.getComponent(cc.Sprite)
            let size: cc.Size = node["_baseSize"] || node.getContentSize()
            if (!node["_baseSize"]) {
                node["_baseSize"] = size
            }
            let newSize: cc.Size = cc.Size.ZERO
            if (src instanceof cc.SpriteFrame) {
                newSize = src.getOriginalSize()
                sprite.spriteFrame = src
            } else if (src instanceof cc.Texture2D) {
                newSize = cc.size(src.width, src.height)
                sprite && sprite.node && sprite.node.isValid && (sprite.spriteFrame = new cc.SpriteFrame(src))
            }

            if(sprite.type == cc.Sprite.Type.SLICED){
                return
            }

            if (isFixSize) {
                if (size.width / newSize.width < size.height / newSize.height) {
                    newSize.height *= size.width / newSize.width
                    newSize.width = size.width
                } else {
                    newSize.width *= size.height / newSize.height
                    newSize.height = size.height
                }
            }

            if (sprite && sprite.node) {
                sprite.node.setContentSize(newSize)
            }
        }

        if (sprite === null || sprite === "https://default") {
            updateFrame(null)
        } else if (typeof sprite === "string") {
            if (sprite.length === 0)
                return

            if (-1 !== sprite.indexOf("http://") || -1 !== sprite.indexOf("https://")) {
                if (-1 !== sprite.indexOf("qlogo.cn") || -1 !== sprite.indexOf("imageStyle")) {
                    sprite = sprite + "?aa=aa.png"
                }
                let n = sprite
                while (-1 !== n.indexOf(".")) {
                    n = n.replace(".", ";")
                }
                let src = DataMgr.getData<cc.Asset>(n)
                if (src) {
                    updateFrame(src)
                } else {
                    this._pushRemoteQueue(sprite, updateFrame)
                }
            } else {
                let fName: string = sprite
                // let load = (bName) => {
                //     return new Promise((rlv, rjt) => {
                //         cc.assetManager.getBundle(bName)
                //             .load(fName, cc.SpriteFrame, (err, res: cc.SpriteFrame) => {
                //                 if (err) {
                //                     rjt(err)
                //                     return
                //                 }
                //                 rlv(res)
                //             })
                //     })
                // }

                // load("igaoshou")
                // .then((res) => updateFrame(res))
                // .catch(() => {
                //     load("lobby")
                //     .then((res) => updateFrame(res))
                //     .catch(() => {})
                // })
                cc.assetManager.getBundle("lobby")?.load(fName, cc.SpriteFrame, (err, res: cc.SpriteFrame) => {
                    if (!err) {
                        updateFrame(res)
                    }

                    cc.assetManager.getBundle("igaoshou")?.load(fName, cc.SpriteFrame, (err1, res1: cc.SpriteFrame) => {
                        if (!err1) {
                            updateFrame(res1)
                        }
                    })
                }) 
            }
        } else if (sprite instanceof cc.SpriteFrame) {
            updateFrame(sprite)
        }
    }

    setSpriteInfo(name: string | cc.Node, parent: cc.Node | any, info: any = null) {
        if (!info && !(parent instanceof cc.Node)) {
            info = parent
            parent = null
        }

        let node = this.getNode(name, parent instanceof cc.Node ? parent : null)
        if (node && info) {
            let sprite = node.getComponent(cc.Sprite)
            if (!sprite) {
                // cc.warn(node.name + " node found cc.Sprite")
                return
            }

            sprite.fillRange = undefined != info.fillRange ? info.fillRange : sprite.fillRange
        }
    }

    setButtonInfo(name: string | cc.Node, parent: cc.Node | any, info?: any) {
        if (!info && !(parent instanceof cc.Node)) {
            info = parent
            parent = null
        }

        let node = this.getNode(name, parent instanceof cc.Node ? parent : null)
        if (node && info) {
            let button = node.getComponent(cc.Button)
            if (!button) {
                // cc.warn(node.name + " node found cc.Button")
                return
            }

            button.transition = info.transition || button.transition
            button.normalSprite = info.normalSprite || button.normalSprite
            button.pressedSprite = info.pressedSprite || button.pressedSprite
            button.disabledSprite = info.disabledSprite || button.disabledSprite

            if (undefined !== info.enableGray && null !== info.enableGray) {
                button.enableAutoGrayEffect = info.enableGray
                node.getComponentsInChildren(cc.RenderComponent).forEach(i => i.setMaterial(0, button.grayMaterial))
            }

            if (undefined !== info.interactable && null !== info.interactable) {
                button.interactable = info.interactable
                if (button["_autoDelay"]) {
                    button["_autoDelay"].stop()
                    button["_autoDelay"] = null
                }
            }

            if (info.normalSprite) {
                this.setSpriteFrame(button.target, button.normalSprite)
                info.size = info.size || info.normalSprite.getOriginalSize()
            }

            if (info.size) {
                node.setContentSize(info.size)
                button.target.setContentSize(info.size)
            }
        }
    }

    setButtonClick(name: string | cc.Node, parent: cc.Node | Function, callback?: Function | number, delay?: number) {
        if (!delay && typeof callback === "number") {
            delay = callback
            callback = null
        }

        if (!callback && typeof parent === "function") {
            callback = parent
            parent = null
        }

        let node = this.getNode(name, parent instanceof cc.Node ? parent : null)
        if (node) {
            let button = node.getComponent(cc.Button)
            if (!button) {
                // cc.warn(node.name + " node found cc.Button")
                return
            }

            let handler = "btn_" + button.name + "_click"
            for (let v of button.clickEvents) {
                if (v.target === this.node && v.component === "cc.Button" && v.handler === handler) {
                    return
                }
            }

            button[handler] = (sender, data) => {
                // cc.log(handler + "click")
                this.setButtonClickDelay(node, delay)
                callback && typeof callback === "function" && callback(sender, data)

                DataMgr.data.Bundle.load("sound/menu", cc.AudioClip, (err, res: cc.AudioClip) => {
                    if (err) {
                        return
                    }
                    cc.audioEngine.playEffect(res, false)
                })
            }

            let clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = button.node;
            clickEventHandler.component = "cc.Button";
            clickEventHandler.handler = handler;

            button.clickEvents.push(clickEventHandler);
        }
    }

    setButtonClickDelay(name: string | cc.Node, parent?: cc.Node | number | Function, delayTime?: number | Function, callback?: Function) {
        if (!callback && typeof delayTime === "function") {
            callback = delayTime
            delayTime = null
        }

        if (!callback && typeof parent === "function") {
            callback = parent
            parent = null
        }

        if (!delayTime && typeof parent === "number") {
            delayTime = parent
            parent = null
        }

        if (typeof delayTime !== "number") {
            delayTime = 1
        }

        let node = this.getNode(name, parent instanceof cc.Node ? parent : null)
        if (node) {
            let button = node.getComponent(cc.Button)
            if (!button) {
                // cc.warn(node.name + " node found cc.Button")
                return
            }

            button["_autoDelay"] = cc.tween(button)
                .set({ interactable: false })
                .delay(delayTime)
                .set({ interactable: true })
                .call(() => button["_autoDelay"] = null)
                .start()
        }
    }

    setToggleClick(name: string | cc.Node, parent: cc.Node | Function, callback?: Function, customData?: string) {
        if (!callback && typeof parent === "function") {
            callback = parent
            parent = null
        }
        let node = this.getNode(name, parent instanceof cc.Node ? parent : null)
        if (node) {
            let toggle = node.getComponent(cc.Toggle)
            let eventName = "toggle" + node.name + "_click"
            toggle[eventName] = (sender, eventType, customEventData) => {
                // cc.log(eventName)
                callback(sender, eventType, customEventData)
            }

            toggle.checkEvents = toggle.checkEvents || []

            let clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = node
            clickEventHandler.component = "cc.Toggle"
            clickEventHandler.handler = eventName
            clickEventHandler.customEventData = customData

            toggle.checkEvents.push(clickEventHandler)
        }
    }

    setLayoutInfo(name: string | cc.Node, parent: cc.Node | any, info?: any) {
        let node = this.getNode(name, parent instanceof cc.Node ? parent : null)
        if (!info && !(parent instanceof cc.Node)) {
            info = parent
            parent = null
        }
        if (node && info) {
            let layout = node.getComponent(cc.Layout)
            if (!layout) {
                // cc.warn(node.name + " node found cc.Layout")
                return
            }

            layout.type = info.type || layout.type
            layout.type = info.horizontal ? cc.Layout.Type.HORIZONTAL : layout.type
            layout.type = info.vertical ? cc.Layout.Type.VERTICAL : layout.type
            layout.resizeMode = info.resizeMode || layout.resizeMode
            layout.horizontalDirection = info.hDir || layout.horizontalDirection
            layout.verticalDirection = info.vDir || layout.verticalDirection
            layout.paddingTop = info.top !== undefined ? info.top : layout.paddingTop
            layout.paddingBottom = info.bottom !== undefined ? info.bottom : layout.paddingBottom
            layout.paddingLeft = info.left !== undefined ? info.left : layout.paddingLeft
            layout.paddingRight = info.right !== undefined ? info.right : layout.paddingRight
            layout.spacingX = info.spacingX !== undefined ? info.spacingX : layout.spacingX
            layout.spacingY = info.spacingY !== undefined ? info.spacingY : layout.spacingY
            layout.cellSize = info.cell ? info.cell : layout.cellSize

            layout.updateLayout()
        }
    }

    setScrollViewEvent(name: string | cc.Node, parent: cc.Node | Function, callback?: Function) {
        if (!callback && typeof parent === "function") {
            callback = parent
            parent = null
        }
        let node = this.getNode(name, parent instanceof cc.Node ? parent : null)
        if (node) {
            let scrollView = node.getComponent(cc.ScrollView)
            if (scrollView) {
                let eventName = "scrollView" + node.name + "_move"
                scrollView[eventName] = (sender, eventType, customEventData) => {
                    callback(sender, eventType, customEventData)
                }

                scrollView.scrollEvents = scrollView.scrollEvents || []

                let scrollEventHandler = new cc.Component.EventHandler();
                scrollEventHandler.target = node
                scrollEventHandler.component = "cc.ScrollView"
                scrollEventHandler.handler = eventName

                scrollView.scrollEvents.push(scrollEventHandler)
            }
        }
    }

    setSliderProgress(name: string | cc.Node, parent: cc.Node | number, progress?: number) {
        if (!progress && typeof parent === "number") {
            progress = parent
            parent = null
        }
        let node = this.getNode(name, parent instanceof cc.Node ? parent : null)
        if (node) {
            let slider = node.getComponent(cc.Slider)
            if (slider) {
                slider.progress = progress
            }
        }
    }

    setSliderEvent(name: string | cc.Node, parent: cc.Node | Function, callback?: Function) {
        if (!callback && typeof parent === "function") {
            callback = parent
            parent = null
        }
        let node = this.getNode(name, parent instanceof cc.Node ? parent : null)
        if (node) {
            let slider = node.getComponent(cc.Slider)
            if (slider) {
                let eventName = "slider" + node.name + "_move"
                slider[eventName] = (sender, eventType, customEventData) => {
                    callback(sender, eventType, customEventData)
                }

                slider.slideEvents = slider.slideEvents || []

                let sliderEventHandler = new cc.Component.EventHandler();
                sliderEventHandler.target = node
                sliderEventHandler.component = "cc.Slider"
                sliderEventHandler.handler = eventName

                slider.slideEvents.push(sliderEventHandler)
            }
        }
    }

    setSpineAni(name: string | cc.Node, parent: cc.Node | string, aniName?: string | boolean, loop?: boolean) {
        if (null === loop || undefined === loop) {
            if (typeof aniName === "boolean") {
                loop = aniName
                aniName = null
            } else {
                loop = false
            }
        }
        if (!aniName && typeof parent === "string") {
            aniName = parent
            parent = null
        }
        let node = this.getNode(name, parent instanceof cc.Node ? parent : null)
        if (node) {
            let spine = node.getComponent(sp.Skeleton)
            spine.clearTracks()
            spine.setAnimation(0, aniName + "", loop)
        }
    }
}