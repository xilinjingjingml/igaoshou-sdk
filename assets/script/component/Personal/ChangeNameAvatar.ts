/*
 * @Author: Jin
 * @Date: 2021-10-08 14:16:05
 * @LastEditTime: 2021-10-14 13:44:02
 * @LastEditors: Jin
 * @Description: In User Settings Edit
 * @FilePath: \igaoshou-sdk\assets\script\component\Personal\ChangeNameAvatar.ts
 */
import BaseUI from "../../base/BaseUI";
import { Helper } from "../../system/Helper";
import { PluginMgr, EPlatformEvent } from "../../base/PluginMgr";
import { LocalMgr } from "../../base/LocalMgr";
import { Constants } from "../../constants";
import { DataMgr } from "../../base/DataMgr";
import { EventMgr } from "../../base/EventMgr"
import { Account } from "../../system/Account";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ChangeNameAvatar extends BaseUI {
    _userName: null |string
    _url: null | string

    onOpen() {
        this.initEvent()
        this.initData()
    }

    initEvent(){
        //1.设置头像 2.submit
        this.setButtonClick("btn_setUp", this.onPressSetUpHandImage.bind(this))  
        this.setButtonClick("btn", this.onPressSumit.bind(this))  
        EventMgr.on("onPlatformCallBack", this.onPlatformCallBack)
    }

    initData(){
        //1.头像 2.currnet game name and icon(暂时不弄)
        let IPlayerData = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        this._userName = IPlayerData.userName
        this.setSpriteFrame("node_handImg/spr_handImage", IPlayerData.avatar)

    }

    onPressSetUpHandImage(){
        console.log("jin---onPressSetUpHandImage")
        PluginMgr.initHeadFace("",false,200,200)
    }

    onPressSumit(){
        if(this._url){
            // 请求图片云地址
            PluginMgr.uploadHeadFace(this._url)
        }else{
            this.submitUserInfo("")

        }
    }

    onPlatformCallBack(msg){
        if (msg.PlatformResultCode == EPlatformEvent.INIT_HEADFACE_SUCCESS) {
            console.log("jin---onPlatformCallBack success")
            this.setAddedPictrue(msg.url)
            this._url = msg.url
        }else if(msg.PlatformResultCode == EPlatformEvent.INIT_HEADFACE_FAIL){
            Helper.OpenTip("For failure.")
        }

        //APP返回图片地址
        if(true){ //(msg.PlatformResultCode == 
            //发送
            this.submitUserInfo(msg.url)
        }
    }

    submitUserInfo(imageUrl){
        //1.name
        let userName = this.getNodeComponent("input", cc.EditBox).string
        if(userName.length <= 2 || userName.length >= 20){
            Helper.OpenTip(LocalMgr.GetMessage("Home_1039"))
            return
        }

        if(this._userName === userName){
            Helper.OpenTip(LocalMgr.GetMessage("Home_1040"))
            return
        }

        //submit info
        Account.UpdateAccountInfo({
            nickname: userName,
            headimgurl: imageUrl
        }, (res)=>{
            this.close()
            Account._loginGuest({})
        })
    }


    setAddedPictrue(url){
        Helper.getPhoneTexture(url, (texture)=>{
            this.setSpriteFrame("spr_handImage", new cc.SpriteFrame(texture))
        })
    }
}
