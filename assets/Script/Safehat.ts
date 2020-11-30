import Game from "./Game";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { UIManager, UIType } from "./UIManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Safehat extends cc.Component {

    @property(cc.Node)
    light: cc.Node = null;
    @property(cc.Node)
    hat: cc.Node = null;

    onLoad() {
        cc.tween(this.light)
            .repeatForever(
                cc.tween()
                    .by(0.2, { angle: 30 })
            )
            .start();
        cc.tween(this.hat)
            .repeatForever(
                cc.tween()
                    .to(0.2, { scale: 1 })
                    .to(0.2, { scale: 0.8 })
            )
            .start();
    }

    onClickGet() {
        UIManager.instance.showUI(UIType.SafeHatGetUI);
        Game.instance.setPauseGame(true);
        this.node.active = false;
    }

}
