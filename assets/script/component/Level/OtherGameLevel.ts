/*
 * @Description: 等级列表
 * @Version: 1.0
 * @Autor: sonke
 * @Date: 20210331 1802
 * @LastEditors: sonke
 * @LastEditTime: 20210331 1803
 */

import BaseUI from "../../base/BaseUI";
import { DataMgr } from "../../base/DataMgr";
import { Constants } from "../../constants";
import { EventMgr } from "../../base/EventMgr";
import { User } from "../../system/User";
import { Helper } from "../../system/Helper"

const {ccclass, property} = cc._decorator;

@ccclass
export default class OtherGameLevel extends BaseUI {
    @property(cc.Prefab)
    levelInfoModePrefab:cc.Node = null
    
    listContent:cc.Node = null
    leverProgress:cc.Node = null

    levelListData:any[] = []
    onOpen() {
        this.listContent = cc.find("body/list/view/content", this.node)
        this.leverProgress = cc.find("body/LevelInfo/LeverProgress", this.node)
        this.initEvent()
        this.initButton()

        let self = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        for(let v in self.levels){
            if( v != "igaoshou" && v != DataMgr.Config.gameId){
                this.levelListData.push(self.levels[v])
            }
        }

        let promotionList = DataMgr.getData(Constants.DATA_DEFINE.OTHER_GAME_PROMOTION)
        if(promotionList){
            this.setPromotionData(promotionList)
            this.initData()
        }else{
            User.GetPromotion((res)=>{
                console.log("GetPromotion", res)
                if(res && res.length >  0){
                    this.setPromotionData(res)
                    this.initData()
                    DataMgr.setData(Constants.DATA_DEFINE.OTHER_GAME_PROMOTION, res)
                }else{
                }
            })
        }
    }

    onLoad(){
        this.scheduleOnce(()=>{
            this.node.getParent().getParent().getComponent(cc.Widget).top = -70
            this.node.getParent().getComponent(cc.Widget).top = 70
            this.node.getParent().getParent().getComponent(cc.Widget).updateAlignment()
            this.node.getParent().getComponent(cc.Widget).updateAlignment()
        }, 0.55)
    }

    onDisable(){
        EventMgr.offByTag(this)
    }

    initEvent() {
        EventMgr.on(Constants.EVENT_DEFINE.SHOW_OTHER_GAME_LEVEL, this.showGameLevelProgress, this)
    }

    initButton(){
        this.setButtonClick("titleNode/btnTip", () => {
            this.setActive("levelTip", true)
        })

        this.setButtonClick("levelTip/node/btnOk", () => {
            this.setActive("levelTip", false)
        })
    }

    setPromotionData(promotionList){        
        for(let p of promotionList){            
            p.type = p.promotion_game_gid
            let add = true
            for(let v of this.levelListData){
                if(v.type == p.type){
                    for(let key in p){
                        v[key] = p[key]
                    }
                    add = false
                    break
                }
            }
            if(add){
                this.levelListData.push(p)            
            }
        }
        console.log("setPromotionData", this.levelListData)
    }

    initData() {
        console.log("OtherGameEntry", this.levelListData)
        
        for(let v of this.levelListData){
            v.sort_id = v.sort_id || 0
        }

        this.levelListData = this.levelListData.sort((a, b) => {
            return a.sort_id < b.sort_id ? -1 : 1
        })

        for(let v of this.levelListData){
            let itemNode = cc.instantiate(this.levelInfoModePrefab)
            this.listContent.addChild(itemNode)     
            this.setChildParam(itemNode, v)
        }

        if (this.param.data){
            let data = this.param.data
            if (data.type === "igaoshou" || data.type === DataMgr.Config.gameId){
                EventMgr.dispatchEvent(Constants.EVENT_DEFINE.SHOW_OTHER_GAME_LEVEL, data)
                this.setActive("body/LevelInfo/LevelInfoEntry/platform/LevelInfoMode/select", data.type === "igaoshou")
                this.setActive("body/LevelInfo/LevelInfoEntry/game/LevelInfoMode/select", data.type === DataMgr.Config.gameId)
            }
        }
    }
    
    initDataNoPromotion() {
        let self = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        for(let v in self.levels){
            if( v != "igaoshou" && v != DataMgr.Config.gameId){
                console.log("initData1", self.levels[v])
                let itemNode = cc.instantiate(this.levelInfoModePrefab)
                this.listContent.addChild(itemNode)     
                this.setChildParam(itemNode, self.levels[v])
            }
        }
    }

    showGameLevelProgress(data){
        console.log("showGameLevelProgress", data)
        this.leverProgress.active = true
        this.setLabelValue("body/LevelInfo/LeverProgress/level", data.name + "等级:" + data.lv)

        let ProgressBar = cc.find("ProgressBar", this.leverProgress)
        ProgressBar.getComponent(cc.ProgressBar).progress = data.exp/data.maxExp
        this.setLabelValue("body/LevelInfo/LeverProgress/ProgressBar/exp/num", data.exp + "/" +data.maxExp)
    }
}
