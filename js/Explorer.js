import { shuffle } from "./util.js";

const dxdy = {
    0: {label: 'north',dx: 0, dy: -1, reverse: 3},
    1: {label: 'west',dx: -1, dy: 0, reverse: 2},
    2: {label: 'east',dx: 1, dy: 0, reverse: 1},
    3: {label: 'south',dx: 0, dy: 1, reverse: 0},
}

export const Explorer = class {
    constructor (maze) {
        this.maze = maze;
        this.history = [];
        this.arrived = ['1_0'];
    }
    next () {
        // 現在の座標
        const px = this.maze.player.x;
        const py = this.maze.player.y;

        // 進行方向をランダムで選択
        const next = shuffle([0,1,2,3]).find((dir) => {
            const {dx, dy} = dxdy[dir];
            const [nx, ny] = [px + dx, py + dy];
            return this.maze.isMovable(nx, ny) && !this.isArrived(nx, ny);
        });
        if (next !== undefined) {
            this.maze.player.step(next);
            this.arrived.push(`${this.maze.player.x}_${this.maze.player.y}`);
            this.history.push(next);
        } else {
            const prev = this.history.pop();
            this.maze.player.step(dxdy[prev].reverse);
        }
    }
    isArrived(x, y) {
        return this.arrived.indexOf(`${x}_${y}`) !== -1;
    }
}