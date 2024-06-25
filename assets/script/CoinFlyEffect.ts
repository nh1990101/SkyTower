import { _decorator, Node, instantiate, Prefab, Vec3, Tween, tween, game, Component, Vec2, random } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CoinFlyEffect')
export class CoinFlyEffect extends Component {
    @property(Prefab)
    coinPrefab: Prefab = null; // 金币预制件

    @property(Node)
    backpackNode: Node = null; // 背包节点

    @property
    poolSize: number = 2; // 对象池大小

    private pool: Node[] = []; // 金币对象池
    public fromPos: Vec3;
    onLoad() {
        this.warmup();
    }

    // 预热对象池
    warmup() {
        for (let i = 0; i < this.poolSize; i++) {
            const coin = instantiate(this.coinPrefab);
            coin.active = false; // 创建时禁用节点
            this.pool.push(coin);
            this.node.addChild(coin); // 添加到场景中
        }
    }

    // 从对象池中获取金币
    getCoin(): Node {
        if (this.pool.length > 0) {
            const coin = this.pool.pop();
            coin.active = true; // 激活节点
            return coin;
        }
        return null; // 如果池空，返回null
    }

    // 将金币放回对象池
    returnCoin(coin: Node) {
        coin.active = false; // 禁用节点
        this.pool.push(coin);
    }

    // 播放金币飞入背包的特效
    playCoinFlyEffect(count: number) {
        const backpackPosition = this.backpackNode.getPosition();
        for (let i = 0; i < count; i++) {
            const coin = this.getCoin();
            if (coin) {
                // 设置金币的初始位置
                const startPosition = this.getRandomCoinPosition();
                coin.setPosition(startPosition);
                let fromPos = coin.position.clone();
                let oldPos = coin.position.clone();
                fromPos.y -= 50;
                // 执行动画，飞向背包
                tween(coin).to(0.2, { position: fromPos }).to(0.2, { position: oldPos }).to(0.1, { position: fromPos }).to(0.1, { position: oldPos }).delay(i * 0.1)
                    .to(0.3, { position: backpackPosition })
                    .call(() => {
                        this.returnCoin(coin);
                    }).union()
                    .start();
            }
        }
    }

    // 获取随机金币位置
    getRandomCoinPosition(): Vec3 {
        // 返回一个随机的位置向量
        const x = Math.sin(game.totalTime * Math.random()) * Math.random() * 100;
        const y = Math.sin(game.totalTime * Math.random()) * Math.random() * 50;
        var resultPos = new Vec3(x, y, 0)
        if (this.fromPos) {
            // resultPos.add(this.fromPos)
        }
        return resultPos;
    }

}