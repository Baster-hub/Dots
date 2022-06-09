class DotsManager {
    dotsArray = [];
    side;

    constructor(side) {
        this.side = side;
    }

    getGrid(rows, columns) {
        let result = Array.from(Array(rows), () => new Array(columns).fill(1));

        this.dotsArray.forEach((item) => {
            if (item.canUse) {
                result[item.dotRow - 1][item.dotColumn - 1] = item;
            }
        });

        return result;
    }

    checkDots(array) {
        return this.dotsArray.filter((item) => !item.check(array));
    }

    addNewDots(dot, enemyDotsArray, redGrid, blueGrid) {

        if (
            !this.dotsArray.some((item) => item.id == dot.id) &&
            !enemyDotsArray.some((item) => item.id == dot.id) &&
            dot.dotRow > 0 &&
            dot.dotColumn > 0 &&
            redGrid[dot.dotRow - 1][dot.dotColumn - 1] <= 0 &&
            blueGrid[dot.dotRow - 1][dot.dotColumn - 1] <= 0
        ) {
            this.dotsArray.push(dot);
            return true;
        }
        return false;
    }

    draw(ctx) {
        ctx.fillStyle = this.side;

        this.dotsArray.forEach((item) => {
            item.draw(ctx);
        });
    }
}
