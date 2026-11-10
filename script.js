
const gameBoard = document.getElementById("gameBoard");
const movesDisplay = document.getElementById("moves");
const timerDisplay = document.getElementById("timer");
const message = document.getElementById("message");
const restartButton = document.getElementById("restart");

const emojis = [
    "🍎", "🍌", "🍇", "🍓",
    "🍎", "🍌", "🍇", "🍓"
];

let firstCard = null;
let secondCard = null;
let moves = 0;
let matchedPairs = 0;
let lockBoard = false;
let seconds = 0;
let timer = null;
let started = false;

function startTimer() {
    if (started) return;

    started = true;

    timer = setInterval(() => {
        seconds++;
        timerDisplay.textContent = seconds;
    }, 1000);
}

function shuffleCards() {
    return [...emojis].sort(() => Math.random() - 0.5);
}

function createCards() {
    gameBoard.innerHTML = "";

    const shuffledEmojis = shuffleCards();

    shuffledEmojis.forEach((emoji) => {
        const card = document.createElement("div");

        card.classList.add("card");
        card.dataset.emoji = emoji;
        card.textContent = "?";

        card.addEventListener("click", () => flipCard(card));

        gameBoard.appendChild(card);
    });
}

function flipCard(card) {
    if (
        lockBoard ||
        card.classList.contains("flipped") ||
        card.classList.contains("matched")
    ) {
        return;
    }

    startTimer();

    card.classList.add("flipped");
    card.textContent = card.dataset.emoji;

    if (!firstCard) {
        firstCard = card;
        return;
    }

    secondCard = card;
    moves++;

    movesDisplay.textContent = moves;

    checkMatch();
}

function checkMatch() {
    const isMatch =
        firstCard.dataset.emoji === secondCard.dataset.emoji;

    if (isMatch) {
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");

        matchedPairs++;

        resetTurn();

        if (matchedPairs === emojis.length / 2) {
            clearInterval(timer);
            message.textContent =
                `Congratulations! You won in ${moves} moves and ${seconds} seconds!`;
        }

    } else {
        lockBoard = true;

        setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");

            firstCard.textContent = "?";
            secondCard.textContent = "?";

            resetTurn();
        }, 1000);
    }
}

function resetTurn() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

function restartGame() {
    clearInterval(timer);

    firstCard = null;
    secondCard = null;
    moves = 0;
    matchedPairs = 0;
    seconds = 0;
    lockBoard = false;
    started = false;

    movesDisplay.textContent = 0;
    timerDisplay.textContent = 0;
    message.textContent = "";

    createCards();
}

restartButton.addEventListener("click", restartGame);

createCards();
