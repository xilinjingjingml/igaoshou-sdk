import BaseUI from "../../../../start/script/base/BaseUI";
import { Helper } from "../../../../start/script/system/Helper";
import ExchangePriceMode from "./ExchangePriceMode";
import { Constants } from "../../../../start/script/igsConstants";

const {ccclass, property} = cc._decorator;


@ccclass
export default class ExchangeBillDetails extends BaseUI {
    goodsContent:cc.Node = null
    goodsPrefab:cc.Node = null

    btnAfterSales:cc.Node = null
    btnLogistics:cc.Node = null
    btnDel:cc.Node = null
    btnReceiv:cc.Node = null

    express:any = null
    isCardOrder = false
    onOpen(){
        console.log("ExchangeBillDetails onOpen", this.param)        
        this.goodsContent = cc.find("scrollView/view/content/content/goodsNode", this.node)
        this.goodsPrefab = cc.find("item", this.goodsContent)
        this.goodsPrefab.active = false

        this.btnAfterSales = cc.find("btm/btnNode/btnAfterSales", this.node)
        this.btnLogistics = cc.find("btm/btnNode/btnLogistics", this.node)
        this.btnDel = cc.find("btm/btnNode/btnDel", this.node)
        this.btnReceiv = cc.find("btm/btnNode/btnReceiv", this.node)
        this.btnAfterSales.active = false
        this.btnLogistics.active = false
        this.btnDel.active = false
        this.btnReceiv.active = false

        this.initButton()

        this.getOrderDetail()
        this.getOrderStatusInfoBlh()
    }

    onLoad(){
        console.log("ExchangeBillDetails onLoad", this.param)
        this.setActive("scrollView/view/content/content/shipmentNode/btn", false)
    }

    start () {
        console.log("ExchangeBillDetails start")
    }

    
    // update (dt) {}

    initButton(){
        let btnLogistics = cc.find("scrollView/view/content/content/shipmentNode/btn", this.node)
        this.setButtonClick(btnLogistics, (sender, data) => {
            if(this.express){
                Helper.OpenPageUI("component/Exchange/ExchangeBillLogistics", "物流信息", null, {express : this.express})
            }else{
                Helper.OpenTip("暂无物流信息")
            }
        })  
        
        //售后
        this.setButtonClick(this.btnAfterSales, (sender, data) => {
            console.log("btnAfterSales on click")
        })  

        //物流
        this.setButtonClick(this.btnLogistics, (sender, data) => {
            console.log("btnLogistics on click")
            if(this.express){
                Helper.OpenPageUI("component/Exchange/ExchangeBillLogistics", "物流信息", null, {express : this.express})
            }else{
                Helper.OpenTip("暂无物流信息")
            }
        })

        //删除
        this.setButtonClick(this.btnDel, (sender, data) => {
            console.log("btnDel on click")
            this.confirmOrder(this.param.orderNo, -1, ()=>{
                if(this.param.callback){
                    this.param.callback(1)
                }
                this.btnDel.active = false
                this.btnReceiv.active = false
                this.close()
            })
        })

        //确认收货
        this.setButtonClick(this.btnReceiv, (sender, data) => {
            console.log("btnReceiv on click")
            this.confirmOrder(this.param.orderNo, 2, ()=>{
                if(this.param.callback){
                    this.param.callback(2)
                }
                this.btnDel.active = true
                this.btnReceiv.active = false
            })
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

    //获取订单详情
    getOrderDetail(){
        let param = {
            order_no:this.param.orderNo
        }
        console.log("getOrderDetail", param)
        Helper.PostHttp("igaoshou-shop-srv/goods/orderDetail", null,param,  (res, event) => {   
            console.log("getOrderDetail",res)
            if (res && res.code == "00000") {
                if(res.goods_list){
                    for(let i=0;i<res.goods_list.length;i++){
                        this.addGoods(res.goods_list[i])
                    }
                }

                if(res.order_no && res.order_time){
                    let orderNode = cc.find("scrollView/view/content/content/orderNode", this.node)
                    let orderNo = cc.find("orderNo", orderNode)
                    orderNo.getComponent(cc.Label).string = "订单编号: " + res.order_no
                    let orderTime = cc.find("orderTime", orderNode)
                    orderTime.getComponent(cc.Label).string = "下单时间: " + Helper.FormatTimeString(res.order_time*1000)
                }

                if(res.pris && res.pris.pri){
                    let priceMode = cc.find("scrollView/view/content/content/priceNode/totalPrice/ExchangePriceMode",this.node)
                    priceMode.getComponent(ExchangePriceMode).setPri(res.pris.pri)
                }

                if(res.address){
                    let addressInfo = JSON.parse(res.address)
                    console.log("addressInfo", addressInfo)
                    if(addressInfo){
                        let name = cc.find("scrollView/view/content/content/addressNode/name", this.node)
                        name.getComponent(cc.Label).string = addressInfo.name + " " + addressInfo.tel.substr(0,3) + "****" + addressInfo.tel.substr(addressInfo.tel.length-4,4)
                        let address = cc.find("scrollView/view/content/content/addressNode/address", this.node)
                        addressInfo.town = addressInfo.town ? addressInfo.town : ""
                        address.getComponent(cc.Label).string = addressInfo.province + addressInfo.city + addressInfo.county + addressInfo.town + addressInfo.address_detail
                    }
                }

                if(res.order_state > 0 && this.express == null){
                    this.setShipment({time:Helper.FormatTimeString(res.order_time*1000),status:"商品已下单"})
                }

                //0：待付款 1：待收货 2：已完成 3：取消  -1：删除
                if(res.order_state == 1){
                    this.btnAfterSales.active = true
                    // this.btnLogistics.active = true
                    this.btnDel.active = false
                    this.btnReceiv.active = true
                }else if(res.order_state == 2){
                    this.btnAfterSales.active = true
                    this.btnDel.active = true
                    this.btnReceiv.active = false
                }else if(res.order_state == 3){
                    this.btnDel.active = true
                }

                if(res.goods_list && res.goods_list.length == 1){
                    let type_id = res.goods_list[0].type_id
                    if(type_id == Constants.EXCHANGE_GOODS_TYPE.CARD || type_id == Constants.EXCHANGE_GOODS_TYPE.PHONE){                        
                        this.isCardOrder = true                  
                        this.btnAfterSales.active = false
                        this.btnDel.active = false
                        this.btnReceiv.active = false
                        this.setActive("scrollView/view/content/content/addressNode", false)
                    }
                }      
                
                if(!this.isCardOrder){
                    this.getOrderShipmentBlh()
                }
            }
        })
    }

    //获取订单状态
    getOrderStatusInfoBlh(){
        let param = {
            orderNo:this.param.orderNo
        }
        console.log("GetOrderStatusInfoBlh", param)
        Helper.PostHttp("igaoshou-shop-srv/goods/GetOrderStatusInfoBlh",  null,param, (res, event) => {   
            console.log("GetOrderStatusInfoBlh",res)
            if (res && res.code == "0000") {
                //1:系统审核, 3:等待处理, 4:等待出货, 5:部分出货, 8:出货完成, 9:处理失败, 0:已关闭
                if(res.status == 8){                    
            }
            }
        })
    }

    //获取物流信息
    getOrderShipmentBlh(){
        let param = {
            orderNo:this.param.orderNo
        }
        console.log("GetOrderShipmentBlh", param)
        Helper.PostHttp("igaoshou-shop-srv/goods/GetOrderShipmentBlh", null, param,  (res, event) => {   
            console.log("GetOrderShipmentBlh",res)
            if (res && res.code == "0000") {
                let data = JSON.parse(res.data)
                console.log("GetOrderShipmentBlh data", data)
                if(data && data.express && data.express[0] && data.express[0].express_track && data.express[0].express_track[0]){
                    data.express[0].express_track.reverse()
                    this.express = data.express[0]
                    this.setShipment(data.express[0].express_track[0])
                    
                    this.btnLogistics.active = true
                    this.setActive("scrollView/view/content/content/shipmentNode/btn", true)
                }
            }
        })
    }

    addGoods(goodsInfo:any){
        let itemNode = cc.instantiate(this.goodsPrefab)
        itemNode.active = true
        this.goodsContent.addChild(itemNode)

        let icon = cc.find("icon", itemNode)
        this.setSpriteFrame(icon, goodsInfo.goods_images)

        let name = cc.find("name", itemNode)
        name.getComponent(cc.Label).string = goodsInfo.goods_name.length > 12 ? goodsInfo.goods_name.substr(0, 11) + "..." : goodsInfo.goods_name

        let num = cc.find("num", itemNode)
        num.getComponent(cc.Label).string = goodsInfo.goods_num + "件"

        let priceMode = cc.find("price/ExchangePriceMode",itemNode)
        priceMode.scale = 0.7
        if(goodsInfo.add_pris){
            priceMode.getComponent(ExchangePriceMode).setPri(goodsInfo.add_pris.pri)
        }else{
            priceMode.getComponent(ExchangePriceMode).setPri(goodsInfo.pris.pri)
        }
    }

    setShipment(track:any){
        let lblShipment = cc.find("scrollView/view/content/content/shipmentNode/lblShipment", this.node)
        let lblTime = cc.find("scrollView/view/content/content/shipmentNode/lblTime", this.node)

        lblShipment.getComponent(cc.Label).string = track.status
        lblTime.getComponent(cc.Label).string = track.time
    }
}
