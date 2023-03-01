import BaseUI from "../../base/BaseUI";
import { DataMgr } from "../../base/DataMgr";
import { Constants } from "../../constants";
import { Account } from "../../system/Account";
import { Helper } from "../../system/Helper";
import { UIMgr } from "../../base/UIMgr";
import { LocalMgr } from "../../base/LocalMgr";
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends BaseUI {

    onOpen() {
        this.initEvent()
        this.initData()
    }

    initEvent(){
    }

    initData(){
        //本地当前游客账户
        let existingItem = this.getNode("existing")//existingItem
        let layout = this.getNode("node_item_layout")
        let histroyAccount = DataMgr.getData<IHISTROY_ACCOUNT_INFO>(Constants.DATA_DEFINE.HISTROY_ACCOUNT)
        let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        let token = DataMgr.getData<IOpenId>(Helper.GetTokenDataKey())
        console.log("jin---avater: ", token, user, histroyAccount)

        for(let curAccount of histroyAccount.history_account){
            if(token.account === curAccount.account){
                continue
            }
            let item = cc.instantiate(existingItem)
            this.setDate(item,curAccount)
            //图标登录方式图标
            item.active = true
            item.parent = layout
            
        }
        
    }

    setDate(item:cc.Node, curAccount){
        //头像
        item.getChildByName("lbl_name").getComponent(cc.Label).string = curAccount.account
        //最近登录方式

        //登录图标
        let name = ""
        let icon_login = ""
        if(curAccount.email){
            name = curAccount.email
            icon_login = "image/icon/foreign_zhangha0-youxiangzhuce"
        }
        else if(curAccount.phone){
            name = curAccount.phone
            icon_login = "image/icon/foreign_zhangha0-shoujizhuce"
        }
        else if(curAccount.facebook){
            //在绑定facebook后，保存facebook信息，1.登录（用于再次进入游戏自动进入） 2.history（已保存账号处）
            // name = curAccount.facebook // TODOT
            name = curAccount.account
        }
        else if(curAccount.apple){
            // name = curAccount.apple // TODOT
            name = curAccount.account
        }else{
            name = curAccount.account
            // icon_login = "image/icon/foreign_zhangha0-zhuce"
        }
        item.getChildByName("lbl_name").getComponent(cc.Label).string = name
        this.setSpriteFrame(item.getChildByName("node_avater").getChildByName("avater"), curAccount.headImage)
        icon_login && this.setSpriteFrame(item.getChildByName("icon_login"), icon_login, true)
        this.setButtonClick(item, this.onPressAccount.bind(this, curAccount))
    }

    onPressAccount(curAccount){
        //优先级：1,邮箱 2.电话 3.facebook 4.apple 5.游客
        if(curAccount.email){
            Helper.OpenPageUI("component/Personal/BindAccountEntry", LocalMgr.GetMessage("Login_1001"), {type: 8, email: curAccount.email})
        }
        else if(curAccount.phone){
            Helper.OpenPageUI("component/Personal/BindAccountEntry", LocalMgr.GetMessage("Loading_1005"), {type: 9, phone: curAccount.phone})
        }
        else if(curAccount.facebook){

        }
        else if(curAccount.apple){

        }else{
            console.log("jin---onPressAccount: ", curAccount)
            let authInfo = {
                metadata:{
                    loginOtherAccount: true,
                    authType: Constants.LOGIN_TYPE.LOGIN_GUSET,
                    account: curAccount.account,
                    password: curAccount.password
                }
            }
            Account.login(authInfo, ()=>{
                this.close()
                UIMgr.CloseUI("component/Personal/ExistingAccountEntry")
                UIMgr.CloseUI("component/Personal/SelectLoginMode")
                UIMgr.CloseUI("component/Personal/MyAccountEntry")
            })
        }
    }


}
