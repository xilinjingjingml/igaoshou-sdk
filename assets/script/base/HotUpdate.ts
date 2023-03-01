/*
 * @Description: 热更新
 * @Version: 1.0
 * @Autor: sonke
 * @Date: 20210330 1528
 * @LastEditors: sonke
 * @LastEditTime: 20210330 1529
 */

import { Helper } from "../system/Helper"

export namespace HotUpdate {
    let _progressHandler: (value: number) => void
    let _resultHandler: (ret: number) => void
    let _assetsManager: any
    let _manifestConfig: any = {}
    let _percent: number = 0
    let _storagePath: string

    export function init(path: string) {
        _storagePath = jsb.fileUtils.getWritablePath() + path
        const manifestPath = cc.sys.localStorage.getItem("HotUpdateSearchPaths") ? _storagePath : "thirdparty"
        _assetsManager = new jsb.AssetsManager(manifestPath + '/project.manifest', _storagePath, Helper.VersionCompare)
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            _assetsManager.setMaxConcurrentTask(2)
        }
    }

    function _getLocalManifestVersion(): string {
        return _assetsManager.getLocalManifest().getVersion()
    }

    export function setProgressHandler(handler: (value: number) => void) {
        _progressHandler = handler
    }

    export function setResultHandler(handler: (value: number) => void) {
        _resultHandler = handler
    }

    export function setUpdateUrl(url: string) {
        cc.log("[HotUpdate.setUpdateUrl]", url)
        _manifestConfig = {
            packageUrl: url,
            remoteManifestUrl: url + "project.manifest",
            remoteVersionUrl: url + "version.manifest",
        }

        _updateManifest(_assetsManager.getLocalManifest(), 'project.manifest')
        _updateStart()
    }

    function _updateManifest(manifest: any, filename: string) {
        const manifestPath = manifest.getManifestRoot() + filename
        const manifestJson = JSON.parse(jsb.fileUtils.getStringFromFile(manifestPath))
        for (const key in _manifestConfig) {
            manifestJson[key] = _manifestConfig[key]
        }
        manifest.parseJSONString(JSON.stringify(manifestJson), _storagePath)
    }

    function _updateStart() {
        cc.log("[HotUpdate.updateStart]")
        _assetsManager.setEventCallback(_updateCallback.bind(this))
        _assetsManager.update()
    }

    function _updateCallback(event: any) {
        let state = 0 // 1 finished 2 failed 3 already
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                cc.log("[HotUpdate.updateCallback] No local manifest file found, hot update skipped.")
                state = 2
                break
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                cc.log("[HotUpdate.updateCallback] Updated file.", event.getMessage())
                cc.log(event.getDownloadedFiles(), event.getTotalFiles(), event.getPercentByFile())
                cc.log(event.getDownloadedBytes(), event.getTotalBytes(), event.getPercent())
                _updateProgress(event.getPercent())
                break
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                cc.log("[HotUpdate.updateCallback] Fail to download manifest file, hot update skipped.")
                state = 2
                break
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                cc.log("[HotUpdate.updateCallback] Already up to date with the latest remote version.")
                state = 3
                break
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                cc.log("[HotUpdate.updateCallback] Update finished.")
                state = 1
                break
            case jsb.EventAssetsManager.UPDATE_FAILED:
                cc.log("[HotUpdate.updateCallback] Update failed.")
                state = 2
                break
            case jsb.EventAssetsManager.ERROR_UPDATING:
                cc.log("[HotUpdate.updateCallback] Asset update error:", event.getAssetId())
                break
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                cc.log("[HotUpdate.updateCallback] ERROR_DECOMPRESS.")
                break
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                cc.log("[HotUpdate.updateCallback] NEW_VERSION_FOUND.")
                _updateManifest(_assetsManager.getRemoteManifest(), 'project.manifest.temp')
                break
            default:
                cc.log("[HotUpdate.updateCallback] unkonw event.", event.getEventCode())
                break
        }

        if (state == 0) {
            return
        }

        _assetsManager.setEventCallback(null)
        if (_resultHandler) {
            _resultHandler(state)
        }
        if (state == 1) {
            const searchPaths = jsb.fileUtils.getSearchPaths()
            Array.prototype.unshift.apply(searchPaths, _assetsManager.getLocalManifest().getSearchPaths())
            cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths))
            jsb.fileUtils.setSearchPaths(searchPaths)
            cc.audioEngine.stopAll()
            cc.log("[HotUpdate.updateCallback] restart 1")
            cc.game.restart()
            cc.log("[HotUpdate.updateCallback] restart 2")
        }
    }

    function _updateProgress(percent: number) {
        cc.log("[HotUpdate.updateProgress] value", percent)
        if (percent > 1) {
            percent = 1
        }
        if (percent <= _percent) {
            return
        }
        _percent = percent
        _progressHandler && _progressHandler(percent)
    }

    function _onDestroy() {
        if (_assetsManager) {
            _assetsManager.setEventCallback(null)
        }
    }

    export function update(path: string, url: string, progress: Function, complete: Function) {
        this.init(path)
        this.setUpdateUrl(url)
        this.setProgressHandler(progress)
        this.setResultHandler(complete)
    }
}
