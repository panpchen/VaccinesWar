// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Game from "./Game";
import Item from "./Item";

const { ccclass, property } = cc._decorator;
const TOTAL_LIFE = 100;

@ccclass
export default class Player extends cc.Component {

    @property(cc.Animation)
    ani: cc.Animation = null;
    @property(cc.Animation)
    resultAni: cc.Animation = null;

    private _curLife: number = TOTAL_LIFE;
    private _isMove: boolean = false;
    private _isDead: boolean = false;
    public get isDead() {
        return this._isDead;
    }
    private _haveSafeHat: boolean = false;
    public get haveSafeHat() {
        return this._haveSafeHat;
    }

    onLoad() {
        this.ani.on("finished", this._onAniFinished, this);
        this.resultAni.on("finished", this._onAniFinished, this);
    }

    init() {
        this._curLife = TOTAL_LIFE;
        this._isDead = false;
        this.playAni("playerIdle");
        this._haveSafeHat = false;
        this.resultAni.node.active = false;
    }

    onTouchMoveEvt() {
        if (this._isDead) {
            return;
        }
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
            if (this._curLife > 0 && !this._haveSafeHat) {
                this.playAni("playerHurt");
                this._curLife -= item.data.damage;
                Game.instance.showHitScore(item.node);
                Game.instance.lifeBar.updateLife(this._curLife, this._curLife / TOTAL_LIFE);
                if (this._curLife <= 0) {
                    this._dead();
                }
            }
        }
    }

    _dead() {
        this._isDead = true;
        this.playAni("playerDie");
        Game.instance.clearAllItems();
        Game.instance.touchArea.active = false;
        this.scheduleOnce(() => {
            this.resultAni.node.active = true;
            this.resultAni.play();
        }, 0.7);
        Game.instance.setPauseGame(true);
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

    takeSafeHat() {
        this._haveSafeHat = true;
        Game.instance.player.playAni("takeSafeHat");
        this.scheduleOnce(() => {
            this._haveSafeHat = false;
            this.playAni("playerIdle");
        }, 15);
    }
}
