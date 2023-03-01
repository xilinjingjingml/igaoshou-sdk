interface PlayerBase {
    userName: string            // 用户名
    userId: string              // 用户ID
    avatar: string              // 头像
    region: number              // 区域  
    newbie?: boolean

    games?: number              // 游戏局数
    winGames?: number           // 胜利局数
    conWinGames?: number        // 连胜局数
}

interface GameDelegate {
    onInit: () => void
    onMatch: (matchInfo: any, opponentId: string, roomInfo?: any) => void
    onJoin: (players: string[], roomInfo?: any) => void
    onPlayerJoin: (player: PlayerBase) => void
    onLeave: (succ: boolean) => void
    onPlayerLeave: (openId: string) => void
    onDismiss: () => void
    onError: (err: any) => void

    onData: (name: string, data: any) => void
}

interface IPlayAdCallBack {
    order_no: string,
    AdsResultCode: number,
    adsInfo: any,
    msg: string,
    awards?: any,
}

declare namespace iGaoShouApi {
    // 平台
    // 接口更新为GameDelegate 支持多状态处理
    // export interface StartGameDelegate { (matchId: string): void; } 
    // export function SetGameStartDelegate(delegate: StartGameDelegate): void;

    // export function GameDelegate(delegate: GameDelegate, gameId?: string): void
    export function Initialize(callback?: Function): void
    export function LaunchPlatform(progress?: (val: number, tip: string) => void): void;
    export function SDKVersion(): string;

    // 工具接口
    export function Random(id: number = 0): number
    export function SetBackgroundMusic(music: string | cc.AudioClip): void
    export function SetMusicVolume(volume: number): void
    export function SetEffectVolume(volume: number): void
    export function GetMusicVolume(): number
    export function GetEffectVolume(): number

    export function SetBackgroundImage(sprite: cc.SpriteFrame): void

    export function SetProto(name: string, proto: any): void
    export function UnsetProto(name: string): void
    export function SendData(route: string, packetName: string, msg: any): void

    // 玩家信息    
    export function GetSelf(): PlayerBase
    export function GetPlayer(userId: string, callback?: (player: PlayerBase) => void): void

    // 比赛
    export function AbortMatch(): void
    export function ReportFinalScore(score: number): void
    export function GetOpponents(): string | PlayerBase | PlayerBase[]

    // 推广
    // export interface PromotionCallback { (res: string): void; }
    // export function GetPromotion(callback: PromotionCallback): void

    // 微信小程序
    export function NativeGame(gameId: string): void

    // 广告
    export function PlayAD(index: number = 0, callback?: (index: number, succ: boolean, playAdCallBack: IPlayAdCallBack) => void): void
    export function ShowBannerAD(callback?: Function): void
    export function HideBannerAD(): void
    export function ShowPluginAD(callback?: Function): void

    export enum EAdsResult {
        RESULT_CODE_INTER_SUCCEES = 10,         //插屏广告播放成功
        RESULT_CODE_INTER_FAIL = 11,            //插屏广告播放失败
        RESULT_CODE_REWARTVIDEO_SUCCEES = 12,    //激励视频广告播放成功
        RESULT_CODE_REWARTVIDEO_FAIL = 13,      //激励视频广告播放失败
        RESULT_CODE_BANNER_SUCCESS = 14,      //banner广告播放成功
        RESULT_CODE_BANNER_FAIL = 15,         //banner广告播放失败
        RESULT_CODE_REWARTVIDEO_LOAD_FAIL = 16,     //激励视频广告LOAD失败
        RESULT_CODE_REWARTVIDEO_LOAD_SUCCESS = 17,  //激励视频广告LOAD成功
        RESULT_CODE_INTER_CLOSE = 18,         //插屏广告关闭
        RESULT_CODE_NATIVE_SUCCESS = 19,      //原生信息流广告播放成功
        RESULT_CODE_NATIVE_FAIL = 20,         //原生信息流广告播放失败
        RESULT_CODE_NATIVE_CLOSE = 21,        //原生信息流广告关闭
        RESULT_CODE_REWARTVIDEO_CLOSE = 22,   //激励视频广告关闭

        RESULT_CODE_REWARTVIDEO_CANCEL = 101,   //激励视频广告播放取消
        RESULT_CODE_CREATE_ORDER_FAIL = 102,    //创建广告订单失败
        RESULT_CODE_ERROR_CONFIG = 103,         //广告配置错误或没有配置
        RESULT_CODE_BANNER_CLOSE = 104,         //banner关闭
    }

    export function UpdateItem(reason: string, items: { id: number, num: number }[], tags: { [name: string]: string }, callback?: Function)
}