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
import { UIMgr } from "../../base/UIMgr"

const {ccclass, property} = cc._decorator;

@ccclass
export default class LevelList extends BaseUI {

    onOpen() {
        this.initEvent()
        this.initData()
    }

    initEvent() {
        DataMgr.feed(Constants.DATA_DEFINE.USER_INFO, this.initData, this)
    }
    
    initData() {
        // let data = DataMgr.getData<Constants.Levels>(Constants.DATA_DEFINE.LEVELS_INFO)
        // if (!data)
        //     return 
        let self = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        this.setChildParam("platform/LevelInfoMode", self.levels["igaoshou"])
        this.setChildParam("game/LevelInfoMode", self.levels[DataMgr.Config.gameId])
        if (!UIMgr.FindUI("component/Level/OtherGameLevel")) {
        this.setChildParam("add/LevelInfoMode", {addGame : true})
        }else{
            this.setActive("add", false)
        }

        if (DataMgr.Config.platId === 3) {
            this.setActive("add", false)
        }
    }
}
