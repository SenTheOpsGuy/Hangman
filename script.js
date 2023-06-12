// ASCII hangman stages
const hangmanStages = [
    '', // initial stage
    `______`, // Bar
    ,
    `______`, // head
    `|
     |
     |
     |
______`, // pole
    `|    |
     |
     |
     |
______`, // crossbar
    `|    |
     O
     |
     |
______`, // body
    `|    |
     O
    /|
     |
______`, // one arm
    `|    |
     O
    /|\\
     |
______`, // two arms
    `|    |
     O
    /|\\
    /
______`, // one leg
    `|    |
     O
    /|\\
    / \\
______` // two legs
];

function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

let wordsData = [];
let currentWordIndex = 0;
let guessesLeft = 10;
let guessedLetters = [];
let correctlyGuessedWords = 0;

// Get elements from the DOM
const guessesLeftElement = document.getElementById('guesses-left');
const wordsLeftElement = document.getElementById('words-left');
const hangmanElement = document.getElementById('hangman');
const wordElement = document.getElementById('word');
const definitionElement = document.getElementById('definition');
const antonymsElement = document.getElementById('antonyms');
const synonymsElement = document.getElementById('synonyms');
const guessInputElement = document.getElementById('guess-input');
const guessButton = document.getElementById('guess-button');
const endButton = document.getElementById('end-button');
const restartButton = document.getElementById('restart-button');

// Update the game stats
function updateStats() {
    guessesLeftElement.textContent = `Guesses left: ${guessesLeft}`;
    wordsLeftElement.textContent = `Words left: ${wordsData.length - currentWordIndex - 1}`;
}

// Update the hangman display
function updateHangmanDisplay() {
    hangmanElement.textContent = hangmanStages[10 - guessesLeft];
}

// Show the current word
function showWord() {
    const wordData = wordsData[currentWordIndex];
    wordElement.textContent = wordData.word.split('').map(letter => guessedLetters.includes(letter) ? letter : '_').join(' ');
    definitionElement.textContent = `Definition: ${wordData.definition}`;
    antonymsElement.textContent = `Antonyms: ${wordData.antonyms.join(', ')}`;
    synonymsElement.textContent = `Synonyms: ${wordData.synonyms.join(', ')}`;
}

// Handle guess
function handleGuess() {
    const guess = guessInputElement.value.toLowerCase();
    guessInputElement.value = '';

    // Check if the guess is more than one character
    if (guess.length > 1) {
        alert("Whoa there, speedy! One letter at a time, please.");
        return;
    }

    // Check if the guess is correct
    if (wordsData[currentWordIndex].word.includes(guess)) {
        // Correct guess
        guessedLetters.push(guess);
        wordElement.textContent = wordsData[currentWordIndex].word.split('').map(letter => guessedLetters.includes(letter) ? letter : '_').join(' ');
    } else {
        // Incorrect guess
        guessesLeft--;
        updateStats();
        updateHangmanDisplay();
    }

    // Check if the word is fully guessed
    if (wordsData[currentWordIndex].word.split('').every(letter => guessedLetters.includes(letter))) {
        // Move on to the next word
        currentWordIndex++;
        correctlyGuessedWords++;
        guessedLetters = [];
        if (currentWordIndex < wordsData.length) {
            showWord();
        } else {
            endGame();
        }
        updateStats(); // Update the stats after a word is fully guessed
    }

    // Check if the game is over
    if (guessesLeft === 0) {
        endGame();
    }
}

// End the game
function endGame() {
    swal({
        title: "Game Over!",
        text: `You correctly guessed ${correctlyGuessedWords} words with ${guessesLeft} guesses left.`,
        icon: "success",
        buttons: {
            home: {
                text: "Home",
                value: "home",
            },
            playAgain: {
                text: "Play Again",
                value: "playAgain",
            },
        },
    })
    .then((value) => {
        if (value === "home") {
            window.location.href = 'https://www.planetspark.in';
        } else if (value === "playAgain") {
            startGame();
        }
    });
}

// Start the game
function startGame() {
    // Fetch the words data
    fetch('words.json')
        .then(response => response.json())
        .then(data => {
            wordsData = shuffle(data); // Shuffle the words

            // Reset game state
            currentWordIndex = 0;
            guessesLeft = 10;
            guessedLetters = [];
            correctlyGuessedWords = 0;

            // Update the game stats
            updateStats();

            // Update the hangman display
            updateHangmanDisplay();

            // Show the first word
            showWord();
        })
        .catch(error => console.error('Error:', error));
}

// Event listeners
guessButton.addEventListener('click', handleGuess);
endButton.addEventListener('click', endGame);
restartButton.addEventListener('click', startGame);

// Start the game when the page loads
startGame();
