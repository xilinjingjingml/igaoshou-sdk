﻿import BaseUI from "../../../start/script/base/BaseUI";
import { Helper } from "../../../start/script/system/Helper";
import { UIMgr } from "../../../start/script/base/UIMgr";
import { Constants } from "../../../start/script/igsConstants";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameCenter extends BaseUI {

   onOpen() {
      this.initEvent()
      this.initData()
   }

   onLoad() {
      if (!Helper.isNative() && (cc.sys.OPPO_GAME == cc.sys.platform || cc.sys.VIVO_GAME == cc.sys.platform)) {
         this.node.getComponent(cc.Widget).top = 70
         this.node.getComponent(cc.Widget).updateAlignment()
         cc.find("top", this.node).getComponent(cc.Widget).updateAlignment()
         cc.find("main", this.node).getComponent(cc.Widget).updateAlignment()
      }
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
      if (this.param != null) {
         if (this.param.title != null) {
            this.setLabelValue("top/title", this.param.title)
         }

         if (!!this.param.icon) {
            this.setSpriteFrame("top/icon", this.param.icon)
            this.setActive("top/icon", true)

            // this.setNodePositionX("top/icon", -title.width - 50)
            cc.tween(this.node).delay(.1).call(() => {
               let title = this.getNode("top/title")
               if (title) {
                  this.setNodePositionX("top/icon", -title.width - 50)
               }
            })
            // }
         } else {
            this.setActive("top/icon", false)
         }

         if (this.param.page != null) {
            UIMgr.OpenUI("lobby", this.param.page, { parent: this.getNode("main/view/content"), param: this.param.param, closeCb: () => this.close() })
         }
      }
   }

}
