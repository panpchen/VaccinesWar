// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import LevelBase from "./LevelBase";
import TimeBar from "./TimeBar";
import { UIManager, UIType } from "./UIManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LevelFind extends LevelBase {
  @property
  levelId: number = 0;
  @property(TimeBar)
  timeBar: TimeBar = null;
  @property(cc.Node)
  tipBtn: cc.Node = null;
  @property(cc.Node)
  itemParent: cc.Node = null;
  @property(cc.RichText)
  title: cc.RichText = null;
  @property(cc.Node)
  idsParent: cc.Node = null;

  private _allItemList: cc.Node[] = [];
  private _clickItemList: cc.Node[] = [];
  private _idList: cc.Node[] = [];
  private _curClickId: number = 0;

  onLoad() {
    cc.director.on("gameTimeOut", this._gameTimeOut.bind(this));
  }

  init() {
    this.timeBar.startCount();
    this._clickItemList = [];
    this._curClickId = 0;
    this.tipBtn.active = false;
    this._idList = this.idsParent.children;
    this._allItemList = this.itemParent.children;
    this._allItemList.forEach(item => {
      item.on("click", this._callback, this);
      item.getComponent(cc.Button).interactable = true;
    });
    this._idList.forEach(node => {
      node.active = false;
    })
    let color = this.levelId == 1 ? "black" : "white";
    this.title.string = `<color=${color}>此处有<color=red><size=40>${this._allItemList.length}</size></c>处安全隐患，请聪明的你把它找出来呦！</c>`;
  }

  _gameTimeOut() {
    this.tipBtn.active = true;
  }

  _callback(button: cc.Button) {
    this._clickItemList.push(button.node);
    cc.tween(button.node)
      .to(0.2, { scaleX: 2 * button.node.scale })
      .to(0.2, { scaleX: 1 * button.node.scale })
      .start()

    button.interactable = false;
    const idNode = this._idList[this._curClickId];
    idNode.active = true;
    idNode.position = button.node.position;
    this._curClickId++;

    if (this._clickItemList.length == this._allItemList.length) {
      this.timeBar.pauseTime();
      cc.director.emit("gameOver", { remainTime: this.timeBar.remainTime });
    }
  }

  onClickEvent(event, parm) {
    switch (parm) {
      case "showTip":
        const unClickItemList = this._allItemList.filter(
          (v) => { return this._clickItemList.indexOf(v) == -1; }
        );
        cc.Tween.stopAll();
        unClickItemList.forEach(node => {
          node.scaleX = 1;
          cc.tween(node)
            .to(0.2, { scaleX: 2 })
            .to(0.2, { scaleX: 1 })
            .start()
        });
        break;
    }
  }
}
