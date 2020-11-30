import { ITEMS_TYPE_LIST } from "./Config/ItemsConfig";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Game from "./Game";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Item extends cc.Component {

    @property(cc.Sprite)
    sp: cc.Sprite = null;
    @property(cc.SpriteAtlas)
    atlas: cc.SpriteAtlas = null;
    @property(cc.CircleCollider)
    collider: cc.CircleCollider = null;

    private _isPause: boolean = false;
    private _data = null;
    public get data() {
        return this._data;
    }

    onLoad() {
        // cc.director.on("upSpeed", this._onUpSpeed, this);
        cc.director.on("pauseGame", this._onPauseGame, this);
        cc.director.on("resumeGame", this._onResumeGame, this);
    }

    init(levelConfig, data) {
        this._data = data;
        // if (Game.itemMoveSpeed < levelConfig.moveSpeed) {
        Game.itemMoveSpeed = levelConfig.moveSpeed;
        // }
        this.sp.spriteFrame = this.atlas.getSpriteFrame(this._data.id);
        this.collider.radius = this.sp.node.width / 2
        this.sp.node.angle = Game.instance.getRangeRandom(0, 360);
        cc.tween(this.sp.node)
            .repeatForever(
                cc.tween()
                    .by(1.5, { angle: 45 })
            ).start();
    }

    // _onUpSpeed() {
    //     Game.itemMoveSpeed += 8;
    // }

    _onResumeGame() {
        this._isPause = false;
    }

    _onPauseGame() {
        this._isPause = true;
    }

    update(dt) {
        if (this._isPause) {
            return;
        }

        if (this.node.y < -(cc.view.getVisibleSize().height / 2) - 50) {
            Game.instance.poolMng.returnItemsPool(this.node);
            return;
        }

        this.node.y -= Game.itemMoveSpeed * dt;
    }
}
