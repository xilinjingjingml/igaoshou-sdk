import BaseUI from "../../base/BaseUI";
import { Helper } from "../../system/Helper";
import { PluginMgr } from "../../base/PluginMgr";
import { LocalMgr } from "../../base/LocalMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SaveAccountSelect extends BaseUI {
    onOpen() {
        this.initEvent()
        this.initData()
    }

    initEvent(){
        this.setButtonClick("btn_contentUs", this.onPressContentUs.bind(this))    

    }

    initData(){
        let QA = [
            {
                question:"这个App是做什么的？",
                answer:"这是一款休闲竞技类游戏应用。您可以在应用上与其他玩家竞技，并通过胜利赢取游戏奖品。我们不会为用户提供作弊机会，所有奖品取决于您的能力。我们提供 1v1 游戏、锦标赛、活动赛、多人赛等各种比赛模式。在1V1奖券比赛和现金比赛中，获胜者将获得所有奖品。在锦标赛、活动赛和多人赛中，排名靠前的玩家瓜分奖池，排名越高，获得的奖品更丰厚。玩家只会与自己相同水平的对手相匹配，因此可能需要一些时间才能找到对手。"
            },
            {
                question:"什么是游戏等级和平台等级？",
                answer:"我们希望玩家在玩我们平台上的各种游戏时拥有成就感，因此通过等级来展示他们独特的成就。其中游戏等级反映了您对特定游戏的掌握程度，而您的平台等级则反映了您玩过的所有游戏的总体验程度。如果你足够努力，你可以达到100级，真正展现你对游戏的掌握！\n备注：您可以通过赢得比赛获得经验，不同游戏每场比赛获得的经验值可以提升平台等级，但仅可提升当前游戏的等级。"
            },
            {
                question:"什么是游戏等级和平台等级？",
                answer:"我们希望玩家在玩我们平台上的各种游戏时拥有成就感，因此通过等级来展示他们独特的成就。其中游戏等级反映了您对特定游戏的掌握程度，而您的平台等级则反映了您玩过的所有游戏的总体验程度。如果你足够努力，你可以达到100级，真正展现你对游戏的掌握！\n备注：您可以通过赢得比赛获得经验，不同游戏每场比赛获得的经验值可以提升平台等级，但仅可提升当前游戏的等级。"
            },
            {
                question:"什么是游戏等级和平台等级？",
                answer:"我们希望玩家在玩我们平台上的各种游戏时拥有成就感，因此通过等级来展示他们独特的成就。其中游戏等级反映了您对特定游戏的掌握程度，而您的平台等级则反映了您玩过的所有游戏的总体验程度。如果你足够努力，你可以达到100级，真正展现你对游戏的掌握！\n备注：您可以通过赢得比赛获得经验，不同游戏每场比赛获得的经验值可以提升平台等级，但仅可提升当前游戏的等级。"
            },
            {
                question:"什么是游戏等级和平台等级？",
                answer:"我们希望玩家在玩我们平台上的各种游戏时拥有成就感，因此通过等级来展示他们独特的成就。其中游戏等级反映了您对特定游戏的掌握程度，而您的平台等级则反映了您玩过的所有游戏的总体验程度。如果你足够努力，你可以达到100级，真正展现你对游戏的掌握！\n备注：您可以通过赢得比赛获得经验，不同游戏每场比赛获得的经验值可以提升平台等级，但仅可提升当前游戏的等级。"
            },
            {
                question:"什么是游戏等级和平台等级？",
                answer:"我们希望玩家在玩我们平台上的各种游戏时拥有成就感，因此通过等级来展示他们独特的成就。其中游戏等级反映了您对特定游戏的掌握程度，而您的平台等级则反映了您玩过的所有游戏的总体验程度。如果你足够努力，你可以达到100级，真正展现你对游戏的掌握！\n备注：您可以通过赢得比赛获得经验，不同游戏每场比赛获得的经验值可以提升平台等级，但仅可提升当前游戏的等级。"
            },
            {
                question:"什么是游戏等级和平台等级？",
                answer:"我们希望玩家在玩我们平台上的各种游戏时拥有成就感，因此通过等级来展示他们独特的成就。其中游戏等级反映了您对特定游戏的掌握程度，而您的平台等级则反映了您玩过的所有游戏的总体验程度。如果你足够努力，你可以达到100级，真正展现你对游戏的掌握！\n备注：您可以通过赢得比赛获得经验，不同游戏每场比赛获得的经验值可以提升平台等级，但仅可提升当前游戏的等级。"
            },
        ]
        let item_QA = this.getNode("item_QA")
        let item_null = this.getNode("item_aa")
        let layout = this.getNode("scrollView_QA/view/content")
        // console.log("jin---qa: ", item_QA, layout)
        for(let id in QA){
            let item = cc.instantiate(item_QA)
            this.setLabelValue(item.getChildByName("node_Q").getChildByName("lbl_Q"), QA[id].question)
            this.setLabelValue(item.getChildByName("node_A").getChildByName("lbl_answer"), QA[id].answer)
            this.setButtonClick(item.getChildByName("node_Q").getChildByName("btn_answer"), this.onPressCurQA.bind(this, item, id))
            // console.log("jin---btn_answer", item.getChildByName("node_Q").getChildByName("btn_answer"))
            for(let clickEvent of item.getChildByName("node_Q").getChildByName("btn_answer").getComponent(cc.Button).clickEvents){
                if(clickEvent.handler == "btn_btn_answer<Button>_click"){
                    clickEvent.customEventData = String(id)
                    console.log("jin---button number: ", clickEvent.customEventData)
                }
            }
            item.active = true
            item.parent = layout

        }
        let item_n = cc.instantiate(item_null)
        item_n.active = true
        item_n.parent = layout
        console.log("jin---button number: ", layout)
    }

    onPressCurQA(item, id: number){
        //TODO 1.按钮状态 2.打开当前 3.同一时间只保持一个answer打开
        //-90:关闭状态 90打开状态
        let btn_answer = item.getChildByName("node_Q").getChildByName("btn_answer")
        if(btn_answer.rotation === -90){
            btn_answer.rotation = 90
            item.getChildByName("node_A").active = false

            //TODO 计算node_A高度h，动效展示
        }else{
            btn_answer.rotation = -90
            item.getChildByName("node_A").active = true
        }
        
    }

    onPressContentUs(){
        // Helper.OpenPageUI("component/Personal/HelpEntry", "Player Support", () => this.close())// TODOT , {pageType: 1, reportUserName: "Jin"}
        Helper.OpenPageUI("component/Personal/HelpEntry", LocalMgr.GetMessage("FAQ_1003"), () => this.close())
    }

}
