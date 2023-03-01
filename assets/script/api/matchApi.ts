import { MatchSvr } from "../system/MatchSvr";
import { Constants } from "../constants";
import { DataMgr } from "../base/DataMgr";
import { UIMgr } from "../base/UIMgr";
import { Helper } from "../system/Helper";
import WxWrapper from "../system/WeChatMini";
import { User } from "../system/User";

let _matchStart: boolean = false
// let _startGameDelegate: Constants.StartGameDelegate = null
let _gameDelegate: IGameDelegate = null

export namespace Match {
    // export function SetGameStartDelegate(func: Constants.StartGameDelegate) {
    //     _startGameDelegate = func
    // }

    export function GameDelegate(delegate: IGameDelegate) {
        _gameDelegate = delegate
    }

    export function GetMatchRules() {

    }

    export function GetMatchInfo() {

    }

    export function AbortMatch() {
        MatchSvr.SubmitScore(1, 0)
        _matchStart = false
        DataMgr.setData(Constants.DATA_DEFINE.GAME_RUNNING, false)
    }

    export function UpdateCurrentScore(score: number | string) {

    }

    export function ReportFinalScore(score: number | string) {
        if (typeof score === "string") {
            score = Number(score)
        }
        MatchSvr.SubmitScore(0, score || 0)
        _matchStart = false
        DataMgr.setData(Constants.DATA_DEFINE.GAME_RUNNING, false)
    }

    // export function onMatch(matchId: string, opponentId: string, roomInfo?: any) {
    //     if (_gameDelegate && _gameDelegate.onMatch) {
    //         _gameDelegate.onMatch(matchId, opponentId, roomInfo)
    //     }
    // }
    export function onMatch(matchInfo: any, opponentId: string, roomInfo?: any) {
        if (_gameDelegate && _gameDelegate.onMatch) {
            _gameDelegate.onMatch(matchInfo, opponentId, roomInfo)
        }
    }

    export function onJoin(players: string[], roomInfo?: any) {
        DataMgr.setData(Constants.DATA_DEFINE.GAME_RUNNING, true)
        if (_gameDelegate && _gameDelegate.onJoin) {
            _gameDelegate.onJoin(players, roomInfo)
            WxWrapper.hideUserInfoButton()
            UIMgr.hideAllScene()
            cc.audioEngine.stopMusic()        
        } else {
            Helper.DelayFun(() => ReportFinalScore(Math.floor(Math.random() * 100)), 1)
            UIMgr.hideAllScene()
            cc.audioEngine.stopMusic()       
        }
    }

    export function onPlayerJoin(openid: string) {
        if (_gameDelegate && _gameDelegate.onPlayerJoin) {
            User.GetPlyDetail(openid, (player) => {
                _gameDelegate.onPlayerJoin(player)
            })            
        }
    }

    export function onLeave(succ: boolean) {
        if (_gameDelegate && _gameDelegate.onLeave) {
            _gameDelegate.onLeave(succ)
        }
    }

    export function onPlayerLeave (openId: string) {
        if (_gameDelegate && _gameDelegate.onPlayerLeave) {
            _gameDelegate.onPlayerLeave(openId)
        }
    }

    export function onDismiss () {
        if (_gameDelegate && _gameDelegate.onDismiss) {
            _gameDelegate.onDismiss()
        }
    }

    export function onData (msg: any) {
        if (_gameDelegate && _gameDelegate.onData) {
            _gameDelegate.onData(msg.name, msg.packet)
        }
    }

    export function SendData(route: string, packetName: string, msg: any) {
        MatchSvr.SendData(route, packetName, msg)
    }

    export function GetOpponents() {
        return MatchSvr.GetCurOpponent()
    }

    // export function StartGame(matchId: string, roomInfo?: any) {
    //     if (_matchStart) {
    //         return
    //     }
    //     _matchStart = true

    //     if (_startGameDelegate && typeof _startGameDelegate === "function") {
    //         WxWrapper.hideUserInfoButton()
    //         _startGameDelegate(matchId, roomInfo)
    //         // UIMgr.clear()
    //         UIMgr.hideAllScene()
    //         cc.audioEngine.stopMusic()            
    //     } else {
    //         Helper.DelayFun(() => ReportFinalScore(Math.floor(Math.random() * 100)), 3)
    //         // UIMgr.clear()
    //         UIMgr.hideAllScene()
    //         cc.audioEngine.stopMusic()            
    //     }
    // }
}