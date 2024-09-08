let gameName = "Guess The Word"
document.title = gameName
document.querySelector("h1").innerHTML = gameName
document.querySelector("footer").innerHTML = `${gameName} Game Created By MTM`
let numOfTries = 6;
let numOfLetters = 6;
let currentTry = 1;
let numOfHints = 2;
//manage word 
let wordToGuess = ""
let words = ["Create", "Update", "Delete", "Master", "Branch", "Mainly", "Elzero", "School"]
wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase()
let messageArea = document.querySelector(".message")
let hintButton = document.querySelector(".hint")
function generateInputs() {
    let inputsContainer = document.querySelector(".inputs")
    for (let i = 1 ;i <= numOfTries; i++) {
        let tryDiv = document.createElement("div")
        tryDiv.classList.add(`try-${i}`)
        tryDiv.innerHTML = `<span>Try ${i}</span>`
        if(i !==1) tryDiv.classList.add("disabled");
        for(let j = 1; j <= numOfLetters; j++) {
            let input = document.createElement("input")
            input.type = "text"
            input.id = `guess-${i}-letter-${j}`
            input.setAttribute("maxlength","1")
            tryDiv.appendChild(input)
        }
        inputsContainer.appendChild(tryDiv)
    }
    inputsContainer.children[0].children[1].focus()
    let disabledInputDiv = document.querySelectorAll(".disabled input") 
    disabledInputDiv.forEach(input => (input.disabled = true))
    let inputs = document.querySelectorAll("input")
    inputs.forEach((input,index) => {
        input.addEventListener("input",function() {
            this.value = this.value.toUpperCase()
            let nextInput = inputs[index + 1]
            if(nextInput) nextInput.focus()
        })
        input.addEventListener("keydown",function(event) {
            let currentIndex = Array.from(inputs).indexOf(event.target)
            if(event.key === "ArrowRight") {
                let nextInput = currentIndex + 1
                if(nextInput < inputs.length) inputs[nextInput].focus()
            }
            if(event.key === "ArrowLeft") {
                let prevInput = currentIndex - 1
                if(prevInput >= 0 ) inputs[prevInput].focus()
            }
        })
    })
} 
window.onload = function () {
    generateInputs()
}
console.log(wordToGuess)
let buttonGuess = document.querySelector(".check")
buttonGuess.addEventListener("click",checkGuesses)
function checkGuesses() {
    let successGuess = true
    for(let i = 1; i <=  numOfLetters; i++) {
        let inputField = document.getElementById(`guess-${currentTry}-letter-${i}`)
        let letter = inputField.value.toLowerCase()
        let actualLetter = wordToGuess[i - 1]
        if (letter === actualLetter) {
            inputField.classList.add("in-place")
        } else if (wordToGuess.includes(letter) && letter !== "") {
            inputField.classList.add("not-place")
            successGuess = false
        } else {
            inputField.classList.add("no")
            successGuess = false
        }
    }

    if(successGuess) {
        messageArea.innerHTML = `You Win The Word Is <span>${wordToGuess}</span>`
        let allTries = document.querySelectorAll(".inputs > div")
        allTries.forEach(eachTry => eachTry.classList.add("disabled"))
        document.querySelector(".check").disabled = true
        hintButton.disabled = true
    } else {
        document.querySelector(`.try-${currentTry}`).classList.add("disabled")
        let currentTryInput = document.querySelectorAll(`.try-${currentTry} input`)
        currentTryInput.forEach((input) => (input.disabled = true))
        currentTry++
        if(currentTry <= numOfTries) {
            document.querySelector(`.try-${currentTry}`).classList.remove("disabled")
            let nextTryInput = document.querySelectorAll(`.try-${currentTry} input`)
            nextTryInput.forEach((input) => (input.disabled = false))
            let el = document.querySelector(`.try-${currentTry}`)
            el.children[1].focus()
        }
        if(currentTry > numOfTries) {
            document.querySelector(".check").disabled = true
            hintButton.disabled = true
            messageArea.innerHTML = `You Lose The Word Is <span>${wordToGuess}</span>`
        }
    }
}
document.querySelector(".hint span").innerHTML = numOfHints
hintButton.addEventListener("click",checkHints)
function checkHints() {
    document.querySelector(".hint span").innerHTML = --numOfHints;
    if (document.querySelector(".hint span").innerHTML <= 0) {
        hintButton.disabled = true
    }

    let enabledInputs = document.querySelectorAll("input:not([disabled])")
    let emptyEnabledInputs = Array.from(enabledInputs).filter(input => input.value === "")
    if(emptyEnabledInputs.length > 0) {
        let randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length)
        let randomInput = emptyEnabledInputs[randomIndex]
        let IndexToFill = Array.from(enabledInputs).indexOf(randomInput)
        if(IndexToFill !== -1) {
            randomInput.value = wordToGuess[IndexToFill].toUpperCase()
        }
    }
}
function handleBackspace(event) {
    if(event.key === "Backspace") {
        let inputs = document.querySelectorAll("input:not([disabled])")
        let currentIndex = Array.from(inputs).indexOf(document.activeElement)
        if (currentIndex > 0) {
            let currentInput = inputs[currentIndex]
            let prevInput = inputs[currentIndex - 1]
            currentInput.value = ""
            prevInput.value = ""
            prevInput.focus() 
        }
    }
}
document.addEventListener("keydown",handleBackspace)