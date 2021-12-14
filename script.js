var lifes = [];
function change(e) {
    e.target.classList.toggle("transformed-state");
    e.target.removeEventListener('click', change, false);
    e.target.innerHTML = '&nbsp;';
    let oneUp = '';
    if (lifes.includes(e.target.id)) {
        e.target.classList.toggle('oneUP');
    }
}

let lifeSortEnd = 0;
do {
    lifeLine = Math.floor(Math.random() * 10) + 1;
    lifeColumn = Math.floor(Math.random() * 10) + 1;
    let life = `box-${lifeLine}-${lifeColumn}`;
    if (!lifes.includes(life)) {
        lifes.push(life);
        lifeSortEnd++;
    }
} while(lifeSortEnd < 5);

const board = document.getElementById('board');
for (let line = 1; line <= 10; line++) {
    for (let column = 1; column <= 10; column++) {
        let appendDiv = document.createElement('div');
        appendDiv.innerHTML = `<div id='box-${line}-${column}' class="box duration">[${line}-${column}]</div> `;
        board.appendChild(appendDiv.firstChild);
    }
    let breakLine = document.createElement('br');
    breakLine.innerHTML = "<br/>";
    board.appendChild(breakLine.firstChild);
}

const divs = document.querySelectorAll("div.box");
for (let div of divs) {
    div.addEventListener("click", change);
}