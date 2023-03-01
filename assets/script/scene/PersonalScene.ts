import BaseUI from "../base/BaseUI";
import { Constants } from "../constants";
import { DataMgr } from "../base/DataMgr";
import { Helper } from "../system/Helper";
import WxWrapper from "../system/WeChatMini";
import { Account } from "../system/Account";
import { ActivitySrv } from "../system/ActivitySrv";
import { MatchSvr } from "../system/MatchSvr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PersonalScene extends BaseUI {

    onOpen() {
        Helper.reportEvent("大厅", "个人信息", "打开界面")
        // this.initNode()
        this.setActive("userInfo/user/btnGift", false)

        this.initEvent()
        this.initData()
    }

    onClose() {
        // WxWrapper.hideUserInfoButton()
    }

    onEnterEnd() {
        this.initNode()
    }

    initNode() {
        // if (cc.sys.platform === cc.sys.WECHAT_GAME) {
        //     let self = this
        //     WxWrapper.checkUserScope("userInfo", function (canUse) {
        //         if (self.isValid && !canUse) {
        //             let btnWeixin = self.getNode("userInfo/user/btnGift")
        //             btnWeixin.active = true
        //             WxWrapper.showUserInfoButton(btnWeixin.getBoundingBoxToWorld(), (res) => {
        //                 Account.login({ authType: Constants.LOGIN_TYPE.LOGIN_WECHAT, relogin: true}, () => {
        //                     ActivitySrv.GetReward("1001")
        //                     WxWrapper.hideUserInfoButton()
        //                     self.setActive("userInfo/user/btnGift", false)

        //                     self.initData()
        //                 })
        //             })
        //         }
        //     })
        //     this.removeNodeComponent("userInfo/user/btnGift", cc.Button)
        // }
    }

    initEvent() {
        // this.setButtonClick("userInfo/user/btnGift", this.onPressGift.bind(this))
        this.setButtonClick("userInfo/user/btnHelp", this.onPressHelp.bind(this))
        this.setButtonClick("userInfo/user/btnSet", this.onPressSet.bind(this))
        this.setButtonClick("userInfo/user/btnCopy", this.onPressCopy.bind(this))

        DataMgr.feed(Constants.DATA_DEFINE.USER_INFO, this.initData, this)

        MatchSvr.GetPlayerProfile()
    }

    initData() {
        let IPlayerData = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        this.setLabelValue("userInfo/user/userName", IPlayerData.userName)
        this.setSpriteFrame("userInfo/user/avatar", IPlayerData.avatar)
    }

    onPressGift() {
        // WxWrapper.getUserInfo(function (err, uinfo) {
        //     uinfo ? Account.login({authType: Constants.LOGIN_TYPE.BIND_WEIXIN}) : WxWrapper.createUserInfoButton()
        // })
        // let self = this
        // WxWrapper.checkUserScope("userInfo", function (canUse) {
        //     if (self.isValid && !canUse) {
        //         let btnWeixin = self.getNode("userInfo/user/btnGift")
        //         btnWeixin.active = true
        //         WxWrapper.showUserInfoButton(btnWeixin.getBoundingBoxToWorld(), (res) => {
        //             Account.login({ authType: Constants.LOGIN_TYPE.BIND_WEIXIN })
        //         })
        //     }
        // })
    }

    onPressHelp() {
        Helper.OpenPageUI("component/Personal/HelpEntry", "帮助") //TODOT {pageType: 1, reportUserName: "Jin"} , null, {pageType: 1, reportUserName: "Jin"}
    }

    onPressSet() {
        Helper.OpenPageUI("component/Personal/SettingEntry", "设置")
    }

    onPressCopy() {
        let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        if (user)
            Helper.copyToClipBoard(user.userId)
    }
}
