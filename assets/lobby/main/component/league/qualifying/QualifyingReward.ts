import BaseUI from "../../../../start/script/base/BaseUI";
import { QualifyingSrv } from "../../../../start/script/system/QualifyingSrv";
import { Constants } from "../../../../start/script/igsConstants";
import { UserSrv } from "../../../../start/script/system/UserSrv";
import { UIMgr } from "../../../../start/script/base/UIMgr";
import { EventMgr } from "../../../../start/script/base/EventMgr";


const { ccclass, property } = cc._decorator;

@ccclass
export default class QualifyingReward extends BaseUI {

    _content: cc.Node = null
    _itemPrefab: cc.Node = null

    _rewardItemPrefab:cc.Node = null
    onOpen() {
        this.initEvent()
        this.initButton()

        QualifyingSrv.GetListRewardStatus((status_list)=>{
            this.initData(status_list)
        })
    }

    onLoad(){
        this._content = cc.find("scrollView/view/content", this.node)
        this._itemPrefab = cc.find("item", this._content)
        this._itemPrefab.active = false
        
        this._rewardItemPrefab = cc.find("item/reward/item", this._content)
        this._rewardItemPrefab.active = false
    }

    onClose() {
    }

    initEvent() {

    }

    initButton() {
        this.setButtonClick("top/btnBack", this.node, () => {
            cc.log("on click btnBack")
            this.close()
        })

        
    }

    initData(status_list:any[]) {
        // for(let v of status_list){
        //     v.sort_id = v.grade.level
        //     if(v.status == 2){
        //         v.sort_id += 100
        //     }            
        // }
        // status_list = status_list.sort((a, b) => {
        //     return a.sort_id < b.sort_id ? -1 : 1
        // })
        for(let v of status_list){
            let item = cc.instantiate(this._itemPrefab)
            item.active = true
            item.parent = this._content

            this.setLabelValue("grade", item, v.grade.name)
            this.setSpriteFrame("icon", item, "image/league/qualifying/lv/major_icon_lv" + v.grade.major)
            if(v.award_list){
                for(let i=0; i<v.award_list.length; i++){
                    let award = v.award_list[i]
                    let rewardItem = cc.instantiate(this._rewardItemPrefab)
                    rewardItem.active = true
                    rewardItem.parent = cc.find("reward", item)
                    if(award.id == Constants.ITEM_INDEX.ProtectStarCard){
                        this.setActive("bxk", rewardItem, true)
                        this.setActive("lotter", rewardItem, false)
                    }else if(award.id == Constants.ITEM_INDEX.LOTTERY){
                        this.setActive("bxk", rewardItem, false)
                        this.setActive("lotter", rewardItem, true)
                    }
                    this.setLabelValue("num", rewardItem, award.num)
                }
            }

            // 0条件不满足 1未领取 2已领取
            if(v.status == 1){
                this.setActive("btnGet", item, true)
                this.setActive("sptBeGet", item, false)
            }else if(v.status == 2){
                this.setActive("btnGet", item, false)
                this.setActive("sptBeGet", item, true)
            }else{
                this.setActive("btnGet", item, false)
                this.setActive("sptBeGet", item, false)
                this.setActive("btnMatch", item, true)
            }
            
            this.setButtonClick("btnGet", item, () => {
                cc.log("on click btnGet")
                QualifyingSrv.GetReward({award_id:v.award_id}, (res=>{
                    if(res.award_list && res.award_list.length > 0){                        
                        this.setActive("btnGet", item, false)
                        this.setActive("sptBeGet", item, true)
                        UserSrv.UpdateItem(() => UIMgr.OpenUI("lobby", "component/activity/getAwardPop/GetAwardPop", { param: { awards: res.award_list } }))
                    }
                }))
            })

            this.setButtonClick("btnMatch", item, () => {
                cc.log("on click btnMatch")
                this.close()
                EventMgr.dispatchEvent(Constants.EVENT_DEFINE.CHANGE_MAIN_TAB, { name: "match"})
            })
        }
    }
}
