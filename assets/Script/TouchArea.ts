// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Player from "./Player";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TouchArea extends cc.Component {

    @property(Player)
    player: Player = null;

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoveEvt, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEndEvt, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchEndEvt, this);
    }

    _onTouchMoveEvt(event: cc.Event.EventTouch) {
        if (this.player.isDead) {
            return;
        }
        let localPos = this.node.parent.convertToNodeSpaceAR(event.getLocation());
        let newPos = cc.v2(localPos.x, this.node.y);
        if (newPos.x > cc.view.getVisibleSize().width / 2 - 50 || newPos.x < -(cc.view.getVisibleSize().width / 2) + 50) {
            return;
        }
        this.node.setPosition(newPos);
        this.player.onTouchMoveEvt();
    }

    _onTouchEndEvt() {
        this.player.onTouchEndEvt();
    }
}
