import {CanvasSize} from "../src/CanvasSize.js"

export class myutil{
    static mod2PiPositive(x) {
        return (((x % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI)) / Math.PI;
    }

    static relative2absolute(xPercent, yPercent){
        
        if(xPercent < 0 || xPercent > 1 || yPercent < 0 || yPercent > 1){
            console.log(`input of relative2absolute (${xPercent}, ${yPercent}) are not percentages.`);
            return [-1];
        }

        return [xPercent * CanvasSize.getSize()[0], yPercent * CanvasSize.getSize()[1]];
    }

    static absolute2Relative(xAbsolute, yAbsolute){

        if(xAbsolute < 0 || xAbsolute > CanvasSize.getSize()[0] || yAbsolute < 0 || yAbsolute > CanvasSize.getSize()[1]){
            console.log(`input of absolute2Relative (${xAbsolute}, ${yAbsolute}) is not valid position.`);
            return [-1];
        }

        return [xAbsolute / CanvasSize.getSize()[0], yAbsolute / CanvasSize.getSize()[1]];
    }
}