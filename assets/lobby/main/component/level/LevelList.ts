/*
 * @Description: 等级列表
 * @Version: 1.0
 * @Autor: sonke
 * @Date: 20210331 1802
 * @LastEditors: sonke
 * @LastEditTime: 20210331 1803
 */

import BaseUI from "../../../start/script/base/BaseUI";
import { Constants } from "../../../start/script/igsConstants";
import { DataMgr } from "../../../start/script/base/DataMgr";
import { UIMgr } from "../../../start/script/base/UIMgr";
import { User } from "../../../start/script/data/User";
import { PluginMgr } from "../../../start/script/base/PluginMgr";
import { Helper } from "../../../start/script/system/Helper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LevelList extends BaseUI {

    start() {
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
        this.setChildParam("platform/LevelInfoMode", User.Levels["igaoshou"])
        this.setChildParam("platform/LevelInfoMode2", User.Levels["igaoshou"])
        this.setChildParam("game/LevelInfoMode", User.Levels[DataMgr.data.Config.gameId])
        this.setChildParam("game/LevelInfoMode2", User.Levels[DataMgr.data.Config.gameId])
        if (!UIMgr.FindUI("component/level/style1/OtherGameLevel") && !UIMgr.FindUI("component/level/style2/OtherGameLevel2")) {
            this.setChildParam("add/LevelInfoMode", { addGame: true })
            this.setChildParam("add/LevelInfoMode2", { addGame: true })
        } else {
            this.setActive("add", false)
        }

        if (DataMgr.data.Config.platId === 3 || Constants.sys.WECHAT_GAME_QQ === cc.sys.platform) {
            this.setActive("add", false)
        } else if (!Helper.isNative() && (cc.sys.OPPO_GAME == cc.sys.platform || cc.sys.VIVO_GAME == cc.sys.platform)) {
            this.setActive("add", false)
        } else if (cc.sys.BYTEDANCE_GAME === cc.sys.platform || PluginMgr.isH52345Game()) {
            this.setActive("add", false)
        // } else if (cc.sys.OS_IOS == cc.sys.os) {
        //     this.setActive("add", false)
        }
    }
}
