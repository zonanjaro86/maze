import { Player } from "./Player.js";
import { createRandomMaze } from './CreateMaze.js';
import { stopTimer } from "./challenge.js";

const width_disp = 15;
const height_disp = 15;
export const Maze = class {
    constructor () {
        this.cell_size = 18;
        this.width;
        this.height;
        this.width_disp;
        this.height_disp;
        this.map;
        this.start;
        this.goal;
        this.player;
        this.ctx;
        this.offsetX = 0;
        this.offsetY = 0;
    }
    setMazeData (maze_data) {
        const {width, height, map} = parseMazeData(maze_data);
        this.analyzeMap(width, height, map);
    }
    createRandomMaze (w, h) {
        const {width, height, map} = createRandomMaze(w, h);
        this.analyzeMap(width, height, map);
    }
    analyzeMap (width, height, map) {
        this.width = width;
        this.height = height;
        this.width_disp = Math.min(width_disp, this.width);
        this.height_disp = Math.min(height_disp, this.height);
        this.map = map;
        this.map.forEach((line, y) => {
            line.forEach((cell, x) => {
                if (cell == 's') {
                    this.start = {x, y};
                } else if (cell == 'g') {
                    this.goal = {x, y};
                }
            });
        });
    }
    createHtml () {
        const canvas = document.createElement('canvas');
        canvas.width = this.cell_size * this.width_disp;
        canvas.height = this.cell_size * this.height_disp;
        canvas.style.border = '2px solid black';
        this.ctx = canvas.getContext('2d');
        return canvas;
    }
    render (isDisp = true) {
        this.offsetX = Math.floor(this.width_disp/2) - this.player.x
        this.offsetX = Math.min(this.offsetX, 0);
        this.offsetX = Math.max(this.offsetX, this.width_disp - this.width);
        this.offsetY = Math.floor(this.height_disp/2) - this.player.y
        this.offsetY = Math.min(this.offsetY, 0);
        this.offsetY = Math.max(this.offsetY, this.height_disp - this.height);
        for (let y = Math.max(0,-this.offsetY); y < this.height_disp || y < this.height; y++) {
            for (let x = Math.max(0,-this.offsetX); x < this.width_disp || x < this.width; x++) {
                const cell = this.map[y][x];
                if (isDisp) {
                    if (cell == 1) {
                        this.dot(x, y, 'gray');
                    } else if (cell == 2) {
                        this.dot(x, y, 'pink');
                    } else if (cell == 's') {
                        this.dot(x, y, '#FF82B2');
                    } else if (cell == 'g') {
                        this.dot(x, y, '#B384FF');
                    } else {
                        this.dot(x, y, 'white');
                    }
                    if (this.player && this.player.x == x && this.player.y == y) {
                        this.dot(this.player.x, this.player.y, 'red');
                    }
                } else {
                    this.dot(x, y, 'black');
                }
            }
        }
    }
    dot (x, y, style) {
        this.ctx.fillStyle = style;
        this.ctx.fillRect(this.cell_size * (x + this.offsetX), this.cell_size * (y + this.offsetY), this.cell_size - 1, this.cell_size - 1);
    }
    init () {
        this.player = new Player(this.start.x, this.start.y, 3);
        this.player.setMaze(this);
        this.render(false);
    }
    isMovable (x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height && this.map[y][x] != '1';
    }
    finish () {
        console.log('goal!!');
        stopTimer();
    }
};

const parseMazeData = (data) => {
    const data_split = data.split('\n');
    const header = data_split.shift();
    const [width, height] = header.split(' ');
    const map = data_split.map((line) => {
        return line.split('');
    });
    return {width, height, map};
};
