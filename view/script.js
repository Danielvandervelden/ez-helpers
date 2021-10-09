import { findNode } from './build/js/index.js';

const div = document.getElementById('child');
const parent = findNode("parent", div, '[data-fok]');


console.log(parent);