import Game from "../Game";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseUI from "./BaseUI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SafeHatUI extends BaseUI {

    @property(cc.Node)
    light: cc.Node = null;
    @property(cc.Node)
    safeHat: cc.Node = null;

    onLoad() {
        super.onLoad();
        cc.tween(this.light)
            .repeatForever(
                cc.tween()
                    .to(0.8, { scale: 1.5 })
                    .to(0.8, { scale: 0.8 })
            )
            .start();
        cc.tween(this.safeHat)
            .repeatForever(
                cc.tween()
                    .by(0.2, { angle: -30 })
                    .by(0.2, { angle: 30 })

            )
            .start();
    }

    onClickClose(event, parm) {
        Game.instance.setPauseGame(false);
        cc.director.emit("resumeGame");

        if (parm == "get") {
            Game.instance.player.takeSafeHat();
        } else {
            Game.instance.showSafeHat();
        }
        this.node.active = false;
    }
}
