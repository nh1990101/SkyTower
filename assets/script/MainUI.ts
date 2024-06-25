import { _decorator, Color, Component, EditBox, find, Label, Node, ProgressBar, RichText, Tween, tween, Vec3 } from 'cc';
import { GameController } from './GameController';
import { GameConfig } from './GameConfig';
import { CoinFlyEffect } from './CoinFlyEffect';
import { NumberRollEffect } from './NumberRollEffect';
import { GlobalData } from './GlobalData';
import { Platform } from './Platform';
import { UImanager } from './UImanager';
import { AudioMgr } from './AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('MainUI')
export class MainUI extends Component {
    @property(Label)
    public lb_floorNum: Label;
    @property(NumberRollEffect)
    public lb_money: NumberRollEffect;
    @property(Label)
    public lb_addMoney: Label;
    @property(RichText)
    public lb_guide: RichText;
    @property(Node)
    public cameraUI: Node;
    @property(Node)
    public moneyIcon: Node;
    @property(Node)
    public continute: Node;
    @property(Node)
    public fingerIcon: Node;
    @property(Node)
    public continueStar: Node;
    @property(ProgressBar)
    public continueBar: ProgressBar;
    @property(Label)
    public lb_continueRate: Label;
    @property(Node)
    public GM: Node;
    @property(Node)
    public btnFloorIdx: Node;
    @property(Node)
    public beginUI: Node;
    @property(Node)
    public finger: Node;
    @property(Node)
    public hp: Node;

    @property(EditBox)
    public ti_floorIdx: EditBox;


    public gameCtrl: GameController;

    @property(Label)
    public lb_selectObj: Label;
    @property(Label)
    public lb_notice: Label;
    @property(EditBox)
    public ti_selectX: EditBox;
    @property(EditBox)
    public ti_selectY: EditBox;
    @property(EditBox)
    public ti_selectZ: EditBox;

    private _selectNode: Node;
    private myTw: Tween<Color>;
    private twBar: Tween<ProgressBar>;
    private twStar: Tween<Node>
    private twAddMoney: Tween<Node>
    private twFinger: Tween<Node>;
    public rate: number = 1;
    public money: number = 0;
    public maxRate = 0;
    public numFloor = 0;
    public maxHp: number = 0;
    public curHp: number = 0;
    public coinEffect: CoinFlyEffect;
    /**房子品质 */
    public towerQuality = 0;
    start() {
        this.lb_floorNum.string = "x0";
        this.coinEffect = this.getComponent(CoinFlyEffect)

    }

    update(deltaTime: number) {

    }
    public initData() {
        this.rate = 1;
        this.money = 0;
        this.maxRate = 0;
        this.numFloor = 0;
        this.towerQuality = 0
        GlobalData.initData();
        this.setFloorNum(0);
        this.watchState(false)
        this.setHp(GameConfig.config.maxHp, GameConfig.config.maxHp)
        this.addMoney(0);
        if (this.twBar) {
            this.twBar.stop();
        }
        this.hideContinue();
        this.hideGuide();
    }
    public setupGameCtrl(gameCtrl: GameController) {
        this.gameCtrl = gameCtrl;
    }

    public setFloorNum(num: number) {
        this.numFloor = num;
        this.lb_floorNum.string = "x" + num;
    }
    public gotoFloorIdx() {
        var idx = Number(this.ti_floorIdx.textLabel.string);
        if (idx > 1) {
            this.gameCtrl.createFloorList(idx);
        }
    }
    public setSelectObj(node: Node) {
        this._selectNode = node;
        var pos = node.worldPosition;
        this.lb_selectObj.string = node.name;
        this.ti_selectX.string = pos.x + "";
        this.ti_selectY.string = pos.y + "";
        this.ti_selectZ.string = pos.z + "";
    }
    public setSelectObjPos() {
        var pos = new Vec3(Number(this.ti_selectX.string), Number(this.ti_selectY.string), Number(this.ti_selectZ.string))
        if (this._selectNode) {
            this._selectNode.setWorldPosition(pos)
        }
    }
    public addHP(value: number): number {
        this.setHp(++this.curHp)
        return this.curHp;
    }
    public subHp(value: number = 1): number {
        this.setHp(--this.curHp)
        return this.curHp;
    }
    private setHp(cur: number, max?: number) {
        this.curHp = cur;
        if (max) {
            this.maxHp = max;
        }
        for (var i = 0; i < this.maxHp; i++) {
            var hp = this.hp.getChildByName(`heart${i}`)
            if (hp) {
                let isAct = i < cur
                if (isAct && !hp.active) {//增加心心
                    hp.active = isAct;
                    hp.setScale(Vec3.ZERO)
                    tween(hp).to(0.2, { scale: Vec3.ONE }).start();
                } else if (!isAct && hp.active) {//减少心心
                    hp.setScale(Vec3.ONE)
                    tween(hp).to(0.2, { scale: Vec3.ZERO }).call(() => { hp.active = isAct }).start();
                } else {
                    hp.active = isAct;
                    hp.setScale(Vec3.ONE)
                }

            }
        }
    }
    public showNotice(bol: boolean) {
        this.lb_notice.enabled = bol;
        var color = this.lb_notice.color.clone();
        this.beginUI.active = !bol
        if (bol) {
            // color.a = 0;
            // this.lb_notice.al = color;
            this.myTw = tween(color).to(0.2, { a: 0 }, {
                onUpdate: (target, radio) => {

                    this.lb_notice.color = color;
                }
            }).to(0.2, { a: 255 }, {
                onUpdate: (target, radio) => {

                    this.lb_notice.color = color;
                }
            }).union().repeatForever().start();
            // tw.repeatForever(tw)
        } else {
            this.myTw.stop();
            color.a = 255;
            this.lb_notice.color = color
        }
    }
    public onClickEvent(touch, event) {
        this.gameCtrl.onClickMainUI(touch, event)
    }
    public addMoney(num: number) {
        var changeNum = (num >> 0)
        this.money += changeNum;
        var color = changeNum >= 0 ? Color.GREEN : Color.RED;
        this.lb_addMoney.color = color;

        this.lb_addMoney.string = (changeNum >= 0 ? "+" : "") + changeNum;
        this.lb_addMoney.node.active = true;
        if (this.twAddMoney) {
            this.twAddMoney.stop();
            this.lb_addMoney.node.scale = Vec3.ONE;
        }
        this.twAddMoney = tween(this.lb_addMoney.node).to(0.2, { scale: new Vec3(1.5, 1.5, 1.5) }).to(0.2, { scale: Vec3.ONE }).delay(0.5).call(() => {
            this.lb_addMoney.node.active = false;
        }).start()
        this.lb_money.targetNumber = this.money
        this.lb_money.startRoll();
        // this.lb_money.string = this.money.toFixed(0) + ""
        if (this.coinEffect) {
            var effectCoinCount = (changeNum / GameConfig.config.perFloorScore) * this.coinEffect.poolSize >> 0;
            // this.playCoinFly(effectCoinCount)
        }
    }
    public showContinue() {
        this.continute.active = true;
        if (this.twBar) {
            this.twBar.stop();
        }
        // this.twStar.stop();
        if (!this.twStar) {
            this.twStar = tween(this.continueStar).to(0.3, { scale: new Vec3(1.5, 1.5, 1.5) }).to(0.3, { scale: Vec3.ONE }).union().repeatForever().start()
        }
        var soundPerfect = Math.ceil(this.rate / 2);
        if (soundPerfect > 6) {
            soundPerfect = 6;
        }
        AudioMgr.inst.playRemoteSound("perfect_" + soundPerfect, true)
        this.rate++;
        this.continueBar.progress = 1;
        this.lb_continueRate.string = "x" + this.rate;
        tween(this.lb_continueRate.node).to(0.2, { scale: new Vec3(2, 2, 2) }).to(0.2, { scale: Vec3.ONE }).start();
        this.twBar = tween(this.continueBar).to(GameConfig.config.continuteCountTime, { progress: 0 }).call(this.finishContinue.bind(this)).start();
    }
    public hideContinue() {

        this.continute.active = false;
        if (this.twBar) {
            this.twBar.stop();
        }
        if (this.twStar) {
            this.twStar.stop();
            this.twStar = null;
            this.continueStar.scale = Vec3.ONE
        }
    }
    public finishContinue() {
        this.hideContinue();
        this.addMoney(GameConfig.config.getMoneyByQuality(this.towerQuality) * this.rate)
        if (this.maxRate < this.rate) {
            this.maxRate = this.rate;
        }
        this.rate = 1;
    }
    public showGuide(text: string, action: number) {
        this.finger.active = true;
        if (this.twFinger) {
            this.twFinger.stop();
        }
        this.fingerIcon.setPosition(Vec3.ZERO)
        this.lb_guide.string = `<outline color=#0 width=4>${text}</outline>`;
        if (action == 1) {
            this.twFinger = tween(this.fingerIcon).to(0.3, { position: new Vec3(-20, -20, 0) }).to(0.3, { position: new Vec3(0, 0, 0) }).union().repeatForever().start();
        } else {
            this.twFinger = tween(this.fingerIcon).to(0.3, { position: new Vec3(100, 0, 0) }).to(0.3, { position: new Vec3(0, 0, 0) }).union().repeatForever().start();
        }
    }
    public hideGuide() {
        if (this.twFinger) {
            this.twFinger.stop();
        }
        this.finger.active = false;
    }
    public watchState(bol: boolean) {
        this.cameraUI.active = bol;
    }
    public playCoinFly(num: number) {
        if (num > this.coinEffect.poolSize) {
            num = this.coinEffect.poolSize
        }
        this.coinEffect.playCoinFlyEffect(num)
    }
    public setCoinBasePos(fromPos: Vec3) {
        this.coinEffect.fromPos = fromPos;
    }
    public openRank() {
        if (Platform.isWX()) {
            AudioMgr.inst.playRemoteSound("usermanual", true)
            UImanager.showLoading(true)
            Platform.getRank().then(() => {
                UImanager.showWin("RankWin", GlobalData.rank)
                UImanager.showLoading(false)
            })
        }
    }
    public openSetWin() {
        UImanager.showWin("MenuWin", this.gameCtrl)
    }
}


