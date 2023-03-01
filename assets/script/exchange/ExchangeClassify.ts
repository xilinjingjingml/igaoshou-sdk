import BaseUI from "../base/BaseUI";
import { Helper } from "../system/Helper";
import ExchangeItemMode from "../exchange/ExchangeItemMode"
import ExchangePriceMode from "./ExchangePriceMode"
import { DataMgr } from "../base/DataMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ExchangeClassify extends BaseUI {

    //分类列表
    classContent:cc.Node = null
    classItemPrefab:cc.Node = null

    //商品列表
    contentScrollView:cc.Node = null
    contentContent:cc.Node = null
    contentItemPrefab:cc.Node = null

    categoryListData = null

    curCategoryId:number = 0
    currentPage = 1
    pageSize = 12
    pageEnd = false
    onOpen(){
        console.log("ExchangeClassify onOpen", this.param)
        this.categoryListData = this.param.categoryList
        this.classContent = cc.find("classScrollView/view/content", this.node)
        this.classItemPrefab = cc.find("classScrollView/view/content/item", this.node)
        this.classItemPrefab.active = false

        this.contentScrollView = cc.find("contentScrollView", this.node)
        this.contentContent = cc.find("contentScrollView/view/content/content", this.node)
        this.contentItemPrefab = cc.find("contentScrollView/view/content/content/item", this.node)
        this.contentItemPrefab.active = false
        

        this.initButton()
        this.initList()

        this.setScrollViewEvent(this.contentScrollView, (sender, eventType,customEventData) => {
            if (eventType == cc.ScrollView.EventType.BOUNCE_BOTTOM) {
                if(!this.pageEnd){
                    this.currentPage += 1
                    this.getCategoryGoods(this.curCategoryId)
                }
            }
        })
    }

    start () {
        console.log("ExchangeClassify start")
    }

    
    // update (dt) {}

    getCategoryGoods(category_id){
        console.log("getCategoryGoods", category_id)
        let param = {
            type_id: -1,
            category_id : category_id,
            keyword : "",
            page_size : this.pageSize,
            // current_page : this.currentPage,
            page_code : this.currentPage,
            sort_by:"",
            order_code:0
        }

        let strParam = ""
        for(var k in param){
            strParam += k + "=" + param[k] + "&"
        }
        let data:any = DataMgr.getData("categoryGoods" + strParam)
        if(data){
            this.initContentList(data.goods_list)
        }else{
            Helper.PostHttp("igaoshou-shop-srv/goods/categoryGoods", null, param, (res, event) => {   
                console.log("categoryGoods",res)
                if (res && res.goods_list) {
                    this.initContentList(res.goods_list)
                    DataMgr.setData("categoryGoods" + strParam, res)
                }

                if(!event){
                    if(!res || !res.goods_list || res.goods_list.length < this.pageSize){
                        this.pageEnd = true
                    }
                }
                console.log("this.pageEnd",this.pageEnd)
            })
        }
    }

    initButton(){
    }

    initList(){
        for(let i=0;i<this.categoryListData.length;i++){
            let v = this.categoryListData[i]
            let itemNode = cc.instantiate(this.classItemPrefab)
            itemNode.active = true
            this.classContent.addChild(itemNode)

            let lbl1 = cc.find("Background/lbl",itemNode)
            lbl1.getComponent(cc.Label).string = v.category_name

            let lbl2 = cc.find("checkmark/lbl",itemNode)
            lbl2.getComponent(cc.Label).string = v.category_name

            this.setToggleClick(itemNode, (sender, data) => {
                console.log("i", v.category_id)
                if(v.category_id != this.curCategoryId){
                    this.pageEnd = false
                    this.currentPage = 1                    
                    this.curCategoryId = v.category_id  
                    this.contentScrollView.getComponent(cc.ScrollView).stopAutoScroll()
                    this.contentScrollView.getComponent(cc.ScrollView).scrollToTop()
                    this.contentContent.removeAllChildren()
                    this.getCategoryGoods(v.category_id)
                }
            })
            
            if(i == 0){
                itemNode.getComponent(cc.Toggle).isChecked = true
                this.getCategoryGoods(v.category_id)
            }
        }
    }

    initContentList(goodsList:any){
        for(let i=0;i<goodsList.length;i++){
            let goodsInfo = goodsList[i]
            let itemNode = cc.instantiate(this.contentItemPrefab)
            itemNode.active = true
            this.contentContent.addChild(itemNode)

            let lblName = cc.find("lblName",itemNode)
            lblName.getComponent(cc.Label).string = goodsInfo.product_name.toString().length > 26 ? goodsInfo.product_name.substr(0,25) + "..." : goodsInfo.product_name
           
            let productImages = cc.find("icon",itemNode)
            this.setSpriteFrame(productImages, goodsInfo.product_images)

            let priceMode = cc.find("ExchangePriceMode",itemNode)
            priceMode.getComponent(ExchangePriceMode).setPri(goodsInfo.pris[0].pri)

            let btn = cc.find("btn", itemNode)
            this.setButtonClick(btn, () => {
                DataMgr.setData("ExchangeSubstanceEntryGoodsInfo", goodsInfo)
                Helper.OpenPageUI("component/Exchange/ExchangeSubstanceEntry", "实物详情", null, {goodsInfo:goodsInfo})
            })
        }
    }
}
