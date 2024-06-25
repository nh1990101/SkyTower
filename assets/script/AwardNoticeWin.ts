import { _decorator, Component, director, Node, RichText } from 'cc';
import { GameConfig } from './GameConfig';
import { AssetMgr } from './AssetMgr';
import { Platform } from './Platform';
import { GameController } from './GameController';
import { BaseWin } from './BaseWin';
import { AudioMgr } from './AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('AwardNoticeWin')
export class AwardNoticeWin extends BaseWin {
    @property(RichText)
    public lb_content: RichText
    @property(Node)
    public btnAdv: Node;
    @property(Node)
    public btnShare: Node;
    public ctrMgr: GameController;

    start() {

        this.ctrMgr = director.getScene().getChildByName("GameController").getComponent(GameController);
    }

    update(deltaTime: number) {

    }
    showWin() {
        super.showWin();
        var config = AssetMgr.instance.RES_CONFIG;
        this.lb_content.string = `<b>需要免费加高<color=#00ff00>${GameConfig.config.awardFloorNum}层</color>吗？</b>`
        if (config.isSupportAdv) {
            this.btnAdv.active = true;
            this.btnShare.active = false;
        } else if (config.isSupportShare) {
            this.btnAdv.active = false;
            this.btnShare.active = true;
        }
    }
    shareFunc() {
        Platform.share();
        AudioMgr.inst.playRemoteSound("checkpoint", true)
        this.ctrMgr.addFloor(GameConfig.config.awardFloorNum)
        this.closeWin();
    }
    advFunc() {
        Platform.rewardAdv(() => {
            console.log("观看广告并获得楼层数增加")
            AudioMgr.inst.playRemoteSound("checkpoint", true)
            this.ctrMgr.addFloor(GameConfig.config.awardFloorNum)
            this.closeWin();
        })
    }
}


