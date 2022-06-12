class GameManager {
    isGameOver = false;
    maxScore;
    #CCL = new CCL()

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
    mainScreen;
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
        columns = columns || 20;
        rows = rows || 15;
        this.#COLUMNS = Math.floor(Math.abs(columns));
        this.#ROWS = Math.floor(Math.abs(rows));
        this.ctx = canvas.getContext("2d");
        this.mainScreen = endGameElement;
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
        this.maxScore = maxScore || columns * rows;

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

    checkGrid(array, surroundedDots) {
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
            this.currentSide = secondSide;

            mainGrid = this.#CCL.findGrid(mainDots.getGrid(this.#ROWS, this.#COLUMNS));

            let surroundedSecondDots = secondDots.checkDots(mainGrid);
            mainScore.innerHTML = surroundedSecondDots.length.toString();

            mainGrid = this.checkGrid(mainGrid, surroundedSecondDots);

            secondGrid = this.#CCL.findGrid(secondDots.getGrid(this.#ROWS, this.#COLUMNS));

            let surroundedMainDots = mainDots.checkDots(secondGrid);
            secondScore.innerHTML = surroundedMainDots.length.toString();

            secondGrid = this.checkGrid(secondGrid, surroundedMainDots);
            
            this.#areasManager.areasArray = [];
            this.#areasManager.findAllArea(mainGrid, mainSide);
            this.#areasManager.findAllArea(secondGrid, secondSide);
        }
        return [mainGrid, secondGrid];
    }

    gameOver() {
        let winner = +this.redScore.innerHTML > +this.blueScore.innerHTML ? "red" : "blue";
        this.mainScreen.style.display = "flex";
        this.mainScreen.style.color = winner.toLowerCase();
        let endScreen = this.mainScreen.lastElementChild;
        endScreen.style.display = "grid";
        endScreen.firstElementChild.innerHTML = (winner == "red" ? "Червновий" : "Синій") + " гравець виграв";
        endScreen.getElementsByTagName("span")[1].innerHTML =
            this.redScore.innerHTML + " : " + this.blueScore.innerHTML;
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
