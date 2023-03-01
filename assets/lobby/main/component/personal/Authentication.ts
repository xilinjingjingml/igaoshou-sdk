import BaseUI from "../../../start/script/base/BaseUI";
import { UIMgr } from "../../../start/script/base/UIMgr";
import { Helper } from "../../../start/script/system/Helper";
import { AuthenticationSrv } from "../../../start/script/system/AuthenticationSrv";
import { DataMgr } from "../../../start/script/base/DataMgr";
import { Constants } from "../../../start/script/igsConstants";

const { ccclass, property } = cc._decorator;

interface PhoneRegion {
    country: string
    areaCode: string
}

@ccclass
export default class AuthenticationEntry extends BaseUI {

    onOpen() {


        this.initEvent()
        this.initData()

        this.node.scale = cc.winSize.width / 720
    }

    onLoad() {
        this.node.zIndex = 999
    }

    initEvent() {
        this.setButtonClick("node/btnCancel", () => {
            this.close()
            if (!UIMgr.FindUI("component/account/SessionPop/SessionPop")) {
                UIMgr.OpenUI("lobby", "component/account/SessionPop/SessionPop", { param: { hideBg: true } })
            }
        })

        this.setButtonClick("node/btnConfirm", this.onPressAuthen.bind(this))
    }

    initData() {

    }

    onPressAuthen() {
        let name = this.getNodeComponent("node/name", cc.EditBox).string
        if (!name || name.length == 0 || name.indexOf(" ") >= 0) {
            Helper.OpenTip("请输入姓名")
            return
        }

        let idNo = this.getNodeComponent("node/idNo", cc.EditBox).string
        var regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (!regIdNo.test(idNo)) {
            Helper.OpenTip('身份证号填写有误');
            return
        }

        let param = {
            name: name,
            idNum: idNo
        }
        AuthenticationSrv.check(this.param.userData, param, (res) => {
            if (res && res.code == "0000") {
                DataMgr.setData(Constants.DATA_DEFINE.AUTHENTICATION_DATA + this.param.userData.openid, true, true)
                this.close()
                this.param.callback && this.param.callback()
            } else if (res && res.msg) {
                Helper.OpenTip(res.msg)
            } else {
                Helper.OpenTip("操作失败，请稍后再试！")
            }
        })
    }
}
