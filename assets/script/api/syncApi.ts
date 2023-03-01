/*
 * @Description: 同步接口
 * @Version: 1.0
 * @Autor: sonke
 * @Date: 20210330 1528
 * @LastEditors: sonke
 * @LastEditTime: 20210330 1529
 */

import { Constants } from "../constants"

export namespace Sync {

    let _syncDelegate: ISyncDelegate

    export function SetSyncDelegate(syncDelegate: ISyncDelegate) {
        _syncDelegate = syncDelegate
    }

    export function IsMatchInProgress(): boolean {
        return false
    }

    export function IsMatchCompleted(): boolean {
        return false
    }

    export function GetConnectedPlayerCount(): number {
        return 0
    }

    export function GetCurrentPlayerId(): number | string {
        return 0
    }

    export function GetCurrentOpponentPlayerId(): number | string {
        return 0
    }

    export function GetServerTime(): number {
        return 0
    }

    export function GetTimeLeftForReconnection(): number {
        return 0
    }

    export function SendData(msg: any) {

    }

    export function ReceiveData(msg: any) {
        
    }
}