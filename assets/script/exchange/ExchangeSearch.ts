import BaseUI from "../base/BaseUI";
import { UIMgr } from "../base/UIMgr";
import { DataMgr } from "../base/DataMgr";
import { Constants } from "../constants";
import { Helper } from "../system/Helper";
import ExchangeItemMode from "../exchange/ExchangeItemMode"

const {ccclass, property} = cc._decorator;


@ccclass
export default class ExchangeSearch extends BaseUI {
    history:cc.Node = null
    tabNode:cc.Node = null
    scrollView:cc.Node = null
    //搜索历史
    historyContent:cc.Node = null
    historyPrefab:cc.Node = null
    editBox:cc.Node = null
    historyData:string[] = null

    //搜索结果
    goodsContent:cc.Node = null
    @property(cc.Prefab)
    goodsPrefab:cc.Node = null

    sort_by = ""
    order_code = 0
    keyword:string = ""
    currentPage = 1
    pageSize = 30
    pageEnd = false
    onOpen(){
        console.log("ExchangeSearch onOpen", this.param)
        this.history = cc.find("history",this.node)
        this.tabNode = cc.find("tabNode",this.node)
        this.scrollView = cc.find("scrollView",this.node)

        this.editBox = cc.find("titleNode/editBox",this.node)

        this.initButton()

        this.setScrollViewEvent(this.scrollView, (sender, eventType,customEventData) => {
            if (eventType == cc.ScrollView.EventType.BOUNCE_BOTTOM) {
                if(!this.pageEnd){
                    this.currentPage += 1
                    this.getCategoryGoods()
                }
            }
        })
    }

    onLoad(){
        console.log("ExchangeSearch onLoad", this.param)
        this.historyContent = cc.find("history/content", this.node)
        this.historyPrefab = cc.find("history/content/item", this.node)
        this.historyPrefab.active = false
        
        this.historyData = DataMgr.getData(Constants.DATA_DEFINE.EXCHANGE_SEARCH)
        this.historyData = this.historyData != null ? this.historyData : new Array()
        console.log("ExchangeSearch this.historyData", this.historyData)
        this.initHistoryContentList()

        this.goodsContent = cc.find("scrollView/view/content/adviseList", this.node)

        this.scheduleOnce(()=>{
            this.node.getParent().getParent().getComponent(cc.Widget).top = -70
            this.node.getParent().getComponent(cc.Widget).top = 70
            this.node.getParent().getParent().getComponent(cc.Widget).updateAlignment()
            this.node.getParent().getComponent(cc.Widget).updateAlignment()
        }, 0.55)
    }

    start () {
        console.log("ExchangeSearch start")
    }

    
    // update (dt) {}

    initButton(){
        let btnSearch = cc.find("titleNode/btnSearch", this.node)
        this.setButtonClick(btnSearch, ()=>{
            this.btnSearchOnClick()
        })

        let btnCleanHistory = cc.find("history/titleNode/btnClean", this.node)
        this.setButtonClick(btnCleanHistory, ()=>{
            this.historyData.splice(0,this.historyData.length)
            DataMgr.setData(Constants.DATA_DEFINE.EXCHANGE_SEARCH, this.historyData, true)
            this.initHistoryContentList()
        })

        let btnSort = cc.find("tabNode/btnSort", this.node)
        this.setButtonClick(btnSort, ()=>{
            this.sort_by = "market_price"

            let arrowNode = cc.find("arrowNode", btnSort)
            this.order_code = this.order_code == 1 ? -1 : 1
            if(this.order_code == 1){
                arrowNode.angle = 0
            }else{
                arrowNode.angle = 180
            }
            this.btnSearchOnClick()
        })
    }

    editBoxDidBegan(){
        console.log("ExchangeSearch editBoxDidBegan")
        this.history.active = true
        this.tabNode.active = false
        this.scrollView.active = false
    }

    btnSearchOnClick(){
        let text = this.editBox.getComponent(cc.EditBox).string
        console.log("btnSearch on click", text)
        
        if(text.length > 0){
            this.history.active = false
            this.tabNode.active = true
            this.scrollView.active = true

            for(let i=0;i<this.historyData.length;i++){
                if(this.historyData[i] == text){
                    this.historyData.splice(i,1)
                    break
                }
            }
            
            if(this.historyData.length >= 15){
                this.historyData.splice(0,1)
            }

            this.historyData.push(text)
            DataMgr.setData(Constants.DATA_DEFINE.EXCHANGE_SEARCH, this.historyData, true)
            this.initHistoryContentList()
            
            this.goodsContent.removeAllChildren()
            this.scrollView.getComponent(cc.ScrollView).stopAutoScroll()
            this.scrollView.getComponent(cc.ScrollView).scrollToTop()
            this.keyword = text
            this.currentPage = 1
            this.pageEnd = false
            this.getCategoryGoods()
        }
    }

    initHistoryContentList(){
        this.historyContent.removeAllChildren()
        for(let i=this.historyData.length-1;i>=0;i--){
            let itemNode = cc.instantiate(this.historyPrefab)
            itemNode.active = true
            this.historyContent.addChild(itemNode)

            let lbl = cc.find("Background/Label", itemNode)
            lbl.getComponent(cc.Label).string = this.historyData[i]

            this.setButtonClick(itemNode, ()=>{
                console.log("itemNode on click", i)
                console.log("itemNode on click", this.historyData[i])
                console.log("itemNode on click", this.historyData)
                this.editBox.getComponent(cc.EditBox).string = this.historyData[i]
                this.btnSearchOnClick()
            })
        }
    }

    getCategoryGoods(){
        console.log("getCategoryGoods")
        let param = {
            type_id: -1,
            category_id : -1,
            keyword : this.keyword,
            page_size : this.pageSize,
            page_code : this.currentPage,
            sort_by: this.sort_by, //排序字段
            order_code: this.order_code //顺序 -1降序 1升序
        }
        console.log("categoryGoods param",param)
        Helper.PostHttp("igaoshou-shop-srv/goods/categoryGoods", null, param, (res, event) => {   
            console.log("categoryGoods",res)
            if(res && res.code == "00000"){
                if (res.goods_list && res.goods_list.length > 0) {
                    this.initGoodsList(res.goods_list)
                }
                
                if(!res.goods_list || res.goods_list.length < this.pageSize){
                    this.pageEnd = true
                }
            }
        })
    }

    initGoodsList(goodsList:any){
        for(let i=0;i<goodsList.length;i++){
            let goodsInfo = goodsList[i]
            let itemNode = cc.instantiate(this.goodsPrefab)
            itemNode.active = true
            this.goodsContent.addChild(itemNode)
            
            itemNode.getComponent(ExchangeItemMode).setData(goodsInfo)
        }
    }
}
