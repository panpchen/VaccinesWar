// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Game from "../Game";
import PopBaseUI from "./PopBaseUI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PassUI extends PopBaseUI {
    @property(cc.Label)
    timeLabel: cc.Label = null;

    init(data) {
        this.timeLabel.string = `用时：${Game.instance.countDownFormat(data.remainTime)}`;
    }

    clickNextLevel() {
        this.hide();
        cc.director.emit("gameNextLevel");
    }
}
