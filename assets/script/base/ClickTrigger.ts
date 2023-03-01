/*
 * @Description: 
 * @Version: 1.0
 * @Autor: sonke
 * @Date: 20210330 1528
 * @LastEditors: sonke
 * @LastEditTime: 20210330 1529
 */

import { UIMgr } from "./UIMgr";
import { EventMgr } from "./EventMgr";

const {ccclass, property} = cc._decorator;

let CLICK_TYPE = cc.Enum({
    OPEN_ENTRY: 0 ,
    SEND_EVENT: 1,
})

@ccclass("Trigger")
export class Trigger {
    @property({
        type: cc.Enum(CLICK_TYPE)
    })
    clickType = CLICK_TYPE.OPEN_ENTRY

    @property({
        visible() { return this.clickType === CLICK_TYPE.OPEN_ENTRY }
    })
    entryName: string = ""

    @property({
        visible() { return this.clickType === CLICK_TYPE.OPEN_ENTRY }
    })
    entryParent: string = ""

    @property({
        visible() { return this.clickType === CLICK_TYPE.OPEN_ENTRY }
    })
    entryParam: string = ""

    @property({
        visible() { return this.clickType === CLICK_TYPE.SEND_EVENT}
    })
    eventName: string = ""

    @property({
        visible() { return this.clickType === CLICK_TYPE.SEND_EVENT}
    })
    eventParam: string = ""
}

@ccclass
export default class ClickTrigger extends cc.Component {

    @property({
        type: cc.Node
    })
    target = null

    @property({
        type: [Trigger],
        serializable: true
    })    
    triggers: Trigger[] = []

    _compoent: cc.Toggle | cc.Button = null
    
    start() {
        if (!this.target) {
            this.target = this.node
        }

        if (!this._compoent) {
            this._compoent = this.target.getComponent(cc.Toggle)
        }

        if (!this._compoent) {
            this._compoent = this.target.getComponent(cc.Button)            
        }
        
        if (!this.haveEvent()) {
            this.bindButton()
        }
    }

    haveEvent() {        
        if (!this._compoent) {
            return
        }

        let events = this._compoent.clickEvents
        for (let k in events) {
            let v = events[k]
            if (v.component === "ClickTrigger" && v.handler === "onTrigger") {
                return true
            }
            else if (v["_componentId"] === this["__cid__"]) {
                return true
            }
        }

        return false
    }

    bindButton() {
        if (!this._compoent) {
            return
        }

        let clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node; 
        clickEventHandler.component = "ClickTrigger";
        clickEventHandler.handler = "onTrigger"; 
            
        this._compoent.clickEvents.push(clickEventHandler);   
    }

    onTrigger(sender) {
        for (let t of this.triggers) {
            if (t.clickType === CLICK_TYPE.OPEN_ENTRY) {       
                let param = JSON.parse(t.entryParam)
                param.parent = t.entryParent
                UIMgr.OpenUI(t.entryName, param)
            } 
            else if (t.clickType === CLICK_TYPE.SEND_EVENT) {
                EventMgr.dispatchEvent(t.eventName, t.eventParam)
            }
        }        
    }

}
