﻿
import BaseUI from "../../base/BaseUI";
import { UIMgr } from "../../base/UIMgr";
import { Constants } from "../../constants";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameCenter extends BaseUI {

   onOpen() {
      this.initEvent()
      this.initData()
   }

   onEnterEnd() {
      cc.log(this.node.position)
   }

   initEvent() {
      this.setButtonClick("top/btnBack", () => {
         console.log("btnBack on click")
         this.close()
      })
   }

   initData() {
      if(this.param != null){         
         if(this.param.title != null){
            this.setLabelValue("top/title", this.param.title)
         }

         if (!!this.param.icon) {            
            this.setSpriteFrame("top/icon", this.param.icon)            
            this.setActive("top/icon", true)
            
               // this.setNodePositionX("top/icon", -title.width - 50)
               cc.tween(this.node).delay(.1).call(() => {
                  let title = this.getNode("top/title")
                  if (title){
                     this.setNodePositionX("top/icon", -title.width - 50)
                  }
               })
            // }
         } else {
            this.setActive("top/icon", false)
         }

         if (this.param.page != null) {
            UIMgr.OpenUI(this.param.page, { parent: this.getNode("main/view/content"), param: this.param.param, enterAni: Constants.PAGE_ANI.FADE_IN, closeCb: () => this.close() })
         }
      }
   }
   
}
