/* start initializing variables */
let activePlayer, playersPosition, isFirstRoll, isDragonAndTree, playersName
let SUBMITNAMES, IMGSELECT, MESSAGE, BOARD, WIN
let MAIN_S, DICE_S, DRAGON_S, TREE_S, SIX_S, HIT_S, CLICK_S, CONGRATS_S
let PLAYER_MODAL, PLAYER1, PLAYER2, NAME1, NAME2, INPUT1_M, INPUT2_M, INFO_MODAL
let ACTIVE_PLAYER
let BTN_INFO, BTN_SOUND, BTN_RESET, BTN_CLOSE
let dragonsAndTrees
let position, dest
let positions, dests
let dice
let soundHandler
/* end initializing variables */

/* start receiving players' name */
PLAYER_MODAL = document.getElementById("players-modal")
INPUT1_M = document.getElementById("input1-m")
INPUT2_M = document.getElementById("input2-m")
PLAYER1 = document.getElementById("p1")
PLAYER2 = document.getElementById("p2")
NAME1 = document.getElementById("p1-name")
NAME2 = document.getElementById("p2-name")
MAIN_S = document.getElementById("main-s")
CLICK_S = document.getElementById("click-s")
SUBMITNAMES = document.getElementById("submit-player")
SUBMITNAMES.addEventListener("click", submitNames)
soundHandler = true

function submitNames() {
    CLICK_S.play()
    if (PLAYER1.value && PLAYER2.value) {
        NAME1.innerText = PLAYER1.value
        NAME2.innerText = PLAYER2.value
        PLAYER_MODAL.style.display = "none"
        MAIN_S.play()
    } else if (PLAYER1.value && !PLAYER2.value) {
        INPUT2_M.style.display = "inline"
    } else if (!PLAYER1.value && PLAYER2.value) {
        INPUT1_M.style.display = "inline"
    } else {
        INPUT1_M.style.display = "inline"
        INPUT2_M.style.display = "inline"
    }
    playersName = [NAME1.innerText, NAME2.innerText]
    ACTIVE_PLAYER.innerText = `${playersName[activePlayer]}'s turn`
}
PLAYER1.addEventListener("keyup", function () {
    INPUT1_M.style.display = "none"
})
PLAYER2.addEventListener("keyup", function () {
    INPUT2_M.style.display = "none"
})
/* end receiving players' name */

/* start creating elements in document */
for (let i = 0; i < 100; i++) {
    let cell = document.createElement("div")
    cell.classList.add("cell")
    document.getElementById("board").appendChild(cell)
}

for (let i = 0; i < 100; i++) {
    let cellNumber = document.createElement("div")
    cellNumber.classList.add("cell-number")
    cellNumber.innerHTML = i + 1
    document.getElementById("board-number").appendChild(cellNumber)
}
/* end creating elements in document */

/* start selecting elements in document */
INFO_MODAL = document.getElementById("info-modal")
IMGSELECT = document.getElementById("dice")
MESSAGE = document.getElementById("message")
BOARD = document.getElementsByClassName("cell")
DICE_S = document.getElementById("dice-s")
DRAGON_S = document.getElementById("dragon-s")
TREE_S = document.getElementById("tree-s")
SIX_S = document.getElementById("six-s")
HIT_S = document.getElementById("hit-s")
DRAGON_S = document.getElementById("dragon-s")
TREE_S = document.getElementById("tree-s")
CONGRATS_S = document.getElementById("congrats-s")
BTN_RESET = document.getElementById("reset")
BTN_SOUND = document.getElementById("sound")
BTN_INFO = document.getElementById('info')
BTN_CLOSE = document.getElementById("close-modal")
WIN = document.getElementById("win")
ACTIVE_PLAYER = document.getElementById("active-player")
/* end selecting elements in document */

/* start and reset the game */
function startGame() {
    activePlayer = 0
    playersPosition = new Array(2)
    isFirstRoll = [true, true]
    dragonsAndTrees = new Array(100)
    positions = []
    dests = []
    IMGSELECT.src = "img/d-q.png"
    MESSAGE.innerText = ""
    WIN.style.display = "none"

    /* start clearing previuos state and go to default styles */
    for (let i = 0; i < 100; i++) {
        BOARD[i].innerHTML = ""
        BOARD[i].style.backgroundColor = "#181818"
    }
    BOARD[99].innerHTML = "&#127937"
    /* end clearing previuos state and go to default styles */

    /* start producing random dragons and trees */
    for (let i = 0; i < 20; i++) {

        position = Math.floor(Math.random() * 100)

        /* avoiding duplicate positions */
        for (let j = 0; j <= positions.length; j++) {
            if (position == 0) {
                position = Math.floor(Math.random() * 100)
                j = -1
            } else if (position == 99) {
                position = Math.floor(Math.random() * 100)
                j = -1
            } else if (positions[j] == position) {
                position = Math.floor(Math.random() * 100)
                j = -1 /* comparing new position with the previous positions */
            } else if (position == dests[j]) {
                position = Math.floor(Math.random() * 100)
                j = -1 /* the new position should not be the same as the previous destinations */
            }
        }

        positions.push(position)

        dest = Math.floor(Math.random() * 100)
        for (let k = 0; k <= positions.length; k++) {
            if (dest == positions[k]) {
                dest = Math.floor(Math.random() * 100)
                k = -1
            } /* the new destination should not be the same as the previous positions */
        }
        dests.push(dest)
        /* position and destination of a cell cannot be the same */

        dragonsAndTrees[position] = dest
        if (position < dest) {
            BOARD[position].innerHTML = "&#127794"
            BOARD[position].style.backgroundColor = "green"
        } else if (position > dest) {
            BOARD[position].innerHTML = "&#128009"
            BOARD[position].style.backgroundColor = "red"
        }
    }
    /* end producing random dragons and trees */

    /* rolling button */
    document.getElementById("roll").addEventListener("click", roll)
}

startGame()

/* strat changing players function */
function changePlayer() {
    activePlayer == 0 ? (activePlayer = 1) : (activePlayer = 0)
    ACTIVE_PLAYER.innerText = `${playersName[activePlayer]}'s turn`
}
/* end changing players function */

/* strat rolling dice function */
function roll() {
    MESSAGE.innerText = ""
    isDragonAndTree = false
    dice = Math.floor(Math.random() * 6 + 1)
    IMGSELECT.style.display = "block"
    IMGSELECT.src = `img/dr-${dice}.png`
    DICE_S.play()

    if (isFirstRoll[activePlayer]) {
        if (dice == 6) {
            SIX_S.play()
            playersPosition[activePlayer] = 0
            activePlayer == 0 ? (BOARD[0].innerHTML += "&#128060") : (BOARD[0].innerHTML += "&#128047")
            isFirstRoll[activePlayer] = false
            MESSAGE.innerText += ` ${playersName[activePlayer]} can start the game.`
            changePlayer()
            return
        } else {
            changePlayer()
            return
        }
    } else {

        /* managing previous position */
        if (playersPosition[0] == playersPosition[1]) {
            if (activePlayer == 0) {
                BOARD[playersPosition[activePlayer]].innerHTML = "&#128047"
            } else {
                BOARD[playersPosition[activePlayer]].innerHTML = "&#128060"
            }
        } else {
            BOARD[playersPosition[activePlayer]].innerHTML = ""
        }

        /* producing new position */
        playersPosition[activePlayer] += dice

        /* when a player has won the game */
        if (playersPosition[activePlayer] > 99) {
            MAIN_S.pause()
            CONGRATS_S.play()
            MESSAGE.innerText += ` ${playersName[activePlayer]} has won the game!`
            document.getElementById("roll").removeEventListener("click", roll)
            for (let i = 0; i < 100; i++) {
                BOARD[i].innerHTML = ""
                BOARD[i].style.backgroundColor = "rgb(207, 207, 207)"
            }
            document.getElementById("board").style.position = "relative"
            WIN.innerText = `Congratulation! ${playersName[activePlayer]} has won the game :)`
            WIN.style.display = "block"
            return
        }

        /* managing dragons and trees */
        if (dragonsAndTrees[playersPosition[activePlayer]] != undefined) {
            isDragonAndTree = true
            if (playersPosition[activePlayer] > dragonsAndTrees[playersPosition[activePlayer]]) {
                DRAGON_S.play()
                MESSAGE.innerText += ` Oops! ${playersName[activePlayer]} was injured by a dragon and escaped to cell ${dragonsAndTrees[playersPosition[activePlayer]] + 1}.`
            } else {
                TREE_S.play()
                MESSAGE.innerText += ` Wow! ${playersName[activePlayer]} reached a tree and was able to climb up to cell ${dragonsAndTrees[playersPosition[activePlayer]] + 1}.`
            }
            playersPosition[activePlayer] = dragonsAndTrees[playersPosition[activePlayer]]
        }

        /* managing new position without hitting posibility */
        /* if (playersPosition[0] == playersPosition[1]) {
            BOARD[playersPosition[activePlayer]].innerHTML = "&#128060&#128047"
        } else {
            if (activePlayer == 0) {
                BOARD[playersPosition[activePlayer]].innerHTML = "&#128060"
            } else {
                BOARD[playersPosition[activePlayer]].innerHTML = "&#128047"
            }
        } */

        /* managing new position with hitting posibility */
        if (playersPosition[0] == playersPosition[1]) {
            if (isDragonAndTree) {
                BOARD[playersPosition[activePlayer]].innerHTML = "&#128060&#128047"
            } else {
                if (activePlayer == 0) {
                    HIT_S.play()
                    BOARD[playersPosition[activePlayer]].innerHTML = "&#128060"
                    playersPosition[activePlayer + 1] = 0
                    BOARD[playersPosition[activePlayer + 1]].innerHTML = "&#128047"
                    MESSAGE.innerText += ` Oh no! ${playersName[activePlayer + 1]} was injured by ${playersName[activePlayer]}'s attack and returned to the beginning of the game.`
                } else {
                    HIT_S.play()
                    BOARD[playersPosition[activePlayer]].innerHTML = "&#128047"
                    playersPosition[activePlayer - 1] = 0
                    BOARD[playersPosition[activePlayer - 1]].innerHTML = "&#128060"
                    MESSAGE.innerText += ` Oh no! ${playersName[activePlayer - 1]} was injured by ${playersName[activePlayer]}'s attack and returned to the beginning of the game.`
                }
            }
        } else {
            if (activePlayer == 0) {
                BOARD[playersPosition[activePlayer]].innerHTML = "&#128060"
            } else {
                BOARD[playersPosition[activePlayer]].innerHTML = "&#128047"
            }
        }
        /* gift for 6 */
        if (dice != 6) {
            changePlayer()
        } else {
            SIX_S.play()
            MESSAGE.innerText += ` ${playersName[activePlayer]} has a prize for dice 6.`
        }
    }
}
/* end rolling dice function */

/* start handling information modal */
BTN_INFO.addEventListener("click", function () {
    CLICK_S.play()
    INFO_MODAL.style.display = "block"
})
BTN_CLOSE.addEventListener("click", function () {
    CLICK_S.play()
    INFO_MODAL.style.display = "none"
})
/* end handling information modal */

/* start reset button */
BTN_RESET.addEventListener("click", function() {
    CLICK_S.play()
    CONGRATS_S.pause()
    MAIN_S.play()
    startGame()
})
/* end reset button */

/* start sound button */
BTN_SOUND.addEventListener("click", function() {
    soundHandler = !soundHandler
    if(soundHandler) {
        document.querySelector("#sound span").innerText = "music_note"
        MAIN_S.muted = false
    } else {
        document.querySelector("#sound span").innerText = "music_off"
        MAIN_S.muted = true
    }
})
/* end sound button */