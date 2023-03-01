import BaseUI from "../base/BaseUI";
import { Helper } from "../system/Helper";
import ExchangePriceMode from "./ExchangePriceMode";
import { DataMgr } from "../base/DataMgr";
import { Constants } from "../constants";
import ExchangeItemMode from "./ExchangeItemMode"
import { EventMgr } from "../base/EventMgr";

const {ccclass, property} = cc._decorator;

interface GoodsItem {
    itemNode:cc.Node,
    cartInfo:any
}

@ccclass
export default class ExchangeAdvise extends BaseUI {
    //推荐列表
    content:cc.Node = null
    @property(cc.Prefab)
    adviseItemPrefab:cc.Node = null

    // cartListData:any = null
    selectNum = 0
    currentPage = 1
    pageSize = 30
    pageEnd = false
    onOpen(){
        console.log("ExchangeAdvise onOpen", this.param)

        
        this.content = cc.find("adviseList", this.node)

        this.getfirstGoods()
        

    }

    onLoad(){
        console.log("onLoad")
    }

    start () {
        console.log("ExchangeAdvise start")
    }

    nextPage(){
        if(!this.pageEnd){
            this.currentPage += 1
            this.getfirstGoods()
        }
    }

    getfirstGoods(){
        let param = {
            page_size :this.pageSize,
            page_code: this.currentPage,
            sort_by:"",
            order_code:0
        }
        Helper.PostHttp("igaoshou-shop-srv/goods/homeInfo", null , param,(res, event) => {
            console.log("getfirstGoods", res)
            if (res && res.first_goods) {
                this.initAdviseList(res.first_goods)
            }

            if (!res.first_goods || res.first_goods.length < this.pageSize){
                this.pageEnd = true
            }
        })
    }    

    initAdviseList(firstGoods:any){
        for(let i=0;i<firstGoods.length;i++){
            let goodsInfo = firstGoods[i]
            let itemNode = cc.instantiate(this.adviseItemPrefab)
            itemNode.active = true
            this.content.addChild(itemNode)

            itemNode.getComponent(ExchangeItemMode).setData(goodsInfo, goodsInfo.pris[0].pris_gid)            
        }
    }
}
