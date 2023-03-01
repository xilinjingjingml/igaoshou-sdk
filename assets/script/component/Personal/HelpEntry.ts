import BaseUI from "../../base/BaseUI";
import { DataMgr } from "../../base/DataMgr";
import { Constants } from "../../constants";
import { Account } from "../../system/Account";
import { Helper } from "../../system/Helper";
import { UIMgr } from "../../base/UIMgr";
import { PluginMgr, EPlatformEvent } from "../../base/PluginMgr";
import { EventMgr } from "../../base/EventMgr"
import { EPluginType, IAdInfo, EAdsType, EAdsResult } from "../../pulgin/IPluginProxy"
import { LocalMgr } from "../../base/LocalMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HelpEntry extends BaseUI {

    _textrure : any[]//手机url

    onOpen() {
        this.initEvent()
        this.initData()
    }

    initEvent(){
        this.setButtonClick("btn_reportProblem_off", this.onPressReportProblem.bind(this))
        this.setButtonClick("btn_myReport_off", this.onPressMyReport.bind(this))
        console.log("jin---this.param: ", this.param)
        if(!this.param.pageType){
            this.setButtonClick("node_reportProblem/node_selectReportCheating/btn_selectCheat", this.onPressSelectCheat.bind(this))
        }
        
        this.setButtonClick("node_reportProblem/layout_picture/btn_addPicture", this.onPressAddPictrue.bind(this))
        
        this.setButtonClick("node_reportProblem/btn_send", this.onPressSend.bind(this))
        EventMgr.on("onPlatformCallBack", this.onPlatformCallBack)
    }

    initData(){
        this.setIssueItem()

        //
        if(this.param.pageType){
            this.setActive("node_reportProblem/node_describe", false)
            this.setActive("node_reportProblem/node_describe_report", true)
            this.setLabelValue("node_reportProblem/node_describe_report/lbl_report", "Report " + this.param.reportUserName)
            // this.setLabelValue("node_reportProblem/node_selectReportCheating/btn_selectCheat/lbl_issue", "Report Cheating")
            this.setLanguageId("node_reportProblem/node_selectReportCheating/btn_selectCheat/lbl_issue","FAQ_1017")
        }

        //show my report true:有信息  false：没信息
        let tempdate = [
            {
                issue: "Report Cheating",
                time: "08/03/2021 14:00:00",
                message:"hello, my name is xiajing",
            },
            {
                issue: "Report Cheating",
                time: "08/03/2021 15:00:00",
                message:"hello, my name is yuanyuan"
            },
            {
                issue: "Report Cheating",
                time: "08/03/2021 16:00:00",
                message:"hello, my name is hanghang"
            },
        ]
        //TODOT
        for(let curDate of tempdate){
            this.setItemMyMessage(curDate)
        }

        let data = {
            report_gid :""
        }

        // Account.LoadReport(data, (res)=>{

        //     if(res.msg && res.msg.length > 0){
        //         for(let curDate of res.msg){
        //             this.setItemMyMessage(curDate)
        //         }
        //     }else{
        //         //TODO 图片 一句话
        //     }
        // })
        
    }

    onPressReportProblem(){
        this.setActive("btn_reportProblem_off", false)
        this.setActive("btn_reportProblem", true)
        this.setActive("btn_myReport_off", true)
        this.setActive("btn_myReport", false)
        this.setPagePostion(false)
    }

    onPressMyReport(){
        this.setActive("btn_reportProblem_off", true)
        this.setActive("btn_reportProblem", false)
        this.setActive("btn_myReport_off", false)
        this.setActive("btn_myReport", true)
        this.setPagePostion(true)
    }

    setPagePostion(direction){
        let reportProblemPoage = this.getNode("node_reportProblem") //-720 0
        let reportProblemPoage_Y = reportProblemPoage.y
        let myReportPoage = this.getNode("node_MyReport")//0 720
        let myReportPoage_Y = myReportPoage.y

        let x_r = null
        let x_m = null
        if(direction){
            x_r = -720
            x_m = 0
        }else{
            x_r = 0
            x_m = 720
        }
        cc.tween(reportProblemPoage)
        .to(.2, {position: cc.v3(x_r,reportProblemPoage_Y, 0)})
        .start()

        cc.tween(myReportPoage)
        .to(.2, {position: cc.v3(x_m, myReportPoage_Y, 0)})
        .start()
    }

    onPressSelectCheat(){
        //1.展示下拉框 2.lbl需要变 3.
        this.setCheatState(true)
    }

    setIssueItem(){
        let preNum = [
            LocalMgr.GetMessage("FAQ_1014"),
            LocalMgr.GetMessage("FAQ_1015"),
            LocalMgr.GetMessage("FAQ_1016"),
            LocalMgr.GetMessage("FAQ_1018"),
            LocalMgr.GetMessage("FAQ_1019"),
            LocalMgr.GetMessage("FAQ_1020"),
        ]
        let item_num = this.getNode("node_reportProblem/node_selectReportCheating/node_cheat/page")
        let pageView = this.getNodeComponent("node_reportProblem/node_selectReportCheating/node_cheat/PageView", cc.PageView)
        for(let i in preNum){
            console.log("jin---setItem", i)
            let item = cc.instantiate(item_num)
            item.getComponentInChildren(cc.Label).string = preNum[i]
            this.setButtonClick(item, this.onPressSelectIssue.bind(this, preNum[i]))
            pageView.addPage(item)
        }

    }

    onPressSelectIssue(curIssue: string){
        //1.收起下拉框 2.btn中lbl显示选中内容
        this.setCheatState(false)
        this.setLabelValue("node_reportProblem/node_selectReportCheating/btn_selectCheat/lbl_issue", curIssue)
    }

    setCheatState(sta: boolean){
        //1.true:打开 2.false：关闭 3.改变箭头方向
        let node_cheat = this.getNode("node_reportProblem/node_selectReportCheating/node_cheat")
        let arrow = this.getNode("node_reportProblem/node_selectReportCheating/btn_selectCheat/foreigen_jubao-fuhao")
        if(sta === node_cheat.active){
            return
        }

        if(sta){
            cc.tween(node_cheat)
            .to(.2, {scaleY: 1})
            .call(()=>{node_cheat.active = true})
            .start()
            arrow.rotation = -90
        }else{
            cc.tween(node_cheat)
            .to(.2, {scaleY: 0.01})
            .call(()=>{node_cheat.active = false})
            .start()
            arrow.rotation = 0
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
        let layout_picture = this.getNode("node_reportProblem/layout_picture")

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

    onPressSend(){
        let textures = ""
        for(let curTexture of this._textrure){
            if(!textures){
                textures = curTexture
            }else{
                textures = textures + "|" + curTexture
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

    //TODO 收到地址，发送问题
    reportProblem_curPage(images){
        let string_issue = this.getNodeComponent("node_reportProblem/node_selectReportCheating/btn_selectCheat/lbl_issue", cc.Label).string
        let string_matchId = this.getNodeComponent("node_reportProblem/node_matchId/input", cc.EditBox).string
        let string_describe = this.getNodeComponent("node_reportProblem/node_describe/input", cc.EditBox).string

        if(string_issue === "*Please select an issue."){
            Helper.OpenTip("Please select an issue.")
            return
        }
        
        if(string_matchId === ""){
            Helper.OpenTip("Please enter match id.")
            return
        }

        if(string_describe === ""){
            Helper.OpenTip("Please enter describe.")
            return
        }

        let number_issue = this.selectIssue(string_issue)
        // TODOT images
        images = ""
        if(this.param.reportUserName){
            //TODO 举报
            Account.reportProblem({
                type: number_issue,
                match_id: string_matchId,
                report_nickname: this.param.reportUserName,
                issue: string_describe,
                images: images
            }, ()=>{

            })
        }else{
            //TODO 常规提交
            Account.reportProblem({
                type: number_issue,
                match_id: string_matchId,
                issue: string_describe,
                images: images
            }, ()=>{
                
            })
        }

    }

    setItemMyMessage(date){
        let layout = this.getNode("node_MyReport/scrollView_myReport/view/content")
        let item_myMessage = this.getNode("item_myMessage")
        let item = cc.instantiate(item_myMessage)
        //TODO 1.ISSUE 2.TIME 3.MESSAGE
        let tempMessage = date.message.slice(0, 16)
        this.setLabelValue(item.getChildByName("lbl_issue"), date.issue)
        this.setLabelValue(item.getChildByName("lbl_time"), date.time)
        this.setLabelValue(item.getChildByName("lbl_message"), tempMessage)
        this.setButtonClick(item.getChildByName("btn_ToMyMessageView"), this.openViewCurReport.bind(this, date))//TODOT date
        item.active = true
        item.parent = layout
    }

    openViewCurReport(date){
        console.log("jin---openViewCurReport: ", date)
        // date = {

        // }
        Helper.OpenPageUI("component/Personal/FeedbackEntry", "My Message", date)

    }

    //
    selectIssue(curIssue: string): number{
        let curIssue_num = null
        if(curIssue == "Account Inquiry"){
            curIssue_num = Constants.ISSUE_TYPE.ACCOUNT_INQUIRY
        }
        else if(curIssue == "Deposit and Billing"){
            curIssue_num = Constants.ISSUE_TYPE.DEPOSIT_AND_BILLING
        }
        else if(curIssue == "Report a Crash"){
            curIssue_num = Constants.ISSUE_TYPE.REPORT_A_CRASH
        }
        else if(curIssue == "Report Cheating"){
            curIssue_num = Constants.ISSUE_TYPE.REPORT_CHEATING
        }
        else if(curIssue == "Report Bug"){
            curIssue_num = Constants.ISSUE_TYPE.REPOT_BUG
        }
        else if(curIssue == "Feedback"){
            curIssue_num = Constants.ISSUE_TYPE.FEEDBACK
        }
        else if(curIssue == "Other issue"){
            curIssue_num = Constants.ISSUE_TYPE.OTHER_ISSUE
        }
       
        return curIssue_num
    }
}
