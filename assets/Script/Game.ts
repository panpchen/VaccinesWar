// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Player from "./Player";
import { ITEMS_TYPE_LIST } from "./Config/ItemsConfig";
import PoolMng from "./PoolMng";
import Item from "./Item";
import TimeBar from "./TimeBar";
import LifeBar from "./LifeBar";
import { levelConfig } from "./Config/LevelConfig";
import { UIManager, UIType } from "./UIManager";
import Safehat from "./Safehat";
import Score from "./Score";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {
    @property(cc.Node)
    itemsParent: cc.Node = null;
    @property(Player)
    player: Player = null;
    @property(PoolMng)
    poolMng: PoolMng = null;
    @property(TimeBar)
    timeBar: TimeBar = null;
    @property(LifeBar)
    lifeBar: LifeBar = null;
    @property(Safehat)
    safehat: Safehat = null;
    @property(cc.Node)
    touchArea: cc.Node = null;

    public static instance: Game = null;
    private _spawnTime: number = 0;
    public static itemMoveSpeed: number = 0;
    public static isFirstHaveSafeHat: boolean = true;

    onLoad() {
        Game.instance = this;
        cc.director.on("gameStart", this._startGame.bind(this));
        cc.director.on("gameOver", this._endGame.bind(this));
        cc.director.on("upSpeed", this._onUpSpeed.bind(this));
    }

    _startGame() {
        this._spawnTime = levelConfig.spawnTime;
        this.poolMng.init();
        this.timeBar.startCount();
        this.player.node.setPosition(cc.v2(0, this.player.node.y));
        this.safehat.node.active = false;
        this.touchArea.active = true;
        this.player.init();
        this.clearAllItems();
        this._generateItems();
    }

    _generateItems() {
        let list = levelConfig.itemsList;
        list.sort((a, b) => {
            let v = Math.random() > 0.5 ? 1 : -1;
            return v;
        });
        let index = 0;
        this.schedule(() => {
            let item = this.poolMng.createItems();
            item.name = "item";
            item.parent = this.itemsParent;
            const data = ITEMS_TYPE_LIST[list[index]];
            item.getComponent(Item).init(levelConfig, data);

            const limitX = cc.view.getVisibleSize().width / 2 - 50;
            const y = cc.view.getVisibleSize().height / 2 + 50;
            item.setPosition(cc.v2(this.getRangeRandom(-limitX, limitX), y));

            index++;
            if (index >= list.length - 1) {
                index = list.length - 1
            }
        }, this._spawnTime);
    }

    _onUpSpeed() {
        this.unscheduleAllCallbacks();
        this._spawnTime -= 0.2;
        if (this._spawnTime <= 0.5) {
            this._spawnTime = 0.5;
        }
        this._generateItems();
        cc.error(this._spawnTime);
    }

    setPauseGame(isPause) {
        const scheduler = cc.director.getScheduler();
        if (isPause) {
            scheduler.pauseTarget(this);
            scheduler.pauseTarget(this.timeBar);
        } else {
            scheduler.resumeTargets([this, this.timeBar]);
        }
        cc.director.emit("pauseGame");
    }

    showHitScore(item: cc.Node) {
        let score = this.poolMng.showScore();
        score.parent = this.itemsParent;
        let worldPos = score.parent.convertToWorldSpaceAR(item.position);
        let localPos = this.itemsParent.convertToNodeSpaceAR(worldPos);
        score.setPosition(cc.v2(localPos.x, localPos.y + 40));
        const sc: Score = score.getComponent(Score);
        sc.showScore(item.getComponent(Item).data.damage);
    }

    getRangeRandom(min, max) {
        return Math.random() * (max - min + 1) + min;
    }

    countDownFormat(sec: number) {
        let nowM = Math.floor(sec % 3600 / 60);
        let nowS = Math.floor(sec % 60);
        let nowMStr = nowM.toString();
        let nowSStr = nowS.toString();
        if (nowM < 10) {
            nowMStr = `0${nowM}`;
        }
        if (nowS < 10) {
            nowSStr = `0${nowS}`;
        }
        return nowMStr + ":" + nowSStr;
    }

    _endGame() {
        this.unscheduleAllCallbacks();
        this.timeBar.clear();
        this.lifeBar.clear();
        this._spawnTime = 0;
        Game.itemMoveSpeed = 0;
        UIManager.instance.showUI(UIType.ResultUI);
    }

    clearAllItems() {
        let list = this.itemsParent.children;
        for (let i = list.length - 1; i >= 0; i--) {
            this.poolMng.returnItemsPool(list[i]);
        }
    }

    showSafeHat() {
        if (this.safehat.node.active) {
            return;
        }
        this.safehat.node.active = true;
        const pos = cc.v2(this.getRangeRandom(-350, 350), this.getRangeRandom(-600, 600));
        this.safehat.node.setPosition(pos);
        this.scheduleOnce(() => {
            this.safehat.node.active = false;
        }, 10);
    }
}
