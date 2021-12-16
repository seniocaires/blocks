
document.getElementById('intro').innerHTML = `<h1>${name}</h1>`;
var lifes = [];
function change(e) {
    e.target.removeEventListener('click', change, false);
    e.target.classList.toggle("transformed-state");
    e.target.innerHTML = '&nbsp;';
    if (lifes.includes(e.target.id)) {
        e.target.classList.toggle('oneUp');
    }
    document.getElementById('m').value = e.target.id;
    document.getElementById('btnSubmit').click();
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
} while (lifeSortEnd < 5);

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

function updateBoard(msg) {
    if (msg.user !== name) {

        var clickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        var element = document.getElementById(msg.block);
        var cancelled = !element.dispatchEvent(clickEvent);
        if (cancelled) {
            alert("Houve um erro ao registrar o click.");
        }
    }
}

function startBoard(msg) {
    for (clicked of msg) {
        document.getElementById(clicked).classList.toggle("transformed-state");
        document.getElementById(clicked).innerHTML = '&nbsp;';
        if (lifes.includes(clicked)) {
            document.getElementById(clicked).classList.toggle('oneUp');
        }
    }
}

function updateUsers(users) {
    console.dir(users);
    let usersString = '';
    Object.keys(users).forEach(function (key, index) {
        if (users[key] !== name) {
            if (usersString !== '') {
                usersString = `${usersString}, `;
            }
            usersString = `${usersString} ${users[key]}`;
        }
    });

    document.getElementById('online').innerHTML = `Usuários online: ${usersString}`;
}

var socket = io();

// var socket = io.connect('http://127.0.0.1:3000', {
//     reconnection: true,
//     reconnectionDelay: 1000,
//     reconnectionDelayMax: 5000,
//     reconnectionAttempts: 99999
// });

socket.on('connect', function () {
    console.log('connected to server');
    if (!name || name == "null" || name.trim() == "") {
        location.reload();
    }
});

socket.emit('join', name);

socket.on("update-users", function (users) {
    updateUsers(users);
});

socket.on("update-board", function (msg) {
    updateBoard(msg);
});

socket.on("start-board", function (msg) {
    startBoard(msg);
});

socket.on("disconnect", function (msg) {
    location.reload();
});

$('form').submit(function (e) {
    e.preventDefault(); // will prevent page reloading
    socket.emit('send', $('#m').val());
    return false;
});
