import BaseUI from "../../../start/script/base/BaseUI";
import { EventMgr } from "../../../start/script/base/EventMgr";
import { Constants } from "../../../start/script/igsConstants";
import { Helper } from "../../../start/script/system/Helper";
import { DataMgr } from "../../../start/script/base/DataMgr";
import AddressMode from "./AddressMode";

const {ccclass, property} = cc._decorator;

@ccclass
export default class AddressListEntry extends BaseUI {

    @property(cc.Prefab)
    addressPrefab: cc.Prefab = null;

    addRessListContent:cc.Node = null

    btnNew:cc.Node = null
    lblTip:cc.Node = null


    addressList:any[] = new Array()
    onOpen(){
        console.log("AddressListEntry onOpen")
        this.addRessListContent = cc.find("scrollView/view/content/content/Address", this.node)
        this.btnNew = cc.find("scrollView/view/content/content/btnNew", this.node)
        this.lblTip = cc.find("scrollView/view/content/content/lblTip", this.node)
        this.lblTip.active = false

        this.initButton()

 
        this.initAddress()
        EventMgr.on(Constants.EVENT_DEFINE.ADDRESS_LIST_UPDATE, this.initAddress.bind(this))
    }

    start () {
        console.log("AddressListEntry start")
    }

    
    // update (dt) {}

    initButton(){
        this.setButtonClick(this.btnNew, () => {
            console.log("btnNew on click")
            Helper.OpenPageUI("component/address/AddressEditEntry", "编辑收货地址", null, {})
            // UIMgr.OpenUI("component/Base/GamePage", 
            //     {enterAni: Constants.PAGE_ANI.LEFT_IN, leaveAni: Constants.PAGE_ANI.LEFT_OUT,
            //     param: {page: "component/Address/AddressEditEntry", title:"编辑收货地址"}})
        })
    }

    initAddress(){
        console.log("AddressListEntry initAddress")
        this.addressList = DataMgr.getData(Constants.DATA_DEFINE.ADDRESS_DATA)
        this.addressList = this.addressList ? this.addressList : []
        this.addRessListContent.removeAllChildren()
        this.addRessListContent.height = 0
        for(let i=0;i<this.addressList.length;i++){
            let addressInfo = this.addressList[i]
            console.log("initAddress info", addressInfo)
            let itemNode = cc.instantiate(this.addressPrefab)
            itemNode.active = true
            this.addRessListContent && (itemNode.parent = this.addRessListContent)

            itemNode.getComponent(AddressMode).setData(addressInfo)
            
            let btnEdit = cc.find("infoNode/btnEdit", itemNode)
            btnEdit.active = true

            let btnChange = cc.find("infoNode/btnChange", itemNode)
            btnChange.active = false
    
            this.setButtonClick("infoNode/btnSelect", itemNode, () => {
                console.log("btnSelect on click")
                EventMgr.dispatchEvent(Constants.EVENT_DEFINE.ADDRESS_SELECT, addressInfo)
                this.close()
            })
        }

        if(this.addressList.length >= 3){
            this.btnNew.getComponent(cc.Button).interactable = false
            this.lblTip.active = true
        }else{
            this.btnNew.getComponent(cc.Button).interactable = true
            this.lblTip.active = false
        }
    }
}
