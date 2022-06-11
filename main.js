const canvas     = document.getElementById("can1");
const redScore   = document.getElementById("red");
const maxScore   = document.getElementById("max-score");
const blueScore  = document.getElementById("blue");
const gameField  = document.getElementById("game");
const endGameDiv = document.getElementById("backgroundShadow");
const startGameHandler = document.getElementById("start-game");

let gameManager;

startGameHandler.onclick = (e) => {
    endGameDiv.firstElementChild.style.display = "none";
    endGameDiv.style.display = "none";
    gameField.style.display = "flex";
    gameManager = new GameManager(
        10,
        7,
        50,
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
