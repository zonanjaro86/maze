const dxdy = {
    0: {label: 'north',dx: 0, dy: -1},
    1: {label: 'west',dx: -1, dy: 0},
    2: {label: 'east',dx: 1, dy: 0},
    3: {label: 'south',dx: 0, dy: 1},
}
export const Player = class {
    constructor (x, y, dir = 0) {
        this.x = x;
        this.y = y;
        this.dir = dir;
        this.maze;
    }
    step (dir) {
        const {dx, dy} = dxdy[dir];
        const [x, y] = [this.x + dx, this.y + dy];
        if (!this.maze.isMovable(x, y)) return;

        // 情報を更新
        [this.x, this.y] = [x, y];
        this.dir = dir;
        if (this.maze.map[y][x] == '0') {
            this.maze.map[y][x] = '2';
        } else if (this.maze.map[y][x] == 'g') {
            this.maze.finish();
        }
        this.maze.render();

    }
    setMaze (maze) {
        this.maze = maze;
    }
}
