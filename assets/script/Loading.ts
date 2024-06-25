import { _decorator, Camera, Component, director, find, JsonAsset, Label, lerp, Node, profiler, ProgressBar, RichText, SkyboxInfo, Sprite, SpriteFrame, TextureCube, Tween, tween, Vec3 } from 'cc';
import { AssetMgr } from './AssetMgr';
import { GameConfig } from './GameConfig';
import { GameController } from './GameController';
import { MainUI } from './MainUI';
import { NumberRollEffect } from './NumberRollEffect';
import { ImageLoader } from './ImageLoader';
import { Plat, Platform } from './Platform';
import { GlobalData } from './GlobalData';
const { ccclass, property } = _decorator;

@ccclass('Loading')
export class Loading extends Component {
    @property(Sprite)
    public bg: Sprite;
    @property(Sprite)
    public nameImg: Sprite;
    @property(ProgressBar)
    public loadingBar: ProgressBar;
    @property(RichText)
    public lb_proNotice: RichText;
    @property(Label)
    public lb_version: Label;
    @property(NumberRollEffect)
    public lb_pro: NumberRollEffect;

    private curPro: number = 0;
    public assetMgr: AssetMgr;
    private tw: Tween<ProgressBar>

    start() {
        profiler.hideStats();


        this.loadingBar.progress = 0.01
        this.assetMgr = AssetMgr.instance;
        this.setPro(0.1, "正在加载资源配置")

        this.assetMgr.getRemoteResByUrl("https://kongdahongproject.oss-cn-hangzhou.aliyuncs.com/tower/GameSetting.json?ver=" + new Date().getTime(), JsonAsset, ".json").then((gameseting) => {
            GameConfig.gameSeting = gameseting.json["res"]

            this.setPro(0.5, "正在预加载资源")
            var loadingPromis = []
            var isWx = Platform.isWX();
            //微信登录获取授权
            if (isWx) {
                Platform.platform = Plat.WX;

                loadingPromis.push(Platform.wxLoginGetUserInfo().then(() => {
                    Platform.init();
                }));

            }
            this.assetMgr.init(Platform.platform)
            loadingPromis.push(this.loadRes())
            Promise.all(loadingPromis).then(this.enterGame.bind(this))
        })


    }
    enterGame() {
        setTimeout(() => {
            Platform.login();
        }, 2000);
        this.scheduleOnce(() => {
            this.assetMgr.removeInstant(this.node)
            this.destroy();
        }, 1)
    }
    async loadRes() {
        return new Promise((resolve, reject) => {
            var scene = director.getScene();

            this.setPro(0.6, "正在搭建城市")



            //加载主bundle包components
            this.assetMgr.loadBundles("components").then(() => {

                //天空盒纹理加载
                this.assetMgr.getRes("texture/skyCube", TextureCube).then((data) => {
                    scene.globals.skybox.enabled = true;
                    scene.globals.skybox.envmap = data
                    // var mainCamera=director.getScene().getChildByName("MainCamera").getComponent(Camera)
                    // mainCamera.node.active = true;

                })
                this.assetMgr.createPrefab("GameController", "components", Vec3.ZERO, scene).then(ctrMgr => {
                    var gameCtr: GameController = (ctrMgr as Node).getComponent(GameController)
                    this.setPro(0.7, "正在加载配置")

                    this.assetMgr.createPrefab("skyBox", "components", new Vec3(0, 0, 12), scene).then(data => {
                        gameCtr.skyBox = (data as Node);
                        this.setPro(this.curPro + 0.1, "正在加载天空")
                    })
                    this.assetMgr.createPrefab("skyBox2", "components", new Vec3(0, 0, 12), scene).then(data => {
                        gameCtr.skyBox2 = (data as Node);
                        this.setPro(this.curPro + 0.1, "正在加载太空")
                    })
                    this.assetMgr.getRes("config/config", JsonAsset).then(config => {
                        GameConfig.initConfig(config.json["config"]);
                        this.lb_version.string = "ver." + GlobalData.version;
                        console.log("当前版本号：" + GlobalData.version)
                        this.setPro(this.curPro + 0.1, "正在创建主界面")
                        // var uiMgr=director.getScene().getChildByName("UIManager")

                        this.assetMgr.createPrefab("MainUI", "components", Vec3.ZERO, find("UIManager/UILayer")).then(data => {
                            var enterContent = "正在进入游戏"
                            if (Platform.isWX() && !GlobalData.userInfo) {
                                enterContent = "（请点击授权登录按钮开始游戏）"
                            }
                            this.setPro(1, enterContent)
                            gameCtr.initMainUI((data as Node).getComponent(MainUI));
                            gameCtr.initData();


                            resolve(null);

                        })
                    })

                })
            })

        })
    }
    update(deltaTime: number) {

        // this.loadingBar.progress += (this.curPro / (this.loadingBar.progress * 1000));
        this.lb_pro.string = (this.loadingBar.progress * 100).toFixed(1) + "%"
    }
    public setPro(percent: number, notice: string) {
        this.curPro = percent;
        if (this.tw) {
            this.tw.stop();
        }
        this.tw = tween(this.loadingBar).to(percent - this.loadingBar.progress, { progress: percent }).start();
        // this.loadingBar.progress = percent;
        // this.lb_pro.targetNumber = percent * 100 >> 0
        // this.lb_pro.startRoll();
        this.lb_proNotice.string = `<outline color=#0 width=1>${notice}</outline>`;
    }
    public fixGame() {
        Platform.clearCacheAndReresh();
    }
}


