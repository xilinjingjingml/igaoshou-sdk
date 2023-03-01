export interface IPluginProxyWrapper {
    getInstance: () => IPluginProxyWrapper 

    setPluginConfig: (data: string) => void
    setPackageName: (packetName: string) => void
    switchPluginXRunEnv: (env: number) => void
    setSessionCallBack: (data: string) => void
    setIapCallBack: (data: string) => void
    setSocialCallBack: (data: string) => void
    setPlatformCallBack: (data: string) => void
    setAdsCallBack: (data: string) => void

    getPluginVersion: () => string
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

    jump2ExtendMethod: (tag: number) => void
    StartPushSDKItem: (data: string) => void

    userItemsLogin: (data: string) => void
    logout: () => void
    logEvent: (name: string, param?: any) => void
    
    showAds: (type: number) => void
    hideAds: (type: number) => void
}