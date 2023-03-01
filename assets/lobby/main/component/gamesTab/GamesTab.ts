import BaseUI from "../../../start/script/base/BaseUI";
import { ActivitySrv } from "../../../start/script/system/ActivitySrv";
import { DataMgr } from "../../../start/script/base/DataMgr";
import { Constants } from "../../../start/script/igsConstants";
import { UserSrv } from "../../../start/script/system/UserSrv";
import { Helper } from "../../../start/script/system/Helper";
import { WxProxyWrapper } from "../../../start/script/pulgin/WxProxyWrapper";
import { PluginMgr } from "../../../start/script/base/PluginMgr";
import { igs } from "../../../../igs";
import { EventMgr } from "../../../start/script/base/EventMgr";
import { MatchSvr } from "../../../start/script/system/MatchSvr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GamesScene extends BaseUI {

    _mode: cc.Node = null
    _reInit: boolean = false
    _dirGameId: string = null
    _loadBundle: string = ""

    content: cc.Node = null
    gameClubCount = 0
    curGameMode: cc.Node = null
    curDownloadProgress: cc.Node = null
    downloadedBytes = new Array()


    _bChange: boolean = false

    onLoad() {
        let content = this.node.parent.parent
        if (content) {
            this.setNodeHeight(this.node, content.height - 2)
        }

        this.initNode()
        this.initEvent()
        this.initData()
    }

    initNode() {
        this.content = this.getNode("scrollView/view/content")
        this._mode = this.getNode("scrollView/view/content/itemMode")
        this._mode.active = false
    }

    initEvent() {
        cc.Canvas.instance.node.on(cc.Node.EventType.CHILD_ADDED, this.onChildChange.bind(this))
        cc.Canvas.instance.node.on(cc.Node.EventType.CHILD_REMOVED, this.onChildChange.bind(this))
    }

    initData() {
        let promotionList = DataMgr.getData(Constants.DATA_DEFINE.OTHER_GAME_PROMOTION)
        if (promotionList) {
            this.updateList(promotionList)
        } else {
            UserSrv.GetPromotion((res) => {
                console.log("GetPromotion", res)
                if (res && res.length > 0) {
                    this.updateList(res)
                } else {
                    Helper.OpenTip("暂无推荐游戏")
                }
            })
        }

        if (Helper.isNative()) {
            this.setActive("btns", false)
            this.scheduleOnce(() => {
                let node = this.getNode("scrollView")
                node.removeComponent(cc.Widget)
                node.setContentSize(node.width, node.height + 145)
                node.position = this.getNode("btns").position
                this.getNode("scrollView/view").height = node.height
            }, .1)
        }
    }

    onEnable() {
        if (this._reInit) {
            this.initData()
        }

        Helper.DelayFun(() => {
            this.addWxGameClubBtn()
        }, 0.5)
    }

    onDisable() {
        cc.Canvas.instance.node.off(cc.Node.EventType.CHILD_ADDED, this.onChildChange, this)
        cc.Canvas.instance.node.off(cc.Node.EventType.CHILD_REMOVED, this.onChildChange, this)
        WxProxyWrapper.hideGameClubButton("btnGameClub")
    }

    onDestroy() {
        WxProxyWrapper.hideGameClubButton("btnGameClub")
        cc.Canvas.instance.node.on(cc.Node.EventType.CHILD_ADDED, this.onChildChange, this)
        cc.Canvas.instance.node.on(cc.Node.EventType.CHILD_REMOVED, this.onChildChange, this)
    }

    addWxGameClubBtn() {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            let btnGameClub = this.getNode("btns/btnGameClub")
            WxProxyWrapper.showGameClubButton(btnGameClub)
        }
    }

    updateList(data) {
        let games = this.content
        let spaceX = (games.width - (3 * this._mode.width)) / 4
        this.setLayoutInfo(this.content, { spacingX: spaceX })
        let list = []
        let gameIcons = DataMgr.getData(Constants.DATA_DEFINE.GAME_ICONS) || {}
        this.content.children.forEach(i => i.active = false)
        for (let v of data) {
            let n = cc.find(v.promotion_game_gid, this.content)
            if (!n) {
                n = cc.instantiate(this._mode)
                n.name = v.promotion_game_gid
                n.active = true
                n.parent = this.content
                this.setLabelValue("name", n, v.promotion_game_name)
                this.setLabelValue("popularity", n, "人气值: " + Math.floor(Math.random() * 10000))
                this.setSpriteFrame("icon", n, v.icon, true)
                gameIcons[v.promotion_game_gid] = v.icon

                this.setActive("new", n, v.new === 1)
                this.setActive("hot", n, v.hot === 1)

                this.setButtonClick(n, () => {
                    if (Helper.isNative()) {
                        if (this._bChange) {
                            return
                        }

                        this._bChange = true
                        console.log("this.curDownloadProgress set active true")
                        if (this.curDownloadProgress) {
                            this.setActive(this.curDownloadProgress, false)
                            this.curDownloadProgress = null
                        }
                        if (this.curGameMode) {
                            this.setActive("name", this.curGameMode, true)
                            this.setActive("popularity", this.curGameMode, true)
                            this.setActive("loading", this.curGameMode, false)
                            this.curGameMode = null
                        }
                        this.curDownloadProgress = cc.find("progress", n)
                        this.setActive(this.curDownloadProgress, true)
                        this.curGameMode = n
                        this.setActive("name", this.curGameMode, false)
                        this.setActive("popularity", this.curGameMode, false)
                        this.setActive("loading", this.curGameMode, true)

                        MatchSvr.LoadMatchConfig(v.promotion_game_gid)
                        let bundles: igs.bundle.BundleConfig[] = []
                        bundles.push(new igs.bundle.BundleConfig(v.bundle, v.bundle, 1, igs.consts.Event.ENTER_GAME, false, false))
                        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.SHOW_BASE_SCENE_LOADING)
                        this._dirGameId = v.promotion_game_gid
                        this._loadBundle = v.bundle
                        igs.bundle.updateBundles(bundles, this.downloadListener)
                        this._reInit = true
                    } else {
                        PluginMgr.navigateToMiniGame(v.promotion_appid)
                    }
                })
            }

            n.active = true

            list.push(v.promotion_game_gid)
            this.setLabelValue("popularity", n, "人气值: " + (v.online_num || 0))

            DataMgr.setData(Constants.DATA_DEFINE.GAME_ICONS, gameIcons, true)
        }

        let self = this
        UserSrv.GetOnlineNum(list, (res) => {
            if (!res || !res.online_num_list) {
                return
            }
            for (let k in data) {
                let d = data[k]
                if (res.online_num_list[d.promotion_game_gid]) {
                    data[k].online_num = res.online_num_list[d.promotion_game_gid]
                    self.setLabelValue(d.promotion_game_gid + "/popularity", self.content, "人气值: " + (d.online_num || 0))
                }
            }

            DataMgr.setData(Constants.DATA_DEFINE.OTHER_GAME_PROMOTION, data)
        })

        this._reInit = false
    }

    onPressSign() {
        let info = ActivitySrv.GetActivityById(8)
        ActivitySrv.OnClickActivity(info)
    }

    onPressSlyder() {
        let info = ActivitySrv.GetActivityById(4)
        ActivitySrv.OnClickActivity(info)
    }

    onDownloadProgress(data: igs.hotUpdate.UpdateData): void {
        igs.log("==onDownloadProgress==", data.bundleName, data.downloadedByteCount, data.totalToDownloadBytesCount)
        this.downloadedBytes[data.bundleName] = data.downloadedByteCount
        this.updateProgress(data)
    }

    updateProgress(data: igs.hotUpdate.UpdateData) {
        // let totalBytes: number = this.totalBytes
        // console.log("this.curDownloadProgress updateProgress")
        let totalDownloadedBytes: number = 0
        for (let i in this.downloadedBytes) {
            let bytes = this.downloadedBytes[i]
            totalDownloadedBytes += bytes
        }
        let rate = (totalDownloadedBytes || 0) / data.totalToDownloadBytesCount
        if (this.curDownloadProgress) {
            this.curDownloadProgress.getComponent(cc.ProgressBar).progress = 1 - rate
        }
        // this.setUpdateProgressText(`${(totalDownloadedBytes / 1024 / 1024).toFixed(3)} / ${(totalBytes/1024/1024).toFixed(3)}M`)
    }

    downloadListener = {
        onCheckRemoteUpdateFailed: (bundles: igs.bundle.BundleConfig[]) => {
            console.log("onCheckRemoteUpdateFailed")
            console.log("this.curDownloadProgress set active false")
            if (this.curDownloadProgress) {
                this.setActive(this.curDownloadProgress, false)
                this.curDownloadProgress = null
            }
            if (this.curGameMode) {
                this.setActive("name", this.curGameMode, true)
                this.setActive("popularity", this.curGameMode, true)
                this.setActive("loading", this.curGameMode, false)
                this.curGameMode = null
            }
            Helper.OpenTip("拉取资源错误, 请稍后再试！")
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.HIDE_BASE_SCENE_LOADING)

            this._bChange = false
        },
        onOneDownloadInfoFailed: (ud: igs.hotUpdate.UpdateData) => { },
        onOneDownloadInfoSuccess: (ud: igs.hotUpdate.UpdateData) => { },
        onAllDownloadInfoSuccess: (uds: igs.hotUpdate.UpdateData[]) => { },
        onSomeDownloadInfoFailed: (uds: igs.hotUpdate.UpdateData[]) => { },
        onOneDownloadSuccess: (ud: igs.hotUpdate.UpdateData) => { },
        onDownloadProgress: (data: igs.hotUpdate.UpdateData) => { this.onDownloadProgress(data) },
        onAllDownloadSuccess: (uds: igs.hotUpdate.UpdateData[]) => { },
        onSomeDownloadFailed: (uds: igs.hotUpdate.UpdateData[]) => { },
        onOneLoadSuccess: (uds: igs.hotUpdate.UpdateData) => { },
        onOneLoadFailed: (uds: igs.hotUpdate.UpdateData) => { },
        onAllLoadSuccess: (uds: igs.hotUpdate.UpdateData[]) => {
            console.log("onAllLoadSuccess")
            console.log("this.curDownloadProgress set active false")
            if (this.curDownloadProgress) {
                this.setActive(this.curDownloadProgress, false)
                this.curDownloadProgress = null
            }
            if (this.curGameMode) {
                this.setActive("name", this.curGameMode, true)
                this.setActive("popularity", this.curGameMode, true)
                this.setActive("loading", this.curGameMode, false)
                this.curGameMode = null
            }
            DataMgr.setData(Constants.DATA_DEFINE.OTHER_GAME_PROMOTION, null)
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.HIDE_BASE_SCENE_LOADING)
            let msg = { gameId: this._dirGameId, bundle: this._loadBundle }
            // console.log("==dispatch CHANGE_GAME_ID " + JSON.stringify(msg))
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.CHANGE_GAME_ID, msg)

            this._bChange = false
        },
        onSomeLoadFailed: (uds: igs.hotUpdate.UpdateData[]) => { },
        onLoadProgress: (uptData: igs.bundle.BundleLoadProgress) => { },
    }

    onChildChange() {
        if (cc.Canvas.instance.node.childrenCount > 3) {
            WxProxyWrapper.hideGameClubButton("btnGameClub")
        } else if (this.node.active) {
            this.addWxGameClubBtn()
        }
    }
}
