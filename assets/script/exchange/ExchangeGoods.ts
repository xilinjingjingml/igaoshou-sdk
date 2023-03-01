import BaseUI from "../base/BaseUI";
import { UIMgr } from "../base/UIMgr";
import { DataMgr } from "../base/DataMgr";
import { Constants } from "../constants";
import { Helper } from "../system/Helper";
import ExchangeItemMode from "../exchange/ExchangeItemMode"
import { ExchangeSrv } from "../system/ExchangeSrv"

const {ccclass, property} = cc._decorator;


@ccclass
export default class ExchangeGoods extends BaseUI {
    //搜索结果
    goodsContent:cc.Node = null
    @property(cc.Prefab)
    goodsPrefab:cc.Node = null

    currentPage = 1
    pageSize = 30
    onOpen(){
        console.log("ExchangeGoods onOpen", this.param)
        this.goodsContent = cc.find("scrollView/view/content/adviseList", this.node)

        this.initButton()

        this.getCategoryGoods(this.param.exchangeType)
    }

    onLoad(){
        console.log("ExchangeGoods onLoad", this.param) 
    }

    start () {
        console.log("ExchangeGoods start")
    }

    
    // update (dt) {}

    initButton(){
        let btnSearch = cc.find("titleNode/btnSearch", this.node)
        this.setButtonClick(btnSearch, ()=>{
           
        })
    }

    getCategoryGoods(type_id){
        console.log("getCategoryGoods", type_id)
        let param = {
            type_id: type_id,
            category_id : -1,
            keyword : "",
            page_size : this.pageSize,
            // current_page : this.currentPage,
            page_code : this.currentPage,
            sort_by:"market_price",
            order_code:1
        }
        ExchangeSrv.CategoryGoods(param, (res) => {   
            console.log("categoryGoods",res)
            if (res && res.goods_list) {
                this.initGoodsList(res.goods_list)
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
