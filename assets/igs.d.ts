declare function $log(...args: any): void;
declare function $error(...args: any): void;
export declare namespace igs { }
export declare namespace igs {
    let log: typeof $log;
}
export declare namespace igs {
    function on(eventName: string, cb: Function, target?: any): void;
    function off(eventName: string, cb: Function, target?: any): void;
    function once(eventName: string, cb: Function, target?: any): void;
    function offTarget(target: any): void;
    function emit(eventName: string, ...args: any): void;
}
export declare namespace igs.consts {
    enum Event {
        GET_ONLINE_PARAM = "get-online-param",
        GET_ONLINE_PARAM_SUCCESS = "get-online-param-success",
        GET_ONLINE_PARAM_FAIL = "get-online-param-fail",
        CHECK_BUNDLE_INFO = "check-bundle-info",
        CHECK_BUNDLE_SUCCESS = "check-bundle-success",
        CHECK_REMOTE_UPDATE_FAIL = "check-remote-update-fail",
        FORCE_UPDATE = "force-update",
        SKIP_FORCE_UPDATE = "skip-force-update",
        CONFIRM_UPDATE_BUNDLE = "confirm-update-bundle",
        ENTER_MAIN = "enter-main",
        ENTER_IGAOSHOU = "enter-igaoshou",
        ENTER_GAME = "enter-game",
        DOWNLOAD_MESSAGE = "download-message",
        HOTUPDATE_DOWNLOAD = "hotupdate-download",
        DOWNLOAD_PROGRESS = "download-progress",
        HOTUPDATE_NEW_VERSION = "hotupdate-new-version",
        HOTUPDATE_PROGRESS = "hotupdate-progress",
        HOTUPDATE_NO = "hotupdate-no",
        HOTUPDATE_OK = "hotupdate-ok",
        BUNDLE_NOT_EXIST_EVERYWHERE = "bundle-not-exist-everywhere",
        BUNDLE_DOWNLOAD_FAILED = "bundle-download-failed",
        BUNDLE_LOAD_PROGRESS = "bundle-load-progress",
        BUNDLE_BATCH_ONE_UPDATED_SUCCESS = "bundle-batch-one-update-success",
        BUNDLE_BATCH_ONE_UPDATED_FAILED = "bundle-batch-one-update-failed",
        BUNDLE_BATCH_ALL_DOWNLOAD_SUCCESS = "bundle-batch-all-download-success",
        BUNDLE_BATCH_SOME_DOWNLOAD_FAILED = "bundle-batch-some-download-failed",
        BUNDLE_BATCH_ALL_DOWNLOADINFO_SUCCESS = "bundle-batch-all-downloadinfo-success",
        BUNDLE_BATCH_SOME_DOWNLOADINFO_FAILED = "bundle-batch-anyone-downloadinfo-failed",
        BUNDLE_BATCH_ONE_LOAD_SUCCESS = "bundle-batch-one-load-success",
        BUNDLE_BATCH_ONE_LOAD_FAILED = "bundle-batch-one-load-failed",
        BUNDLE_BATCH_ALL_LOAD_SUCCESS = "bundle-batch-all-load-success",
        BUNDLE_BATCH_SOME_LOAD_FAILED = "bundle-batch-some-load-failed",
        IGS_NODE_SIZE_CHANGED = "igs-node-size-changed"
    }
    enum ENV {
        ENV_PRODUCTION = 0,
        ENV_SANDBOX = 1,
        ENV_ABROAD = 2
    }
}
declare enum TrackName {
    IGS_ENTER_LOADING = "\u52A0\u8F7D-2.1\u8FDB\u5165loading\u754C\u9762",
    IGS_GET_ONLINE_PARAM_START = "\u52A0\u8F7D-2.2\u83B7\u53D6\u5728\u7EBF\u53C2\u6570",
    IGS_GET_ONLINE_PARAM_SUCCESS = "\u52A0\u8F7D-2.2.1\u83B7\u53D6\u5728\u7EBF\u53C2\u6570\u6210\u529F",
    IGS_GET_ONLINE_PARAM_FAILED = "\u52A0\u8F7D-2.2.2\u83B7\u53D6\u5728\u7EBF\u53C2\u6570\u5931\u8D25",
    IGS_PRELOAD_BUNDLES = "\u52A0\u8F7D-2.3\u52A0\u8F7Digaoshou\u5B50\u5305\u548C\u6E38\u620F\u5B50\u5305",
    IGS_PRELOAD_BUNDLES_SUCCESS_igaoshou = "\u52A0\u8F7D-2.3.1\u52A0\u8F7Digaoshou\u5B50\u5305\u6210\u529F",
    IGS_PRELOAD_BUNDLES_FAILED_igaoshou = "\u52A0\u8F7D-2.3.2\u52A0\u8F7Digaoshou\u5B50\u5305\u5931\u8D25",
    IGS_PRELOAD_BUNDLES_SUCCESS_game = "\u52A0\u8F7D-2.3.3\u52A0\u8F7D\u6E38\u620F\u5B50\u5305\u6210\u529F",
    IGS_PRELOAD_BUNDLES_FAILED_game = "\u52A0\u8F7D-2.3.4\u52A0\u8F7D\u6E38\u620F\u5B50\u5305\u5931\u8D25",
    IGS_LOBBY_LAUNCH = "\u52A0\u8F7D-2.5\u542F\u52A8\u5927\u5385",
    IGS_GAME_GUIDE_ENTER_GAME = "\u9996\u5C40-4.1\u8FDB\u5165\u6E38\u620F-\u65B0\u624B\u5F15\u5BFC",
    IGS_FIRST_ROUND_ENTER_GAME = "\u9996\u5C40-4.1\u8FDB\u5165\u6E38\u620F",
    IGS_GAME_GUIDE_START = "\u9996\u5C40-4.2\u65B0\u624B\u5F15\u5BFC\u5F00\u59CB",
    IGS_GAME_GUIDE_OVER = "\u9996\u5C40-4.3\u65B0\u624B\u5F15\u5BFC\u7ED3\u675F",
    IGS_FIRST_ROUND = "\u9996\u5C40-4.4\u5F00\u59CB\u6E38\u620F",
    IGS_FIRST_ROUND_REPORT_SCORE = "\u9996\u5C40-4.5\u63D0\u4EA4\u5206\u6570",
    IGS_FIRST_ROUND_QUIT = "\u9996\u5C40-4.6\u9000\u51FA\u6E38\u620F",
    IGS_NORMAL_ROUND_ENTER_GAME = "\u6B63\u5E38\u5C40-8.1\u8FDB\u5165\u6E38\u620F",
    IGS_NORMAL_ROUND = "\u6B63\u5E38\u5C40-8.2\u5F00\u59CB\u6E38\u620F",
    IGS_NORMAL_ROUND_REPORT_SCORE = "\u6B63\u5E38\u5C40-8.3\u63D0\u4EA4\u5206\u6570",
    IGS_NORMAL_ROUND_QUIT = "\u6B63\u5E38\u5C40-8.4\u9000\u51FA\u6E38\u620F"
}
export declare namespace igs.util {
    function CallStaticMethod(clsName: string, methodName: string, methodSig?: string, params?: Function | any, callback?: Function): any;
    function FormatTimeString(time: string | number, format?: string): string;
    function FormatNumKMBT(num: number): string;
    function FormatNumWY(num: number): string;
    function FormatNumQWY(num: number): string;
    function FormatNumPrice(num: number): string;
    function FormatNumSplit(num: number): string;
    function GetURI(key: string): string;
    function UUID(): string;
    function sign(param: any, userToken: any): string;
    function ParseJson(json: string): any;
    function CSVToArray(strData: any, strDelimiter: any): any[][];
    function isNative(): boolean;
    function dateFormat(fmt: any, date: any): any;
    function trace(count?: any): void;
}
export declare namespace igs.hotUpdate {
    enum HotUpdateCode {
        INIT = -1,
        NEW_VERSION_FOUND = 0,
        ALREADY_UP_TO_DATE = 1,
        LOCAL_MANIFEST_NOT_FOUND = 2,
        PARSE_LOCAL_MANIFEST_FAILED = 3,
        DOWNLOADING_ASSETS = 4,
        UPDATE_FINISHED = 5,
        BUNDLE_NOT_EXIST_EVERYWHERE = 6,
        USE_LOCAL_BUNDLE = 7,
        UPDATE_FINISHED_NOTHING = 8,
        UPDATE_FAILED = 9,
        BUNDLE_LOAD_SUCCESS = 100,
        BUNDLE_LOAD_FAILED = 101,
        BUNDLE_LOADING = 102
    }
    class UpdateData {
        private _ret;
        set ret(v: HotUpdateCode);
        get ret(): HotUpdateCode;
        private _bundleName;
        set bundleName(v: string);
        get bundleName(): string;
        private _bundleDir;
        set bundleDir(v: string);
        get bundleDir(): string;
        private _newVersion;
        set newVersion(v: string);
        get newVersion(): string;
        private _oldVersion;
        set oldVersion(v: string);
        get oldVersion(): string;
        private _totalToDownloadFiles;
        set totalToDownloadFiles(v: number);
        get totalToDownloadFiles(): number;
        private _totalToDownloadBytesCount;
        set totalToDownloadBytesCount(v: number);
        get totalToDownloadBytesCount(): number;
        private _downloadedByteCount;
        set downloadedByteCount(v: number);
        get downloadedByteCount(): number;
        private _downloadedFiles;
        set downloadedFiles(v: number);
        get downloadedFiles(): number;
        private _remoteInfo;
        set remoteInfo(v: RemoteInfo);
        get remoteInfo(): RemoteInfo;
        constructor(ret: HotUpdateCode, bundleName: string);
    }
}
export declare namespace igs.http {
    class Request {
        body?: any;
        method?: string;
        url: string;
        head?: any;
    }
    function request(req: Request): Promise<HttpResult>;
    interface HttpResult {
        err: Error;
        data: any;
    }
    function get(url: any, head: any, params: any, progressCb?: (evt: any) => void): Promise<HttpResult>;
    function post(url: any, head: any, params: any, body: any, progressCb?: (evt: any) => void, callback?: any): Promise<HttpResult>;
    function download(url: any, params: any, callback: any): XMLHttpRequest;
}
export declare namespace igs.platform {
    interface ScreenCapInfo {
        onStart?: (res?: any) => void;
        onStop?: (res: {
            videoPath: string;
        }) => void;
        onPause?: () => void;
        onResume?: () => void;
        onError?: (res: {
            errMsg: string;
        }) => void;
    }
    interface ScreenCapResult {
        start: (duration?: number) => void;
        stop: () => void;
        pause?: () => void;
        resume?: () => void;
    }
    interface TrackEventDetail {
        uploadToPlatform?: {
            k: string;
            v: object;
        }[];
    }
}
export declare namespace igs.bundle {
    interface RunConfig {
        mainScene: string;
        mainPage: string;
    }
    class BundleConfig {
        bundle: string;
        name: string;
        versionName: string;
        versionCode: number;
        description: string;
        index: number;
        run: RunConfig;
        event: string;
        isNeedPrompt: boolean;
        isAutoRun: boolean;
        constructor(name: string, bundle: string, index: number, event?: string, isNeedPrompt?: boolean, isAutoRun?: boolean);
    }
    class BundleLoadProgress {
        progress: number;
        bytesWritten: number;
        bytesExpectedToWrite: number;
        tip: string;
    }
    type BundleType = string | cc.AssetManager.Bundle;
    interface BundleInfo {
        name?: string;
        url?: string;
        versionName?: string;
        versionCode?: number;
        zipSize?: number;
        extparam?: string;
    }
}
export declare namespace igs.bundle {
    type BtCallback = (bt: igs.listener.IBundleBootListener, params: any) => void;
}
export declare namespace igs.listener {
    interface IBundleBatchUpdateListener {
        onCheckRemoteUpdateFailed(bundles: igs.bundle.BundleConfig[]): void;
        onOneDownloadInfoFailed(ud: igs.hotUpdate.UpdateData): void;
        onOneDownloadInfoSuccess(ud: igs.hotUpdate.UpdateData): void;
        onAllDownloadInfoSuccess(uds: igs.hotUpdate.UpdateData[]): void;
        onSomeDownloadInfoFailed(uds: igs.hotUpdate.UpdateData[]): void;
        onOneDownloadSuccess(ud: igs.hotUpdate.UpdateData): void;
        onDownloadProgress(ud: igs.hotUpdate.UpdateData): void;
        onAllDownloadSuccess(uds: igs.hotUpdate.UpdateData[]): void;
        onSomeDownloadFailed(uds: igs.hotUpdate.UpdateData[]): void;
        onOneLoadSuccess(uds: igs.hotUpdate.UpdateData): void;
        onOneLoadFailed(uds: igs.hotUpdate.UpdateData): void;
        onAllLoadSuccess(uds: igs.hotUpdate.UpdateData[]): void;
        onSomeLoadFailed(uds: igs.hotUpdate.UpdateData[]): void;
        onLoadProgress(uptData: igs.bundle.BundleLoadProgress): void;
    }
    interface IBundleBootListener {
        init(bundleConfig: igs.bundle.BundleConfig, initparams: any, cb: igs.bundle.BtCallback): void;
    }
    class DefaultBundleBooter implements IBundleBootListener, GameDelegate {
        init(bundleConfig: igs.bundle.BundleConfig, initparams: any, cb: igs.bundle.BtCallback): void;
        onMatch(matchInfo: any, opponentId: string, roomInfo?: any): void;
        onJoin(players: string[], roomInfo?: any): void;
    }
    interface GameDelegate {
        onMatch: (matchInfo: any, opponentId: string, roomInfo?: any) => void;
        onJoin: (players: string[], roomInfo?: any) => void;
        onData?: (msgName: string, msg: any) => void;
        onLeave?: (succ: boolean) => void;
        onPlayerLeave?: (id: string) => void;
        onDismiss?: () => void;
    }
}
interface RemoteInfo {
    url: string;
    versionCode: number;
    zipSize: number;
    versionName?: string;
    extparam?: string;
}
export declare namespace igs.bundle {
    let updateBundles: (bundles: igs.bundle.BundleConfig[], listener: igs.listener.IBundleBatchUpdateListener) => void;
    let registerBooter: <T extends igs.listener.IBundleBootListener>(name: string, booterClass: {
        new (): T;
    }) => void;
    let bootBundle: (config: igs.bundle.BundleConfig, initparams: any) => void;
    let getBundleInfo: (bundleName: string) => igs.bundle.BundleInfo;
}
export declare namespace igs.exports {
    let onlineParam: any;
    let lobbyConfig: any;
    let config: any;
    let safeArea: {
        top: number;
        bottom: number;
        left: number;
        right: number;
    };
    let getCookie: () => any;
}
export declare namespace igs.global {
    function set(key: any, value: any): void;
    function get(key: any): any;
}
export declare namespace igs.platform {
    function trackEvent(name: string, detail?: igs.platform.TrackEventDetail): void;
    function setScreenCapInfo(info: igs.platform.ScreenCapInfo): igs.platform.ScreenCapResult;
}
export declare namespace igs.izx { }
interface iSceneParam {
    pos?: cc.Vec2 | cc.Vec3;
    parent?: cc.Node;
    size?: cc.Size;
    mask?: boolean;
    maskClose?: boolean;
    initParam?: any;
    closeCallback?: Function;
}
export declare namespace igs.izx.UiMgr {
    function preLoad(name: string | string[], progress?: Function, callback?: Function): void;
    function loadBundle(name: string, callback?: Function): void;
    function popScene(bundleName: string, name: string, param?: iSceneParam | Function, callback?: Function): void;
    function closeScene(name: string, param?: any): void;
    function PushScene(bundleName: string, name: string, callback?: Function, opt?: any): void;
    function ReplaceScene(bundleName: string, name: string, callback?: Function, opt?: any): void;
    function ShowScene(bundleName: string, name: string, callback?: Function, opt?: any): void;
    function PopScene(ui?: igs.izx.BaseUI): void;
    function PushDialog(bundleName: string, name: string, callback?: Function, opt?: any): void;
    function PopDialog(bundleName: igs.izx.BaseUI | string, name?: string): void;
    function loadPic(bundleName: any, pathName: any, callback: any): void;
}
export declare namespace igs.izx {
    let on: typeof igs.on;
    let once: typeof igs.once;
    let off: typeof igs.off;
    let offByTag: typeof offTarget;
    let dispatchEvent: typeof igs.emit;
    let emit: typeof igs.emit;
    let log: typeof $log;
    let logE: typeof $error;
    let pushDialog: typeof UiMgr.PushDialog;
    let popDialog: typeof UiMgr.PopDialog;
    let pushScene: typeof UiMgr.PushScene;
    let replaceScene: typeof UiMgr.ReplaceScene;
    let showScene: typeof UiMgr.ShowScene;
    let popScene: typeof UiMgr.PopScene;
    let closeScene: typeof UiMgr.closeScene;
    enum Orientation {
        Unknown = 0,
        Portrait = 1,
        PortraitUpsideDown = 2,
        LandscapeLeft = 3,
        Landscape = 3,
        LandscapeRight = 4,
        AutoRotation = 5
    }
    let DEFAULT_ORIENTATION: Orientation;
    interface IBundle {
        name: string;
        err: Error;
        bundle: cc.AssetManager.Bundle;
    }
    let LoadBundle: (name: string, callback?: Function) => void;
    class baseUICloseTransition extends cc.Component {
        _closeClip: cc.AnimationClip;
        onLoad(): void;
        start(): void;
        doCloseAni(): void;
        doAniOver(): void;
        onCloseAniOver(): void;
        onDestroy(): void;
    }
    class BaseUI extends cc.Component {
        initParam: any;
        closeCb: Function;
        protected _isScene: boolean;
        protected _dialog: BaseUI[];
        protected _resPath: string;
        protected _orientation: izx.Orientation;
        get isScene(): boolean;
        set isScene(value: boolean);
        get orientation(): izx.Orientation;
        set orientation(value: izx.Orientation);
        onOpen(): void;
        onTransitionOpen(): void;
        onTransitionClose(): void;
        onResume(): void;
        onPause(): void;
        onClose(callback?: Function): void;
        onDestroy(): void;
        pushDialog(dialog: BaseUI): void;
        popDialog(dialog: BaseUI | string): void;
        popAllDialog(): void;
        pop(): void;
        lastDialog(): BaseUI;
    }
    namespace Button {
        function bindButtonClick(comp: string | cc.Node, node: cc.Node | Function, callback?: Function, customData?: string): void;
    }
}
export declare namespace igs.izx.AudioMgr {
    function setMusicVolume(value: number): void;
    function getMusicVolume(): number;
    function setEffectVolume(value: number): void;
    function getEffectVolume(): number;
    function playMusic(path: string, bundleName?: string): void;
    function playEffect(path: string, bundleName?: string, loop?: boolean | Function, cb?: Function): void;
    function setMusicOn(value: number): void;
    function getMusicOn(): number;
    function setEffectOn(value: number): void;
    function getEffectOn(): number;
    function init(): void;
}
export declare namespace igs.platform {
    let TrackNames: typeof TrackName;
    namespace EventTrack {
        let add: (name: string) => void;
    }
}
export {};
