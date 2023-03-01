import { Constants } from "../igsConstants"
import { DataMgr } from "../base/DataMgr"
import { UserSrv } from "../system/UserSrv"
import { Helper } from "../system/Helper"
import { User } from "../data/User"

export namespace Player {

    export function GetSelf(): IPlayerExportData {
        return {
            userName: User.UserName,
            openId: User.OpenID,
            avatar: User.Avatar,
            region: User.Region,
            newbie: User.AllGame <= 3,

            playGames: User.PlayGame,
            games: User.AllGame,
            winGames: User.WinNum,
            conWinGames: User.WinCon,
        }
    }

    export function GetSelfDetail(): IPlayerData {
        return null
    }

    export function GetPlayer(userId: string, callback?: Function) {
        UserSrv.GetPlyDetail(userId, callback)
    }

    export function GetPlayerDetail(userId: string): IPlayerData {
        return null
    }

}

