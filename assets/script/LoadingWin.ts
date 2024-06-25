import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LoadingWin')
export class LoadingWin extends Component {
    @property(Node)
    public loadingIcon: Node;
    start() {

    }

    update(deltaTime: number) {
        this.loadingIcon.angle += deltaTime*100;
    }
}


