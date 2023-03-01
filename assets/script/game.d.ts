interface IGameVersion {
    verName: string
    verCode: number
}

interface IGameConfig {
    mid: number,
    pn: string,
    platId: number,
    gameId: string,
    gameName: string,
    env: number,
    orientation: number,
    wxAPPID?: string,
    wxMIDASID?: string,
    unPreload: boolean,

    version?: IGameVersion,

    hostname?: string,
    gameVersion?: IGameVersion,
    enforceUpdate?: boolean,
    updateUrl?: string,
    
    onlineParam?: any,
}

interface IACCOUNT_INFO {
    account: string,
    password: string,
    headImage: string,
    email?: string,
    phone?: string,
    facebook?: string,
    apple?: string,
    authType?: number
}

interface 

interface IHISTROY_ACCOUNT_INFO {
    history_account?: IACCOUNT_INFO[]
}

interface IOpenId {
    token?: string,
    openid?: string,
    newbie?: boolean,
    account?: string,
    key?: string,
}

interface IGameDelegate {
    onMatch: (matchInfo: IMatchInfo, opponentId: string, roomInfo?: any) => void
    onJoin: (playser:string[], roomInfo?: any) => void
    onPlayerJoin: (player: IPlayerBase) => void
    onLeave: (succ: boolean) => void
    onPlayerLeave: (openId: string) => void
    onDismiss: () => void

    // send:(name: string, msg: any, callback: (succ: boolean) => void) => void
    onData: (name: string, data: any) => void
}

// 数据同步委托
interface ISyncDelegate {
    onMatchCompleted(): void
    onDidReceiveData(data: any): void
    onOpponentHasLostConnection(userId: number | string): void
    onOpponentHasReconnected(userId: number | string): void
    onOpponentHasLeftMatch(userId: number | string): void
    onHasLostConnection(): void
    onHasReconnected(): void
    onHasLeftMatch(): void
}

interface IPlayerBase {
    userName: string            // 用户名
    userId: string              // 用户ID
    avatar: string              // 头像
    region: string              // 区域  
    newbie?: boolean
}

interface IItemInfo {
    id: number,
    num: number,
    expireAt?: number,
}

interface IPlayerToken extends IPlayerBase {
    lottery?: number             // 奖券
    wcoin?: number               // W币
    diamond?: number             // 钻石
    items?: IItemInfo[]
}

interface IPlayerData extends IPlayerToken {
    openId?: string
    joinTime?: number
    regTime?: number
    userLife?: number
    levels?: ILevels
    league?: ILeagueBase[]
    achieve?: IAchieve
    histroy?: IGamesHistroy
    metaData?: { [name: string]: string }
}

interface IPlayerExportData extends IPlayerBase {
    playGames?: number
    games?: number
    winGames?: number
    conWinGames?: number
}

interface IItemConfig {
    id: number,
    name: string,
    desc: string,
    pic: string,
}

interface IMatchAward {
    start: number,
    end: number,
    items: IItemInfo[]
}

interface IMatchInfo {
    matchId: string,
    type: MATCH_TYPE | number,
    name: string,
    desc: string,
    startTime?: number,
    endTime?: number,
    minPlayer: number,
    maxPlayer: number,
    gateMoney: IItemInfo[],
    awards: IMatchAward[],
    highLight?: boolean,
    highMsg?: string,

    order?: number,
    freeAd?: boolean,
    free?: boolean,

    // 活动赛
    maxTimes?: number
    curTimes?: number

    hide?: boolean
    showBeginTime?: number
    showEndTime?: number

    forwordShowTime?: number

    curMatchId?: string
    // GetMatchAward?: (rank: number) => ItemInfo[]
}

interface IMatchRoundInfo extends IMatchInfo {
    roundNum: number
    roundAwards: { [index: number]: IItemInfo[] }
}

interface IMatchPlayer {
    openid: string,
    avatar?: string,
    userName?: string,
    region?: string,
    score: number,
    state: PLAYER_BATTLE_STATE,
    rank?: number,
    win?: boolean
}

interface IMatchDetail {
    matchId: string,
    name: string,
    type: MATCH_TYPE | number,
    playerNum: number,
    matchUuid: string,
    roundId?: string,
    // lastRoundId?: string,
    score?: number,
    isWin?: boolean,
    players: IMatchPlayer[]
    awards?: IMatchAward[],
    gateMoney?: IItemInfo[],
    matchState?: MATCH_STATE,
    roundState?: MATCH_ROUND_STATE,
    rounds?: { [name: string]: IMatchPlayer[] },
    totalStage?: number,
    curStage: number,
    stages: string[][],
    playerState: PLAYER_MATCH_STATE,
    battleState: PLAYER_BATTLE_STATE,
    time?: number,
    createTime?: number,
    expireTime?: number,

    topScore?: number,
    rank?: number,
    // GetMatchAward?: (rank: number) => ItemInfo[]
}

interface IActivityMatchRankRow {
    rank: number,
    score: number,
    user?: IPlayerBase
}

interface IMatchRound {
    matchCid: string,
    matchId: string,
    roundId: string,
}

interface ILevelInfo {
    type: string
    name: string
    icon: string
    lv: number
    exp: number
    maxExp: number
}

interface IGamesHistroy {
    playGame: number    // 游戏局数
    allGame: number     // 完成总局数 
    platGame: number    // 平台总局数
    winNum: number      // 总胜利
    winCon: number      // 连续胜利
    records: boolean[]    // 最近10局输赢
}

interface IAchieve {
    flag: string
    name: string
    desc: string
}

interface IAchieveInfo {
    achieves: IAchieve[] // 成就列表
}

interface ILeagueBase {
    type: LEAGUE_TYPE
    rank: number         // 排名
    medal: number       // 勋章                        
}

interface ILeagueRow extends ILeagueBase {
    // type: LEAGUE_TYPE     // 排名类型
    awards?: IItemInfo[]
    user?: IPlayerBase
}

interface ILeagueInfo {
    type: LEAGUE_TYPE
    leagueId: string
    totalBouns: IItemInfo[]
    rows: ILeagueRow[]
    time: number
}

interface ILeagueAward {
    type: LEAGUE_TYPE
    awards: IMatchAward[]
}

interface IShopInfo {
    boxId: string
    type: SHOP_TYPE
    name: string
    pic: string
    items: IItemInfo[]
    worth: number
    price: number
    addition?: IItemInfo[]
    time?: number
}

interface IGuidanceCfg {
    sceneName: string
    highLightNode: string
    msg: string
    msgPos: {
        x: number,
        y: number,
    }
    highLigheEvent: boolean
    anyClick: boolean
    nextGuidance: boolean
    arrowTip: boolean
    fingerTip: boolean
    nextButton?: boolean
    closeGuidance: boolean
    showMask: boolean

    idx?: number
    preposing?: string

    condition?: string
    value?: any

    mainTab?: string
    callback?: Function

    wechatUnshow?: boolean

    getAwards?: boolean
    wcoinAwards?: boolean

    topInHighLight?: boolean

    checkFirstGame?: boolean

    shortMsg?: boolean
    gameRound?: number

    startEvent?: string
    endEvent?: string
}

interface IPushMsg {
    type: number
    openUri: string
    msg: string
}

type TCountryFlag = { [index: number]: string }
type TItems = { [index: number]: IItemInfo }
type TPlayers = { [index: string]: IPlayerData }
type TMatchs = { [index: string]: IMatchInfo }
type TResults = IMatchDetail[]
type TLevels = { [index: string]: ILevelInfo }
type TShopBoxes = { [index: string]: IShopInfo }
