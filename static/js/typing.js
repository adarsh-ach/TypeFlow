const wordSets = [

    [
        "art", "train", "trail", "terrain", "apple",
        "river", "keyboard", "window", "planet",
        "orange", "school", "future", "coding",
        "coffee", "system"
    ],

    [
        "blue", "cloud", "forest", "computer", "bright",
        "garden", "mouse", "screen", "python",
        "rocket", "summer", "keyboard", "practice",
        "speed", "focus"
    ]

];


// =========================
// ROUND SETTINGS
// =========================

let currentRound = 0;

let words = wordSets[currentRound];


// =========================
// DOM ELEMENTS
// =========================

const wordDisplay =
    document.getElementById("word-display");

const input =
    document.getElementById("typing-input");

const timerDisplay =
    document.getElementById("timer");

const accuracyDisplay =
    document.getElementById("accuracy");

const wpmDisplay =
    document.getElementById("wpm");


// =========================
// VARIABLES
// =========================

let currentWordIndex = 0;

let currentCharacterIndex = 0;

let correctCharacters = 0;

let wrongAttempts = 0;

let startTime = null;

let timerInterval = null;

let testFinished = false;


// =========================
// STORE RESULTS
// =========================

let round1Accuracy = 0;
let round1Wpm = 0;

let round2Accuracy = 0;
let round2Wpm = 0;


// =========================
// DISPLAY WORDS
// =========================

function displayWords() {

    wordDisplay.innerHTML = "";

    words.forEach((word, wordIndex) => {

        const wordElement =
            document.createElement("span");

        wordElement.classList.add("word");

        wordElement.dataset.index =
            wordIndex;


        for (
            let i = 0;
            i < word.length;
            i++
        ) {

            const character =
                document.createElement("span");

            character.textContent =
                word[i];

            character.classList.add(
                "character"
            );

            wordElement.appendChild(
                character
            );
        }


        wordDisplay.appendChild(
            wordElement
        );


        if (
            wordIndex <
            words.length - 1
        ) {

            const space =
                document.createElement("span");

            space.textContent = " ";

            space.classList.add(
                "word-space"
            );

            wordDisplay.appendChild(
                space
            );
        }

    });


    updateCursor();

    updateProgress();
}


// =========================
// UPDATE PROGRESS
// =========================

function updateProgress() {

    const wordProgress =
        document.getElementById("word-progress");

    const progressPercent =
        document.getElementById("progress-percent");

    const progressFill =
        document.getElementById("progress-fill");


    if (
        !wordProgress ||
        !progressPercent ||
        !progressFill
    ) {

        return;
    }


    const totalWords =
        words.length;

    const completedWords =
        currentWordIndex;


    const percent =
        (completedWords / totalWords) * 100;


    wordProgress.textContent =
        `Word ${Math.min(
            completedWords + 1,
            totalWords
        )} / ${totalWords}`;


    progressPercent.textContent =
        `${Math.round(percent)}%`;


    progressFill.style.width =
        `${percent}%`;
}


// =========================
// CURSOR
// =========================

function updateCursor() {

    document
        .querySelectorAll(".character")
        .forEach(character => {

            character.classList.remove(
                "current"
            );

        });


    const currentWord =
        document.querySelector(
            `.word[data-index="${currentWordIndex}"]`
        );


    if (!currentWord) {

        return;
    }


    const characters =
        currentWord.querySelectorAll(
            ".character"
        );


    if (
        characters[currentCharacterIndex]
    ) {

        characters[currentCharacterIndex]
            .classList.add("current");
    }
}


// =========================
// TIMER
// =========================

function startTimer() {

    if (startTime !== null) {

        return;
    }


    startTime = Date.now();


    timerInterval =
        setInterval(() => {

            const elapsed =
                (Date.now() - startTime)
                / 1000;


            timerDisplay.textContent =
                elapsed.toFixed(2) + "s";


            updateStats();

        }, 100);
}


// =========================
// STATS
// =========================

function updateStats() {

    if (startTime === null) {

        return;
    }


    const elapsedSeconds =
        (Date.now() - startTime)
        / 1000;


    if (elapsedSeconds <= 0) {

        return;
    }


    const totalAttempts =
        correctCharacters +
        wrongAttempts;


    let accuracy = 100;


    if (totalAttempts > 0) {

        accuracy =
            (
                correctCharacters /
                totalAttempts
            ) * 100;
    }


    accuracyDisplay.textContent =
        accuracy.toFixed(1) + "%";


    const minutes =
        elapsedSeconds / 60;


    const wpm =
        minutes > 0
            ? (
                correctCharacters / 5
              ) / minutes
            : 0;


    wpmDisplay.textContent =
        Math.round(wpm);
}


// =========================
// KEYBOARD HIGHLIGHT
// =========================

function highlightKey(key) {

    let keyValue =
        key.toLowerCase();


    if (key === " ") {

        keyValue = " ";
    }


    const keyButton =
        document.querySelector(
            `[data-key="${keyValue}"]`
        );


    if (!keyButton) {

        return;
    }


    keyButton.classList.add(
        "active"
    );


    setTimeout(() => {

        keyButton.classList.remove(
            "active"
        );

    }, 120);
}


// =========================
// CHARACTER DISPLAY
// =========================

function updateCharacterDisplay() {

    const currentWord =
        document.querySelector(
            `.word[data-index="${currentWordIndex}"]`
        );


    if (!currentWord) {

        return;
    }


    const characters =
        currentWord.querySelectorAll(
            ".character"
        );


    characters.forEach(
        (character, index) => {

            character.classList.remove(
                "correct"
            );


            if (
                index <
                currentCharacterIndex
            ) {

                character.classList.add(
                    "correct"
                );
            }

        }
    );
}


// =========================
// KEYBOARD INPUT
// =========================

input.addEventListener(
    "keydown",
    function(event) {

        if (testFinished) {

            return;
        }


        event.preventDefault();


        highlightKey(event.key);


        if (
            event.key === "Shift" ||
            event.key === "Control" ||
            event.key === "Alt" ||
            event.key === "Tab" ||
            event.key === "CapsLock" ||
            event.key === "Backspace" ||
            event.key === "Escape" ||
            event.key === "ArrowLeft" ||
            event.key === "ArrowRight" ||
            event.key === "ArrowUp" ||
            event.key === "ArrowDown"
        ) {

            return;
        }


        if (
            event.key.length === 1 ||
            event.code === "Space"
        ) {

            startTimer();
        }


        const currentWord =
            words[currentWordIndex];


        // =========================
        // SPACE
        // =========================

        if (event.code === "Space") {

            console.log(
                "SPACE PRESSED"
            );


            if (
                currentCharacterIndex ===
                currentWord.length
            ) {

                console.log(
                    "WORD COMPLETE:",
                    currentWord
                );


                currentWordIndex++;

                currentCharacterIndex = 0;


                // UPDATE PROGRESS
                updateProgress();


                if (
                    currentWordIndex >=
                    words.length
                ) {

                    finishRound();

                    return;
                }


                updateCursor();

            }

            else {

                wrongAttempts++;

                console.log(
                    "SPACE TOO EARLY"
                );

                updateStats();
            }


            return;
        }


        // =========================
        // NORMAL CHARACTER
        // =========================

        if (
            event.key.length !== 1
        ) {

            return;
        }


        const expectedCharacter =
            currentWord[
                currentCharacterIndex
            ];


        // =========================
        // CORRECT
        // =========================

        if (
            event.key ===
            expectedCharacter
        ) {

            correctCharacters++;

            currentCharacterIndex++;


            updateCharacterDisplay();

            updateCursor();

            updateStats();
        }


        // =========================
        // WRONG
        // =========================

        else {

            wrongAttempts++;


            console.log(
                "WRONG:",
                event.key,
                "EXPECTED:",
                expectedCharacter
            );


            updateCharacterDisplay();

            updateStats();
        }

    }
);


// =========================
// FINISH ROUND
// =========================

function finishRound() {

    testFinished = true;


    clearInterval(
        timerInterval
    );


    input.disabled = true;


    const elapsedSeconds =
        (Date.now() - startTime)
        / 1000;


    const totalAttempts =
        correctCharacters +
        wrongAttempts;


    let accuracy = 100;


    if (totalAttempts > 0) {

        accuracy =
            (
                correctCharacters /
                totalAttempts
            ) * 100;
    }


    let wpm = 0;


    if (elapsedSeconds > 0) {

        wpm =
            (
                correctCharacters / 5
            ) /
            (elapsedSeconds / 60);
    }


    if (currentRound === 0) {

        round1Accuracy = accuracy;

        round1Wpm = wpm;


        wordDisplay.innerHTML = `

            <div class="finished">

                🎉 Round 1 Complete!

                <br><br>

                <span>
                    Accuracy:
                    ${accuracy.toFixed(1)}%
                </span>

                <br>

                <span>
                    WPM:
                    ${Math.round(wpm)}
                </span>

                <br><br>

                <button
                    id="round2-btn"
                    class="start-round-btn"
                >
                    Start Round 2
                </button>

            </div>

        `;


        document
            .getElementById("round2-btn")
            .addEventListener(
                "click",
                startRound2
            );

    }

    else {

        round2Accuracy = accuracy;

        round2Wpm = wpm;


        showFinalResults();
    }
}


// =========================
// START ROUND 2
// =========================

function startRound2() {

    currentRound = 1;

    words =
        wordSets[currentRound];


    currentWordIndex = 0;

    currentCharacterIndex = 0;

    correctCharacters = 0;

    wrongAttempts = 0;

    startTime = null;

    testFinished = false;


    clearInterval(
        timerInterval
    );


    timerInterval = null;


    timerDisplay.textContent =
        "0.00s";


    accuracyDisplay.textContent =
        "100.0%";


    wpmDisplay.textContent =
        "0";


    /*
        Change ROUND display
    */

    const roundCard =
        document.querySelector(
            ".stat-card .stat-value"
        );


    if (roundCard) {

        roundCard.textContent =
            "2 / 2";
    }


    displayWords();


    input.disabled = false;

    input.value = "";

    input.focus();
}


// =========================
// FINAL RESULTS
// =========================

function showFinalResults() {

    const accuracyDifference =
        round2Accuracy -
        round1Accuracy;


    const wpmDifference =
        round2Wpm -
        round1Wpm;


    const accuracySign =
        accuracyDifference >= 0
            ? "+"
            : "";


    const wpmSign =
        wpmDifference >= 0
            ? "+"
            : "";


    wordDisplay.innerHTML = `

        <div class="finished">

            🎉 Test Complete!

            <br><br>

            <span>
                Round 1
            </span>

            <br>

            Accuracy:
            ${round1Accuracy.toFixed(1)}%

            <br>

            WPM:
            ${Math.round(round1Wpm)}

            <br><br>

            <span>
                Round 2
            </span>

            <br>

            Accuracy:
            ${round2Accuracy.toFixed(1)}%

            <br>

            WPM:
            ${Math.round(round2Wpm)}

            <br><br>

            <span>
                Accuracy Change:
                ${accuracySign}${accuracyDifference.toFixed(1)}%
            </span>

            <br>

            <span>
                WPM Change:
                ${wpmSign}${Math.round(wpmDifference)}
            </span>

            <br><br>

            <button
                id="view-results-btn"
                class="start-round-btn"
            >
                📊 View My Results
            </button>

        </div>

    `;


    // Disable typing after test completion

    input.disabled = true;


    // View Results button

    document
        .getElementById("view-results-btn")
        .addEventListener(
            "click",
            function() {

                window.location.href =
                    "/history";

            }
        );


    // Save result to database

    fetch("/save-result", {

        method: "POST",

        headers: {

            "Content-Type":
                "application/json"

        },

        body: JSON.stringify({

            round1_accuracy:
                round1Accuracy,

            round1_wpm:
                Math.round(round1Wpm),

            round2_accuracy:
                round2Accuracy,

            round2_wpm:
                Math.round(round2Wpm)

        })

    })

    .then(
        response =>
            response.json()
    )

    .then(
        data => {

            console.log(
                "SAVE RESULT:",
                data
            );

        }
    )

    .catch(
        error => {

            console.error(
                "Error saving result:",
                error
            );

        }
    );

}


// =========================
// START
// =========================

displayWords();

input.focus();