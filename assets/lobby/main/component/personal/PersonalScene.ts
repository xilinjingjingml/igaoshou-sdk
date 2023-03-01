import BaseUI from "../../../start/script/base/BaseUI";
import { DataMgr } from "../../../start/script/base/DataMgr";
import { MatchSvr } from "../../../start/script/system/MatchSvr";
import { Constants } from "../../../start/script/igsConstants";
import { User } from "../../../start/script/data/User";
import { Helper } from "../../../start/script/system/Helper";
import { HttpMgr } from "../../../start/script/base/HttpMgr";


const { ccclass, property } = cc._decorator;

@ccclass
export default class PersonalScene extends BaseUI {

    btnHeadCount = 0

    _changeCount: number = 0

    onOpen() {
        //Helper.reportEvent("大厅", "个人信息", "打开界面")
        this.initNode()
        this.setActive("userInfo/user/btnGift", false)

        this.initEvent()
        this.initData()

        if (cc.sys.BYTEDANCE_GAME === cc.sys.platform) {
            this.setActive("userInfo/user/avatar/btnHead", true)
        }
    }

    onLoad(): void {
        this.setActive("userInfo/user/avatar/avatarFrame", false)
    }

    onClose() {
    }

    initNode() {
        this.setActive("userInfo/user/btnClear", false)
    }

    initEvent() {
        this.setButtonClick("userInfo/user/btnHelp", this.onPressHelp.bind(this))
        this.setButtonClick("userInfo/user/btnSet", this.onPressSet.bind(this))
        this.setButtonClick("userInfo/user/btnCopy", this.onPressCopy.bind(this))
        this.setButtonClick("userInfo/user/avatar/btnHead", this.onPressHead.bind(this))

        this.setButtonClick("btnChange", this.onChangeEnv.bind(this), 0)
        
        DataMgr.feed(Constants.DATA_DEFINE.USER_INFO, this.initData, this)

        MatchSvr.GetPlayerProfile()
    }

    initData() {
        this.setLabelValue("userInfo/user/userName", User.UserName)
        this.setSpriteFrame("userInfo/user/avatar", User.Avatar)
        this.setActive("userInfo/user/avatar/avatarFrameMember", false)

        if (DataMgr.data.OnlineParam.golden_card && DataMgr.data.OnlineParam.golden_card == 1) {
            let isMember = DataMgr.getData<boolean>(User.OpenID + Constants.DATA_DEFINE.IS_MEMBER)
            this.setActive("userInfo/user/avatar/avatarFrame", !isMember)
            this.setActive("userInfo/user/avatar/avatarFrameMember", isMember)            
        }
    }

    onPressHelp() {
    }

    onPressSet() {
        Helper.OpenPageUI("component/personal/Setting", "设置")
    }

    onPressCopy() {
        if (cc.sys.BYTEDANCE_GAME === cc.sys.platform) {
            Helper.copyToClipBoard(User.UserName)
        } else {
            Helper.copyToClipBoard(User.OpenID + "@" + DataMgr.data.Config.gameId + "@" + HttpMgr.headKey())
        }
    }

    onPressHead() {
        this.btnHeadCount++
        if (this.btnHeadCount == 5) {
            this.btnHeadCount = 0
            Helper.copyToClipBoard(User.OpenID + "@" + DataMgr.data.Config.gameId + "@" + HttpMgr.headKey())
        }
    }

    onChangeEnv() {
        this._changeCount++
        if (this._changeCount >= 5) {
            this.setActive("editEnv", true)
        }
    }    

    onEditEnvReturn() {
        let edit = this.getNodeComponent("editEnv", cc.EditBox)
        if (edit.string === ">>*>>t") {
            DataMgr.setData(Constants.DATA_DEFINE.IGS_ENV, Constants.ENV.ENV_SANDBOX, true)
            cc.game.restart()
        } else if (edit.string === ">>*>>o") {
            DataMgr.setData(Constants.DATA_DEFINE.IGS_ENV, Constants.ENV.ENV_PRODUCTION, true)
            cc.game.restart()
        } else if (edit.string === ">>*>>a") {
            DataMgr.setData(Constants.DATA_DEFINE.IGS_ENV, Constants.ENV.ENV_ABROAD, true)
            cc.game.restart()
        }
    }
}
