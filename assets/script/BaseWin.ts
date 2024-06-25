import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BaseWin')
export class BaseWin extends Component {
    
    start() {

    }

    update(deltaTime: number) {

    }
    public showWin(...data: any) {
        this.node.active = true;
    }
    closeWin() {
        this.node.active = false;
    }
}


