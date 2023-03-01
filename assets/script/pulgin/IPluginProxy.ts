export enum EPluginType {
    kPluginAds = 1, //广告
    kPluginIAP = 3, //支付
    kPluginSession = 5, //登陆
    kPluginExend = 6, //扩展
}

export interface IPluginProxy {

    pluginTypes: boolean[]

    setParam: (data: any) => void
    login: (data: any) => void
    pay: (data: any) => void
    share: (data: string) => void
    showAds: (type: number) => void
    hideAds: (type: number) => void
}

export interface IAdInfo {
  adPlugin: string
  adArea: number
  adType: number
  adId: string
  adOid: string
  adWidth ?: number
  adHeight ?: number
}

export enum EAdsType {
  ADS_TYPE_BANNER = 0, //banner广告
  ADS_TYPE_FULL_SCREEN = 1,//开屏广告
  ADS_TYPE_INTER = 3, //插屏广告
  ADS_TYPE_REWARTVIDEO = 4, //视频激励广告
  ADS_TYPE_NATIVE = 5, //信息流
}

export enum EAdsResult {
  RESULT_CODE_REWARTVIDEO_SUCCEES = 12,	//激励视频广告成功
  RESULT_CODE_REWARTVIDEO_FAIL = 13,		//激励视频广告失败
  RESULT_CODE_REWARTVIDEO_CANCEL = 14,		//激励视频广告用户取消
}
