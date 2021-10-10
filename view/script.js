import { addListener, setObserver } from './build/js/index.js';

const div = document.getElementById('child');
const button = document.getElementById('swap');
const destroy = document.getElementById('destroy');

addListener(button, "click touchend", swapClass);

function swapClass() {
	div.classList.toggle("hoerenlijer");
}

const observer = setObserver(div, logStuff);


console.log(observer instanceof MutationObserver);
function logStuff() {
	console.log("CHANGED WAJOOO");
}

addListener(destroy, "click touchend", murder);

function murder() {
	observer.disconnect();
}