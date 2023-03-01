import BaseUI from "../../base/BaseUI";
import { Constants } from "../../constants";
import { DataMgr } from "../../base/DataMgr";
import { ITEM_STYLE } from "../Base/ItemMode";
import { ShopSvr } from "../../system/ShopSvr";
import { AdSrv } from "../../system/AdSrv";
import { UIMgr } from "../../base/UIMgr";
import { Helper } from "../../system/Helper";
import { EventMgr } from "../../base/EventMgr";
import { TaskSrv } from "../../system/TaskSrv"
import { User } from "../../system/User";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Task extends BaseUI {
    listContent: cc.Node = null
    itemNode: cc.Node = null

    activityConfig:any = null
    onOpen() {
        console.log("Task onOpen", this.param)
        this.activityConfig = this.param.activityConfig || {}
        this.activityConfig.ad_aid = this.param.activityConfig.ad_aid || 0

        this.refreshActivityData()
    }

    onLoad() {
        this.listContent = cc.find("scrollView/view/content", this.node)
        this.itemNode = cc.find("scrollView/view/content/item", this.node)
        this.itemNode.active = false
    }

    initEvent() {

    }

    initButton() {

    }

    refreshActivityData() {
        TaskSrv.GetTaskList((res) => {
            if (res.list) {
                this.initData(res.list)
            }
        })
    }

    initData(list: any) {
        this.listContent.removeAllChildren()
        for (let i = 0; i < list.length; i++) {
            let info = list[i]
            let itemNode = cc.instantiate(this.itemNode)
            itemNode.active = true
            this.listContent.addChild(itemNode)

            this.setSpriteFrame("icon", itemNode, "image/activity/" + info.icon)

            let taskName = cc.find("taskName", itemNode)
            taskName.getComponent(cc.Label).string = info.desc

            let progress = cc.find("progress", itemNode)
            info.progress = info.progress || 0
            progress.getComponent(cc.ProgressBar).progress = info.progress / info.max_progress

            let value = cc.find("value", progress)
            value.getComponent(cc.Label).string = info.progress + "/" + info.max_progress

            let btnUnFinish = cc.find("btnUnFinish", itemNode)
            let btnGetAward = cc.find("btnGetAward", itemNode)
            let btnFinish = cc.find("btnFinish", itemNode)
            //任务状态 0未完成 1奖励未领取 2已完成
            info.status = info.status || 0
            switch (info.status) {
                case 0:
                    btnUnFinish.active = true
                    break
                case 1:
                    btnGetAward.active = true
                    break
                case 2:
                    btnFinish.active = true
                    break
            }

            if (info.award_list && info.award_list[0]) {
                for (let v of info.award_list) {
                    // cc.find("ItemMode", itemNode).scale = 0.8  
                    // this.setChildParam("ItemMode", itemNode, {items: [{id:v.id, num: v.num}], condense: v.num >= 10000 })
                    this.setActive("awards/wcoin", itemNode, false)
                    this.setActive("awards/lottery", itemNode, false)
                    this.setActive("awards/diamond", itemNode, false)
                    if (v.id === Constants.ITEM_INDEX.WCOIN) {
                        this.setActive("awards/wcoin", itemNode, true)
                        this.setLabelValue("awards/wcoin/num", itemNode, v.num >= 10000 ? Helper.FormatNumWY(v.num) : v.num)
                    } else if (v.id === Constants.ITEM_INDEX.LOTTERY) {
                        this.setActive("awards/lottery", itemNode, true)
                        this.setLabelValue("awards/lottery/num", itemNode, v.num >= 10000 ? Helper.FormatNumWY(v.num) : v.num)
                    } else if (v.id === Constants.ITEM_INDEX.DIAMOND) {
                        this.setActive("awards/diamond", itemNode, true)
                        this.setLabelValue("awards/diamond/num", itemNode, v.num >= 10000 ? Helper.FormatNumWY(v.num) : Helper.FormatNumPrice(v.num / 100))
                    }
                }
            }

            this.setButtonClick(btnGetAward, () => {
                if(this.activityConfig.ad_aid > 0){
                    AdSrv.createAdOrder(this.activityConfig.ad_aid, JSON.stringify(this.activityConfig), (order_no:string)=>{
                        if(order_no && order_no.length > 0){
                            AdSrv.completeAdOrder((res) => {
                                if (res && res.code == "00000"){
                                    this.getAward(info)
                                }
                            })            
                        }
                    })
                }else{
                    this.getAward(info)
                }                
            })
        }
    }

    getAward(info:any){
        TaskSrv.GetAward(info.task_id, (res) => {
            this.refreshActivityData()
            for (let v of res.award_list) {
                v.item_id = v.id
                v.item_num = v.num
            }
            User.UpdateItem(() =>UIMgr.OpenUI("component/Shop/GetAwardEntry", { param: { awards: res.award_list, autoOpenBox: true } }))
        })
    }
}
