import {log, shuffle} from './util.js';
import {startTimer, stopTimer} from './timer.js';

const Cursor = class {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        document.getElementById(`${this.x}_${this.y}`).classList.add('cursor');
    }
    move(x, y) {
        document.getElementById(`${this.x}_${this.y}`).classList.remove('cursor');
        this.x = x;
        this.y = y;
        document.getElementById(`${this.x}_${this.y}`).classList.add('cursor');
    }
}

// 初期状態
const width_cell = 5;
const height_cell = 5;
const width = width_cell * 2 + 1;
const height = height_cell * 2 + 1;
const cell_size = '16';
const maze = [...Array(height)].map(() => Array(width).fill(1));

const [sx, sy] = [width_cell, height_cell];
const stock = [];
stock.push({x: sx, y: sy});

let currentStep = 0;
const next = () => {
    currentStep++;
    if (currentStep > 1) {
        currentStep = 0;
    }
}

let x, y;
let direction = null;

const dxdy = {
    0: {label: '北',dx: 0, dy: -1},
    1: {label: '西',dx: -1, dy: 0},
    2: {label: '東',dx: 1, dy: 0},
    3: {label: '南',dx: 0, dy: 1},
}
let cursor;

const init = () => {
    const fragment = document.createDocumentFragment();

    const start_button = document.createElement('button');
    start_button.innerText = 'start';
    start_button.setAttribute('id', 'btn_start');
    start_button.addEventListener('click', start);
    fragment.appendChild(start_button);

    const stop_button = document.createElement('button');
    stop_button.innerText = 'stop';
    stop_button.setAttribute('id', 'btn_stop');
    stop_button.addEventListener('click', stop);
    stop_button.disabled = true;
    fragment.appendChild(stop_button);

    const table = document.createElement('table');
    table.style.width = `${cell_size * width}px`;
    table.style.height = `${cell_size * height}px`;
    maze.forEach((line, y) => {
        const tr = document.createElement('tr');
        line.forEach((cell, x) => {
            const td = document.createElement('td');
            td.setAttribute('id', `${x}_${y}`);
            if (cell !== 0) {
                td.classList.add('wall');
            }
            tr.appendChild(td);
        });
        table.appendChild(tr);
    })
    fragment.appendChild(table);

    const ul = document.createElement('ul');
    ul.setAttribute('id', 'log');
    fragment.appendChild(ul);

    document.body.appendChild(fragment);

    cursor = new Cursor(sx, sy);
};

const dig = (x, y) => {
    maze[y][x] = 0;
    const tgt = document.getElementById(`${x}_${y}`);
    tgt.classList.remove('wall');
}


const stop = () => {
    document.getElementById('btn_start').disabled = false;
    document.getElementById('btn_stop').disabled = true;
    stopTimer();
}

const start = () => {
    document.getElementById('btn_start').disabled = true;
    document.getElementById('btn_stop').disabled = false;
    startTimer(loop, 500);
}
   
let loop_cnt = 1;
const loop = () => {
    if (currentStep == 0) {
        if (stock.length == 0) {
            stopTimer();
            log(`${loop_cnt}:\tもう掘れるところが無い！完了！`);
            dig(1,0);
            dig(width - 2, height - 1);
            return;
        }
        const {x:_x, y:_y} = stock.pop();
        [x, y] = [_x, _y];
        cursor.move(x, y);
    
        const directions = shuffle([0, 1, 2, 3]);
        for (let i = 0; i < 4; i++) {
            direction = directions[i];
            const {dx, dy} = dxdy[direction];
            if (y + dy * 2 < height && x + dx * 2 < width
                && y + dy * 2 >= 0 && x + dx * 2 >= 0
                && maze[y + dy * 2][x + dx * 2] == 1) {
                    break;
            } else {
                direction = null;
            }
        }
        if (direction !== null) {
            const {label} = dxdy[direction]
            log(`${loop_cnt}:\t${label}を掘るよ`);
        } else {
            log(`${loop_cnt}:\t掘れるところが無い`);
        }
        next();
    } else if (currentStep == 1) {
        if (direction !== null) {
            const {dx, dy} = dxdy[direction];
            log(`${loop_cnt}:\t掘った`);
            dig(x + dx, y + dy);
            dig(x + dx * 2, y + dy * 2);
            stock.push({x, y});
            stock.push({x: x + dx * 2, y: y + dy * 2});
        }　else {
            log(`${loop_cnt}:\t戻るよ`);
        }
        next();
    }
    loop_cnt++;
}

init();
dig(sx, sy);



