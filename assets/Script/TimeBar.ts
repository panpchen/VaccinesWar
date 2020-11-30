// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Game from "./Game";
import { UIManager, UIType } from "./UIManager";

const { ccclass, property } = cc._decorator;

const TOTALTIME: number = 120;

@ccclass
export default class TimeBar extends cc.Component {

    @property(cc.ProgressBar)
    bar: cc.ProgressBar = null;
    @property(cc.Node)
    subBar: cc.Node = null;
    @property(cc.Label)
    timeLabel: cc.Label = null;

    private _curTime: number = 0;
    public get curTime() {
        return this._curTime;
    }

    onLoad() {
        this.clear();
    }

    startCount() {
        this._curTime = TOTALTIME;
        this.schedule(() => {
            if (this._curTime <= 0) {
                this.unscheduleAllCallbacks();
                cc.director.emit("gameOver");
                return;
            }
            if (this._curTime % 15 == 0 && this._curTime != TOTALTIME) {
                cc.director.emit("upSpeed");
            }

            if (this.curTime % 25 == 0 && !Game.instance.player.haveSafeHat && this._curTime != TOTALTIME) {
                if (Game.isFirstHaveSafeHat) {
                    UIManager.instance.showUI(UIType.SafeHatUI);
                    Game.instance.setPauseGame(true);
                    Game.isFirstHaveSafeHat = false;
                } else {
                    Game.instance.showSafeHat();
                }
            }
            this._curTime--;
            this.timeLabel.string = Game.instance.countDownFormat(this._curTime);
            let v = this._curTime / TOTALTIME;
            this.bar.node.getComponent("progressBarMoveEffect").updateProgress(v, (num) => {
                let x = this.subBar.width - 10;
                const limitX = 117;
                if (x <= limitX) {
                    x = limitX;
                }
                this.timeLabel.node.setPosition(cc.v2(x, this.timeLabel.node.y));
            });
        }, 1, cc.macro.REPEAT_FOREVER, 1);
    }

    clear() {
        this.unscheduleAllCallbacks();
        this.timeLabel.string = Game.instance.countDownFormat(TOTALTIME);
        this.timeLabel.node.setPosition(cc.v2(this.subBar.width - 10, this.timeLabel.node.y));
        this.bar.progress = 1;
        this._curTime = 0;
    }
}
