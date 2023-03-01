import { Constants } from "../constants"
import { DataMgr } from "../base/DataMgr"
import { User } from "../system/User"
import { Helper } from "../system/Helper"

export namespace Player {

    export function GetSelf(): IPlayerExportData {
        let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        if (user) {
            return {
                userName: user.userName,
                userId: user.userId,
                avatar: user.avatar,
                region: user.region,
                newbie: user.newbie,

                playGames: user.histroy.playGame,
                games: user.histroy.allGame,
                winGames: user.histroy.winNum,
                conWinGames: user.histroy.winCon,
            }
        }

        let openid = DataMgr.getData<IOpenId>(Helper.GetTokenDataKey())
        openid = openid || {}
        return {
            userName: "",
            userId: "",
            avatar: "",
            region: "",
            newbie: openid.openid ? false : true,
        }
    }

    export function GetSelfDetail(): IPlayerData {
        return null
    }

    export function GetPlayer(userId: string, callback?: Function) {
        User.GetPlyDetail(userId, callback)
    }

    export function GetPlayerDetail(userId: string): IPlayerData {
        return null
    }

}

