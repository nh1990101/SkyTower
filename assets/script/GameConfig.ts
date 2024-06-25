import { _decorator, Component, lerp, math, Node, Vec3 } from 'cc';
import { GlobalData } from './GlobalData';
const { ccclass, property } = _decorator;

export interface GameRes {
    version: number,//最新版本号
    resUrl: string,
    soundUrl: string,
    iosSoundUrl: string,
    lastResUrl: string,//审核服资源地址
    isSupportAdv: boolean;//是否开启广告激励
    isSupportShare: boolean;//是否开启分享激励
    advID: string;//广告ID
    shareTittles: string[];//分享好友时候的文本
}
export class GameConfig {
    public static gameSeting: GameRes[];
    public static config: ConfigCfg;
    private static _floorKey: Map<number, SkyObjCfg>;
    private static _shopItemKey: Map<number, ShopItem>;
    public static initConfig(value: Object) {
        GameConfig.config = new ConfigCfg;
        GameConfig.config.decode(value)
        this._floorKey = new Map<number, SkyObjCfg>();
        this._shopItemKey = new Map<number, ShopItem>();
        GameConfig.config.skyObj.forEach(item => {
            this._floorKey.set(item.index, item)
        })
        GameConfig.config.shopList.forEach(item => {
            this._shopItemKey.set(item.index, item)
        })
    }
    public static getCfgByIdx(index: number): SkyObjCfg {
        return this._floorKey.get(index)
    }
    public static getShopItemByIdx(index: number) {
        return this._shopItemKey.get(index);
    }
}
export class BaseConfig extends Object {
    // constructor(){

    // }
    decode(value: Object) {
        for (var key in value) {
            if (this.hasOwnProperty(key)) {
                var objValue = value[key]
                if (objValue)
                    this[key] = objValue;
            }
        }
    }
}
export class ConfigCfg extends BaseConfig {
    public skyObj: SkyObjCfg[]
    public maxHp: number;
    public perFloorScore: number;//每层加分数
    public continuteAwardRate: number;//连击倍数奖励
    public continuteCountTime: number;//连击结束时间
    public shopList: ShopItem[];
    public reliveMax: number;//普通复活次数
    public shareReliveMax: number;//分享复活最大次数
    public advReliveMax: number;//广告复活最大次数
    public awardFloorNum:number;//楼层奖励层数
    public maxQuality: number;//房子最高品质
    public qualityAddRate: number;//房子品质的金币系数
    public getMoneyByQuality(quality: number): number {
        return this.perFloorScore * (1 + quality * this.qualityAddRate)
    }
    public getPriceByTimes(data: Item): number {
        return data.doubleRate ? data.price + data.doubleRate * GlobalData.getBuyTimes(data.type) : data.price;
    }
}
export interface SkyObjCfg extends BaseConfig {
    index: number;
    list: SkyListItem[];
}
export interface SkyListItem {
    name: string;
    pos: number[];
    isFollowCamera: boolean;//是否跟随摄像机（父容器是skyObj）
    isLive: boolean;//是否长期存在
    sound: string;//声音
}
export interface Item {
    type: number;//物品类型
    num: number;//物品数量
    price: number;//价格
    icon: string;//物品图标
    name: string;
    desc: string;
    doubleRate: number;//跟购买次数挂钩，每次增加多少钱
}
export interface ShopItem {
    index: number;//第几层出现商店
    prefabName: string;//预制体名字
    items: Item[];//商品列表

}