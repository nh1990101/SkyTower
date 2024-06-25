import { _decorator, Component, director, Node, Vec3 } from 'cc';
import { ReGameWin } from './ReGameWin';
import { AssetMgr } from './AssetMgr';
import { BaseWin } from './BaseWin';
import { FlyNotice } from './FlyNotice';
const { ccclass, property } = _decorator;

@ccclass('UImanager')
export class UImanager extends Component {
    @property(Node)
    public UILayer: Node;
    @property(Node)
    public PopUILayer: Node;
    @property(Node)
    public loading: Node
    private win: Map<string, BaseWin>
    public resultWin: ReGameWin;
    public assetMgr: AssetMgr

    protected notice: FlyNotice;
    public static instance: UImanager;
    start() {
        this.win = new Map<string, BaseWin>();
        this.assetMgr = AssetMgr.instance;
        this.loading.active = false;
    }

    update(deltaTime: number) {

    }

    public showWin(winName: string, ...param: any) {
        // var winName: string = winClass.name
        // this.loading.active = true;
        var showWin = this.win.get(winName);
        if (!this.win.get(winName)) {

            this.assetMgr.createPrefab(winName, "components", Vec3.ZERO, this.PopUILayer).then(data => {
                var win = (data as Node).getComponent(BaseWin);
                win.showWin(...param)
                this.win.set(winName, win)
            })
        }
        else {
            showWin.showWin(...param)
        }

        return showWin;
    }
    public showNotice(content: string) {
        if (!this.notice) {
            this.assetMgr.createPrefab("FlyNotice", "components", Vec3.ZERO, this.PopUILayer).then(data => {
                var notice = (data as Node).getComponent(FlyNotice);
                this.notice = notice;
                this.notice.showText(content)
            })
        } else {
            this.notice.node.setParent(this.PopUILayer)
            this.notice.showText(content)
        }
    }
    public static showWin(winName: string, ...param: any) {
        if (!this.instance) {

            var UIManager = director.getScene().getChildByName("UIManager")
            if (UIManager) {

                this.instance = UIManager.getComponent(UImanager)
            }
        }
        this.instance.showWin(winName, ...param)
    }
    public static showNotice(content: string) {
        if (!this.instance) {

            var UIManager = director.getScene().getChildByName("UIManager")
            if (UIManager) {

                this.instance = UIManager.getComponent(UImanager)
            }
        }
        this.instance.showNotice("<b>" + content + "</b>")
    }
    public static showLoading(isShow: boolean) {
        if (!this.instance) {

            var UIManager = director.getScene().getChildByName("UIManager")
            if (UIManager) {

                this.instance = UIManager.getComponent(UImanager)
            }
        }
        this.instance.loading.active = isShow;
    }
}


