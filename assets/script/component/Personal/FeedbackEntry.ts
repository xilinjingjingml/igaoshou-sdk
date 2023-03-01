import BaseUI from "../../base/BaseUI";
import { DataMgr } from "../../base/DataMgr";
import { Constants } from "../../constants";
import { Account } from "../../system/Account";
import { Helper } from "../../system/Helper";
import { UIMgr } from "../../base/UIMgr";
import { PluginMgr, EPlatformEvent } from "../../base/PluginMgr";
import { EventMgr } from "../../base/EventMgr"

const {ccclass, property} = cc._decorator;

@ccclass
export default class FeedbackEntry extends BaseUI {

    _textrure: any[]
    onOpen() {
        this.initEvent()
        this.initData()
    }

    initEvent(){
        this.setButtonClick("node_replyView/layout_picture/btn_addPicture", this.onPressAddPictrue.bind(this))
        this.setButtonClick("node_CurMessage/btn_Reply", this.onPressPeplyView.bind(this))
        this.setButtonClick("node_replyView/btn_send", this.onPressSend.bind(this))
        EventMgr.on("onPlatformCallBack", this.onPlatformCallBack)
    }

    initData(){
        //TODO 展示this.param.message

        if(this.param.pageType){
            this.setReplyView()
        }else{
            this.setItemCurMessage()
        }
    }

    //TODO 多个图片
    setNodePicture(layout: cc.Node){
        //
        let node_picture = this.getNode("node_picture")
        // let layout = this.getNode("node_CurMessage/scrollView_message/view/content/item_curMessage/node_describle/node_pictures/layout")
        for(let i = 0;i < 3; i++){
            let item = cc.instantiate(node_picture)
            this.setSpriteFrame(item.getChildByName("spr_pic"), "image/icon/big_weibi", true)
            item.active = true
            item.parent = layout
        }
        
    }

    //提交问题与回复
    setItemCurMessage(){
        //node_CurMessage
        this.setActive("node_CurMessage", true)
        let item_curMessage = this.getNode("item_curMessage")
        let content = this.getNode("node_CurMessage/scrollView_message/view/content")
        for(let i = 0;i < 3; i++){
            let item = cc.instantiate(item_curMessage)
            // this.setSpriteFrame(item.getChildByName("spr_pic"), "image/icon/big_weibi", true)
            //1.官方回复:true 2.我的提问:false  
            if(false){
                item.getChildByName("node_title").getChildByName("icon_game").active = true
                item.getChildByName("node_title").getChildByName("lbl_gameName").active = true
                this.setLabelValue(item.getChildByName("node_title").getChildByName("lbl_gameName"), "taiqiu")
                this.setLabelValue(item.getChildByName("node_describle").getChildByName("lbl_issua"), "Hello,")
                
            }else{
                item.getChildByName("node_title").getChildByName("lbl_myReport").active = true
                // this.setLabelValue(item.getChildByName("node_title").getChildByName("lbl_myReport"), "taiqiu")
                this.setLabelValue(item.getChildByName("node_describle").getChildByName("lbl_issua"), "Report Cheating")

            }

            //0.pictrue 1.time 2.content
            let node_pictures = item.getChildByName("node_describle").getChildByName("node_pictures")
            if(false){
                this.setActive(node_pictures, true)
                node_pictures.getChildByName("layout")
                this.setNodePicture(node_pictures.getChildByName("layout"))
            }else{
                this.setActive(node_pictures, false)
            }
            
            this.setLabelValue(item.getChildByName("node_title").getChildByName("lbl_time"), "08/09/2021 14:90:00")
            this.setLabelValue(item.getChildByName("node_describle").getChildByName("lbl_content"), "Arrays are list-like objects whose prototype has methods to perform traversal and mutation operations. Neither the length of a JavaScript array nor the types of its elements are fixed. Since an array's length can change at any time, and data can be stored at non-contiguous locations in the array, JavaScript arrays are not guaranteed to be dense; this depends on how the programmer chooses to use them. In general, these are convenient characteristics; but if these features are not desirable for your particular use, you might consider using typed arrays.")

            item.active = true
            item.parent = content
        }
    }

    setReplyView(){
        //desribe
        //picture
        //send
        this.setActive("node_replyView", true)
    }

    onPressSend(){
        let textures = ""
        if(this._textrure){
            for(let curTexture of this._textrure){
                if(!textures){
                    textures = curTexture
                }else{
                    textures = textures + "|" + curTexture
                }
                
            }
        }
        
        let layout_picture = this.getNode("node_reportProblem/layout_picture")
        let addPictureSta = false
        for(let cur of layout_picture.children){
            if(cur.name === "node_picture"){
                addPictureSta = true
            }
        }

        if(addPictureSta){
            //TODO textures发送云端，获取新地址
            PluginMgr.uploadHeadFace(textures)
        }else{
            this.reportProblem_curPage("")
        }
    }

    onPressAddPictrue(){
        //TODO 1.调用接口打开本地相册 2.
        PluginMgr.initHeadFace("",false,0,0)
    }

    onPlatformCallBack(msg){
        if (msg.PlatformResultCode == EPlatformEvent.INIT_HEADFACE_SUCCESS) {
            console.log("jin---onPlatformCallBack success")
            this.setAddedPictrue(msg.url)
        }else if(msg.PlatformResultCode == EPlatformEvent.INIT_HEADFACE_FAIL){
            Helper.OpenTip("For failure.")
        }

        //TODO APP返回图片地址
        if(true){ //(msg.PlatformResultCode == 
            //发送
            this.reportProblem_curPage(msg.url)
        }
    }

    setAddedPictrue(url){
        //TODO 选中后回调 添加到界面
        let layout_picture = this.getNode("node_replyView/layout_picture")

        let item_pic = this.getNode("node_picture")
        Helper.getPhoneTexture(url, (texture)=>{
            this._textrure.push(texture)
            let item = cc.instantiate(item_pic)
            // this.setSpriteFrame(item.getComponent("spr_pic"), url)
            item.getChildByName("spr_pic").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture)
            item.active = true
            item.parent = layout_picture
            console.log("jin---layout_picture: ", layout_picture)
            if(layout_picture.childrenCount === 4){
                layout_picture.getChildByName("btn_addPicture").active = false
                return
            }else if(layout_picture.childrenCount >= 4){
                return
            }
        })
    }

    reportProblem_curPage(images){
        let string_describe = this.getNodeComponent("node_replyView/node_describe/input", cc.EditBox).string

        if(string_describe === ""){
            Helper.OpenTip("Please enter describe.")
            return
        }
        // TODOT images
        images = ""
        Account.reportProblem({
            issue: string_describe,
            images: images,
            report_gid: ''
        }, ()=>{

        })
    }

    onPressPeplyView(){
        Helper.OpenPageUI("component/Personal/FeedbackEntry", "Feedback", {pageType: 1})
    }
}
