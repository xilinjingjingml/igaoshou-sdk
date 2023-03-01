import BaseUI from "../base/BaseUI";
import { UIMgr } from "../base/UIMgr";
import { EventMgr } from "../base/EventMgr";
import { DataMgr } from "../base/DataMgr";
import { Constants } from "../constants";
import { Helper } from "../system/Helper";
const {ccclass, property} = cc._decorator;

interface Region {
    id:number
    name:string
    parentId:number
    levelId:number
}

interface SelectRegion {
    region:Region
    itemNode:cc.Node
}

@ccclass
export default class AddressEditEntry extends BaseUI {
    @property(cc.Asset)
    addresCSV:cc.Asset = null

    addressAll:Region[] = new Array()
    //城市地区列表
    btnCloseRegionChoose:cc.Node = null
    regionChoose:cc.Node = null
    regionChoosePosY:number = 0
    regionScrollView:cc.Node = null
    regionContent:cc.Node = null
    regionContentPrefab:cc.Node = null
    //选中的城市地区
    regionSelect:cc.Node = null
    regionSelectPrefab:cc.Node = null
    regionSelectList:SelectRegion[] = new Array()
    regionSelectCur:cc.Node = null
    regionSelectTipNode:cc.Node = null

    //显示的城市地区
    regionShowList:Region[] = new Array()

    nameEdit:cc.Node = null
    regionLbl:cc.Node = null
    phoneEdit:cc.Node = null
    addressEdit:cc.Node = null

    //默认地址
    defaultSet:cc.Node = null
    regionSet = false
    onOpen(){
        console.log("AddressEditEntry onOpen")
        this.btnCloseRegionChoose = cc.find("btnCloseRegionChoose", this.node)
        this.regionChoose = cc.find("regionChoose", this.node)
        this.regionChoosePosY = this.regionChoose.y
        this.regionChoose.y = this.regionChoosePosY-this.regionChoose.height
        this.regionScrollView = cc.find("regionChoose/content/scrollView", this.node)
        this.regionContent = cc.find("regionChoose/content/scrollView/view/content", this.node)
        this.regionContentPrefab = cc.find("regionChoose/content/scrollView/view/content/item", this.node)

        this.regionSelect = cc.find("regionChoose/content/selectNode", this.node)
        this.regionSelectPrefab = cc.find("regionChoose/content/selectNode/item", this.node)
        this.regionSelectPrefab.active = false

        this.nameEdit = cc.find("edit/userName/edit", this.node)
        this.phoneEdit = cc.find("edit/phone/edit", this.node)
        this.regionLbl = cc.find("edit/region/lbl", this.node)
        this.addressEdit = cc.find("edit/address/edit", this.node)
        this.defaultSet = cc.find("default/set", this.node)

        let btnDel = cc.find("titleNode/btnDel", this.node)
        btnDel.active = false
        if(this.param && this.param.addressInfo){
            btnDel.active = true
            let addressInfo = this.param.addressInfo
            this.nameEdit.getComponent(cc.EditBox).string = addressInfo.name
            this.phoneEdit.getComponent(cc.EditBox).string = addressInfo.tel
            this.regionSet = true
            this.regionLbl.getComponent(cc.Label).string = addressInfo.province + addressInfo.city + addressInfo.county + addressInfo.town
            this.addressEdit.getComponent(cc.EditBox).string = addressInfo.address_detail
            this.defaultSet.getComponent(cc.Toggle).isChecked = addressInfo.is_default == 1 ? true : false
        }

        this.initButton()        
        this.initRegionContentList(this.getRegionList(0))
        this.addRegionSelect(null)
    }

    onLoad(){
        this.scheduleOnce(()=>{
            this.node.getParent().getParent().getComponent(cc.Widget).top = -70
            this.node.getParent().getComponent(cc.Widget).top = 70
            this.node.getParent().getParent().getComponent(cc.Widget).updateAlignment()
            this.node.getParent().getComponent(cc.Widget).updateAlignment()
        }, 0.55)
    }

    start () {
        console.log("AddressEditEntry start")
        let jsonAll = Helper.CSVToArray(this.addresCSV, ",")
        for(let v of jsonAll){
            let id = Number(v[0])
            let parentId = Number(v[2])
            let levelId = Number(v[3])
            if(isNaN(id) || isNaN(parentId) || isNaN(levelId)){  
            }else{                
                let region:Region = {
                    id:id,
                    name:v[1],
                    parentId:parentId,
                    levelId:levelId
                }
                this.addressAll.push(region)
            }
        }
        
        // this.regionChoose = cc.find("regionChoose", this.node)
        // this.regionChoose.active = false
    }
    
    // update (dt) {}

    initButton(){
        //删除地址
        let btnDel = cc.find("titleNode/btnDel", this.node)
        this.setButtonClick(btnDel, () => {
            let addressList:any[] = DataMgr.getData(Constants.DATA_DEFINE.ADDRESS_DATA)
            addressList = addressList ? addressList : []
            for(let i=0;i<addressList.length;i++){
                if(addressList[i].address_gid == this.param.addressInfo.address_gid){
                    addressList.splice(i,1)
                    break
                }
            }
            this.uploadAddressInfo(addressList)
        })

        this.setButtonClick("btnSave", () => {
            console.log("btnSave on click", this.regionShowList)
            let name = this.nameEdit.getComponent(cc.EditBox).string
            let phone = this.phoneEdit.getComponent(cc.EditBox).string
            let address = this.addressEdit.getComponent(cc.EditBox).string
            let isDefault = this.defaultSet.getComponent(cc.Toggle).isChecked

            if(name.length == 0 || phone.length == 0 || this.regionSet == false || address.length == 0 ){
                Helper.OpenTip("请输入收货人信息")
                return
            }

            console.log("isDefault",isDefault)
            let addressList:any[] = DataMgr.getData(Constants.DATA_DEFINE.ADDRESS_DATA)
            addressList = addressList ? addressList : []

            if(isDefault){
                for(let i=0;i<addressList.length;i++){
                    addressList[i].is_default = 0
                }
            }

            if(this.param && this.param.addressInfo && this.param.addressInfo.address_gid){
                for(let i=0;i<addressList.length;i++){
                    if(addressList[i].address_gid == this.param.addressInfo.address_gid){
                        addressList[i].country = ""
                        addressList[i].country_id = 0

                        addressList[i].province = this.regionShowList[0]?this.regionShowList[0].name:this.param.addressInfo.province
                        addressList[i].province_id = this.regionShowList[0]?this.regionShowList[0].id:this.param.addressInfo.province_id
                        
                        addressList[i].city = this.regionShowList[1]?this.regionShowList[1].name:this.param.addressInfo.city
                        addressList[i].city_id  = this.regionShowList[1]?this.regionShowList[1].id:this.param.addressInfo.city_id 
                        
                        addressList[i].county = this.regionShowList[2]?this.regionShowList[2].name:this.param.addressInfo.country
                        addressList[i].county_id  = this.regionShowList[2]?this.regionShowList[2].id:this.param.addressInfo.country_id 
                        
                        addressList[i].town = this.regionShowList[3]?this.regionShowList[3].name:this.param.addressInfo.town
                        addressList[i].town_id = this.regionShowList[3]?this.regionShowList[3].id:this.param.addressInfo.town_id
                        
                        addressList[i].address_detail = address
                        addressList[i].is_default = isDefault?1:0,
                        addressList[i].name = name
                        addressList[i].tel = phone
                        addressList[i].address_gid = this.param.addressInfo.address_gid
                        break
                    }
                }
            }else{
                let addressInfo = {
                    country : "",
                    country_id : 0,

                    province:this.regionShowList[0]?this.regionShowList[0].name:"",
                    province_id :this.regionShowList[0]?this.regionShowList[0].id:0,

                    city:this.regionShowList[1]?this.regionShowList[1].name:"",
                    city_id :this.regionShowList[1]?this.regionShowList[1].id:0,

                    county :this.regionShowList[2]?this.regionShowList[2].name:"",
                    county_id :this.regionShowList[2]?this.regionShowList[2].id:0,

                    town:this.regionShowList[3]?this.regionShowList[3].name:"",
                    town_id :this.regionShowList[3]?this.regionShowList[3].id:0,

                    address_detail:address,
                    is_default:isDefault?1:0,
                    name:name,
                    tel:phone,
                    address_gid:"",
                }
                addressList.push(addressInfo)
            }            
            
            this.uploadAddressInfo(addressList)
        })

        //选择省市地区
        this.setButtonClick("edit/region/btn", () => {
            //默认显示
            if(this.regionShowList.length == 0){
                this.initRegionContentList(this.getRegionList(0))
            }else{
                let parentId = 0
                for(let v of this.regionShowList){
                    this.addRegionSelect(v)
                    parentId = v.parentId
                }
                let data = this.getRegionList(parentId)
                if(data.length > 0 ){
                    this.initRegionContentList(data)
                }
            }
            
            this.btnCloseRegionChoose.active = true
            this.regionChoose.x = 0
            cc.tween(this.regionChoose)
                .to(0.2, { position: cc.v3(0, this.regionChoosePosY)})
                .start()
        })

        //关闭省市地区选择
        this.setButtonClick("regionChoose/content/titleNode/btnClose", () => {
            this.closeRegionChoose()
        })
        //关闭省市地区选择
        this.setButtonClick(this.btnCloseRegionChoose, () => {
            this.closeRegionChoose()
        })

        if (DataMgr.Config.platId === 2 || DataMgr.Config.platId === 5) {
            this.setNodePositionX(btnDel, btnDel.getPosition().x - 150)
        }
    }

    uploadAddressInfo(addressList:any){
        // JSON.stringify(addressList)      
        let param = {
            address:JSON.stringify(addressList)
        }
        console.log("uploadAddressInfo", param)
        Helper.PostHttp("mcbeam-authen-srv/auth/addressInfo", null, param, (res, event) => {   
            console.log("addressInfo",res)
            if (res && res.code == "00000") {                
                EventMgr.dispatchEvent(Constants.EVENT_DEFINE.ADDRESS_LIST_REQ)
                this.close()
            }
        })
    }

    updateRegionLbl(){
        let text = ""
        for(let v of this.regionShowList){
            text += v.name
        }
        this.regionSet = true
        this.regionLbl.getComponent(cc.Label).string = text
    }

    closeRegionChoose(){
        this.btnCloseRegionChoose.active = false
        this.regionChoose.y = this.regionChoosePosY-this.regionChoose.height
        //清空选择的地区
        for(let i = 0; i < this.regionSelectList.length; i++){
            let v = this.regionSelectList[i]
            v.itemNode.removeFromParent()                
        }
        this.regionSelectList.splice(0, this.regionSelectList.length)
    }

    //根据上级ID获取地区列表
    getRegionList(parent:number){
        let list:Region[] = new Array()
        for(let v of this.addressAll){
            if(v.parentId == parent){
                list.push(v)
            }
        }
        return list
    }

    //地区列表显示
    initRegionContentList(data:Region[]){
        this.regionContent.removeAllChildren()
        this.regionScrollView.getComponent(cc.ScrollView).stopAutoScroll()
        this.regionScrollView.getComponent(cc.ScrollView).scrollToTop()
        for(let i=0;i<data.length;i++){
            let v = data[i]
            let itemNode = cc.instantiate(this.regionContentPrefab)
            itemNode.active = true
            this.regionContent.addChild(itemNode)

            let name = cc.find("Background/lbl", itemNode)
            name.getComponent(cc.Label).string = v.name

            this.setButtonClick(itemNode, () => {    
                this.addRegionSelect(v)      
                let data = this.getRegionList(v.id)
                if(data.length > 0 ){
                    this.initRegionContentList(data)
                }else{
                    //选择最后一级地区，保存并更新到地址栏
                    this.regionShowList.splice(0, this.regionShowList.length)
                    for(let i = 0; i < this.regionSelectList.length; i++){
                        this.regionShowList.push(this.regionSelectList[i].region)
                    }
                    this.updateRegionLbl()
                    this.closeRegionChoose()
                }
            })
        }
    }

    //选择的地区显示
    addRegionSelect(data:Region){
        let itemNode = cc.instantiate(this.regionSelectPrefab)
        itemNode.active = true
        this.regionSelect.addChild(itemNode)

        let name = cc.find("Background/lbl", itemNode)
        
        if(data != null){
            name && (name.getComponent(cc.Label).string = data.name.length > 6 ? data.name.substr(0,5) + "..." : data.name)

            //如果有下级地址，显示请选择
            let nextlevel = this.getRegionList(data.id)
            if(nextlevel.length > 0 ){
                if(this.regionSelectTipNode){
                    this.regionSelectTipNode.active = true
                }
            }else{
                if(this.regionSelectTipNode){
                    this.regionSelectTipNode.active = false
                }
            }
            //点击选中的地区
            this.setButtonClick(itemNode, () => {    
                if(this.regionSelectCur != null){
                    let name = cc.find("Background/lbl", this.regionSelectCur)
                    name.color = cc.color(121, 142, 171)
                }
                this.regionSelectCur = itemNode
                name.color = cc.color(32, 145, 216)

                let data1 = this.getRegionList(data.parentId)
                if(data1.length > 0 ){
                    this.initRegionContentList(data1)                    
                }
            })

            //删除选中级别相等或等级更高的
            for(let i = 0; i < this.regionSelectList.length; i++){
                let v = this.regionSelectList[i]
                if(v.region.levelId >= data.levelId){
                    v.itemNode.removeFromParent()
                    this.regionSelectList.splice(i,1)
                    i--
                }
            }        

            let sr:SelectRegion = {
                region:data,
                itemNode:itemNode
            }
            this.regionSelectList.push(sr)   
        }else{
            if(this.regionSelectTipNode){
                this.regionSelectTipNode.removeFromParent()
                this.regionSelectTipNode = null
            }
            itemNode.zIndex = 5   //最多4级
            this.regionSelectTipNode = itemNode
        }
    }
}
