// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TimeBar from "./TimeBar";
import { UIManager, UIType } from "./UIManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LevelBase extends cc.Component {
    init() { }

    onBaseClickEvent(event, parm) {
        switch (parm) {
            case "showHelp":
                UIManager.instance.showUI(UIType.IntroUI);
                break;
        }
    }

}
