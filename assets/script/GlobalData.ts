import { _decorator, Component, Node } from 'cc';
import { Platform } from './Platform';
import { LocalStorage } from './LocalStorage';
const { ccclass, property } = _decorator;

export interface UserInfo {
    /** 用户头像图片的 URL。URL 最后一个数值代表正方形头像大小（有 0、46、64、96、132 数值可选，0 代表 640x640 的正方形头像，46 表示 46x46 的正方形头像，剩余数值以此类推。默认132），用户没有头像时该项为空。若用户更换头像，原有头像 URL 将失效。 */
    avatarUrl: string
    /** 用户所在城市。不再返回，参考 [相关公告](https://developers.weixin.qq.com/community/develop/doc/00028edbe3c58081e7cc834705b801) */
    city: string
    /** 用户所在国家。不再返回，参考 [相关公告](https://developers.weixin.qq.com/community/develop/doc/00028edbe3c58081e7cc834705b801) */
    country: string
    /** 用户性别。不再返回，参考 [相关公告](https://developers.weixin.qq.com/community/develop/doc/00028edbe3c58081e7cc834705b801)
     *
     * 可选值：
     * - 0: 未知;
     * - 1: 男性;
     * - 2: 女性; */
    gender: 0 | 1 | 2
    /** 显示 country，province，city 所用的语言。强制返回 “zh_CN”，参考 [相关公告](https://developers.weixin.qq.com/community/develop/doc/00028edbe3c58081e7cc834705b801)
     *
     * 可选值：
     * - 'en': 英文;
     * - 'zh_CN': 简体中文;
     * - 'zh_TW': 繁体中文; */
    language: 'en' | 'zh_CN' | 'zh_TW'
    /** 用户昵称 */
    nickName: string
    /** 用户所在省份。不再返回，参考 [相关公告](https://developers.weixin.qq.com/community/develop/doc/00028edbe3c58081e7cc834705b801) */
    province: string

}
export interface UserGameData {
    openid: string;
    due: Date;
    headUrl: string;
    nickName: string;
    gender: any;//性别
    score: number;
    continue: number;
    soundDeny: boolean;//游戏声音是否关闭
    soundVolume: number;//声音大小
}
export class GlobalData {
    public static version = 1;
    private static _buyTimes: Map<number, number>
    constructor() {

    }
    static initData() {
        this._buyTimes = new Map<number, number>();
    }
    static setBuyTimes(type: number, value: number) {

        this._buyTimes.set(type, value)
    }
    static getBuyTimes(type: number): number {
        if (!this._buyTimes.get(type)) {
            return 0;
        }
        return this._buyTimes.get(type)
    }
    public static userInfo: UserInfo
    public static myGameInfo: UserGameData;
    public static rank: UserGameData[];
    public static getMaxScore(): number {
        if (Platform.isWX() && GlobalData.myGameInfo) {
            return GlobalData.myGameInfo.score
        }
        return Number(LocalStorage.getItem("maxFloor"))
    }
    public static getSoundDenyState(): boolean {
        if (Platform.isWX() && GlobalData.myGameInfo) {
            return GlobalData.myGameInfo.soundDeny
        }
        return Number(LocalStorage.getItem("soundDeny")) == 1;
    }
    public static getSoundVolume(): number {
        if (Platform.isWX() && GlobalData.myGameInfo) {
            return GlobalData.myGameInfo.soundVolume
        }
        return Number(LocalStorage.getItem("soundVolume"));
    }
    // public userInfo:UserInfo
}


