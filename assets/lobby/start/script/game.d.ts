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
    qqAPPID?: string,
    hideMusic: boolean,

    version?: IGameVersion,

    hostname?: string,
    gameVersion?: IGameVersion,
    enforceUpdate?: boolean,
    updateUrl?: string,

    onlineParam?: any,

    bootConfig?: { mainGameBundle?: string }
}

// interface IACCOUNT_INFO {
//     account: string,
//     password: string,
//     authType: number
// }

interface IAccount {
    token?: string,
    openid?: string,
    account?: string,
    key?: string,

    type?: string,
}


interface UIParam {
    parent?: cc.Node | string
    position?: cc.Vec2 | cc.Vec3
    scale?: number

    index?: number

    mask?: boolean
    maskClose?: boolean

    name?: string

    childName?: string

    single?: boolean
    tabPage?: boolean

    enterAni?: Constants.PAGE_ANI
    leaveAni?: Constants.PAGE_ANI

    param?: any

    closeCb?: Function

    msg?: cc.Label
}

interface IGameDelegate {
    onInit: () => void
    onMatch: (matchInfo: IMatchInfo, opponentId: string, roomInfo?: any) => void
    onJoin: (playser: string[], roomInfo?: any) => void
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

interface IGradeData {
    major: number,
    minor: number,
    star: number,
    maxStar: number,
    name: string, // 段位名称
    icon: string, // 段位icon
    level: number // 段位等级，从1开始连续
}

interface IGradeRank {
    rank: number
    grade: IGradeData
    like_star: number // 点赞次数
    openid: string
    nickname: string
    head_image: string
    today_like: boolean
}

interface IPlayerBase {
    userName: string            // 用户名
    openId: string              // 用户ID
    avatar: string              // 头像
    region: string              // 区域  
    newbie?: boolean
    gradeRank?: IGradeRank
    props?: IItemInfo[]
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
    joinTime?: number
    regTime?: number
    userLife?: number
    levels?: ILevels
    league?: ILeagueBase[]
    achieve?: IAchieve
    histroy?: IGamesHistroy

    wxOpenId?: string
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
    gameId: string,
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

    roundPlayer: number

    labals?: string

    realTime?: boolean
    // GetMatchAward?: (rank: number) => ItemInfo[]

    level?: number

    isMultiplayer?: boolean
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

    rebattleScore?: number,
    props?: IItemInfo[]
}

interface IMatchDetailGrade {
    before_grade: IGradeData
    after_grade: IGradeData
    season: number
    season_name: string
    timestamp: number
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
    gradeDate?: IMatchDetailGrade,
    // GetMatchAward?: (rank: number) => ItemInfo[]

    randseed?: number,

    roomInfo?: any,
    realTime?: boolean,
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
    props?: IItemInfo[]
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
    rate: number
    addition?: IItemInfo[]
    time?: number

    daysNum?: number
    isBuy?: boolean

    payType?: number
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

interface IPlayAdCallBack {
    order_no: string,
    AdsResultCode: number,
    adsInfo: any,
    msg: string,
    awards?: any,
}

type TCountryFlag = { [index: number]: string }
type TItems = { [index: number]: IItemInfo }
type TPlayers = { [index: string]: IPlayerData }
type TMatchs = { [index: string]: IMatchInfo }
type TResults = IMatchDetail[]
type TLevels = { [index: string]: ILevelInfo }
type TShopBoxes = { [index: number]: { [index: string]: IShopInfo } }
