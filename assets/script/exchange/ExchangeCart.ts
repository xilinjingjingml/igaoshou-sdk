import BaseUI from "../base/BaseUI";
import { Helper } from "../system/Helper";
import ExchangePriceMode from "./ExchangePriceMode";
import { DataMgr } from "../base/DataMgr";
import { Constants } from "../constants";
import ExchangeItemMode from "./ExchangeItemMode"
import { EventMgr } from "../base/EventMgr";
import ExchangeAdvise from "./ExchangeAdvise"
import { ExchangeSrv } from "../system/ExchangeSrv"

const {ccclass, property} = cc._decorator;

interface GoodsItem {
    itemNode:cc.Node,
    cartInfo:any
}

@ccclass
export default class ExchangeCart extends BaseUI {
    scrollView:cc.Node = null
    //商品列表
    goodsContent:cc.Node = null
    goodsItemPrefab:cc.Node = null
    emptyNode:cc.Node = null
    goodsItemNodeList:GoodsItem[] = new Array()

    //推荐列表
    adviseNode:cc.Node = null

    btnEdit:cc.Node = null
    btnSave:cc.Node = null

    btm:cc.Node = null
    toggleAll:cc.Node = null
    btnConfirm:cc.Node = null
    btnDel:cc.Node = null

    payToggle:cc.Node = null

    selectNum = 0
    onOpen(){
        console.log("ExchangeCart onOpen", this.param)
        let addressInfo = null
        let addressList:any[] = DataMgr.getData(Constants.DATA_DEFINE.ADDRESS_DATA)
        if(addressList && addressList.length > 0){ 
            if(this.param && this.param.goodsDetail){
                for(let i=0;i<addressList.length;i++){
                    if(addressList[i].address_gid == this.param.addressGid){
                        addressInfo = addressList[i]
                        break
                    }
                }
            }else{
                for(let i=0;i<addressList.length;i++){
                    if(addressList[i].is_default == 1){
                        addressInfo = addressList[i]
                        break
                    }
                }
            }

            if(!addressInfo){
                addressInfo = addressList[0]
            }
            if(addressInfo){
                let address = cc.find("titleNode/title/address", this.node)
                address.getComponent(cc.Label).string = "配送至:" + addressInfo.address_detail
            }

            this.setActive("titleNode/title/address", !!addressInfo)
        }

        EventMgr.on(Constants.EVENT_DEFINE.UPDATE_CART, (args)=>{
            console.log("getCartList",args )
            //过滤自己界面发送的消息
            if(!args || (args && args.node_uuid != this.node.uuid)){
                this.getCartList()
            }
        }, this)
    }

    onLoad(){
        console.log("onLoad")
        this.scrollView = cc.find("scrollView", this.node)
        this.goodsContent = cc.find("scrollView/view/content/goodsList", this.node)
        this.goodsContent.active = false
        this.goodsItemPrefab = cc.find("scrollView/view/content/goodsList/item", this.node)
        this.goodsItemPrefab.active = false
        this.emptyNode = cc.find("scrollView/view/content/emptyNode", this.node)
        this.emptyNode.active = false

        this.adviseNode = cc.find("scrollView/view/content/ExchangeAdvise", this.node)

        this.btnEdit = cc.find("titleNode/btnEdit", this.node)
        this.btnSave = cc.find("titleNode/btnSave", this.node)
        this.btnEdit.active = true
        this.btnSave.active = false

        this.btm = cc.find("btm", this.node)
        this.toggleAll = cc.find("btm/toggleAll", this.node)
        this.btnConfirm = cc.find("btm/btnConfirm", this.node)
        this.btnDel = cc.find("btm/btnDel", this.node)
        this.btnDel.active = false

        this.payToggle = cc.find("btm/payToggle", this.node)

        this.initButton()

        this.getCartList()

        this.scheduleOnce(()=>{
            this.node.getParent().getParent().getComponent(cc.Widget).top = -70
            this.node.getParent().getComponent(cc.Widget).top = 70
            this.node.getParent().getParent().getComponent(cc.Widget).updateAlignment()
            this.node.getParent().getComponent(cc.Widget).updateAlignment()
        }, 0.55)
    }

    start () {
        console.log("ExchangeCart start")
    }

    onDisable(){
        console.log("ExchangeCart onDisable")
        EventMgr.offByTag(this)
    }

    getCartList(){
        ExchangeSrv.getCartList(null, (res) => {
            if (res && res.cart_list && res.cart_list.length > 0) {
                this.goodsContent.removeAllChildren()
                this.goodsItemNodeList.splice(0, this.goodsItemNodeList.length)
                for(let i=0;i<res.cart_list.length;i++){
                    this.addCartGood(res.cart_list[i])
                }
                this.calcCheck()
                
                this.setCartEmpty(false)
            }else{
                this.setCartEmpty(true)
            }
        })
    }
    
    //检查购物车
    checkCart(cart_gid:string, checked:number, goods_num:number){
        let param = {
            cart_gid : cart_gid,
            checked : checked,
            goods_num : goods_num
        }
        console.log("checkCart", param)
        Helper.PostHttp("igaoshou-shop-srv/goods/checkCart", null , param, (res, event) => {   
            console.log("checkCart",res)
            if (res && res.code == "00000") {
                for(let j=0;j<this.goodsItemNodeList.length;j++){
                    if(this.goodsItemNodeList[j].cartInfo.cart_gid == cart_gid){
                        this.goodsItemNodeList[j].cartInfo.checked = checked
                        let toggle = cc.find("toggle",this.goodsItemNodeList[j].itemNode)
                        toggle.getComponent(cc.Toggle).isChecked = checked == 1 ? true : false
                    }
                }
                this.calcCheck()
                EventMgr.dispatchEvent(Constants.EVENT_DEFINE.UPDATE_CART, {node_uuid : this.node.uuid})
            }
        })
    }

    //删除购物车
    cartDelete(cart_gid:string){
        let param = {
            cart_gid : cart_gid
        }
        console.log("cartDelete", param)
        Helper.PostHttp("igaoshou-shop-srv/goods/cartDelete", null, param, (res, event) => {   
            console.log("cartDelete",res)
            if (res && res.code == "00000") {
                for(let j=0;j<this.goodsItemNodeList.length;j++){
                    if(this.goodsItemNodeList[j].cartInfo.cart_gid == cart_gid){
                        this.goodsItemNodeList[j].itemNode.removeFromParent()
                        this.goodsItemNodeList.splice(j,1)
                    }
                }
                this.setCartEmpty(this.goodsItemNodeList.length == 0)
                EventMgr.dispatchEvent(Constants.EVENT_DEFINE.UPDATE_CART, {node_uuid : this.node.uuid})
            }
        })
    }

    

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

        this.setButtonClick(this.btnEdit, (sender, data) => {
            console.log("btnEdit on click")
            this.btnSave.active = true
            this.adviseNode.active = false
            this.payToggle.active = false
            this.btnConfirm.active = false
            this.btnDel.active = true
            this.scrollView.getComponent(cc.ScrollView).stopAutoScroll()
            this.scrollView.getComponent(cc.ScrollView).scrollToTop()
        })

        this.setButtonClick(this.btnSave, (sender, data) => {
            console.log("btnEdit on click")
            this.btnSave.active = false
            this.adviseNode.active = true
            this.payToggle.active = true
            this.btnConfirm.active = true
            this.btnDel.active = false
        })

        this.setButtonClick("btm/btnConfirm", (sender, data) => {
            if(this.selectNum == 0){
                Helper.OpenTip("您还没有选择商品哦")
            }else{
                Helper.OpenPageUI("component/Exchange/ExchangeConfirmEntry", "确认订单", null, {})
            }
        })
        

        
        this.setToggleClick(this.toggleAll, (sender:cc.Node, eventType,customEventData) => {
            let isCheck = this.toggleAll.getComponent(cc.Toggle).isChecked
            console.log("toggleAll on click", isCheck)
            for(let v of this.goodsItemNodeList){
                let toggle = cc.find("toggle",v.itemNode)
                let isCheck = this.toggleAll.getComponent(cc.Toggle).isChecked
                if(isCheck){
                    toggle.getComponent(cc.Toggle).isChecked = true
                }else{
                    toggle.getComponent(cc.Toggle).isChecked = false
                }
                toggle.getComponent(cc.Toggle).checkEvents.forEach(item => item.emit([]))
            }
        })

        this.setButtonClick("btm/btnDel", (sender, data) => {
            for(let j=0;j<this.goodsItemNodeList.length;j++){
                if(this.goodsItemNodeList[j].cartInfo.checked == 1){
                    this.cartDelete(this.goodsItemNodeList[j].cartInfo.cart_gid)
                }
            }
        })

        this.setScrollViewEvent(this.scrollView, (sender, eventType,customEventData) => {
            if (eventType == cc.ScrollView.EventType.BOUNCE_BOTTOM) {
                this.adviseNode.getComponent(ExchangeAdvise).nextPage()           
            }
        })

        if (DataMgr.Config.platId === 2 || DataMgr.Config.platId === 5) {
            this.setNodePositionX(this.btnEdit, this.btnEdit.getPosition().x - 150)
            this.setNodePositionX(this.btnSave, this.btnSave.getPosition().x - 150)
        }
    }

    setCartEmpty(empty:boolean){
        if(empty){    
            this.goodsContent.active = false
            this.emptyNode.active = true
            this.btm.active = false
            this.btnEdit.active = false

            this.scheduleOnce(()=>{
                let view = cc.find("scrollView/view", this.node)
                view.getComponent(cc.Widget).bottom = -127
                view.getComponent(cc.Widget).updateAlignment()
            }, 0.4)
        }else{
            this.goodsContent.active = true
            this.emptyNode.active = false
            this.btm.active = true
            this.btnEdit.active = true

            this.scheduleOnce(()=>{
                let view = cc.find("scrollView/view", this.node)
                view.getComponent(cc.Widget).bottom = 0
                view.getComponent(cc.Widget).updateAlignment()
            }, 0.4)
        }
    }

    addCartGood(cartInfo:any){
        let itemNode = cc.instantiate(this.goodsItemPrefab)
        itemNode.active = true
        this.goodsContent.addChild(itemNode)

        let goodsItem:GoodsItem = {
            itemNode:itemNode,
            cartInfo:cartInfo,
        }
        this.goodsItemNodeList.push(goodsItem)

        let lblName = cc.find("name",itemNode)
        lblName.getComponent(cc.Label).string = cartInfo.goods_name.length > 10 ? cartInfo.goods_name.substr(0, 9) + "..." : cartInfo.goods_name

        let lblNum = cc.find("num/lbl",itemNode)
        lblNum.getComponent(cc.Label).string = cartInfo.goods_num

        let pri = this.getCartInfoPris(cartInfo, cartInfo.add_pris.pris_gid)
        if(pri){
            let priceMode = cc.find("ExchangePriceMode",itemNode)
            priceMode.getComponent(ExchangePriceMode).setPri(pri)
        }

        let icon = cc.find("icon", itemNode)
        this.setSpriteFrame(icon, cartInfo.goods_images)

        let toggle = cc.find("toggle",itemNode)
        this.setToggleClick(toggle, (sender, data) => {
            console.log("setToggleClick", cartInfo.cart_gid)
            console.log("isChecked", cartInfo.checked)
            let checked = toggle.getComponent(cc.Toggle).isChecked ? 1 : 0
            this.checkCart(cartInfo.cart_gid, checked, cartInfo.goods_num)
        })

        console.log("cartInfo.checked", cartInfo.checked)
        cartInfo.checked = cartInfo.checked ? cartInfo.checked : 0
        if(cartInfo.checked == 1){
            toggle.getComponent(cc.Toggle).check()
        }else{
            toggle.getComponent(cc.Toggle).uncheck()            
            this.toggleAll.getComponent(cc.Toggle).isChecked = false
        }

        let btnAdd = cc.find("num/btnAdd",itemNode)
        this.setButtonClick(btnAdd, () => {
            console.log("btnAdd on click")
            cartInfo.goods_num++
            lblNum.getComponent(cc.Label).string = cartInfo.goods_num.toString()
            this.checkCart(cartInfo.cart_gid, cartInfo.checked, cartInfo.goods_num)
        })

        let btnDel = cc.find("num/btnDel",itemNode)
        this.setButtonClick(btnDel, () => {
            console.log("btnDel on click")
            cartInfo.goods_num--
            cartInfo.goods_num = cartInfo.goods_num < 1 ? 1 : cartInfo.goods_num
            lblNum.getComponent(cc.Label).string = cartInfo.goods_num.toString()
            this.checkCart(cartInfo.cart_gid, cartInfo.checked, cartInfo.goods_num)
        })
        
    }

    //根据玩家加入购物车的价格组合ID，获取最新的价格
    getCartInfoPris(cartInfo:any, prisGid:string){
        // for(let i=0;i<cartInfo.pris.length;i++){
        //     if(cartInfo.pris[i].pris_gid == prisGid){
        //         return cartInfo.pris[i].pri
        //     }
        // }
        // return null
        return cartInfo.pris.pri
    }

    calcCheck(){
        let totalPri = new Array()
        totalPri.push({
            pri_currency: "奖券",
            pri_type: Constants.EXCHANGE_PRI_TYPE.TICKET,
            pri_value: 0
        })
        totalPri.push({
            pri_currency: "人民币",
            pri_type: Constants.EXCHANGE_PRI_TYPE.MONEY,
            pri_value: 0
        })
        this.selectNum = 0
        let checkAll = true
        for(let j=0;j<this.goodsItemNodeList.length;j++){
            let toggle = cc.find("toggle",this.goodsItemNodeList[j].itemNode)
            
            if(toggle.getComponent(cc.Toggle).isChecked == true){
                this.selectNum++
                let pri = this.getCartInfoPris(this.goodsItemNodeList[j].cartInfo, this.goodsItemNodeList[j].cartInfo.add_pris.pris_gid)
                if(pri){
                    for(let v of pri){
                        v.pri_type = v.pri_type ? v.pri_type : 0
                        if(v.pri_type == Constants.EXCHANGE_PRI_TYPE.TICKET){
                            totalPri[0].pri_value += v.pri_value * this.goodsItemNodeList[j].cartInfo.goods_num
                        }else{
                            totalPri[1].pri_value += v.pri_value * this.goodsItemNodeList[j].cartInfo.goods_num
                        }
                    }     
                }
            }else{
                checkAll = false
            }
        }
           
        this.toggleAll.getComponent(cc.Toggle).isChecked = checkAll
        let checkNum = cc.find("Background/checkNum", this.btnConfirm)
        checkNum.getComponent(cc.Label).string = "去结算(" + this.selectNum + ")"

        for(let i=0;i<totalPri.length;i++){
            if(totalPri[i].pri_value == 0){
                totalPri.splice(i,1)
                i--
            }
        }

        if(totalPri.length > 0){
            let priceMode = cc.find("ExchangePriceMode",this.payToggle)
            priceMode.getComponent(ExchangePriceMode).setPri(totalPri)
        }else{
            let priceMode = cc.find("ExchangePriceMode",this.payToggle)
            priceMode.getComponent(ExchangePriceMode).setPri(new Array())
        }
    }
}
