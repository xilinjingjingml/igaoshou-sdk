
import BaseUI from "../../base/BaseUI";
import { EventMgr } from "../../base/EventMgr";
import { Constants } from "../../constants";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameCenter extends BaseUI {

   onOpen() {
      this.initNode()
      this.initEvent()
   }

   initNode() {
      this.setNodeHeight("main", this.node.height - 70)
      // this.setNodeHeight("main/view", this.node.height - 80)
   }

   initEvent() {
      EventMgr.on(Constants.EVENT_DEFINE.HIDE_TOKEN_INFO, this.hideTokenInfo, this)
      EventMgr.on(Constants.EVENT_DEFINE.SHOW_TOKEN_INFO, this.showTokenInfo, this)

      EventMgr.on(Constants.EVENT_DEFINE.CHANGE_TAB, this.onChangeTab, this)
   }

   hideTokenInfo() {
      let layout = this.getComponent(cc.Layout)
      if (!layout) {
         return
      }
      cc.Tween.stopAllByTarget(layout)
      cc.tween(layout)
      .call(() => this.setNodeHeight("main", this.node.height))
      .to(.2, {paddingTop: -70})      
      .call(() => this.setActive("TokenInfoEntry", false))
      .set({paddingTop: 0})
      .start()
   }

   showTokenInfo() {
      let layout = this.getComponent(cc.Layout)
      if (!layout) {
         return
      }
      cc.Tween.stopAllByTarget(layout)
      cc.tween(layout)
      .call(() => this.setNodeHeight("main", this.node.height - 70))
      .set({paddingTop: -70})
      .call(() => this.setActive("TokenInfoEntry", true))
      .to(.2, {paddingTop: 0})            
      .start()
   }

   onChangeTab() {
      let scroll = this.getNodeComponent("main", cc.ScrollView)
      if (scroll) {
         scroll.stopAutoScroll()
         scroll.scrollToTop()
      }
   }
   
}
