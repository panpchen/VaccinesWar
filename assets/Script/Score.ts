// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Game from "./Game";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Score extends cc.Component {

    @property(cc.Label)
    scoreLabel: cc.Label = null;

    showScore(score) {
        this.scoreLabel.string = `-${score}`;
        cc.tween(this.node)
            .to(0.15, { position: cc.v3(this.node.x, this.node.y + 50, this.node.z) }, { easing: "easeOutQuint" })
            .delay(0.3)
            .call(() => { Game.instance.poolMng.returnScorePool(this.node) })
            .start()
    }
}
