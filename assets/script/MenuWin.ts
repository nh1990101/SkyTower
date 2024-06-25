import { _decorator, Component, Node, ProgressBar, Slider, Toggle } from 'cc';
import { BaseWin } from './BaseWin';
import { GameController } from './GameController';
import { GlobalData } from './GlobalData';
import { Plat, Platform } from './Platform';
import { AudioMgr } from './AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('MenuWin')
export class MenuWin extends BaseWin {
    @property(Slider)
    soundSlider: Slider
    @property(Toggle)
    soundToggle: Toggle;
    @property(ProgressBar)
    proVolume: ProgressBar
    ctrMgr: GameController

    start() {

    }

    update(deltaTime: number) {

    }
    public showWin(ctrMgr: GameController) {
        super.showWin();
        
        this.soundToggle.isChecked = !GlobalData.getSoundDenyState();
        this.soundSlider.progress = GlobalData.getSoundVolume();
        this.proVolume.progress=this.soundSlider.progress
        this.ctrMgr = ctrMgr;
    }
    public setVolume(e: Slider) {
        // console.log(e.progress)
        this.proVolume.progress=e.progress
        AudioMgr.inst.setVolume(e.progress)
    }
    public setSoundDeny() {
        var isDeny = !this.soundToggle.isChecked
        // GlobalData.myGameInfo.soundDeny = isDeny
        if (isDeny) {
            AudioMgr.inst.pause();
        } else {
            AudioMgr.inst.resume();
        }
    }
    public closeWin() {
        super.closeWin();
        Platform.saveSeting(!this.soundToggle.isChecked, this.soundSlider.progress);
    }
    public shareFunc() {
        Platform.share();
    }
    public again() {
        var num = this.ctrMgr.getFloorNum()
        var max = GlobalData.getMaxScore()
        if (num > max) {
            Platform.commitResult(num, this.ctrMgr.mainUI.maxRate)
        }
        this.ctrMgr.again();
        this.closeWin();
    }
}


