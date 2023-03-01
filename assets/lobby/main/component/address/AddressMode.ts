import BaseUI from "../../../start/script/base/BaseUI";
import { Helper } from "../../../start/script/system/Helper";


const {ccclass, property} = cc._decorator;

@ccclass
export default class AddressMode extends BaseUI {
    addressInfo:any = null
    onLoad(){
        console.log("AddressMode onLoad")
        this.initButton()
    }

    initButton(){
        this.setButtonClick("infoNode/btnEdit", () => {
            console.log("btnEdit on click")
            let addressGid = null
            if(this.addressInfo && this.addressInfo.addressGid){
                addressGid = this.addressInfo.addressGid
            }
            Helper.OpenPageUI("component/address/AddressEditEntry", "编辑收货地址", null, {addressInfo:this.addressInfo})
            // UIMgr.OpenUI("component/Base/GamePage", 
            //     {enterAni: Constants.PAGE_ANI.LEFT_IN, leaveAni: Constants.PAGE_ANI.LEFT_OUT,
            //     param: {page: "component/Address/AddressEditEntry", title:"编辑收货地址"}})
        })

        this.setButtonClick("infoNode/btnChange", () => {
            console.log("btnChange on click")
            Helper.OpenPageUI("component/address/AddressListEntry", "收货地址", null, {})
            // UIMgr.OpenUI("component/Base/GamePage", 
            //     {enterAni: Constants.PAGE_ANI.LEFT_IN, leaveAni: Constants.PAGE_ANI.LEFT_OUT,
            //     param: {page: "component/Address/AddressListEntry", title:"收货地址"}})
        })

        this.setButtonClick("noAddress/btnAdd", () => {
            console.log("btnAdd on click")
            Helper.OpenPageUI("component/address/AddressEditEntry", "编辑收货地址", null, {})
        })
    }

    setData(data:any){
        this.addressInfo = data
        let defaultIcon = cc.find("infoNode/region/icon",this.node)
        defaultIcon.active = data.is_default == 1 ? true : false

        let region = cc.find("infoNode/region/region",this.node)
        region.getComponent(cc.Label).string = data.province + data.city + data.county + data.town

        let address = cc.find("infoNode/address",this.node)
        address.getComponent(cc.Label).string = data.address_detail

        let userName = cc.find("infoNode/user/name",this.node)
        userName.getComponent(cc.Label).string = data.name

        let phone = cc.find("infoNode/user/phone",this.node)
        phone.getComponent(cc.Label).string = data.tel
    }
}
