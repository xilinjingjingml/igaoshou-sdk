import BaseUI from "../../../../start/script/base/BaseUI";


const {ccclass, property} = cc._decorator;


@ccclass
export default class ExchangeBillLogistics extends BaseUI {
    //送货方式和单号
    lblMode:cc.Node = null
    lblOrderId:cc.Node = null

    //物流信息
    content:cc.Node = null
    contentPrefab:cc.Node = null

    express:any = null
    onOpen(){
        console.log("ExchangeBillLogistics onOpen", this.param)
        this.express = this.param.express

        this.lblMode = cc.find("orderNode/lblMode", this.node)
        this.lblOrderId = cc.find("orderNode/lblOrderId", this.node)

        this.lblMode.getComponent(cc.Label).string = "送货方式：" + this.express.express_name
        this.lblOrderId.getComponent(cc.Label).string = "货运单号：" + this.express.express_code

        this.initContentList()
    }

    onLoad(){
        console.log("ExchangeBillLogistics onLoad", this.param)
        this.content = cc.find("scrollView/view/content/content", this.node)
        this.contentPrefab = cc.find("scrollView/view/content/content/item", this.node)
        this.contentPrefab.active = false
    }

    start () {
        console.log("ExchangeBillLogistics start")
    }

    
    // update (dt) {}

    initButton(){      
    }

    initContentList(){
        for(let i=0;i<this.express.express_track.length;i++){
            let track = this.express.express_track[i]
            let itemNode = cc.instantiate(this.contentPrefab)
            itemNode.active = true
            this.content.addChild(itemNode)
            let lbl = cc.find("lbl", itemNode)
            lbl.getComponent(cc.Label).string = track.status + "\r\n" + track.time
                        
            let progress = cc.find("progress", itemNode)
            let progressCur = cc.find("progressCur", itemNode)
            progressCur.active = false

            lbl.on(cc.Node.EventType.SIZE_CHANGED, ()=>{
                itemNode.height = lbl.height + 30
                progress.height = itemNode.height
            }, this)

            if(i == 0){
                progressCur.active = true
                lbl.color = cc.color(32, 145, 216)
            }

            if(i == this.express.express_track.length-1){
                progress.active = false
            }
        }
    }
}
