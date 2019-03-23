
const keyMap = {};
document.addEventListener('keydown', (e) => {
    if (e.keyCode >= 37 && e.keyCode <= 40) {
        keyMap[e.key] = true;
        e.preventDefault();

    }
});
document.addEventListener('keyup', (e) => {
    if (e.keyCode >= 37 && e.keyCode <= 40) {
        keyMap[e.key] = false;
        e.preventDefault();
    }
});

export const isKeyDown = (key) => keyMap[key];