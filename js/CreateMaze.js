import { shuffle } from "./util.js";


const dxdy = {
    0: {dx: 0,  dy: -1},
    1: {dx: -1, dy: 0},
    2: {dx: 1,  dy: 0},
    3: {dx: 0,  dy: 1},
}

export const createRandomMaze = (w = 5, h = 5) => {
    const width = w * 2 + 1;
    const height = h * 2 + 1;

    const map = [...Array(height)].map(() => Array(width).fill(1));
    map[0][1] = 's';
    map[height-1][width-2] = 'g';
    map[1][1] = 0;
    let stock = ['1-1'];
    let loop_cnt = 0;
    while (stock.length > 0) {
        const [px, py] = stock.pop().split('-').map(Number);

        // ランダムで4方向から選ぶ（進行できないものは除く）
        const dir = shuffle([0,1,2,3]).find((d) => {
            const {dx, dy} = dxdy[d];
            const [x, y] = [px + dx*2, py + dy*2];
            return x > 0 && y > 0 && x < width && y < height && map[y][x] == 1;
        });
        if (dir !== undefined) {
            const {dx, dy} = dxdy[dir];
            map[py + dy][px + dx] = 0;
            map[py + dy*2][px + dx*2] = 0;
            stock.push(`${px}-${py}`);
            stock.push(`${px+dx*2}-${py+dy*2}`);
        } else {
            shuffle(stock);
        }
        loop_cnt++;
    }
    return {width, height, map};
}
