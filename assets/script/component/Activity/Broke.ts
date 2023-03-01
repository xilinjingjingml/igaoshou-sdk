import BaseUI from "../../base/BaseUI";
import { Constants } from "../../constants";
import { AdSrv } from "../../system/AdSrv";
import { EventMgr } from "../../base/EventMgr";
import { Helper } from "../../system/Helper"
import { User } from "../../system/User";
import { DataMgr } from "../../base/DataMgr";
import { Util } from "../../api/utilApi";
import { MatchSvr } from "../../system/MatchSvr";
import { UIMgr } from "../../base/UIMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Broke extends BaseUI {
    @property(cc.Prefab)
    freeAwardModePrefab: cc.Node = null

    otherGameItem:cc.Node = null
    
    content:cc.Node = null
    onOpen() {
        Helper.reportEvent("大厅", "游戏币不足", "打开界面")
        console.log("Broke onOpen", this.param)
       
        this.initButton()
        
        let promotionList = DataMgr.getData(Constants.DATA_DEFINE.OTHER_GAME_PROMOTION)
        if(promotionList){
            this.initData(promotionList)
        }else{
            User.GetPromotion((res)=>{
                console.log("GetPromotion", res)
                if(res && res.length >  0){
                    this.initData(res)
                    DataMgr.setData(Constants.DATA_DEFINE.OTHER_GAME_PROMOTION, res)
                }else{
                    Helper.OpenTip("暂无推荐游戏")
                }
            })
        }
    }

    onClose() {
        Helper.reportEvent("大厅", "游戏币不足", "关闭界面")
    }

    onLoad(){
        this.content = cc.find("node/otherGameList", this.node)
        this.otherGameItem = cc.find("item", this.content)
        this.otherGameItem.active = false
    }

    initEvent() {
        
    }

    initButton(){
        this.setButtonClick("node/btnMore", this.node, ()=>{
            console.log("btnMore")
            this.close()  
            // EventMgr.dispatchEvent(Constants.EVENT_DEFINE.CHANGE_MAIN_TAB, { name: "shop" }) 
            Helper.OpenPageUI("component/Level/OtherGameLevel", "", null, {})
        })

        this.setButtonClick("node/btnClose", this.node, ()=>{
            this.close()        
        })

        this.setButtonClick("node/btnKefu", this.node, ()=>{
            let param = {
                buttons: 1,
                confirmName: "复制公众号",
                confirmUnclose: true,
                confirm: () => {Helper.copyToClipBoard("高手竞技")}
                // param: { msg: msg }
            }
            Helper.OpenPopUI("component/Personal/KefuEntry", "客服中心", null, param)    
        })

        this.setButtonClick("node/freeMatch/btn", this.node, ()=>{
            let data: TMatchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)
            console.log("freeMatch",data)
            for(let idx in data){
                let d = data[idx]
                if(d.freeAd && d.type === Constants.MATCH_TYPE.PRACTICE_MATCH){
                    MatchSvr.JoinMatch(d.matchId)
                    break
                }
            }
        })

        this.setButtonClick("node/freeAward/btn", this.node, ()=>{
            this.close()  
            UIMgr.CloseUI("component/Match/MatchDetailEntry")
            UIMgr.CloseUI("component/Match/ActivityMatchList")
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.CHANGE_MAIN_TAB, { name: "shop" }) 
        })
   
    }

    initData(promotionList:any){
        if(this.param.page == 3){
            this.setSpriteFrame("node/freeAward/icon_bg/icon", "image/icon/G6", true)
            this.setLabelValue("node/freeAward/desc", "最高可领取10金币")
        }
        // for (let data of this.param.activityConfig) {
        //     let itemNode = cc.instantiate(this.freeAwardModePrefab)
        //     itemNode.name = "item" + data.activity_id
        //     itemNode.parent = this.content
        //     this.setChildParam(itemNode, data)
        // }
        for(let v of promotionList){
            v.sort_id = v.sort_id || 0
        }

        promotionList = promotionList.sort((a, b) => {
            return a.sort_id < b.sort_id ? -1 : 1
        })

        let counter = 0
        for(let v of promotionList){
            if(counter < 3){
                let itemNode = cc.instantiate(this.otherGameItem)
            itemNode.parent = this.content
                itemNode.active = true
                
                this.setLabelValue("name", itemNode, v.promotion_game_name)
                this.setSpriteFrame("icon", itemNode, v.icon, true)

                this.setButtonClick("btn", itemNode, () => {
                    console.log("btnAdd on click")
                    Util.NativeGame(v.promotion_appid)
                })
            }
            counter++
        }
    }

    createAdOrder(){
        AdSrv.createAdOrder(this.param.ad_aid, JSON.stringify(this.param), (order_no: string) => {
            if (order_no && order_no.length > 0) {
                this.close()
                AdSrv.completeAdOrder()
            }
        })
    }
}
