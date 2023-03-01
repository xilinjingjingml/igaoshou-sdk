/*
 * @Description: 等级列表
 * @Version: 1.0
 * @Autor: sonke
 * @Date: 20210331 1802
 * @LastEditors: sonke
 * @LastEditTime: 20210331 1803
 */

import BaseUI from "../../../start/script/base/BaseUI";
import { User } from "../../../start/script/data/User";
import { DataMgr } from "../../../start/script/base/DataMgr";
import { Constants } from "../../../start/script/igsConstants";
import { UserSrv } from "../../../start/script/system/UserSrv";
import { EventMgr } from "../../../start/script/base/EventMgr";

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

        for(let v in User.Levels){
            if( v != "igaoshou" && v != DataMgr.data.Config.gameId){
                this.levelListData.push(User.Levels[v])
            }
        }

        let promotionList = DataMgr.getData(Constants.DATA_DEFINE.OTHER_GAME_PROMOTION)
        if(promotionList){
            this.setPromotionData(promotionList)
            this.initData()
        }else{
            UserSrv.GetPromotion((res)=>{
                console.log("GetPromotion", res)
                if(res && res.length >  0){
                    this.setPromotionData(res)
                    this.initData()
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
            if (data.type === "igaoshou" || data.type === DataMgr.data.Config.gameId){
                EventMgr.dispatchEvent(Constants.EVENT_DEFINE.SHOW_OTHER_GAME_LEVEL, data)
                this.setActive("body/LevelInfo/LevelInfoEntry/platform/LevelInfoMode/select", data.type === "igaoshou")
                this.setActive("body/LevelInfo/LevelInfoEntry/game/LevelInfoMode/select", data.type === DataMgr.data.Config.gameId)
                this.setActive("body/LevelInfo/LevelInfoEntry2/platform/LevelInfoMode2/select", data.type === "igaoshou")
                this.setActive("body/LevelInfo/LevelInfoEntry2/game/LevelInfoMode2/select", data.type === DataMgr.data.Config.gameId)
            }
        }
    }
    
    initDataNoPromotion() {
        for(let v in User.Levels){
            if( v != "igaoshou" && v != DataMgr.data.Config.gameId){
                console.log("initData1", User.Levels[v])
                let itemNode = cc.instantiate(this.levelInfoModePrefab)
                this.listContent.addChild(itemNode)     
                this.setChildParam(itemNode, User.Levels[v])
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
