import {myutil} from "../../lib/myutil.js";

export class InfoBox{
    constructor() {
        this.infoStatus = 't'; // by default prints terrain & ( enemy | seed )
    }


    // left bottom info box
    draw(p5, playBoard) {
        let [boxWidth, boxHeight] = myutil.relative2absolute(0.18, 1 / 4);
        let boxX = myutil.relative2absolute(1 / 128, 0)[0];
        let [paddingX, paddingY] = myutil.relative2absolute(1 / 128, 1 / 72);
        let boxY = playBoard.canvasHeight - boxHeight - paddingY;

        p5.fill(50);
        p5.noStroke();
        p5.rect(boxX, boxY, boxWidth, boxHeight, 10); // 10: corner roundness

        let title;
        let info;

        if(this.infoStatus === 't'){
            title = "General Info";
            info = playBoard.boardObjects.getCellString(playBoard.selectedCell[0], playBoard.selectedCell[1]);
        }else if(this.infoStatus === 'p'){
            title = "Plant Passive";
            info = playBoard.boardObjects.getCell(playBoard.selectedCell[0], playBoard.selectedCell[1]).plant.getPassiveString();
        }else if(this.infoStatus === 'a'){
            title = "Plant Active";
            info = playBoard.boardObjects.getCell(playBoard.selectedCell[0], playBoard.selectedCell[1]).plant.getActiveString();
        }else if(this.infoStatus === 'e'){
            title = "Ecosystem";
            info = playBoard.boardObjects.getCell(playBoard.selectedCell[0], playBoard.selectedCell[1]).getEcoString();
        }

        p5.fill(255);
        p5.textSize(20);
        p5.textAlign(p5.CENTER, p5.TOP);
        p5.text(title, boxX + boxWidth / 2, boxY + paddingY);

        p5.textSize(18);
        p5.textAlign(p5.LEFT, p5.TOP);
        p5.textWrap(p5.WORD);
        p5.text(info, boxX + paddingX, boxY + paddingY + 24, boxWidth - paddingX * 2);

        let arrowSize = myutil.relative2absolute(0.02)[0];
        p5.image(p5.images.get("leftarrow"), boxX + boxWidth/3 - arrowSize/2, boxY - arrowSize - paddingY, arrowSize, arrowSize);
        p5.image(p5.images.get("rightarrow"), boxX + 2*boxWidth/3 - arrowSize/2, boxY - arrowSize - paddingY, arrowSize, arrowSize);
    }

    clickArrow(p5, playBoard){
        // the parameters of arrows are hardcoded now, should refactor later.
        let leftArrowX = 74;
        let rightArrowX = 150.8;
        let arrowY = 494.4;
        let arrowSize = 25.6;
        if(p5.mouseX >= leftArrowX && p5.mouseX < leftArrowX + arrowSize
            && p5.mouseY >= arrowY && p5.mouseY <= arrowY + arrowSize){
            this.infoBoxFSM('p', playBoard);
            return true;
        }
        if(p5.mouseX >= rightArrowX && p5.mouseX < rightArrowX + arrowSize
            && p5.mouseY >= arrowY && p5.mouseY <= arrowY + arrowSize){
            this.infoBoxFSM('n', playBoard);
            return true;
        }
        return false;
    }

    // a finite state machine.
    infoBoxFSM(nextOrPrev, playBoard){
        let cell = playBoard.boardObjects.getCell(playBoard.selectedCell[0], playBoard.selectedCell[1]);

        // terrain & enemy
        if(this.infoStatus === 't'){
            if(nextOrPrev === 'n'){
                if(cell.plant !== null){
                    this.infoStatus = 'p';
                }else{
                    this.infoStatus = 'e';
                }
            }else{
                this.infoStatus = 'e';
            }
            return;
        }

        // plant passive skill
        if(this.infoStatus === 'p'){
            if(nextOrPrev === 'n'){
                this.infoStatus = 'a';
            }else{
                this.infoStatus = 't';
            }
            return;
        }

        // plant active skill
        if(this.infoStatus === 'a'){
            if(nextOrPrev === 'n'){
                this.infoStatus = 'e';
            }else{
                this.infoStatus = 'p';
            }
            return;
        }

        // ecosystem
        if(this.infoStatus === 'e'){
            if(nextOrPrev === 'n'){
                this.infoStatus = 't';
            }else{
                if(cell.plant !== null){
                    this.infoStatus = 'a';
                }else{
                    this.infoStatus = 't';
                }
            }
            return;
        }
    }
}