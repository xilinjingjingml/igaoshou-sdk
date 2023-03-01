import BaseUI from "../../../../start/script/base/BaseUI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class QualifyingLevelMode extends BaseUI {
    star1: cc.Node = null
    star2: cc.Node = null
    star3: cc.Node = null
    star4: cc.Node = null
    star5: cc.Node = null

    starPos: cc.Vec2[] = []

    content: cc.Node = null
    maxStar: number = 0
    onLoad() {
        this.content = cc.find("node/content", this.node)
        this.starPos[1] = cc.v2(this.getNode("node/content/star1").getPosition().x, this.getNode("node/content/star1").getPosition().y)
        this.starPos[2] = cc.v2(this.getNode("node/content/star2").getPosition().x, this.getNode("node/content/star2").getPosition().y)
        this.starPos[3] = cc.v2(this.getNode("node/content/star3").getPosition().x, this.getNode("node/content/star3").getPosition().y)
        this.starPos[4] = cc.v2(this.getNode("node/content/star4").getPosition().x, this.getNode("node/content/star4").getPosition().y)
        this.starPos[5] = cc.v2(this.getNode("node/content/star5").getPosition().x, this.getNode("node/content/star5").getPosition().y)
    }

    onClose() {
    }

    initEvent() {

    }

    initButton() {

    }

    initData() {

    }

    setParam(param: any) {
        cc.log("QualifyingLevelMode setParam", param)
        this.param = param
        let grade: IGradeData = param.grade
        let finalGrade: IGradeData = param.finalGrade

        this.setStars(grade.maxStar, grade.star)
        this.setLabelValue("duanwei/tip", this.param.tip ? this.param.tip : "")
        this.setSpriteFrame("duanwei/name", "image/qualifyingIcons/name_lv" + (grade.level >= 25 ? 25 : grade.level))
        this.setSpriteFrame("node/content/majorIcon_bg", "image/qualifyingIcons/major_icon_lv" + grade.major)
        this.setSpriteFrame("node/content/majorIcon", "image/qualifyingIcons/major_lv" + grade.major)

        if (finalGrade) {
            cc.tween(this.node)
                .delay(1)
                .call(() => {
                    if (finalGrade.major != grade.major || finalGrade.minor != grade.minor) {
                        let majorIcon_bg = cc.find("node/content/majorIcon_bg", this.node)
                        let majorIcon = cc.find("node/content/majorIcon", this.node)
                        let node = cc.find("node", this.node)
                        cc.tween(node)
                            .to(0.2, { scaleX: 0 })
                            .call(() => {
                                this.setSpriteFrame("duanwei/name", "image/qualifyingIcons/name_lv" + (finalGrade.level >= 25 ? 25 : finalGrade.level))
                                this.setSpriteFrame("node/content/majorIcon_bg", "image/qualifyingIcons/major_icon_lv" + finalGrade.major)
                                this.setSpriteFrame("node/content/majorIcon", "image/qualifyingIcons/major_lv" + finalGrade.major)
                                cc.tween(this.content)
                                    .to(0.1, { scale: 1.5 })
                                    .start()
                            })
                            .to(0.1, { scaleX: 1 })
                            .delay(0)
                            .call(() => {
                                cc.tween(this.content)
                                    .to(0.2, { scale: 1 }, { easing: "sineIn" })
                                    .start()
                            })
                            .delay(0.2)
                            .call(() => {
                                majorIcon_bg.active = true
                                cc.tween(majorIcon_bg)
                                    .to(0.2, { scale: 5, opacity: 0 })
                                    .start()
                            })
                            .start()
                    }
                })
                .delay(0.2)
                .call(() => {
                    this.setStars(finalGrade.maxStar, 0)
                })
                .delay(0.2)
                .call(() => {
                    this.starsAnimationStart(finalGrade.star)
                })
                .start()
        }
    }

    setStars(maxStar: number = 0, stars: number = 0) {
        this.maxStar = maxStar
        if (maxStar > 5) {
            this.setActive("node/content/star1", false)
            this.setActive("node/content/star2", false)
            this.setActive("node/content/star3", false)
            this.setActive("node/content/star4", false)
            this.setActive("node/content/star5", false)
            this.setActive("node/content/totalStar", true)
            this.setLabelValue("node/content/totalStar/num", "x" + stars)
        } else {
            this.setActive("node/content/totalStar", false)
            if (maxStar == 3) {
                this.setNodePosition("node/content/star1", this.starPos[2])
                this.setNodePosition("node/content/star2", this.starPos[3])
                this.setNodePosition("node/content/star3", this.starPos[4])
            } else if (maxStar == 4) {
                let x = this.starPos[1].x + (this.starPos[2].x - this.starPos[1].x) / 2
                let y = this.starPos[1].y + (this.starPos[2].y - this.starPos[1].y) / 2
                this.setNodePosition("node/content/star1", cc.v2(x, y))

                x = this.starPos[2].x + (this.starPos[3].x - this.starPos[2].x) / 2
                y = this.starPos[2].y + (this.starPos[3].y - this.starPos[2].y) / 2
                this.setNodePosition("node/content/star2", cc.v2(x, y))

                x = this.starPos[3].x + (this.starPos[4].x - this.starPos[3].x) / 2
                y = this.starPos[3].y + (this.starPos[4].y - this.starPos[3].y) / 2
                this.setNodePosition("node/content/star3", cc.v2(x, y))

                x = this.starPos[4].x + (this.starPos[5].x - this.starPos[4].x) / 2
                y = this.starPos[4].y + (this.starPos[5].y - this.starPos[4].y) / 2
                this.setNodePosition("node/content/star4", cc.v2(x, y))
            }

            for (let i = 1; i <= 5; i++) {
                if (i <= maxStar) {
                    this.setActive("node/content/star" + i, true)
                } else {
                    this.setActive("node/content/star" + i, false)
                }

                if (i <= stars) {
                    this.setActive("node/content/star" + i + "/star", true)
                } else {
                    this.setActive("node/content/star" + i + "/star", false)
                }
            }
        }
    }

    starsAnimationStart(endStars: number = 0) {
        if (this.maxStar > 5) {
            this.setLabelValue("node/content/totalStar/num", "x" + endStars)
        } else {
            for (let i = 1; i <= endStars; i++) {
                let star = this.getNode("node/content/star" + i + "/star")
                if (!star.active) {
                    cc.tween(star)
                        .delay(0.4 * i)
                        .set({ active: true, scale: 3 })
                        .to(0.2, { scale: 1 })
                        .start()
                }
            }
        }
    }
}
