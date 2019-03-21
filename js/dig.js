
import {startTimer, stopTimer} from './timer.js';
import {Maze} from './Maze.js';
import {Worker} from './Worker.js';


const width = 25;
const height = 15;
let speed = 200;
let maze;
let workers;

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

const reset = () => {
    stopTimer();
    document.getElementById('btn_start').disabled = false;
    document.getElementById('btn_stop').disabled = true;
    init();
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
    reset_button.addEventListener('click', reset);
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
    maze = new Maze(width, height);
    workers = [
        new Worker(2, 2, maze),
    ];
}

const loop = () => {
    if (maze.dig_cnt >= (width * height) * 2) {
        stopTimer();
    }
    workers.forEach((worker) => {
        worker.next();
    });
}


window.addEventListener('load', () => {
    createFrame();
    init();
});



