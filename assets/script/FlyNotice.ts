import { _decorator, Component, Node, RichText, tween, Tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FlyNotice')
export class FlyNotice extends Component {
    @property(RichText)
    public lb_content: RichText
    public targetPos = new Vec3(0, 300, 0)
    private tw: Tween<Node>
    start() {

    }

    update(deltaTime: number) {

    }
    public showText(content: string) {
        this.lb_content.node.active = true;
        if (this.tw) {
            this.tw.stop();
        }
        this.lb_content.string = content;
        this.lb_content.node.position = Vec3.ZERO;
        this.tw = tween(this.lb_content.node).delay(1).to(0.5, { position: this.targetPos, }).call(() => {
            this.lb_content.node.active = false;
        }).start();
    }
}


