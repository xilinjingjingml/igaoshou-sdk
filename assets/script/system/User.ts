import { Helper } from "./Helper"
import { Constants } from "../constants"
import { DataMgr } from "../base/DataMgr"
import { MatchSvr } from "./MatchSvr"
import { ShopSvr } from "./ShopSvr"
import { HttpMgr } from "../base/HttpMgr"
import { EventMgr } from "../base/EventMgr"

const GET_CONFIG_URI = "igaoshou-lobby-srv/lobby/getConfig"
const GET_PLY_DETAIL = "igaoshou-lobby-srv/lobby/getPlyDetail"
const GET_ITEM = "igaoshou-lobby-srv/lobby/getItem"
const GET_PLY_GAME_LIST = "igaoshou-lobby-srv/lobby/getPlyGameList"
const COIN2TICKET = "igaoshou-lobby-srv/lobby/Coin2Ticket"

const GET_GAME_INFO = "api/mcbeam-version-api/config/loadGameInfo"
const GET_ONLINE_NUM = "igaoshou-lobby-srv/lobby/getOnlineNum"

let _gameInfo: { [index: string]: string } = {}

export namespace User {
    export function LoadConfig(callback?: Function) {
        Helper.PostHttp(GET_CONFIG_URI, null, null, (res) => {
            cc.log(res)
            if (res) {
                _initItems(res.config)
                MatchSvr.initMatch(res.config)
                ShopSvr.initShop(res.config)
            }
            callback && callback()
        })
    }

    export function GetPlyDetail(openid?: string | Function, callback?: Function) {
        if (!callback && typeof openid === "function") {
            callback = openid
            openid = null
        }

        let self = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        if (!openid) {
            openid = self.userId
        }

        if (self.userId !== openid) {
            let players = DataMgr.getData<TPlayers>(Constants.DATA_DEFINE.PLAYERS_INFO)
            if (players && players[openid as string]) {
                callback && callback(players[openid as string])
                return
            }
        }

        let id = openid as string
        let param = {
            openid: id
        }
        Helper.PostHttp(GET_PLY_DETAIL, null, param, (res) => {
            if(DataMgr.Config.env != 2 && res && res.area_info){
                let area_arr = res.area_info.split("|")                
                res.area_info = area_arr[2] || area_arr[0]
                res.area_info = res.area_info.length > 0 ? res.area_info : "中国"
            }
            self = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
            if (self.userId !== id) {
                if (res) {
                    let players = DataMgr.getData<TPlayers>(Constants.DATA_DEFINE.PLAYERS_INFO) || {}
                    let ply: IPlayerBase = players[id] || { userName: "未知用户", userId: id, avatar: "", region: "" }
                    ply.userName = res.nickname || ply.userName
                    ply.avatar = res.headimage || ply.avatar
                    ply.region = res.area_info || ""
                    players[id] = ply
                    DataMgr.setData(Constants.DATA_DEFINE.PLAYERS_INFO, players)
                    callback && callback(ply)
                }
            } else {
                self.userName = res.nickname || self.userName
                self.avatar = res.headimage || self.avatar
                self.region = res.area_info || ""
                self.levels["igaoshou"].lv = res.plat_level
                self.levels["igaoshou"].exp = res.plat_exp
                self.levels[DataMgr.Config.gameId].lv = res.level
                self.levels[DataMgr.Config.gameId].exp = res.exp
                DataMgr.setData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO, self)
                callback && callback(self)
            }
        })
    }

    export function UpdateItem(callback?: Function) {
        Helper.PostHttp(GET_ITEM, null, null, (res) => {
            if (!res || !res.item_list) {
                return
            }

            let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
            if (user) {
                user.items = []
                for (let i in res.item_list) {
                    let id = res.item_list[i].id || 0
                    if (user.items[id]) {
                        user.items[id].num += (Number(res.item_list[i].num) || 0)
                        user.items[id].expireAt = Number(res.item_list[i].expireAt) || 0
                    } else {
                        user.items[id] = {
                            id: id,
                            num: Number(res.item_list[i].num) || 0,
                            expireAt: Number(res.item_list[i].expireAt) || 0
                        }
                    }

                    if (id === Constants.ITEM_INDEX.DIAMOND) {
                        user.items[id].num
                    }
                }

                DataMgr.setData(Constants.DATA_DEFINE.USER_INFO, user)
                EventMgr.dispatchEvent(Constants.EVENT_DEFINE.UPDATE_USER_ITEM)
                //
                MatchSvr.UpdateMatch()
            }

            callback && callback()
        })
    }

    export function CheckItem(items: IItemInfo[]): boolean {
        let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        if (user) {
            for (let i of items) {
                if (undefined === i.id || !user.items[i.id] || user.items[i.id].num < i.num)
                    return false
            }
        }

        return true
    }

    export function GetPlayerGameList(openid: string = null) {
        let param = {}
        if (openid) {
            param["openid"] = openid
        }
        Helper.PostHttp(GET_PLY_GAME_LIST, null, param, (res) => {
            cc.log(res)
            let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
            if (user) {
                user.levels["igaoshou"] = {
                    type: "igaoshou",
                    name: "平台等级",
                    icon: "",
                    lv: res.plat_level || 0,
                    exp: res.plat_exp || 0,
                    maxExp: res.max_plat_exp || 0,
                }
                for (let i in res.list) {
                    let l = res.list[i]
                    user.levels[l.game_id] = {
                        type: l.game_id,
                        name: "",
                        icon: "",
                        lv: l.level || 0,
                        exp: l.exp || 0,
                        maxExp: l.max_exp || 0,
                    }
                }
            }
            DataMgr.setData(Constants.DATA_DEFINE.USER_INFO, user)
        })
    }

    export function GetGameInfo(gameId: string, callback: Function = null) {
        if (_gameInfo && _gameInfo[gameId]) {
            callback && callback(_gameInfo[gameId])
            return
        }
        let param = {
            game_gid: gameId,
            is_lobby: 1,
        }
        Helper.PostHttp(GET_GAME_INFO, null, param, (res) => {
            cc.log(res)
            _gameInfo = _gameInfo || {}
            _gameInfo[gameId] = res
            callback && callback(res)
        })
    }

    export function GetShareInfo(callback: Function = null) {
        let param = {
            game_gid: DataMgr.Config.gameId,
            is_lobby: 1,
        }
        Helper.PostHttp(GET_GAME_INFO, null, param, (res) => {
            cc.log(res)
            _gameInfo = _gameInfo || {}
            _gameInfo[DataMgr.Config.gameId] = res
            try { res.share_info = JSON.parse(res.share_info) } catch { }
            DataMgr.setData(Constants.DATA_DEFINE.SHARE_INFO, res.share_info)
            callback && callback(res)
        })
    }

    export function GetPromotion(callback: Function) {
        let param = {
            game_gid: DataMgr.Config.gameId,
            is_lobby: 0,
        }
        let host = DataMgr.Config.hostname
        host = host.replace("igaoshou.", "mcbeam.")
        HttpMgr.post("https://" + host + "/" + GET_GAME_INFO, null, null, param, (res) => {
            cc.log(res)
            if (res && res.promotion_info) {
                try { res.promotion_info = JSON.parse(res.promotion_info) } catch { }
                callback && callback(res.promotion_info)
            }
        })
    }

    function _initItems(data) {
        if (!data || !data.items) {
            return
        }

        let cfg = JSON.parse(data.items)
        if (!cfg) {
            return
        }

        let IItemConfigs: { [index: number]: IItemConfig } = {}
        for (let idx in cfg) {
            let item = cfg[idx]
            let id = item.id || 0
            IItemConfigs[id] = {
                id: id,
                name: item.name,
                desc: item.desc,
                pic: item.pic,
            }
        }
        cc.log(IItemConfigs)

        DataMgr.setData(Constants.DATA_DEFINE.ITEM_CONFIG, IItemConfigs, true)
    }

    export function GetItemInfo(id: number): IItemConfig {
        let config = DataMgr.getData<{ [index: number]: IItemConfig }>(Constants.DATA_DEFINE.ITEM_CONFIG)
        return config[id]
    }

    export function Coin2Ticket(callback?: Function) {
        Helper.PostHttp(COIN2TICKET, null, null, (res) => {
            console.log("COIN2TICKET", res)
            callback && callback(res)
        })
    }

    export function GetOnlineNum(games: string[], callback?: Function) {
        let strGame = ""
        for (let v of games) {
            strGame += v + "|"
        }
        strGame = strGame.substr(0, strGame.length - 1)
        let param = {
            game_list: strGame
        }
        Helper.PostHttp(GET_ONLINE_NUM, null, param, (res) => {
            callback && callback(res)
        })
    }
}