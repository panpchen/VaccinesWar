// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseUI from "./BaseUI";
import { UIManager, UIType } from "../UIManager";
import { SendMsg } from "../Net/SendMsg";
import { Constants } from "../Config/Constants";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ResultUI extends BaseUI {
    @property(cc.Node)
    starNodes: cc.Node[] = [];

    init() {
        // if (life <= 0) {
        //     this.aniList[2].active = true;
        // } else if (life > 0 && life < 90) {
        //     this.aniList[1].active = true;
        // } else {
        //     this.aniList[0].active = true;
        // }

        SendMsg.reqSaveAssessStatistics(Constants.AssessStatisticsJson);
    }

    clickBackGame() {
        this.hide();
        UIManager.instance.showUI(UIType.MenuUI);
    }
}
