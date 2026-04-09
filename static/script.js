const boardDiv = document.getElementById("board");
const statusDiv = document.getElementById("status");

let board = ["", "", "", "", "", "", "", "", ""];
let gameOver = false;

// 🎮 Create board UI
function createBoard() {
    boardDiv.innerHTML = "";

    board.forEach((cell, index) => {
        const cellDiv = document.createElement("div");
        cellDiv.classList.add("cell");

        cellDiv.innerText = cell;

        // 💥 Add pop animation when symbol appears
        if (cell !== "") {
            cellDiv.classList.add("pop");
        }

        // ❌ Prevent clicking if already filled or game over
        if (cell === "" && !gameOver) {
            cellDiv.onclick = () => makeMove(index);
        }

        boardDiv.appendChild(cellDiv);
    });
}

// 🎯 Handle move
async function makeMove(index) {
    if (gameOver || board[index] !== "") return;

    const response = await fetch("/move", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ index: index })
    });

    const data = await response.json();

    board = data.board;
    createBoard();

    // 🏆 Winner logic
    if (data.winner) {
        gameOver = true;

        if (data.winner === "Draw") {
            statusDiv.innerText = "It's a Draw! 🤝";
        } else {
            statusDiv.innerText = `${data.winner} Wins! 🎉🔥`;

            // 🎉 Highlight winning cells (simple glow all)
            document.querySelectorAll(".cell").forEach(cell => {
                cell.classList.add("winner");
            });
        }
    } else {
        statusDiv.innerText = `Player ${data.next_player}'s Turn`;
    }
}

// 🔁 Reset game
async function resetGame() {
    await fetch("/reset", { method: "POST" });

    board = ["", "", "", "", "", "", "", "", ""];
    gameOver = false;

    statusDiv.innerText = "Player X's Turn";
    createBoard();
}

// 🚀 Initialize
createBoard();