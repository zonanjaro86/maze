
import {startTimer, stopTimer} from './timer.js';
import {Maze} from './Maze.js';
import {Worker} from './Worker.js';


let width = 20;
let width_tmp = width;
let height = 10;
let height_tmp = height;
let speed = 200;
let maze;
let workers;

export const load = (id) => {
    createFrame(id);
    init();
}

const init = () => {
    if (width_tmp  > 100) width_tmp  = 100;
    if (width_tmp  < 2)   width_tmp  = 2;
    if (height_tmp > 100) height_tmp = 100;
    if (height_tmp < 2)   height_tmp = 2;
    width = width_tmp;
    height = height_tmp;
    maze = new Maze(width, height);
    workers = [
        new Worker(2, 2, maze),
    ];
}

const loop = () => {
    if (maze.dig_cnt >= (width * height) * 2) {
        stop();
    }
    workers.forEach((worker) => {
        worker.next();
    });
}

// ループ停止
const stop = () => {
    document.getElementById('btn_start').disabled = false;
    document.getElementById('btn_stop').disabled = true;
    stopTimer();
}

// ループ開始
const start = () => {
    document.getElementById('btn_start').disabled = true;
    document.getElementById('btn_stop').disabled = false;
    startTimer(loop, speed);
}

// リセット
const reset = () => {
    stopTimer();
    document.getElementById('btn_start').disabled = false;
    document.getElementById('btn_stop').disabled = true;
    init();
}

// ループ速度変更
const changeSpeed = (e) => {
    speed = e.target.options[e.target.selectedIndex].value;
    if (document.getElementById('btn_start').disabled) {
        stopTimer();
        startTimer(loop, speed);
    }
}

// DOMの作成
const createFrame = (id) => {
    const fragment = document.createDocumentFragment();

    // 外枠
    const wrapper = document.createElement('div');
    wrapper.setAttribute('id', 'wrapper');
    fragment.appendChild(wrapper);

    // main
    const main = document.createElement('div');
    main.setAttribute('id', 'main');
    wrapper.appendChild(main);

    // 迷路のサイズ
    main.appendChild(getSize());

    // 制御ボタン
    main.appendChild(getButtons());

    // 速度調節
    main.appendChild(getSpeedSelect());

    // 迷路の枠
    const maze_wrap = document.createElement('div');
    maze_wrap.setAttribute('id', 'maze');
    main.appendChild(maze_wrap);

    // sub
    const sub = document.createElement('div');
    sub.setAttribute('id', 'sub');
    wrapper.appendChild(sub);

    // ログ出力
    const ul = document.createElement('ul');
    ul.setAttribute('id', 'log');
    sub.appendChild(ul);

    document.getElementById(id).appendChild(fragment);
};

const getButtons = () => {
    const buttons = document.createElement('div');

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
    reset_button.addEventListener('click', reset);
    buttons.appendChild(reset_button);

    const next_button = document.createElement('button');
    next_button.innerText = '>';
    next_button.setAttribute('id', 'btn_next');
    next_button.addEventListener('click', loop);
    buttons.appendChild(next_button);

    return buttons;
}

const getSpeedSelect = () => {
    const speed_select = document.createElement('select');
    speed_select.addEventListener('change', changeSpeed);

    const option1 = document.createElement('option');
    option1.label = '0.2倍速'
    option1.value = 1000;
    speed_select.appendChild(option1);

    const option2 = document.createElement('option');
    option2.label = '0.5倍速'
    option2.value = 400;
    speed_select.appendChild(option2);

    const option3 = document.createElement('option');
    option3.label = '1倍速'
    option3.value = 200;
    option3.selected = true;
    speed_select.appendChild(option3);

    const option4 = document.createElement('option');
    option4.label = '4倍速'
    option4.value = 50;
    speed_select.appendChild(option4);

    const option5 = document.createElement('option');
    option5.label = '20倍速'
    option5.value = 0;
    speed_select.appendChild(option5);

    return speed_select;
}

const getSize = () => {
    const fragment = document.createDocumentFragment();

    const input_width = document.createElement('input');
    input_width.setAttribute('type', 'number');
    input_width.setAttribute('min', '2');
    input_width.setAttribute('max', '100');
    input_width.value = width;
    input_width.addEventListener('change', (e) => {
        width_tmp = e.target.value;
    });
    fragment.appendChild(input_width);

    const input_height = document.createElement('input');
    input_height.setAttribute('type', 'number');
    input_height.setAttribute('min', '2');
    input_height.setAttribute('max', '100');
    input_height.value = height;
    input_height.addEventListener('change', (e) => {
        height_tmp = e.target.value;
    });
    fragment.appendChild(input_height);

    return fragment;
}