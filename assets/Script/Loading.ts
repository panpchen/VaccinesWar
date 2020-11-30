import { Constants } from "./Config/Constants";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Loading extends cc.Component {

  @property(cc.Sprite)
  fillSp: cc.Sprite = null;
  @property(cc.Label)
  label: cc.Label = null;
  @property(cc.Node)
  subBar: cc.Node = null;
  @property(cc.Node)
  zoomIcon: cc.Node = null;

  onLoad() {
    cc.macro.ENABLE_MULTI_TOUCH = false;
    const manager = cc.director.getCollisionManager();
    manager.enabled = true;

    Constants.storeParmForAssessStatistics();

    // manager.enabledDebugDraw = true;
    this.preloadGameScene();
  }

  preloadGameScene() {
    cc.director.preloadScene('game', (completeCount, totalCount, item) => {
      let v = completeCount / totalCount;
      this.fillSp.node.getComponent("fillEffect").updateProgress(v, (num) => {
        let x = this.subBar.width * num;
        this.zoomIcon.setPosition(cc.v2(x, this.zoomIcon.y));
        this.fillSp.fillStart = num;
        this.label.string = `${Math.floor(v * 100)}%`;
      });
    }, () => {
      cc.director.loadScene("game");
      cc.log('game scene preloaded');
    });

  }
}
