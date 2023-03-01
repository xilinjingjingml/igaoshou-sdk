import BaseUI from "../../script/base/BaseUI";
import { EventMgr } from "../../script/base/EventMgr";
import { Constants } from "../../script/igsConstants";


const {ccclass, property} = cc._decorator;

@ccclass
export default class MainSceneCenter extends BaseUI {

   start() {
      this.initNode()
      this.initEvent()
   }

   initNode() {
      this.setNodeHeight("main", this.node.height - 70)
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
      .call(() => this.setActive("token", false))
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
      .call(() => this.setActive("token", true))
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
