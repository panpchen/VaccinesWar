// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseUI from "./BaseUI";
import { UIManager, UIType } from "../UIManager";
import Game from "../Game";
import { SendMsg } from "../Net/SendMsg";
import { Constants } from "../Config/Constants";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ResultUI extends BaseUI {
    @property(cc.Sprite)
    heart: cc.Sprite = null;
    @property(cc.Label)
    heartLabel: cc.Label = null;
    @property(cc.Node)
    aniList: cc.Node[] = [];

    init() {
        const life = Game.instance.lifeBar.curLife;
        this.heartLabel.string = `生命值${life}%`;
        this.heart.fillStart = life / 100;
        this.aniList.forEach(node => {
            node.active = false;
        })
        if (life <= 0) {
            this.aniList[2].active = true;
        } else if (life > 0 && life < 90) {
            this.aniList[1].active = true;
        } else {
            this.aniList[0].active = true;
        }

        SendMsg.reqSaveAssessStatistics(Constants.AssessStatisticsJson);
    }

    clickAgainGame() {
        this.hide();
        cc.director.emit("gameStart");
    }

    clickBackGame() {
        this.hide();
        UIManager.instance.showUI(UIType.MenuUI);
    }
}
