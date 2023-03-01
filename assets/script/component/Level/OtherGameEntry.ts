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
import { User } from "../../system/User";
import { Helper } from "../../system/Helper"

const {ccclass, property} = cc._decorator;

@ccclass
export default class OtherGameEntry extends BaseUI {
    @property(cc.Prefab)
    otherGameModePrefab:cc.Node = null
    
    listContent:cc.Node = null
    onOpen() {
        this.listContent = cc.find("list/view/content", this.node)
        this.initEvent()
                
        let promotionList = DataMgr.getData(Constants.DATA_DEFINE.OTHER_GAME_PROMOTION)
        if(promotionList){
            this.initData(promotionList)
        }else{
            User.GetPromotion((res)=>{
                console.log("GetPromotion", res)
                if(res && res.length >  0){
                    this.initData(res)
                    DataMgr.setData(Constants.DATA_DEFINE.OTHER_GAME_PROMOTION, res)
                }else{
                    Helper.OpenTip("暂无推荐游戏")
                }
            })
        }
    }

    initEvent() {
        
    }
    
    initData(promotionList:any) {
        console.log("OtherGameEntry", promotionList)
        
        for(let v of promotionList){
            v.sort_id = v.sort_id || 0
        }

        promotionList = promotionList.sort((a, b) => {
            return a.sort_id < b.sort_id ? -1 : 1
        })

        for(let v of promotionList){
            let itemNode = cc.instantiate(this.otherGameModePrefab)
            this.listContent.addChild(itemNode)     
            this.setChildParam(itemNode, v)
        }
    }
}
