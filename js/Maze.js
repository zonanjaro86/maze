const cell_size = 16;

export const Maze = class {
    constructor (width, height) {
        this.dig_cnt = 0;
        this.width = width * 2 + 3;
        this.height = height * 2 + 3;
        this.map = this.createMap();
        this.draw();
        this.dig(2, 1); // start
        this.dig(this.width - 3, this.height - 2); // goal
    }
    createMap () {
        const map = [...Array(this.height)].map(() => Array(this.width).fill(1));
        map[0].fill(0);
        map[this.height-1].fill(0);
        map.forEach((_, i) => {
            map[i][0] = 0;
            map[i][this.width-1] = 0;
        });
        return map;
    }
    draw () {
        document.getElementById('maze').innerText = null;
        const table = document.createElement('table');
        table.style.width = `${cell_size * this.width + 2 * (this.width+1)}px`;
        table.style.height = `${cell_size * this.height + 2 * (this.height+1)}px`;
        this.map.forEach((line, y) => {
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
    }
    dig (x, y) {
        this.map[y][x] = 0;
        const tgt = document.getElementById(`${x}_${y}`);
        if (tgt) {
            tgt.classList.remove('wall');
            this.dig_cnt++;
            return true;
        } else {
            return false;
        }
    }
    addWorker (worker) {
        this.workers.push(worker);
    }
    next () {
        this.workers.forEach((worker) => {
            worker.next();
        });
    }
}