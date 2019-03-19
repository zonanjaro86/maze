let timer;
export const startTimer = (func, msec) => {
    if (timer) clearInterval(timer);
    timer = setInterval(func, msec);
}
export const stopTimer = () => {
    if (timer) clearInterval(timer);
}