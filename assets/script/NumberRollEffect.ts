import { _decorator, Label, Vec3, Tween, tween, game } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('NumberRollEffect')
export class NumberRollEffect extends Label {
    // 目标数字
    @property
    targetNumber: number = 0;

    // 滚动速度
    @property
    rollSpeed: number = 10;

    // 当前数字
    private _currentNumber: number = 0;

    // 是否正在滚动
    private _isRolling: boolean = false;

    // 开始滚动数字
    startRoll() {
        if (!this._isRolling) {
            this._isRolling = true;
            this._rollToTargetNumber();
        }
    }

    // 数字滚动逻辑
    private _rollToTargetNumber() {
        const direction = this.targetNumber > this._currentNumber ? 1 : -1;
        const rollAmount = Math.ceil(Math.abs(this.targetNumber - this._currentNumber) / this.rollSpeed);

        for (let i = 0; i < rollAmount; i++) {
            this._currentNumber += direction;
            this.string = this._currentNumber.toString();
            if (this._currentNumber >= this.targetNumber) {
                this._currentNumber = this.targetNumber;
                this.string = this.targetNumber.toString();
                this._isRolling = false;
                break;
            }
        }

        if (this._isRolling) {
            tween(this)
                .delay(0.05)
                .call(this._rollToTargetNumber.bind(this))
                .start();
        }
    }
}