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
  adWidth?: number
  adHeight?: number

  id?: number
}

export interface IShareInfo {
  ShareWay: string
  ShareTaskType: string
  ShareTitle: string
  ShareText: string
  ShareUrl: string
  ShareType: string
  gameid: string
  SharedImg?: string
}

export enum EAdsType {
  ADS_TYPE_BANNER = 0, //banner广告
  ADS_TYPE_FULL_SCREEN = 1,//开屏广告
  ADS_TYPE_INTER = 3, //插屏广告
  ADS_TYPE_REWARTVIDEO = 4, //视频激励广告
  ADS_TYPE_NATIVE = 5, //信息流
}

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

export enum ESessionResult {
  SESSIONRESULT_SUCCESS = 0,
  SESSIONRESULT_CANCEL = 1,
  SESSIONRESULT_FAIL = 2,
  SESSIONRESULT_SWITCH_ACCOUNT = 3,
}

export enum ESocialResult {
  SHARERESULT_SUCCESS        = 0,
  SHARERESULT_FAIL           = 1,
  SHARERESULT_CANCEL         = 2,
  SHARERESULT_DEFAULT_CALLBACK   = 4,//默认回调，插件没有回调
}