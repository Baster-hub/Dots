const canvas     = document.getElementById("can1");
const redScore   = document.getElementById("red");
const maxScore   = document.getElementById("max-score");
const blueScore  = document.getElementById("blue");
const gameField  = document.getElementById("game");
const rows       = document.getElementById("rows");
const columns    = document.getElementById("columns");
const endGameDiv = document.getElementById("backgroundShadow");
const startGame  = document.getElementById("start-game");

let gameManager;

startGame.onclick = (e) => {
    endGameDiv.firstElementChild.style.display = "none";
    endGameDiv.style.display = "none";
    gameField.style.display = "flex";
    
    gameManager = new GameManager(
        +columns.value,
        +rows.value,
        25,
        canvas,
        endGameDiv,
        "red",
        redScore,
        blueScore,
        +maxScore.value
    );
};

canvas.onmousemove = (e) => {
    const canPos = canvas.getBoundingClientRect();

    gameManager.mouseMove(e.clientX - canPos.left, e.clientY - canPos.top);
};

canvas.onclick = (e) => {
    gameManager.mouseClick();
};
