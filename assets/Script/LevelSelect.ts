// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { PicTopicConfig } from "./Config/PicTopicConfig";
import LevelBase from "./LevelBase";
import { UIManager, UIType } from "./UIManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LevelSelect extends LevelBase {
    @property(cc.SpriteFrame)
    picList: cc.SpriteFrame[] = [];
    @property(cc.Node)
    btnList: cc.Node[] = [];
    @property(cc.RichText)
    pageNumLabel: cc.RichText = null;
    @property(cc.Label)
    titleLabel: cc.Label = null;
    @property(cc.Sprite)
    pic: cc.Sprite = null;
    @property(cc.Node)
    errorTip: cc.Node = null;

    private _curPicId = 0;
    private get curPicId() {
        return this._curPicId;
    }
    private set curPicId(v) {
        this._curPicId = v;
        if (this._curPicId > this._totalRightNum - 1) {
            this._curPicId = this._totalRightNum - 1;
        }
        if (this._curPicId < 0) {
            this._curPicId = 0;
        }
    }
    private _topicData = null;
    private _totalRightNum = 0;
    private _curAnswerNum = 0;

    init() {
        super.init();
        this._topicData = null;
        this._totalRightNum = this.picList.length;
        this.errorTip.opacity = 0;
        this.curPicId = 0;
        this._loadPic();
    }

    _loadPic() {
        this._topicData = PicTopicConfig.getConfigById(this.curPicId);
        this.pic.spriteFrame = this.picList[this._topicData.id];
        this.pic.node.scale = this._topicData.scale;
        this.titleLabel.string = this._topicData.title;
    }

    update() {
        this.pageNumLabel.string = `<color=#FF5400>${this._topicData.id + 1}</c><color=#00C412>/${this.picList.length}</color>`;
        if (this._curAnswerNum == this._totalRightNum && this._totalRightNum != 0) {
            this._curAnswerNum = 0;
            cc.director.emit("gameOver");
        }
    }

    _showIcon(isRight) {
        if (!isRight) {
            this.errorTip.opacity = 255;
            cc.Tween.stopAll();
            cc.tween(this.errorTip)
                .delay(1)
                .to(0.2, { opacity: 0 })
                .start()
        }
    }

    _loadNextPic() {
        this.curPicId++;
        this._loadPic();
    }

    _loadLastPic() {
        this.curPicId--;
        this._loadPic();
    }

    onClickEvent(event, parm) {
        let isRight = false;

        switch (parm) {
            case "leftSlide":
                this._loadLastPic();
                break;
            case "rightSlide":
                this._loadNextPic();
                break;
            case "yes":
                isRight = this._topicData.answer == "right";
                break;
            case "no":
                isRight = this._topicData.answer == "wrong";
                break;
        }

        if (parm == "yes" || parm == "no") {
            this._showIcon(isRight);
            const btn = event.target.getComponent(cc.Button);
            btn.interactable = false;
            if (isRight) {
                this.scheduleOnce(() => {
                    this._loadNextPic();
                    btn.interactable = true;
                }, 0.3);
                this._curAnswerNum++;
            } else {
                this.scheduleOnce(() => {
                    btn.interactable = true;
                }, 0.3);
            }
        }
    }
}
