function listenInputs(){
    document.querySelectorAll("td > input")
        .forEach((input) => {
        input.addEventListener("change", saveInput);
    })
}

document.addEventListener("DOMContentLoaded", () => {
    let selectConfig = document.querySelectorAll("div.gameConfig select");
    genExercise();
    selectConfig.forEach((s)=>{
        s.addEventListener("change", genExercise);
    });
    loadInput();
    listenInputs();
    // event listener passes the "event" parameter to "exercise" function
})

function convertNumSys(n, type){
    if (type === "dec") base = 10;
    if (type === "hex") base = 16;
    if (type === "oct") base = 8;
    return n.toString(base).toUpperCase();
}

function genExercise(){
    let selectEType = document.querySelector("div.gameConfig select[name='exercise']");
    let eType = selectEType.value
    let eTypeArr = eType.split("-"); // exercise type
    let selectDifficulty = document.querySelector("div.gameConfig select[name='difficulty']");
    let diff = selectDifficulty.value;
    let generate = eTypeArr[0];
    let validate = eTypeArr[1];
    let min;
    let max;
    let numbers = new Set();
    let showNums = new Set();
    switch(diff){
        case "easy":
            min=1;
            max=16; // 2⁴ one byte
            break;
        case "medium":
            min=32;
            max=256; // 2⁸ two bytes
            break;
        case "hard":
            min=256;
            max=65535; // 2¹⁶ four bytes
    }
    let localNumbersStr = localStorage.getItem(`${eType}-${diff}-generated`);
    if (!localNumbersStr){
        while (numbers.size < 10){
            let n = Math.floor(Math.random() * (max - min + 1)) + min;
            numbers.add(n);
        }
        localStorage.setItem(`${eType}-${diff}-generated`, JSON.stringify(Array.from(numbers)));
    }
    else{
        let localNumbersArr = JSON.parse(localNumbersStr);
        numbers = new Set(localNumbersArr);
    }

    for(let n of numbers) showNums.add(convertNumSys(n, generate));

    // First part done.
    let table = document.querySelector("table.exercise");
    table.innerHTML = '';
    // HEAD
    let tHead = document.createElement("thead");
    let hShow = document.createElement("th");
    hShow.textContent = generate.charAt(0).toUpperCase() + generate.slice(1);
    let hGuess = document.createElement("th");
    hGuess.textContent = validate.charAt(0).toUpperCase() + validate.slice(1);
    let headTr = document.createElement("tr");
    headTr.append(hShow, hGuess)
    tHead.append(headTr);

    // BODY
    let tBody = document.createElement("tbody");
    for (let number of showNums){
        let bodyTr = document.createElement("tr");
        let dShow = document.createElement("td");
        dShow.textContent = number;
        let dGuess = document.createElement("td");
        let guess = document.createElement("input");
        guess.type = "text";
        dGuess.append(guess);
        bodyTr.append(dShow, dGuess);
        tBody.append(bodyTr);
    }
    table.append(tHead, tBody);
    let inputs = document.querySelectorAll("td > input");
    inputs.forEach((input) => {input.disabled = false});
    listenInputs();

}

function update(){
    let eType = document.querySelector("div.gameConfig select[name='exercise']").value;
    let diff = document.querySelector("div.gameConfig select[name='difficulty']").value;
    localStorage.removeItem(`${eType}-${diff}-generated`);
    localStorage.removeItem(`${eType}-${diff}-inputs`);
    genExercise();
    let checkTBody = document.querySelector("table.check > tbody");
    checkTBody.innerHTML = '';
}

function saveInput() {
    let inputs = document.querySelectorAll("td > input");
    let inputValuesArr = [];
    for (let i=0; i<inputs.length; i++){
        inputValuesArr[i] = inputs[i].value;
    }
    let eType = document.querySelector("div.gameConfig select[name='exercise']").value;
    let diff = document.querySelector("div.gameConfig select[name='difficulty']").value;
    localStorage.setItem(`${eType}-${diff}-inputs`, JSON.stringify(inputValuesArr))
}

function loadInput(){
    let inputs = document.querySelectorAll("td > input");
    let eType = document.querySelector("div.gameConfig select[name='exercise']").value;
    let diff = document.querySelector("div.gameConfig select[name='difficulty']").value;
    let inputValuesArr = JSON.parse(localStorage.getItem(`${eType}-${diff}-inputs`));
    if (!inputValuesArr) return 1;
    for (let i=0; i<inputs.length; i++){
        inputs[i].value = inputValuesArr[i];
    }


}

function check(){
    let checkTBody = document.querySelector("table.check > tbody");
    checkTBody.innerHTML = '';
    let selectEType = document.querySelector("div.gameConfig select[name='exercise']");
    let eType = selectEType.value
    let eTypeArr = eType.split("-");
    let guessedType = eTypeArr[1]
    let selectDifficulty = document.querySelector("div.gameConfig select[name='difficulty']");
    let diff = selectDifficulty.value;
    let localNumbersArr = JSON.parse(localStorage.getItem(`${eType}-${diff}-generated`));
    let base;
    if (guessedType === "hex") base = 16; if (guessedType === "oct") base = 8; if (guessedType === "dec") base = 10;
    let inputs = document.querySelectorAll(`td > input`);

    for (let i=0; i<localNumbersArr.length; i++){
        let tr = document.createElement("tr");
        let td = document.createElement("td");

        let generated = localNumbersArr[i];
        let guessed = parseInt(inputs[i].value, base);
        if (inputs[i].value){
            if (generated === guessed){
                td.innerHTML = "<p>✅ Correct!</p>";
            }
            else {
                td.innerHTML = `<p>❌ Incorrect. Answer is <span class="answer">${convertNumSys(generated, guessedType)}</span></p>`
            }
        }
        else {
            td.innerHTML = "<p>No response</p>";
        }

        tr.append(td);
        checkTBody.append(tr);
        inputs[i].disabled = true;
    }

}