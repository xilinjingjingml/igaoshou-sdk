import BaseUI from "../base/BaseUI";
import { UIMgr } from "../base/UIMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ExchangeLotteryEntry extends BaseUI {

    listContent:cc.Node = null
    itemPrefab:cc.Node = null

    curItemPrefab:cc.Node = null
    onOpen(){
        console.log("ExchangeLotteryEntry onOpen", this.param)
        this.listContent = cc.find("btm/list/view/content", this.node)
        this.itemPrefab = cc.find("btm/list/view/content/item", this.node)
        this.itemPrefab.active = false

        this.initButton()
        this.initList()
    }

    start () {
        console.log("ExchangeLotteryEntry start")
    }

    
    // update (dt) {}

    initButton(){
        this.setButtonClick("btm/btnBuy", () => {
            console.log("btnBuy on click")
            // UIMgr.OpenUI("component/Base/GamePage", {param: {page: "component/Exchange/ExchangeConfirmEntry"}})
        })
    }

    initList(){
        for(let i=0;i<5;i++){
            let itemNode = cc.instantiate(this.itemPrefab)
            itemNode.active = true
            this.listContent.addChild(itemNode)

            let tip = cc.find("tip", itemNode)
            
            this.setToggleClick(itemNode, (sender, data) => {
                console.log("btnEdit on click")
                // sptSelect.active = true
                // if(this.curItemPrefab){
                //     this.setSpriteFrame("tip", this.curItemPrefab, "image/exchange/huanhongbao1-4")
                // }
                // this.curItemPrefab = itemNode
                // this.setSpriteFrame(tip, "image/exchange/huanhongbao1-5")
            })

            if(i == 0){                
                itemNode.getComponent(cc.Toggle).isChecked = true
            }
            
            if(i == 2){
                itemNode.getComponent(cc.Toggle).interactable = false
                this.setSpriteFrame(tip, "image/exchange/huanhongbao1-5")
            }
        }
    }
}
