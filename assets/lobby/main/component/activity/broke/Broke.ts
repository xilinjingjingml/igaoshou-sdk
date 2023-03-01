import BaseUI from "../../../../start/script/base/BaseUI";
import { DataMgr } from "../../../../start/script/base/DataMgr";
import { Constants } from "../../../../start/script/igsConstants";
import { UserSrv } from "../../../../start/script/system/UserSrv";
import { Helper } from "../../../../start/script/system/Helper";
import { PluginMgr } from "../../../../start/script/base/PluginMgr";
import { MatchSvr } from "../../../../start/script/system/MatchSvr";
import { UIMgr } from "../../../../start/script/base/UIMgr";
import { PlatformApi } from "../../../../start/script/api/platformApi";
import { EventMgr } from "../../../../start/script/base/EventMgr";
import { Util } from "../../../../start/script/api/utilApi";
import { AdSrv } from "../../../../start/script/system/AdSrv";


const {ccclass, property} = cc._decorator;

@ccclass
export default class Broke extends BaseUI {
    otherGameItem:cc.Node = null
    
    content:cc.Node = null
    onOpen() {
        // Helper.reportEvent("大厅", "游戏币不足", "打开界面")
        console.log("Broke onOpen", this.param)
       
        this.initButton()
        
        let promotionList = DataMgr.getData(Constants.DATA_DEFINE.OTHER_GAME_PROMOTION)
        if(promotionList){
            this.initData(promotionList)
        }else{
            UserSrv.GetPromotion((res)=>{
                console.log("GetPromotion", res)
                if(res && res.length >  0){
                    this.initData(res)
                }else{
                    Helper.OpenTip("暂无推荐游戏")
                }
            })
        }

        if(cc.sys.BYTEDANCE_GAME === cc.sys.platform || PluginMgr.isH52345Game()){
            this.setActive("node/keFuNode", false)
            this.setActive("node/otherGame", false)
        }
    }

    onClose() {
        // Helper.reportEvent("大厅", "游戏币不足", "关闭界面")
    }

    onLoad(){
        this.content = cc.find("node/otherGame/otherGameList", this.node)
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
            Helper.OpenPageUI("component/level/style1/OtherGameLevel", "", null, {})
        })

        this.setButtonClick("node/btnClose", this.node, ()=>{
            this.close()        
        })

        this.setButtonClick("node/keFuNode/btnKefu", this.node, ()=>{
            let param = {
                buttons: 1,
                confirmName: "复制公众号",
                confirmUnclose: true,
                confirm: () => {Helper.copyToClipBoard("高手竞技")}
                // param: { msg: msg }
            }
            Helper.OpenPopUI("component/personal/KefuPop", "客服中心", null, param)    
        })

        this.setButtonClick("node/freeMatch/btn", this.node, ()=>{
            let data: TMatchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)
            console.log("freeMatch",data)
            let joinMatch = false
            for(let idx in data){
                let d = data[idx]
                if (data[idx].gameId !== DataMgr.data.Config.gameId) {
                    continue
                }
                if(d.freeAd && d.type === Constants.MATCH_TYPE.PRACTICE_MATCH){
                    joinMatch = true
                    MatchSvr.JoinMatch(d.matchId)
                    this.param?.brokeCb?.()
                    break
                }
            }

            if(!joinMatch){
                Helper.OpenTip("暂未开放！请前往免费福利")
            }
        })

        this.setButtonClick("node/freeAward/btn", this.node, ()=>{
            this.close()  
            UIMgr.CloseUI("component/matchDetail/MatchDetail")
            UIMgr.CloseUI("component/match/activityMatch/ActivityMatchList")
            UIMgr.CloseUI("component/task/TaskScene")
            if (cc.director.getScene().name === "result") {
                PlatformApi.GotoLobby("shop")
            } else {
                EventMgr.dispatchEvent(Constants.EVENT_DEFINE.CHANGE_MAIN_TAB, { name: "shop" }) 
            }
            this.param?.brokeCb?.()
        })
   
    }

    initData(promotionList:any){
        if(this.param.page == 3){
            this.setSpriteFrame("node/freeAward/icon_bg/icon", "image/icon/G6", true)
            this.setLabelValue("node/freeAward/desc", "最高可领取10金币")
        }

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
        AdSrv.createAdOrder(this.param.ad_aid, JSON.stringify(this.param), (res: IPlayAdCallBack) => {
            if (res && res.order_no && res.order_no.length > 0) {
                this.close()
                AdSrv.completeAdOrder()
            }
        })
    }
}
