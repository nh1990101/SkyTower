import { director, random } from "cc"
import { UImanager } from "./UImanager"
import { GlobalData } from "./GlobalData";
import { LocalStorage } from "./LocalStorage";
import { GameConfig } from "./GameConfig";
import { AssetMgr } from "./AssetMgr";
export enum Plat {
    LOCAL = 0,
    WX = 1,
}
export class Platform {
    public static platform: number = Plat.LOCAL;
    public static isWX(): boolean {
        return window["wx"]
    }
    public static init() {
        if (this.isWX()) {
            console.log("云函数初始化")
            wx.cloud.init({ env: "cloud1-2g8c4k139a88364e" });
        }

    }
    public static rewardAdv(success, fail?) {
        if (!this.isWX()) {
            success();
            return;
        }
        if (AssetMgr.instance.RES_CONFIG.isSupportAdv) {

            let rewardedVideoAd = wx.createRewardedVideoAd({ adUnitId: AssetMgr.instance.RES_CONFIG.advID })
            rewardedVideoAd.show().catch(err => console.log(err))
            rewardedVideoAd.onLoad(() => {
                console.log('激励视频 广告加载成功')
            })
            rewardedVideoAd.onClose(res => {
                // 用户点击了【关闭广告】按钮
                // 小于 2.1.0 的基础库版本，res 是一个 undefined
                if (res && res.isEnded || res === undefined) {
                    // 正常播放结束，可以下发游戏奖励
                    success();
                }
                else {
                    // 播放中途退出，不下发游戏奖励
                    if (fail) {
                        fail();

                    } else {
                        UImanager.showNotice("奖励获取失败")
                    }
                }
            })
        }
    }
    public db() {
        // 1. 获取数据库引用
        const db = wx.cloud.database();


        // 2. 构造查询语句
        db
            // collection() 方法获取一个集合的引用
            .collection("books")
            // where() 方法传入一个 query 对象，数据库返回集合中字段等于指定值的 JSON 文档。
            .where({
                name: "The Catcher in the Rye"
            })
            // get() 方法会触发网络请求，往数据库取数据
            .get()
            .then(function (res) {
                console.log(res);
                // 输出 [{ "name": "The Catcher in the Rye", ... }]
            });



    }

    public static login() {
        if (this.isWX()) {
            console.log("云函数login，GlobalData.userInfo=" + GlobalData.userInfo)

            wx.cloud.callFunction({
                name: "login",
                data: {
                    userinfo: GlobalData.userInfo
                },
            }).then(res => {

                console.log("登录成功：res=" + res.result)
                GlobalData.myGameInfo = res.result["data"][0];

            }).catch(console.error)
        }
    }
    public static saveSeting(isDeny: boolean, volume: number) {
        if (this.isWX()) {
            GlobalData.myGameInfo.soundDeny = isDeny;
            GlobalData.myGameInfo.soundVolume = volume;
            wx.cloud.callFunction({
                name: "saveSeting",
                data: {
                    gameUserInfo: GlobalData.myGameInfo
                },
            }).then(res => {

                console.log("设置成功")


            }).catch(console.error)

        } else {
            LocalStorage.setItem("soundDeny", isDeny ? "1" : "0")
            LocalStorage.setItem("soundVolume", volume.toString())
        }
    }
    public static getRank() {
        return new Promise((resolve, reject) => {
            if (this.isWX()) {
                wx.cloud.callFunction({
                    name: "getRank",
                    data: {
                        userinfo: GlobalData.userInfo
                    },
                }).then(res => {

                    console.log("获取排行榜成功")
                    GlobalData.rank = res.result["data"];
                    resolve(null)

                }).catch(console.error)

            }
        })
    }
    public static commitResult(score: number, contin: number) {
        if (this.isWX()) {

            wx.cloud.callFunction({
                name: "commitResult",
                data: {
                    continue: contin,
                    score: score,
                },
            }).then(res => {
                if (res.result["code"] == 0) {

                    console.log("记录提交成功")
                } else {
                    console.log("记录提交失败")
                }
                GlobalData.myGameInfo.score = score;
                GlobalData.myGameInfo.continue = contin;

            }).catch(console.error)
        } else {
            LocalStorage.setItem("maxFloor", score.toString())
        }
    }
    public static async wxLoginGetUserInfo() {
        return new Promise((resolve, reject) => {

            wx.login({
                success: res => {
                    if (res.code) {
                        console.log("登录成功，code=" + res.code)
                        wx.getSetting({
                            success(res) {
                                if (res.authSetting['scope.userInfo'] === true) {
                                    wx.getUserInfo({
                                        success: (res) => {
                                            console.log(res)
                                            // 已经授权，直接获取用户信息
                                            GlobalData.userInfo = res.userInfo;

                                            resolve(null)
                                        },
                                    });
                                } else {
                                    const button = wx.createUserInfoButton({
                                        type: 'text',
                                        text: '授权登录',
                                        style: {
                                            borderColor: '#00FF00',
                                            borderWidth: 1,
                                            borderRadius: 10,
                                            left: wx.getSystemInfoSync().screenWidth / 2 - 60,
                                            top: wx.getSystemInfoSync().screenHeight - 320,
                                            width: 120,
                                            height: 40,
                                            lineHeight: 40,
                                            backgroundColor: '#00ff00',
                                            color: '#ffffff',
                                            textAlign: 'center',
                                            fontSize: 16,



                                        }
                                    })
                                    button.onTap((res) => {
                                        // 此处可以获取到用户信息
                                        console.log(res)
                                        if (res) {
                                            GlobalData.userInfo = res.userInfo;

                                            button.destroy();
                                            resolve(null)
                                        }
                                    })
                                }
                            },
                        });

                    }
                }
            })
        })
    }
    public static share() {
        if (this.isWX()) {
            var shareTittle = AssetMgr.instance.RES_CONFIG.shareTittles;
            var title = shareTittle[random() * shareTittle.length >> 0]
            wx.shareAppMessage({ title: title })

        }
    }
    /**清理缓存并重新进入游戏 */
    public static clearCacheAndReresh() {
        AssetMgr.instance.clearCache();
        switch (this.platform) {
            case Plat.WX:
                wx.restartMiniProgram({
                    complete: () => {
                        console.log("重启应用")
                    }
                })
                break;
            default:
                location.reload();
                break;
        }
    }
}


