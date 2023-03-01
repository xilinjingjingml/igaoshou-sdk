import BaseUI from "../../base/BaseUI";
import { Constants } from "../../constants";
import { Helper } from "../../system/Helper";

const {ccclass, property} = cc._decorator;

@ccclass
export default class getAwardPop extends BaseUI {
    awardPrefab:cc.Node = null
    jiahaoPrefab:cc.Node = null
    rwardNode:cc.Node = null
    onOpen() {
        console.log("getAwardPop onOpen", this.param)
       
        this.initButton()

        let jiahao:cc.Node = null
        for(let i=0;i<this.param.awards.length;i++){
            let awardInfo = this.param.awards[i]
            awardInfo.item_id = awardInfo.item_id || 0
            let award = cc.instantiate(this.awardPrefab)
            award.active = true
            this.rwardNode.addChild(award)

            let manyIcons = new Map();
            manyIcons.set(Constants.ITEM_INDEX.WCOIN,"image/icon/many_weibi")
            manyIcons.set(Constants.ITEM_INDEX.LOTTERY,"image/icon/many_jiangjuan")
            manyIcons.set(Constants.ITEM_INDEX.DIAMOND,"image/icon/many_zuanshi")

            if(manyIcons.get(awardInfo.item_id)){
                this.setSpriteFrame("icon", award, manyIcons.get(awardInfo.item_id))
            }

            let num = cc.find("num", award)
            num.getComponent(cc.Label).string = 
                awardInfo.item_id === Constants.ITEM_INDEX.DIAMOND ? Helper.FormatNumPrice(awardInfo.item_num / 100) : awardInfo.item_num
            
            jiahao = cc.instantiate(this.jiahaoPrefab)
            jiahao.active = true
            this.rwardNode.addChild(jiahao)
        }
        if(jiahao){
            jiahao.destroy()
        }
    }

    onLoad(){
        this.awardPrefab = cc.find("award", this.node)
        this.jiahaoPrefab = cc.find("jiahao", this.node)
        this.awardPrefab.active = false
        this.jiahaoPrefab.active = false

        this.rwardNode = cc.find("node/rwardNode", this.node)
    }

    initEvent() {
        
    }

    initButton(){
        this.setButtonClick("node/btnOk", this.node, ()=>{
            this.close()        
        })
    }

    initData(signConfig:any){
        
    }
}
