import BaseUI from "../../base/BaseUI";
import { DataMgr } from "../../base/DataMgr";
import { Constants } from "../../constants";
import { UIMgr } from "../../base/UIMgr";
import { Helper } from "../../system/Helper";
import { EventMgr } from "../../base/EventMgr";
import WxWrapper from "../../system/WeChatMini";
import { Account } from "../../system/Account";
import { ActivitySrv } from "../../system/ActivitySrv";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WebView extends BaseUI {

    onOpen() {
        this.initData()
    }

    initData() {
        let web = this.node.getComponent(cc.WebView)
         web.url = this.param.url
    }

}
