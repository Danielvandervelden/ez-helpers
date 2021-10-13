import { addListener, scrollTo } from './build/js/index.js';

const blue = document.getElementById('blue');
const red = document.getElementById('red');
const green = document.getElementById('green');
const purple = document.getElementById('purple');

addListener(blue, "click touchend", scrollTo.bind(null, purple, 200, 0));
addListener('#red', "click touchend", scrollTo.bind(null, purple, 200, 0));
addListener(green, "click touchend", scrollTo.bind(null, blue, 200, 0));
addListener("#purple", "click touchend", scrollTo.bind(null, blue, 200, 0));