import {log, shuffle} from './util.js';
import {startTimer, stopTimer} from './timer.js';


/**
 * 定数
 */
const cell_size = '16';
const width_cell = 5;
const height_cell = 5;
const width = (width_cell + 1) * 2 + 1;
const height = (height_cell + 1) * 2 + 1;
const dxdy = {
    0: {label: 'north',dx: 0, dy: -1},
    1: {label: 'west',dx: -1, dy: 0},
    2: {label: 'east',dx: 1, dy: 0},
    3: {label: 'south',dx: 0, dy: 1},
}


/**
 * 変数
 */
let speed = 200;
let maze;
let workers;
let dig_cnt;

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


const Worker = class extends Cursor {
    constructor(x, y, dir = 0) {
        super(x, y);
        this.dir = dir;
        this.memo = {};
        this.step = 0;
        this.dig();
        this.dig();
    }
    getdxdy(dir = this.dir, mag = 1) {
        const {dx, dy} = dxdy[dir];
        const [x, y] = [this.x + dx * mag, this.y + dy * mag];
        return [x, y];
    }
    // 目の前を掘る
    dig () {
        const [x, y] = this.getdxdy(this.dir, 1);
        const result = dig(x, y);
        if (result) {
            this.move(x, y);
        }
    }
    // 周囲の掘れる方向を確認
    search () {
        const index = `${this.x}_${this.y}`;

        const searchList = this.memo[index] ? this.memo[index] : [0, 1, 2, 3];
        const dirList = [];
        searchList.forEach((dir) => {
            const [x, y] = this.getdxdy(dir, 2);
            if (maze[y][x] == 1) {
                dirList.push(dir);
            }
        });
        this.memo[index] = dirList;
        return this.memo[index].length > 0;
    }
    next () {
        if (this.step == 0) {
            // search
            if (this.search()) {
                this.dir = shuffle(this.memo[`${this.x}_${this.y}`]).pop();
                log(`search: dir ${dxdy[this.dir].label}`);
            } else {
                this.step = 2;
                log(`search: no dig`);
                return;
            }
            
            // dig
            this.dig (...this.getdxdy(this.dir, 1));
            this.dig (...this.getdxdy(this.dir, 2));
            this.step = 0;
        } else if (this.step == 2) {
            // warp
            const keys = shuffle(Object.keys(this.memo));
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                if (this.memo[key].length > 0) {
                    this.move(...key.split('_').map(Number));
                    this.step = 0;
                    log('warp');
                    return;
                }
            }
        }
    }
}


const dig = (x, y) => {
    maze[y][x] = 0;
    const tgt = document.getElementById(`${x}_${y}`);
    if (tgt) {
        tgt.classList.remove('wall');
        dig_cnt++;
        return true;
    } else {
        return false;
    }
}

const stop = () => {
    document.getElementById('btn_start').disabled = false;
    document.getElementById('btn_stop').disabled = true;
    stopTimer();
}

const start = () => {
    document.getElementById('btn_start').disabled = true;
    document.getElementById('btn_stop').disabled = false;
    startTimer(loop, speed);
}

const changeSpeed = (e) => {
    speed = e.target.options[e.target.selectedIndex].value;
    if (document.getElementById('btn_start').disabled) {
        stopTimer();
        startTimer(loop, speed);
    }
}

// DOMの作成
const createFrame = () => {
    const fragment = document.createDocumentFragment();

    const wrapper = document.createElement('div');
    wrapper.setAttribute('id', 'wrapper');
    wrapper.style.display = 'flex';
    wrapper.style.flexWrap = 'wrap'
    fragment.appendChild(wrapper);

    const left = document.createElement('div');
    left.setAttribute('id', 'left');
    wrapper.appendChild(left);

    const buttons = document.createElement('div');
    left.appendChild(buttons);

    const start_button = document.createElement('button');
    start_button.innerText = 'start';
    start_button.setAttribute('id', 'btn_start');
    start_button.addEventListener('click', start);
    buttons.appendChild(start_button);

    const stop_button = document.createElement('button');
    stop_button.innerText = 'stop';
    stop_button.setAttribute('id', 'btn_stop');
    stop_button.addEventListener('click', stop);
    stop_button.disabled = true;
    buttons.appendChild(stop_button);

    const reset_button = document.createElement('button');
    reset_button.innerText = 'reset';
    reset_button.setAttribute('id', 'btn_reset');
    reset_button.addEventListener('click', init);
    buttons.appendChild(reset_button);

    const next_button = document.createElement('button');
    next_button.innerText = '>';
    next_button.setAttribute('id', 'btn_next');
    next_button.addEventListener('click', loop);
    buttons.appendChild(next_button);

    const speed_select = document.createElement('select');
    speed_select.addEventListener('change', changeSpeed);
    buttons.appendChild(speed_select);

    const option1 = document.createElement('option');
    option1.label = '激遅'
    option1.value = 1000;
    speed_select.appendChild(option1);

    const option2 = document.createElement('option');
    option2.label = '遅い'
    option2.value = 400;
    speed_select.appendChild(option2);

    const option3 = document.createElement('option');
    option3.label = '普通'
    option3.value = 200;
    option3.selected = true;
    speed_select.appendChild(option3);

    const option4 = document.createElement('option');
    option4.label = '速い'
    option4.value = 50;
    speed_select.appendChild(option4);

    const option5 = document.createElement('option');
    option5.label = '激速'
    option5.value = 0;
    speed_select.appendChild(option5);

    const maze_wrap = document.createElement('div');
    maze_wrap.setAttribute('id', 'maze');
    left.appendChild(maze_wrap);

    const right = document.createElement('div');
    right.style.overflow = 'auto scroll ';
    right.style.height = `500px`;
    right.style.width = `300px`;
    wrapper.appendChild(right);

    const ul = document.createElement('ul');
    ul.setAttribute('id', 'log');
    right.appendChild(ul);

    document.body.appendChild(fragment);
};

// 初期処理
const init = () => {
    stopTimer();
    document.getElementById('btn_start').disabled = false;
    document.getElementById('btn_stop').disabled = true;

    maze = [...Array(height)].map(() => Array(width).fill(1));
    maze[0].fill(0);
    maze[height-1].fill(0);
    maze.forEach((_, i) => {
        maze[i][0] = 0;
        maze[i][width-1] = 0;
    });

    dig_cnt = 0;

    document.getElementById('maze').innerText = null;
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
    document.getElementById('maze').appendChild(table);

    workers = [
        new Worker(2, 0, 3),
        // new Worker(width-3, height-3)
    ];
}

const loop = () => {
    if (dig_cnt >= (width_cell * height_cell) * 2 - 1) {
        stopTimer();
    }
    workers.forEach((worker) => {
        worker.next();
    });
    console.log(dig_cnt);
}


window.addEventListener('load', () => {
    createFrame();
    init();
});



