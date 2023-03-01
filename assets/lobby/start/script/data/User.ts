import { igs } from "../../../../igs"
import { DataMgr } from "../base/DataMgr"
import { Constants } from "../igsConstants"

// const FACES = [
//     { avatar: "https://pictures.hiigame.com/qmddz/1.jpg", region: "上海市" },
//     { avatar: "https://pictures.hiigame.com/qmddz/2.jpg", region: "上海市" },
//     { avatar: "https://pictures.hiigame.com/qmddz/3.jpg", region: "上海市" },
//     { avatar: "https://pictures.hiigame.com/qmddz/4.jpg", region: "上海市" },
//     { avatar: "https://pictures.hiigame.com/qmddz/5.jpg", region: "上海市" },
//     { avatar: "https://pictures.hiigame.com/qmddz/6.jpg", region: "上海市" },
// ]


export class User {
    private static _userData: IPlayerData = null
    private static _invitationCode: string = ""

    static get Data() {
        if (!User._userData) {
            User._userData = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
            if (!User._userData) {
                User._userData = {
                    openId: "10000",
                    userName: "我",
                    avatar: "faces/" + Math.floor(Math.random() * 100 % 6 + 1),
                    region: "上海市",
                    items: [
                        //     { id: Constants.ITEM_INDEX.LOTTERY, num: 0 },
                        //     { id: Constants.ITEM_INDEX.GOLD, num: 0 },
                        //     { id: Constants.ITEM_INDEX.GOLDITEM, num: 0 },
                        //     { id: Constants.ITEM_INDEX.CREDITS, num: 0 },
                        //     { id: Constants.ITEM_INDEX.TURNTABLE, num: 0 }
                    ],
                    histroy: {
                        playGame: 0,
                        allGame: 0,
                        platGame: 0,
                        winNum: 0,
                        winCon: 0,
                        records: []
                    },
                }
                User._userData.items[Constants.ITEM_INDEX.LOTTERY] = { id: Constants.ITEM_INDEX.LOTTERY, num: 0 }
                User._userData.items[Constants.ITEM_INDEX.GOLD] = { id: Constants.ITEM_INDEX.GOLD, num: 0 }
                User._userData.items[Constants.ITEM_INDEX.GOLDITEM] = { id: Constants.ITEM_INDEX.GOLDITEM, num: 0 }
                User._userData.items[Constants.ITEM_INDEX.CREDITS] = { id: Constants.ITEM_INDEX.CREDITS, num: 0 }
                User._userData.items[Constants.ITEM_INDEX.TURNTABLE] = { id: Constants.ITEM_INDEX.TURNTABLE, num: 0 }
            }
        }

        return User._userData
    }

    static set Data(data: IPlayerData) {
        if (User.Data.league) {
            data.league = User.Data.league
        }
        for (let i in User.Data.items) {
            if (!data.items[i]) {
                data.items[i] = User.Data.items[i]
            }
        }
        User._userData = data
        DataMgr.setData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO, User._userData, true)
    }

    static get OpenID(): string {
        return User.Data.openId
    }

    static get UserName(): string {
        return User.Data.userName
    }

    static get Avatar(): string {
        return User.Data.avatar
    }

    static set Avatar(avatar: string) {
        let data = User.Data
        data.avatar = avatar
        User.Data = data
    }

    static get Region(): string {
        return User.Data.region
    }

    static set Region(region: string) {
        let data = User.Data
        data.region = region || data.region
        User.Data = data
    }

    static get RegTime(): number {
        return User.Data.regTime || Math.floor(Date.now() / 1000)
    }

    static get JoinTime(): number {
        return User.Data.joinTime || Math.floor(Date.now() / 1000)
    }

    static get UserLife(): number {
        return Math.floor((Date.now() / 1000 - User.Data.regTime) / 86400)
    }

    static get Lottery(): number {
        return User.Data.items[Constants.ITEM_INDEX.LOTTERY]?.num || 0
    }

    static set Lottery(lottery: number) {
        let data = User.Data
        data.items[Constants.ITEM_INDEX.LOTTERY].num = lottery
        User.Data = data
    }

    static get Gold(): number {
        return (User.Data.items[Constants.ITEM_INDEX.GOLD]?.num || 0) + (User.Data.items[Constants.ITEM_INDEX.GOLDITEM]?.num || 0)
    }

    static set Gold(gold: number) {
        if (User.Data[Constants.ITEM_INDEX.GOLD]) {
            User.Data[Constants.ITEM_INDEX.GOLD].num = gold
        } else {
            User.Data[Constants.ITEM_INDEX.GOLD] = {
                id: Constants.ITEM_INDEX.GOLD,
                num: gold
            }
        }
    }

    static get GoldItem(): number {
        return User.Data.items[Constants.ITEM_INDEX.GOLDITEM]?.num || 0
    }

    static set GoldItem(goldItem: number) {
        if (User.Data[Constants.ITEM_INDEX.GOLDITEM]) {
            User.Data[Constants.ITEM_INDEX.GOLDITEM].num = goldItem
        } else {
            User.Data[Constants.ITEM_INDEX.GOLDITEM] = {
                id: Constants.ITEM_INDEX.GOLDITEM,
                num: goldItem
            }
        }
    }

    static get Credits(): number {
        return User.Data.items[Constants.ITEM_INDEX.CREDITS]?.num || 0
    }

    static set Credits(credits: number) {
        if (User.Data[Constants.ITEM_INDEX.CREDITS]) {
            User.Data[Constants.ITEM_INDEX.CREDITS].num = credits
        } else {
            User.Data[Constants.ITEM_INDEX.CREDITS] = {
                id: Constants.ITEM_INDEX.CREDITS,
                num: credits
            }
        }
    }

    static get Items(): IItemInfo[] {
        return User.Data.items
    }

    static set Items(items: IItemInfo[]) {
        let data = User.Data
        for (let i in items) {
            let id = items[i].id || 0
            if (!data.items[id]) {
                data.items[id] = {
                    id: id,
                    num: items[i].num
                }
            } else {
                data.items[id].num = items[i].num
            }
        }
        User.Data = data
    }

    static get Diamond(): number {
        return User.Data.items[Constants.ITEM_INDEX.DIAMOND]?.num || 0
    }

    static set Diamond(diamond: number) {
        let data = User.Data
        User.Data.items[Constants.ITEM_INDEX.DIAMOND].num = diamond
        User.Data = data
    }

    static get PlayGame(): number {
        return User.Data.histroy.playGame || 0
    }

    static set PlayGame(games: number) {
        let data = User.Data
        User.Data.histroy.playGame = games
        User.Data = data
    }

    static get AllGame(): number {
        return User.Data.histroy.allGame || 0
    }

    static set AllGame(games: number) {
        let data = User.Data
        User.Data.histroy.allGame = games
        User.Data = data
    }

    static get PlatGame(): number {
        return User.Data.histroy.platGame || 0
    }

    static set PlatGame(games: number) {
        let data = User.Data
        User.Data.histroy.platGame = games
        User.Data = data
    }

    static get WinCon(): number {
        return User.Data.histroy.winCon || 0
    }

    static set WinCon(games: number) {
        let data = User.Data
        User.Data.histroy.winCon = games
        User.Data = data
    }

    static get WinNum(): number {
        return User.Data.histroy.winNum || 0
    }

    static set WinNum(games: number) {
        let data = User.Data
        User.Data.histroy.winNum = games
        User.Data = data
    }

    static get Records(): boolean[] {
        return User.Data.histroy.records || []
    }

    static set Records(records: boolean[]) {
        let data = User.Data
        User.Data.histroy.records = records
        User.Data = data
    }

    static get Levels() {
        return User.Data.levels
    }

    static set Levels(levels) {
        let data = User.Data
        User.Data.levels = levels
        User.Data = data
    }

    static get League(): ILeagueBase[] {
        return User.Data.league || []
    }

    static set League(league: ILeagueBase[]) {
        let data = User.Data
        User.Data.league = league
        User.Data = data
    }

    static get GradeRank(): IGradeRank {
        return User.Data.gradeRank
    }

    static set GradeRank(gradeRank: IGradeRank) {
        let data = User.Data
        User.Data.gradeRank = gradeRank
        User.Data = data        

        if (igs.odc && cc.sys.WECHAT_GAME === cc.sys.platform) {
            console.log("===igs odc updateScore====")
            igs.odc.updateScore({
                level: gradeRank.grade.major,
                grade: gradeRank.grade.minor,
                star: gradeRank.grade.star
            })
        }
    }

    static get PromRedPacket(): number {
        return User.Data.items[Constants.ITEM_INDEX.PROM_REDPACKET] && User.Data.items[Constants.ITEM_INDEX.PROM_REDPACKET].num || 0
    }

    static set PromRedPacket(promRedPacket: number) {
        let data = User.Data
        if (!User.Data.items[Constants.ITEM_INDEX.PROM_REDPACKET]) {
            User.Data.items[Constants.ITEM_INDEX.PROM_REDPACKET] = { id: Constants.ITEM_INDEX.PROM_REDPACKET, num: promRedPacket }
        } else {
            User.Data.items[Constants.ITEM_INDEX.PROM_REDPACKET].num = promRedPacket
        }
        User.Data = data
    }

    static get TurnTable(): number {
        return User.Data.items[Constants.ITEM_INDEX.TURNTABLE] && User.Data.items[Constants.ITEM_INDEX.TURNTABLE].num || 0
    }

    static set TurnTable(turnTable: number) {
        let data = User.Data
        if (!User.Data.items[Constants.ITEM_INDEX.TURNTABLE]) {
            User.Data.items[Constants.ITEM_INDEX.TURNTABLE] = { id: Constants.ITEM_INDEX.TURNTABLE, num: turnTable }
        } else {
            User.Data.items[Constants.ITEM_INDEX.TURNTABLE].num = turnTable
        }
        User.Data = data
    }

    static get InvitationCode(): string {
        return User._invitationCode || ""
    }

    static set InvitationCode(invitationCode: string) {
        User._invitationCode = invitationCode
    }

    static get WxOpenId(): string {
        return User.Data.wxOpenId
    }

    static set WxOpenId(openId: string) {
        let data = User.Data
        User.Data.wxOpenId = openId
        User.Data = data
    }
}