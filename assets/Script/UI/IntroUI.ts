// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { UIManager, UIType } from "../UIManager";
import BaseUI from "./BaseUI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class IntroUI extends BaseUI {

    clickGameStart() {
        UIManager.instance.hideAll();
        cc.director.emit("gameStart");
    }

}
