import {log, shuffle} from './util.js';
import {startTimer, stopTimer} from './timer.js';

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

const init = () => {
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
    document.body.appendChild(table);

    const ul = document.createElement('ul');
    ul.setAttribute('id', 'log');
    document.body.appendChild(ul);
};

const dig = (x, y) => {
    maze[y][x] = 0;
    const tgt = document.getElementById(`${x}_${y}`);
    tgt.classList.remove('wall');
}

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


const main = () => {
    init();
    
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
    const cursor = new Cursor(sx, sy);
    
    dig(sx, sy);
    let loop_cnt = 1;
    const loop = () => {
        if (currentStep == 0) {
            if (stock.length == 0) {
                stopTimer();
                log(`${loop_cnt}:もう掘れるところが無いよ`);
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
                log(`${loop_cnt}:${label}を掘るよ`);
            } else {
                log(`${loop_cnt}:掘れるところが無い`);
            }
            next();
        } else if (currentStep == 1) {
            if (direction !== null) {
                const {dx, dy} = dxdy[direction];
                log(`${loop_cnt}:掘った`);
                dig(x + dx, y + dy);
                dig(x + dx * 2, y + dy * 2);
                stock.push({x, y});
                stock.push({x: x + dx * 2, y: y + dy * 2});
            }　else {
                log(`${loop_cnt}:戻るよ`);
            }
            next();
        }
        loop_cnt++;
    }
    startTimer(loop, 200);
}
main();



