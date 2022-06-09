const can1 = document.getElementById("can1");
const redScore = document.getElementById("red")
const blueScore = document.getElementById("blue")
const endGameDiv = document.getElementById("end-game");

const gameManager = new GameManager(
    20,
    20,
    30,
    can1,
    endGameDiv,
    "red",
    redScore,
    blueScore,
    5
);

can1.onmousemove = (e) => {
    const canPos = can1.getBoundingClientRect();

    gameManager.mouseMove(e.clientX - canPos.left, e.clientY - canPos.top);
};

can1.onclick = (e) => {
	gameManager.mouseClick();
};

document.addEventListener("keypress", (e) => {
    if(e.keyCode == 32)
        gameManager.isGameOver = true;
})

