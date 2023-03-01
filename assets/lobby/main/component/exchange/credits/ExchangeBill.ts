import BaseUI from "../../../../start/script/base/BaseUI";
import { Constants } from "../../../../start/script/igsConstants";
import { EventMgr } from "../../../../start/script/base/EventMgr";
import { DataMgr } from "../../../../start/script/base/DataMgr";
import { Helper } from "../../../../start/script/system/Helper";
import ExchangePriceMode from "./ExchangePriceMode";
import ExchangeAdvise from "./ExchangeAdvise";


const {ccclass, property} = cc._decorator;


@ccclass
export default class ExchangeBill extends BaseUI {
    scrollView:cc.Node = null
    itemList:cc.Node = null
    itemPrefab:cc.Node = null

    emptyNode:cc.Node = null
    //推荐列表
    adviseNode:cc.Node = null

    tabContent:cc.Node = null
    tabPrefab:cc.Node = null

    curState:number = -1
    TabItem = [
        {
            name: "全部",
            state: -1
        },
        {
            name: "待付款",
            state: 0
        },
        {
            name: "待收货",
            state: 1
        },
        {
            name: "已完成",
            state: 2
        },
        {
            name: "已取消",
            state: 3
        }
    ]

    orderListData:any[] = null
    onOpen(){
        console.log("ExchangeBill onOpen", this.param)

        this.initButton()
        this.initTabList()

        this.getOrderList(this.TabItem[0].state)

        this.setScrollViewEvent(this.scrollView, (sender, eventType,customEventData) => {
            if (eventType == cc.ScrollView.EventType.BOUNCE_BOTTOM) {
                this.adviseNode.getComponent(ExchangeAdvise).nextPage()           
            }
        })

        EventMgr.on(Constants.EVENT_DEFINE.UPDATE_BILL, (args)=>{
            this.getOrderList(this.curState)
        })
    }

    onLoad(){
        console.log("ExchangeBill onLoad", this.param)
        this.scrollView = cc.find("scrollView", this.node)
        this.itemList = cc.find("scrollView/view/content/itemList", this.node)
        this.itemPrefab = cc.find("scrollView/view/content/itemList/item", this.node)
        this.itemPrefab.active = false

        this.tabContent = cc.find("tabNode", this.node)
        this.tabPrefab = cc.find("tabNode/toggle", this.node)
        this.tabPrefab.active = false
        
        this.emptyNode = cc.find("scrollView/view/content/emptyNode", this.node)
        this.adviseNode = cc.find("scrollView/view/content/ExchangeAdvise", this.node)
        this.emptyNode.active = false
        this.adviseNode.active = false
    }

    start () {
        console.log("ExchangeBill start")
    }

    onDisable(){
        console.log("ExchangeBill onDisable")
        EventMgr.offByTag(this)
    }

    
    // update (dt) {}

    initButton(){
        let btnEmpty = cc.find("btnEmpty", this.emptyNode)
        this.setButtonClick(btnEmpty, (sender, data) => {
            console.log("btnEmpty on click")
            let homeInfoData:any = DataMgr.getData(Constants.DATA_DEFINE.EXCHANGE_HOME_INFO_DATA)
            if(homeInfoData && homeInfoData.category_list){
                Helper.OpenPageUI("component/Exchange/ExchangeClassify", "全部分类", null, {categoryList:homeInfoData.category_list})
            }else{
                this.close()
            }
        })       
    }

    initTabList(){
        for(let i=0;i<this.TabItem.length;i++){
            let v = this.TabItem[i]
            let itemNode = cc.instantiate(this.tabPrefab)
            itemNode.active = true
            this.tabContent.addChild(itemNode)

            let lbl1 = cc.find("Background/lbl", itemNode)
            lbl1.getComponent(cc.Label).string = v.name

            let lbl2 = cc.find("checkmark/lbl", itemNode)
            lbl2.getComponent(cc.Label).string = lbl1.getComponent(cc.Label).string

            if(i == 0){
                itemNode.getComponent(cc.Toggle).isChecked = true
            }

            this.setToggleClick(itemNode, ()=>{
                console.log("itemNode on click", v)
                this.itemList.removeAllChildren()
                this.getOrderList(v.state)
            })
        }
    }

    //获取订单列表
    getOrderList(state:number){
        this.curState = state
        let param = {
            order_state: state //-1全部  0 :待付款  1：待收货   2: 已完成
        }
        console.log("getOrderList param", param)
        Helper.PostHttp("igaoshou-shop-srv/goods/orderList",  null,param, (res, event) => {   
            console.log("getOrderList res",res)
            if (res && res.code == "00000") {
               if(res.order_list && res.order_list != "null"){
                    this.orderListData = JSON.parse(res.order_list)
                    console.log("getOrderList jsonObject", this.orderListData)
                    
                    this.initList()
                    this.scrollView.getComponent(cc.ScrollView).stopAutoScroll()
                    this.scrollView.getComponent(cc.ScrollView).scrollToTop()
                    this.itemList.active = true
                    this.emptyNode.active = false
                    this.adviseNode.active = false
               }else{
                    this.scrollView.getComponent(cc.ScrollView).stopAutoScroll()
                    this.scrollView.getComponent(cc.ScrollView).scrollToTop()
                    this.itemList.active = false
                    this.emptyNode.active = true
                    this.adviseNode.active = true
               }
            }
        })
    }

    //修改订单状态
    confirmOrder(orderNo:string, state:number , callback:Function){
        let param = {
            orderNo: orderNo,
            state:state
        }
        console.log("ConfirmOrder", param)
        Helper.PostHttp("igaoshou-shop-srv/goods/ConfirmOrder", null, param, (res, event) => {   
            console.log("ConfirmOrder",res)
            if (res && res.code == "0000") {
                callback()
            }
        })
    }

    //获取物流信息
    getOrderShipmentBlh(orderNo:string, callback:Function){
        let param = {
            orderNo:orderNo
        }
        console.log("GetOrderShipmentBlh", param)
        Helper.PostHttp("igaoshou-shop-srv/goods/GetOrderShipmentBlh", null, param,  (res, event) => {   
            console.log("GetOrderShipmentBlh",res)
            if (res && res.code == "0000") {
                let data = JSON.parse(res.data)
                console.log("GetOrderShipmentBlh data", data)
                if(data && data.express && data.express[0] && data.express[0].express_track && data.express[0].express_track[0]){
                    data.express[0].express_track.reverse()
                    let express = data.express[0]
                    callback(express)
                }else{
                    Helper.OpenTip("暂无物流信息")
                }
            }
        })
    }

    prefixInteger(num, m) {
        return (Array(m).join("0") + num).slice(-m);
    }

    initList(){
        for(let i=0;i<this.orderListData.length;i++){
            let orderInfo = this.orderListData[i]
            let itemNode = cc.instantiate(this.itemPrefab)
            itemNode.active = true
            this.itemList.addChild(itemNode)
            
            let time = cc.find("time",itemNode)
            time.getComponent(cc.Label).string = Helper.FormatTimeString(orderInfo.orderTime*1000)

            
            let btnCancel = cc.find("btnNode/btnCancel",itemNode)
            let btnPay = cc.find("btnNode/btnPay",itemNode)
            let btnAfterSales = cc.find("btnNode/btnAfterSales",itemNode)
            let btnLogistics = cc.find("btnNode/btnLogistics",itemNode)
            
            btnCancel.active = false
            btnPay.active = false
            btnAfterSales.active = false
            btnLogistics.active = false

            //0：待付款 1：待收货 2：已完成 3：取消  -1：删除
            if(orderInfo.orderState == 0){
                let upTime = function () {
                    let remaining:number = orderInfo.endTime - Date.now()/1000
                    if(orderInfo.orderState == 0 && remaining > 0){            
                        let h = Math.floor(remaining/(60*60)%24)
                        let m = Math.floor(remaining/(60)%60)
                        let s = Math.floor(remaining%60)
                        let state = cc.find("state",itemNode)
                        state.getComponent(cc.Label).string = "剩余 "+this.prefixInteger(h,2)+":"+this.prefixInteger(m,2)+":"+this.prefixInteger(s,2)+"  待支付"
                    }else{
                        this.unschedule(upTime)
                        let state = cc.find("state",itemNode)
                        state.getComponent(cc.Label).string = "已取消"
                        // this.confirmOrder(orderInfo.orderNo, 3, ()=>{
                            btnCancel.active = false
                            btnPay.active = false
                        // })
                    }
                }.bind(this)
                this.schedule(upTime,1)
                upTime()
                btnCancel.active = true
                btnPay.active = true
            }else if(orderInfo.orderState == 1){
                let state = cc.find("state",itemNode)
                state.getComponent(cc.Label).string = "待收货"
                // btnAfterSales.active = true
                btnLogistics.active = true
            }else if(orderInfo.orderState == 2){
                let state = cc.find("state",itemNode)
                state.getComponent(cc.Label).string = "已完成"
                // btnAfterSales.active = true
            }else if(orderInfo.orderState == 3){
                let state = cc.find("state",itemNode)
                state.getComponent(cc.Label).string = "已取消"
            }

            let singleNode = cc.find("singleNode",itemNode)
            let multipleNode = cc.find("multipleNode",itemNode)
            singleNode.active = false
            multipleNode.active = false

            //单个商品
            if(orderInfo.goodsList.length == 1){
                singleNode.active = true
                let goodsInfo = orderInfo.goodsList[0]
                let goods_images = goodsInfo.goods_images

                let icon = cc.find("singleNode/icon", itemNode)
                this.setSpriteFrame(icon, goodsInfo.goods_images)


                let lblName = cc.find("singleNode/name",itemNode)
                lblName.getComponent(cc.Label).string = goodsInfo.goods_name.length > 15 ? goodsInfo.goods_name.substr(0, 14) + "..." : goodsInfo.goods_name

                let priceMode = cc.find("singleNode/price/ExchangePriceMode",itemNode)
                priceMode.scale = 0.7
                if(goodsInfo.add_pris){
                    priceMode.getComponent(ExchangePriceMode).setPri(goodsInfo.add_pris.pri)
                }else{
                    priceMode.getComponent(ExchangePriceMode).setPri(goodsInfo.pris.pri)
                }
            }else{
                multipleNode.active = true
                let content = cc.find("scrollView/view/content", multipleNode)
                let itemPrefab = cc.find("item", content)
                itemPrefab.active = false
                for(let i=0;i<orderInfo.goodsList.length;i++){
                    let goodsInfo = orderInfo.goodsList[i]
                    let itemNode = cc.instantiate(itemPrefab)
                    itemNode.active = true
                    content.addChild(itemNode)

                    this.setSpriteFrame(itemNode, goodsInfo.goods_images)
                }

                let num = cc.find("num", multipleNode)
                num.getComponent(cc.Label).string = "共"+orderInfo.goodsList.length+"件"
            }

            let totalPriceMode = cc.find("total/ExchangePriceMode",itemNode)
            totalPriceMode.getComponent(ExchangePriceMode).setPri(orderInfo.pris.pri)
            
            let btnSelect = cc.find("btnSelect",itemNode)
            this.setButtonClick(btnSelect, () => {
                console.log("btnSelect on click")
                if(orderInfo.orderState != this.TabItem[1].state){
                    Helper.OpenPageUI("component/Exchange/ExchangeBillDetails", "订单详情", null, {orderNo:orderInfo.orderNo, callback:(ret)=>{
                        if(ret == 1){//删除订单
                            itemNode.removeFromParent()
                        }else if(ret == 2){//确认收货
                            itemNode.removeFromParent()
                        }
                    }})
                }
            })

            //取消订单
            this.setButtonClick(btnCancel, () => {
                console.log("btnCancel on click")
                this.confirmOrder(orderInfo.orderNo, 3, ()=>{
                    btnCancel.active = false
                    btnPay.active = false
                    orderInfo.orderState = 3
                    let state = cc.find("state",itemNode)
                    state.getComponent(cc.Label).string = "已取消"
                })
            })

            //支付
            this.setButtonClick(btnPay, () => {
                console.log("btnPay on click",orderInfo.orderNo)
                let payValue = 0
                if(orderInfo.pris.pri.length > 0){
                    let pris_string = ""
                    for(let v of orderInfo.pris.pri){
                        if(Constants.EXCHANGE_PRI_TYPE.TICKET != v.pri_type){//奖券
                            payValue += v.pri_value
                        }
                    }
                }
                if(payValue > 0){
                    Helper.OpenPageUI("component/Cashier/CashierEntry", "收银台", null, {orderNo : orderInfo.orderNo, callback : (ret) => {
                        console.log("CashierEntry callback", ret)
                        if(ret == 1){
                            btnCancel.active = false
                            btnPay.active = false
                            // btnAfterSales.active = true
                            btnLogistics.active = true
                            orderInfo.orderState = this.TabItem[2].state
                        }
                    }})
                }
            })

            //售后
            this.setButtonClick(btnAfterSales, () => {
                console.log("btnAfterSales on click")
            })

            //查看物流
            this.setButtonClick(btnLogistics, () => {
                console.log("btnLogistics on click")
                this.getOrderShipmentBlh(orderInfo.orderNo, (express)=>{                    
                    Helper.OpenPageUI("component/Exchange/ExchangeBillLogistics", "物流信息", null, {express : express})
                })
            })

            
        }
    }
}
