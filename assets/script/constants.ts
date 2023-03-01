/*
 * @Description: 全局定义
 * @Version: 1.0
 * @Autor: sonke
 * @Date: 20210330 1528
 * @LastEditors: sonke
 * @LastEditTime: 20210831 0926
 */

export namespace Constants {

    export let version: string = "0.3.0.4"
    export let versionCode: number = 1

    // 环境
    export enum ENV {
        ENV_PRODUCTION = 0,     // 运行环境
        ENV_SANDBOX = 1,        // 沙盒环境
        ENV_ABROAD = 2,        // 海外环境
    }

    // 屏幕方向
    export enum ORIENTATION {
        LANDSCAPE = 0,
        PORTRAIT = 1
    }

    // 登录类型
    export enum LOGIN_TYPE {
        LOGIN_GUSET = 0,
        BING_PHONE,
        LOGIN_PHONE,
        BIND_EMAIL,
        LOGIN_EMAIL,
        BIND_WEIXIN,
        LOGIN_WECHAT,
        LOGIN_HUAWEI,
        LOGIN_ANY,
        LOGIN_DEFAULT,
        LOGIN_OPPO,
        LOGIN_BYTEDANCE,
        LOGIN_VIVO,
    }

    export enum PAGE_ANI {
        IDLE = 0,
        LEFT_IN,
        LEFT_OUT,
        RIGHT_IN,
        RIGHT_OUT,
        BOTTOM_IN,
        BOTTOM_OUT,
        TOP_IN,
        TOP_OUT,
        FADE_IN,
        FADE_OUT,
        POP_IN,

        ITMEIZE_SHOW,
    }

    export let DATA_DEFINE = cc.Enum({
        NONE: 0,
        BUNDLE: 1,//"igs-bundle",
        IGS_CONFIG: 2,//"igs-config",
        IGS_REGION_FLAG: 3,

        LAST_ACCOUNT: 4,//"last_login_type",
        OPEN_ID: 5,
        USER_INFO: 6,//"user-info"      // 玩家
        USER_ITEMS: 7,

        PLAYERS_INFO: 8,                // 玩家列表

        MATCH_ACTIVITY: 9,              // 活动赛   
        MATHC_TOURNEY: 10,              // 锦标赛
        MATCH_BATTLE: 11,               // 对战赛
        MATCH_PRACTICE: 12,             // 练习赛

        LEAGUE_PRACTICE: 13,
        LEAGUE_PROFESSION: 14,

        // LEVELS_INFO: 15,

        EXCHANGE_SEARCH: 16, //兑换商城搜索历史

        MATCH_PROGRESS: 17,
        MATCH_COMPLETED: 18,

        SHOP_BOXES: 19,

        EXCHANGE_HOME_INFO_DATA: 20, //兑换商城首页信息
        ADDRESS_DATA: 21, //收货地址        

        ICON_LIST: 23,

        PREFERENCE_BOXES: 24,

        SHARE_INFO: 25,

        ACTIVITY_DATA: 26,

        LAST_ENV: 27,

        HISTROY_ACCOUNT: 28,//本机登陆过的账号

        //config 配置在后面
        ITEM_CONFIG: 101,
        MATCH_CONFIG: 102,
        SHOP_CONFIG: 103,
        LEAGUE_PRACTICE_AWARD_CONFIG: 104,
        LEAGUE_PROFESSION_AWARD_CONFIG: 105,
        AD_CONFIG: 106,

        NEWBIE_LIST: 107,
        GUIDANCE_INDEX: 108,

        // 随机数种子
        RAND_SEED: 1001,        
        MATCH_RESULT: 1002,
        LEAGUE_RESULT: 1003,
        PROGRESS_FIRST_TIME: 1004,
        COMPLETED_FIRST_TIME: 1005,

        PHONE_CODE_TIME: 1006,

        OTHER_GAME_PROMOTION: 1007,

        GAME_RUNNING: 1008,

        BACK_GROUND_IMAGE: 1009,     

        SUBMIT_ERR: 1010,

        SEND_EMAIL_TIME: 1011,
        
        GAME_STATE: "game_state",
    })

    export enum STRING_LIST {
        LOAD_ONLINE_PARAM = "读取在线参数",
        LOAD_HOT_UPDATE = "更新资源",
        LOAD_RESOURCE = "预加载资源",
        ACCOUNT_LOGIN = "账号登录",
        GET_CONFIG = "获取游戏配置",
        LOAD_FINISH = "加载完成"
    }

    export enum GAME_STATE {
        NONE = 0,

        PLATFORM_INIT,
        LAUNCH_PLATFORM,
        LOAD_ONLINE_PARAM,
        LOAD_HOT_UPDATE,
        LOAD_RESOURCE,
        LOAD_SCENE,
        LOAD_FINISH,
        ACCOUNT_LOGIN,
        GET_CONFIG,
    }

    export enum EVENT_DEFINE {
        CHANGE_MAIN_TAB = "changeMainTab",
        CHANGE_TAB = "changeTab",

        HIDE_TOKEN_INFO = "hideTokenInfo",
        SHOW_TOKEN_INFO = "showTokenInfo",

        JOIN_MATCH_NOT = "joinMatchNot",
        UPDATE_OPPONENT = "updateOppoentn",
        SET_OPPONENT = "setOpponent",

        ADDRESS_LIST_REQ = "addressListReq",
        ADDRESS_LIST_UPDATE = "addressUpdate",
        ADDRESS_SELECT = "addressSelect",

        UPDATE_CART = "updateCart",
        UPDATE_BILL = "updateBill",
        ENTER_MATCH_SCEME = "enterMatchScene",
        SUBMIT_ORDER_SUCCESS = "submit_order_success",

        GAME_TIP = "gameTip",

        FOREGROUND = "foreground",
        BACKGROUND = "backgournd",

        UI_OPEN = "ui_opened",
        UI_CLOSE = "ui_closed",
        REFRESH_ACTIVITY = "refresh_activity",

        MATCH_LIST_CLOSE = "match_list_close",

        SHOW_OTHER_GAME_LEVEL = "show_other_game_level",

        ON_DATA = "on_data",

        MATCH_HIGH_LIGHT_DIRECT = "match_high_light_direct",

        TASK_UPDATE = "task_update",

        SHOW_SESSION_OPT = "show_session_opt",
        
        LOGIN_SUCCESS = "login_success",

        MSG_PUSH_NOT = "msg_push_not",

        UPDATE_USER_ITEM = "update_user_item",
    }

    export enum ITEM_INDEX {
        WCOIN = 0,
        LOTTERY,
        DIAMOND,
    
        Exp = 10000, // 经验值
        GoldenMedal = 10001, // 奖章 金
        SilverMedal = 10002, // 奖章 银
    }
    
    export enum MATCH_TYPE {
        ACTIVITY_MATCH = 0,
        TOURNEY_MATCH,
        BATTLE_MATCH,
        PRACTICE_MATCH,
    }
    
    export enum MATCH_STATE {
        NONE = -1,
        MATCHING = 0,   // 匹配中
        BATTLING,       // 比赛中
        COMPLETE,       // 已完成
        ABORT,          // 已终止
    }
    
    export enum MATCH_ROUND_STATE {
        ROUND_STATE_MATCHING = 0,   // 匹配中
        ROUND_STATE_WATTING,    // 匹配完成，等待玩家游戏
        ROUND_STATE_GAMEOVER,   // 比赛结果已出
        ROUND_STATE_ABORTED,    // 回合已中止
    }
    
    export enum PLAYER_MATCH_STATE {
        PLAYER_MATCH_STATE_INVALID = -1,    // 无效状态
        PLAYER_MATCH_STATE_GAMING,          // 比赛中
        PLAYER_MATCH_STATE_AWARD,           // 领奖未领取
        PLAYER_MATCH_STATE_GAMEOVER,        // 比赛已完成
    }
    
    export enum PLAYER_BATTLE_STATE {
        NONE = -1,
        PLAYER_STATE_WAITING = 0,   // 等待进入游戏
        PLAYER_STATE_GAMING,        // 比赛中
        PLAYER_STATE_REBATTLE,      // 平局(重新开始)
        PLAYER_STATE_SETTLE,        // 已结算
        PLAYER_STATE_ABORTED,       // 已终止 (超时未完成比赛)
    }
    
    export enum LEAGUE_TYPE {
        PRACTICE_LEAGUE = 0,
        PROFESSION_LEAGUE,
    
        NONE,
    }
    
    export enum SHOP_TYPE {
        NONE = 0,
        NORMAL,
        PREFERENCE
    }
    
    //商品类型(0自营1卡券2直充3京东4严选)
    export enum EXCHANGE_GOODS_TYPE {
        NORMAL = 0,
        CARD = 1,
        PHONE = 2,
    }
    
    //商品支付类型（0奖券 1货币支付）
    export enum EXCHANGE_PRI_TYPE {
        TICKET = 0,
        MONEY = 1,
    }
    

    export const PROFESSION_LEAGUE_COUNT = 0

    //提交问题类型
    export enum ISSUE_TYPE {
        ACCOUNT_INQUIRY = 1,
        DEPOSIT_AND_BILLING = 2,
        REPORT_A_CRASH = 3,
        REPORT_CHEATING = 4,
        REPOT_BUG = 5,
        FEEDBACK = 6,
        OTHER_ISSUE = 7,
    }
}