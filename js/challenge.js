import { Maze } from './Maze2.js';
import { isKeyDown } from "./keyEvent.js";
import { Explorer } from './Explorer.js';
import { isTouch, getTouchController } from './touchEvent.js';

const maze_data = [
    `5 3`,
    `1s111`,
    `10001`,
    `111g1`,
].join('\n');
const [width, height] = [20, 20];
const cooltime = 5;
const automode = false;

let id;
let maze;
let explorer;
let req;
let rest = 0;
let start;

export const load = (_id) => {
    stopTimer();
    start = null;

    if (!id) id = _id;
    document.getElementById(id).innerText = null;
    maze = new Maze();
    // maze.setMazeData(maze_data);
    maze.createRandomMaze(width, height);
    const wrapper = document.createElement('div');
    wrapper.appendChild(createPanel());
    wrapper.appendChild(maze.createHtml());
    wrapper.appendChild(getTouchController());
    document.getElementById(id).appendChild(wrapper);
    maze.init();
    explorer = new Explorer(maze);
    timeDisp();
}


const loop = () => {
    req = requestAnimationFrame(loop);
    timeDisp();

    if (rest > 0) {
        rest--;
        return;
    }
    if (automode) {
        explorer.next();
        rest = cooltime;
    } else {
        if (isKeyDown('ArrowUp') || isTouch('up')) {
            maze.player.step(0);
            rest = cooltime;
        } else if (isKeyDown('ArrowLeft') || isTouch('left')) {
            maze.player.step(1);
            rest = cooltime;
        } else if (isKeyDown('ArrowRight') || isTouch('right')) {
            maze.player.step(2);
            rest = cooltime;
        } else if (isKeyDown('ArrowDown') || isTouch('down')) {
            maze.player.step(3);
            rest = cooltime;
        }
    }
    maze.render();
}

const timeDisp = () => {
    if (!start) start = Date.now();
    const end = Date.now();
    const time = end - start;

    document.getElementById('time').value = timeFormat(time);
};

const timeFormat = (time) => {
    const sec = parseInt(time / 1000);
    const msec = ('00' + time % 1000).slice(-3);
    return `${sec}.${msec}`;
}

const startTimer = () => {
    req = requestAnimationFrame(loop);
}
export const stopTimer = () => {
    cancelAnimationFrame(req);
}

const createPanel = () => {
    const panel = document.createElement('div');

    const time = document.createElement('input');
    time.setAttribute('id', 'time');
    panel.appendChild(time);

    const start = document.createElement('button');
    start.innerText = 'start';
    start.addEventListener('click', startTimer);
    panel.appendChild(start);

    const reset = document.createElement('button');
    reset.innerText = 'reset';
    reset.addEventListener('click', load);
    panel.appendChild(reset);
    return panel;
};
