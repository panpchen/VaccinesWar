// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Game from "./Game";

const { ccclass, property } = cc._decorator;

const TOTALTIME: number = 30;

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
	public get remainTime() {
		return TOTALTIME - this._curTime;
	}

	startCount() {
		this.clear();
		this._curTime = TOTALTIME;
		this.schedule(() => {
			this._curTime--;
			this.timeLabel.string = Game.instance.countDownFormat(this._curTime);
			let v = this._curTime / TOTALTIME;
			this.bar.node.getComponent("progressBarMoveEffect").updateProgress(v, (num) => {
				let x = this.subBar.width - 10;
				const limitX = 130;
				if (x <= limitX) {
					x = limitX;
				}
				this.timeLabel.node.setPosition(cc.v2(x, this.timeLabel.node.y));
			});
			if (this._curTime <= 0) {
				this.unscheduleAllCallbacks();
				cc.director.emit("gameTimeOut");
				return;
			}
		}, 1, cc.macro.REPEAT_FOREVER, 1);
	}

	pauseTime() {
		cc.director.getScheduler().pauseTarget(this);
	}

	resumeTime() {
		cc.director.getScheduler().resumeTarget(this);
	}

	clear() {
		this.unscheduleAllCallbacks();
		this._curTime = 0;
		this.timeLabel.string = Game.instance.countDownFormat(TOTALTIME);
		this.timeLabel.node.setPosition(cc.v2(290, this.timeLabel.node.y));
		this.bar.progress = 1;
	}
}
