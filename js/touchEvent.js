const touchMap = {};

export const getTouchController = () => {
    const controller = document.createElement('div');
    controller.classList.add('sp');
    controller.style.width = '100%';
    controller.style.height = '100px';
    controller.style.background = 'url(./img/controller.svg) 100%';
    // controller.style.background-size = '100%';
    controller.addEventListener('touchstart', touchEvent);
    controller.addEventListener('touchmove', touchEvent);
    controller.addEventListener('touchend', touchEvent);
    controller.addEventListener('touchcancel', touchEvent);
    return controller;
}

export const isTouch = (key) => {
    return touchMap[key];
}

const touchEvent = (e) => {
    switch (e.type) {
        case 'touchstart':
            changeFlag(e);
            break;
        case 'touchmove':
            changeFlag(e);
            break;
        case 'touchend':
        case 'touchstart':
            clearFlag(e);
            break;

        default:
            break;
    }
}

const changeFlag = (e) => {
    let {left, top, width, height} = e.target.getBoundingClientRect();
    const x = e.touches[0].clientX - left;
    const y = e.touches[0].clientY - top;
    const ur = (y) * width <= (x) * height;
    const ul = (y) * width <= (width - x) * height;
    clearFlag();
    if (ur && ul) {
        touchMap['up'] = true;
    } else if (ur && !ul) {
        touchMap['right'] = true;
    } else if (!ur && ul) {
        touchMap['left'] = true;
    } else {
        touchMap['down'] = true;
    }
}
const clearFlag = (e) => {
    touchMap['up'] = false;
    touchMap['left'] = false;
    touchMap['right'] = false;
    touchMap['down'] = false;
}