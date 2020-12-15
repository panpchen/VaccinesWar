// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Game from "./Game";
import Item from "./Item";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Player extends cc.Component {

    @property(cc.Animation)
    ani: cc.Animation = null;
    @property(cc.Animation)
    private _isMove: boolean = false;

    onLoad() {
        this.ani.on("finished", this._onAniFinished, this);
    }

    init() {
        this.playAni("playerIdle");
    }

    onTouchMoveEvt() {
        if (this.node.x > cc.view.getVisibleSize().width / 2 - 50 || this.node.x < -(cc.view.getVisibleSize().width / 2) + 50) {
            return;
        }
        if (!this._isMove) {
            this.playAni("playerMove");
            this._isMove = true;
        }
    }

    onTouchEndEvt() {
        this._isMove = false;
        this.ani.stop("playerMove");
    }

    playAni(name) {
        this.ani.play(name);
    }

    onCollisionEnter(other, self) {
        if (other.node.name == "item") {
            let item: Item = other.node.getComponent(Item);
            Game.instance.poolMng.returnItemsPool(item.node);
        }
    }

    _onAniFinished(event, state) {
        if (state.name == "playerHurt") {
            this.playAni("playerIdle");
        } else if (state.name == "resultAni") {
            this.scheduleOnce(() => {
                cc.director.emit("gameOver");
            }, 0.5);
        }
    }
}
