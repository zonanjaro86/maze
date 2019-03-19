export const log = (str) => {
    console.log(str);
}

export const shuffle = (array) => {
    for(var i = array.length - 1; i > 0; i--){
        var r = Math.floor(Math.random() * (i + 1));
        var tmp = array[i];
        array[i] = array[r];
        array[r] = tmp;
        return array;
    }
}