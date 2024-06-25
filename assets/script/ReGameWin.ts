import { _decorator, color, Color, Component, Label, Node, RichText, Sprite } from 'cc';
import { LocalStorage } from './LocalStorage';
import { BaseWin } from './BaseWin';
import { Platform } from './Platform';
import { GlobalData } from './GlobalData';
import { AudioMgr } from './AudioMgr';
import { AssetMgr } from './AssetMgr';
import { UImanager } from './UImanager';
import { GameConfig } from './GameConfig';
const { ccclass, property } = _decorator;

@ccclass('ReGameWin')
export class ReGameWin extends BaseWin {
    @property(Label)
    public tittle: Label;
    @property(RichText)
    public rt_content: RichText;
    @property(Node)
    public win: Node;
    @property(Sprite)
    public mask: Sprite;
    @property(Node)
    public btnAdv: Node;
    @property(Node)
    public btnShare: Node;
    @property(Node)
    public btnAddHp: Node;
    @property(Label)
    public lb_tryTime: Label;
    @property(Label)
    public lb_reliveTime: Label;
    private _callBack0: Function;
    private _callBack1: Function;
    private bgColor: Color = new Color(0, 0, 0, 50)
    private historyScore: number;
    private historyDoubleHit: number;
    public tryTime = 0;//复活次数
    public maxTryTime = 0;

    start() {
        this.bgColor = this.mask.color.clone();
    }

    update(deltaTime: number) {

    }
    setWinBgShow(bol: boolean) {
        this.win.active = bol;
        var color = this.bgColor.clone();
        if (!bol) {
            color.a = 0;
        }
        this.mask.color = color
    }
    hideBg() {
        this.setWinBgShow(false)
    }

    showWin(numFloor: number, doubleHit: number, score: number, call0: Function, call1: Function) {
        AudioMgr.inst.playRemoteSound("milestone_reached", true)
        this.historyScore = numFloor;
        this.historyDoubleHit = doubleHit;
        this.node.active = true;
        this.setWinBgShow(true)
        var max = GlobalData.getMaxScore();
        var tittle = ""
        if (numFloor > Number(max)) {
            tittle = "新纪录"
            Platform.commitResult(this.historyScore, this.historyDoubleHit)
        } else {
            tittle = "相当不错"
        }
        var content = `高楼层数：${numFloor}层\n最高连击：${doubleHit}`
        this.tittle.string = tittle;
        this.rt_content.string = content;
        this._callBack0 = call0;
        this._callBack1 = call1;
        var config = AssetMgr.instance.RES_CONFIG
        if (config.isSupportAdv) {
            this.btnAdv.active = true;
            this.btnAddHp.active = this.btnShare.active = false;
            this.maxTryTime = GameConfig.config.advReliveMax;
        } else if (config.isSupportShare) {
            this.btnShare.active = true;
            this.btnAdv.active = this.btnAddHp.active = false;
            this.maxTryTime = GameConfig.config.shareReliveMax;
        } else {
            this.maxTryTime = GameConfig.config.reliveMax;
            this.lb_tryTime.string = `复活`
            this.btnAddHp.active = true;
            this.btnAdv.active = this.btnShare.active = false;
        }
        var leftTime = this.maxTryTime - this.tryTime
        this.lb_reliveTime.color = leftTime > 0 ? Color.WHITE : Color.RED;
        this.lb_reliveTime.string = leftTime + ""
    }
    onClickAgain() {
        if (this._callBack0) {
            this._callBack0();
        }
        this.tryTime = 0;
        this.closeWin();
    }
    onClickAdvi() {
        if (this.tryTime >= this.maxTryTime) {
            UImanager.showNotice("<font color='#ff0000'>复活次数用完，请重新开始游戏</font>")
            return;
        }
        Platform.rewardAdv(() => {
            console.log("观看广告并获得复活")
            if (this._callBack1) {
                this._callBack1();
                this.tryTime++;
            }
            this.closeWin();
        })
    }
    onClickShare() {
        if (this.tryTime >= this.maxTryTime) {
            UImanager.showNotice("<font color='#ff0000'>复活次数用完，请重新开始游戏</font>")
            return;
        }
        Platform.share();
        if (this._callBack1) {
            this._callBack1();
        }
        this.tryTime++;
        this.closeWin();
    }
    onClickTryAgain() {
        if (this.tryTime >= this.maxTryTime) {
            UImanager.showNotice("<font color='#ff0000'>复活次数用完，请重新开始游戏</font>")
            return;
        }
        if (this._callBack1) {
            this._callBack1();
        }
        this.tryTime++;
        this.closeWin();
    }
}


