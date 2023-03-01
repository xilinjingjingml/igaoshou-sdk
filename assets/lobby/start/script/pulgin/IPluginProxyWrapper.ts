export interface IPluginProxyWrapper {
    getInstance: () => IPluginProxyWrapper
    getPluginsPlist: () => any

    setPluginEnv: (env: number) => void
    setPluginConfig: (data: string) => void
    setPackageName: (packetName: string) => void
    switchPluginXRunEnv: (env: number) => void
    setSessionCallBack: (callback: (data: string) => void) => void
    setIapCallBack: (callback: (data: string) => void) => void
    setSocialCallBack: (callback: (data: string) => void) => void
    setPlatformCallBack: (callback: (data: string) => void) => void
    setAdsCallBack: (callback: (data: string) => void) => void

    getPluginVersion: (name: string, idx: number, type: number) => string
    getDeviceIMEI: () => string
    getMacAddress: () => string
    getVersionCode: () => number
    getDeviceName: () => string
    startUpdatingLocation: () => void

    loadPlugin: (name: string, idx: number, type: number) => void

    copyToClipboard: (text: string) => void
    getClipBoardContent: () => void

    initHeadFace: (url: string) => void

    payForProduct: (data: string) => void
    shareWithItems: (data: string) => void

    jump2ExtendMethod: (tag: number, data: string) => void
    StartPushSDKItem: (data: string) => void

    userItemsLogin: (data: string) => void
    logout: () => void
    logEvent: (type: number, name: string, param?: any) => void

    initAds: (data: string) => void
    showAds: (data: string) => void
    hideAds: (adsType: number) => void

    navigateToMiniGame:(appId: string, extraData: any, callback: (succ: boolean) => void) => void
    checkNetwork: (callback: (res: any) => void) => void

    getABTestKey: (key: string) => string
}