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

const dxdy = {
    0: {label: '北',dx: 0, dy: -1},
    1: {label: '西',dx: -1, dy: 0},
    2: {label: '東',dx: 1, dy: 0},
    3: {label: '南',dx: 0, dy: 1},
}

/**
 * パラメータ
 */
const width_cell = 10;
const height_cell = 10;
const cell_size = '16';
const width = width_cell * 2 + 1;
const height = height_cell * 2 + 1;
const maze = [...Array(height)].map(() => Array(width).fill(1));

// 掘り始めの座標
const [sx, sy] = [1, 1];

// 穴掘りの起点となる座標をストックで保持
const stock = [];
stock.push({x: sx, y: sy});

let currentStep = 0;
const next = () => {
    currentStep++;
    if (currentStep > 1) {
        currentStep = 0;
    }
}

// 初期処理
const init = () => {
    const fragment = document.createDocumentFragment();

    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.flexWrap = 'wrap'
    fragment.appendChild(wrapper);

    const left = document.createElement('div');
    wrapper.appendChild(left);

    const start_button = document.createElement('button');
    start_button.innerText = 'start';
    start_button.setAttribute('id', 'btn_start');
    start_button.addEventListener('click', start);
    left.appendChild(start_button);

    const stop_button = document.createElement('button');
    stop_button.innerText = 'stop';
    stop_button.setAttribute('id', 'btn_stop');
    stop_button.addEventListener('click', stop);
    stop_button.disabled = true;
    left.appendChild(stop_button);

    const table = document.createElement('table');
    table.style.width = `${cell_size * width + 2 * (width+1)}px`;
    table.style.height = `${cell_size * height + 2 * (height+1)}px`;
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
    left.appendChild(table);

    document.body.appendChild(fragment);

    const right = document.createElement('div');
    right.style.overflow = 'auto scroll ';
    right.style.height = `500px`;
    right.style.width = `300px`;
    wrapper.appendChild(right);

    const ul = document.createElement('ul');
    ul.setAttribute('id', 'log');
    right.appendChild(ul);


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
    startTimer(loop, 0);
}

// ループ用変数
let x, y;
let direction = null;
let cursor;
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

window.addEventListener('load', () => {
    init();
    dig(sx, sy);
});



