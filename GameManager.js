class GameManager {
    isGameOver = false;
    maxScore;

    #areasManager = new AreasManager();
    #redDots = new DotsManager("red");
    #blueDots = new DotsManager("blue");
    redScore;
    blueScore;
    redGrid;
    blueGrid;

    #DBC;
    #gameField;
    #COLUMNS;
    #ROWS;
    width;
    height;
    ctx;
    endScreen;
    currentSide;
    dotColumn;
    dotRow;

    constructor(
        columns,
        rows,
        distance_between_cells,
        canvas,
        endGameElement,
        currentSide,
        redScore,
        blueScore,
        maxScore
    ) {
        this.#DBC = distance_between_cells;
        this.currentSide = currentSide;
        this.#COLUMNS = columns;
        this.#ROWS = rows;
        this.ctx = canvas.getContext("2d");
        this.endScreen = endGameElement;
        this.width = canvas.width = (this.#COLUMNS + 1) * this.#DBC;
        this.height = canvas.height = (this.#ROWS + 1) * this.#DBC;

        this.#gameField = new GameField(
            columns,
            rows,
            distance_between_cells,
            canvas
        );
        this.#gameField.drawFieldCells(this.ctx);
        this.redScore = redScore;
        this.blueScore = blueScore;
        this.maxScore = maxScore ?? columns * rows;

        this.redGrid = Array.from(Array(this.#ROWS), () =>
            new Array(this.#COLUMNS).fill(0)
        );
        this.blueGrid = Array.from(Array(this.#ROWS), () =>
            new Array(this.#COLUMNS).fill(0)
        );

        console.log(this.maxScore);
    }

    setRowAndColumn(dotRow, dotColumn) {
        if (
            dotRow > 0 &&
            dotRow <= this.#ROWS &&
            dotColumn > 0 &&
            dotColumn <= this.#COLUMNS
        ) {
            this.dotRow = dotRow;
            this.dotColumn = dotColumn;
        } else {
            this.dotRow = -1;
            this.dotColumn = -1;
        }
    }

    arrayLoop(array, func, ...args) {
        for (let i = 0; i < array.length; i++)
            for (let j = 0; j < array[i].length; j++)
                if (typeof array[i][j] == "number")
                    args = func(array, i, j, ...args);
    }

    findNeighboursCCL(array, i, j, linked, nextNum) {
        if (i == 0 || typeof array[i - 1][j] != "number") {
            if (j == 0 || typeof array[i][j - 1] != "number") {
                array[i][j] = nextNum;
                linked[nextNum] = [nextNum];
                nextNum++;

                return [linked, nextNum];
            }

            array[i][j] = array[i][j - 1];
            return [linked, nextNum];
        }

        if (j == 0 || typeof array[i][j - 1] != "number") {
            array[i][j] = array[i - 1][j];
            return [linked, nextNum];
        }

        let min = Math.min(array[i - 1][j], array[i][j - 1]);
        let max = Math.max(array[i - 1][j], array[i][j - 1]);

        array[i][j] = min;

        linked[max] = Array.from(new Set(linked[max].concat(linked[min])));
        linked[min] = Array.from(new Set(linked[min].concat(linked[max])));

        linked[max].forEach((item) => {
            linked[item] = Array.from(
                new Set(linked[item].concat(linked[min]))
            );
        });
        linked[min].forEach((item) => {
            linked[item] = Array.from(
                new Set(linked[item].concat(linked[min]))
            );
        });

        return [linked, nextNum];
    }

    makeAllArea(array, i, j, linked, background) {
        array[i][j] = Math.min(...linked[array[i][j]]);

        if (
            [0, array.length - 1].includes(i) ||
            [0, array[i].length - 1].includes(j)
        )
            background[array[i][j].toString()] = true;

        return [linked, background];
    }

    fillBackground(array, i, j, background) {
        if (background[array[i][j].toString()]) array[i][j] = 0;

        return [background];
    }

    ccl(fakeArray) {
        let tempArray = JSON.parse(JSON.stringify(fakeArray));

        let nextNum = 1;
        let linked = [];
        let background = {};

        this.arrayLoop(tempArray, this.findNeighboursCCL, linked, nextNum);
        this.arrayLoop(tempArray, this.makeAllArea, linked, background);
        this.arrayLoop(tempArray, this.fillBackground, background);

        return tempArray;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.#gameField.draw(
            this.ctx,
            this.currentSide,
            this.dotColumn,
            this.dotRow
        );
        this.#redDots.draw(this.ctx);
        this.#blueDots.draw(this.ctx);
        this.#areasManager.draw(this.ctx);
    }

    checkArea(array, surroundedDots) {
        let key = surroundedDots.reduce((accum, item) => {
            accum.push(array[item.dotRow - 1][item.dotColumn - 1]);
            return accum;
        }, []);

        return array.map((item) =>
            item.map((item2) =>
                key.some((item3) => item3 == item2) || typeof item2 == "object"
                    ? item2
                    : 0
            )
        );
    }

    update(
        tempDot,
        mainDots,
        mainGrid,
        mainScore,
        secondDots,
        secondGrid,
        secondScore,
        mainSide,
        secondSide
    ) {
        if (
            mainDots.addNewDots(
                tempDot,
                secondDots.dotsArray,
                mainGrid,
                secondGrid
            )
        ) {
            this.#areasManager.areasArray = [];
            this.currentSide = secondSide;

            mainGrid = this.ccl(mainDots.getGrid(this.#ROWS, this.#COLUMNS));

            let surroundedSecondDots = secondDots.checkDots(mainGrid);
            mainScore.innerHTML = surroundedSecondDots.length.toString();

            mainGrid = this.checkArea(mainGrid, surroundedSecondDots);

            secondGrid = this.ccl(
                secondDots.getGrid(this.#ROWS, this.#COLUMNS)
            );

            let surroundedMainDots = mainDots.checkDots(secondGrid);
            secondScore.innerHTML = surroundedMainDots.length.toString();

            secondGrid = this.checkArea(secondGrid, surroundedMainDots);

            this.#areasManager.findAllArea(mainGrid, mainSide);
            this.#areasManager.findAllArea(secondGrid, secondSide);
        }
        return [mainGrid, secondGrid];
    }

    gameOver() {
        let winner = +this.redScore.innerHTML > +this.blueScore.innerHTML ? "Red" : "Blue";
        this.endScreen.style.display = "flex";
        this.endScreen.style.color = winner.toLowerCase();
        this.endScreen.lastElementChild.style.display = "grid";
        this.endScreen.lastElementChild.firstElementChild.innerHTML =
            winner + " player win";
    }

    setIsGameOver(mainGrid, secondGrid, mainScore, secondScore) {
        let temp = Array.from(Array(this.#ROWS), () =>
            new Array(this.#COLUMNS).fill(0)
        );

        for (let i = 0; i < temp.length; i++)
            for (let j = 0; j < temp[i].length; j++) {
                temp[i][j] = mainGrid[i][j] || secondGrid[i][j];
            }

        if (
            +mainScore.innerHTML >= this.maxScore ||
            +secondScore.innerHTML >= this.maxScore ||
            !temp.some((item) => item.some((item2) => item2 == 0))
        )
            this.isGameOver = true;
    }

    mouseMove(mouseX, mouseY) {
        if (this.isGameOver) 
            return;
        

        let dotColumn = Math.round(mouseX / this.#DBC);
        let dotRow = Math.round(mouseY / this.#DBC);

        this.setRowAndColumn(dotRow, dotColumn);
        this.draw();
    }

    mouseClick() {
        if (this.isGameOver)
            return;
        
        let tempDot = new Dot(
            this.dotColumn,
            this.dotRow,
            this.#gameField.CIRCLE_RADIUS,
            this.dotRow * this.#COLUMNS + this.dotColumn,
            this.#DBC
        );

        if (this.currentSide == "red") {
            [this.redGrid, this.blueGrid] = this.update(
                tempDot,
                this.#redDots,
                this.redGrid,
                this.redScore,
                this.#blueDots,
                this.blueGrid,
                this.blueScore,
                "red",
                "blue"
            );
        } else {
            [this.blueGrid, this.redGrid] = this.update(
                tempDot,
                this.#blueDots,
                this.blueGrid,
                this.blueScore,
                this.#redDots,
                this.redGrid,
                this.redScore,
                "blue",
                "red"
            );
        }

        this.setIsGameOver(
            this.redGrid,
            this.blueGrid,
            this.redScore,
            this.blueScore
        );
        this.draw();
        if (this.isGameOver)
            this.gameOver()
    }
}
