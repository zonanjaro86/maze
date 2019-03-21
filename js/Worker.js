import {Cursor} from './Cursor.js';
import {shuffle, log} from './util.js';

const dxdy = {
    0: {label: 'north',dx: 0, dy: -1},
    1: {label: 'west',dx: -1, dy: 0},
    2: {label: 'east',dx: 1, dy: 0},
    3: {label: 'south',dx: 0, dy: 1},
}

export const Worker = class extends Cursor {
    constructor(x, y, maze) {
        super(x, y);
        this.dir = 0;
        this.memo = {};
        this.step = 0;
        this.maze = maze;
        maze.dig(x, y);
    }
    getdxdy(dir = this.dir, mag = 1) {
        const {dx, dy} = dxdy[dir];
        const [x, y] = [this.x + dx * mag, this.y + dy * mag];
        return [x, y];
    }
    // 目の前を掘る
    dig () {
        const [x, y] = this.getdxdy(this.dir, 1);
        const result = this.maze.dig(x, y);
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
            if (this.maze.map[y][x] == 1) {
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
            } else {
                this.step = 2;
                log(`no dig`);
                return;
            }

            // dig
            this.dig (...this.getdxdy(this.dir, 1));
            this.dig (...this.getdxdy(this.dir, 2));
            this.step = 0;
            log(`dig ${dxdy[this.dir].label}`);
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