// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class LifeBar extends cc.Component {

    @property(cc.ProgressBar)
    bar: cc.ProgressBar = null;
    @property(cc.Node)
    subBar: cc.Node = null;
    @property(cc.Label)
    lifeLabel: cc.Label = null;

    private _curLife: number = 0;
    public get curLife() {
        return this._curLife;
    }

    onLoad() {
        this.clear();
    }

    updateLife(curLife, ratio) {
        if (ratio <= 0) {
            this.lifeLabel.string = "0%";
            this._curLife = 0;
            return;
        }
        this._curLife = curLife;
        this.lifeLabel.string = `${curLife}%`;
        this.bar.node.getComponent("progressBarMoveEffect").updateProgress(ratio, (num) => {
            let x = -this.subBar.width + 10;
            const limitX = -117;
            if (x >= limitX) {
                x = limitX;
            }
            this.lifeLabel.node.setPosition(cc.v2(x, this.lifeLabel.node.y));
        });
    }

    clear() {
        this.lifeLabel.string = "100%";
        this.bar.progress = 1;
        this.lifeLabel.node.setPosition(cc.v2(-this.subBar.width + 10, this.lifeLabel.node.y));
    }
}
