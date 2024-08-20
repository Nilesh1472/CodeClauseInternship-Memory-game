document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("game-board");
    const timerElement = document.getElementById("timer");
    const scoreElement = document.getElementById("score");
    const resetButton = document.getElementById("reset");
    const cards = [];
    const cardValues = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H'];
    const cardColors = ['#ff9999', '#99ff99', '#9999ff', '#ffcc99', '#cc99ff', '#99cccc', '#ff99cc', '#cccc99'];
    let flippedCards = [];
    let matchedPairs = 0;
    let score = 0;
    let timerInterval;
    let elapsedTime = 0;

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function createBoard() {
        shuffle(cardValues);
        const colors = cardColors.concat(cardColors); 
        shuffle(colors); 
        
        cardValues.forEach((value, index) => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.dataset.value = value;
            card.dataset.color = colors[index]; 
            card.addEventListener("click", flipCard);
            board.appendChild(card);
            cards.push(card);
        });
    }

    function flipCard() {
        if (flippedCards.length === 2 || this.classList.contains("flipped") || this.classList.contains("matched")) {
            return;
        }

        this.style.backgroundColor = this.dataset.color;
        this.textContent = this.dataset.value;
        this.classList.add("flipped");
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            checkMatch();
        }
    }

    function checkMatch() {
        const [card1, card2] = flippedCards;

        if (card1.dataset.value === card2.dataset.value) {
            card1.classList.add("matched");
            card2.classList.add("matched");
            card1.style.backgroundColor = 'green'; 
            card2.style.backgroundColor = 'green'; 
            matchedPairs += 1;
            score += 10;
            updateScore();

            if (matchedPairs === cardValues.length / 2) {
                clearInterval(timerInterval);
                setTimeout(() => alert(`You win! Your score is ${score}`), 500);
            }
        } else {
            setTimeout(() => {
                card1.style.backgroundColor = '#eee'; 
                card2.style.backgroundColor = '#eee'; 
                card1.classList.remove("flipped");
                card2.classList.remove("flipped");
                card1.textContent = '';
                card2.textContent = '';
            }, 1000);
        }

        flippedCards = [];
    }

    function updateScore() {
        scoreElement.textContent = `Score: ${score}`;
    }

    function startTimer() {
        elapsedTime = 0;
        timerInterval = setInterval(() => {
            elapsedTime++;
            const minutes = Math.floor(elapsedTime / 60);
            const seconds = elapsedTime % 60;
            timerElement.textContent = `Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    function resetGame() {
        board.innerHTML = '';
        cards.length = 0;
        flippedCards.length = 0;
        matchedPairs = 0;
        score = 0;
        updateScore();
        clearInterval(timerInterval);
        timerElement.textContent = 'Time: 00:00';
        createBoard();
        startTimer();
    }

    resetButton.addEventListener("click", resetGame);

    createBoard();
    startTimer();
});
