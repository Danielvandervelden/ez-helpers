import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import 'mocha';
import { finished } from 'stream';
import { toArray, addListener, throttle, findNode } from '../src/ts/index';

describe('validating toArray function', () => {
	it('should return an array, while passing in a nodelist', () => {
		const dom = new JSDOM('<!DOCTYPE html><body><div class="container"><div class="container"><div class="container"></div></body>');
		
		const nodelist = dom.window.document.querySelectorAll('.container');
		const result = toArray(nodelist);
		expect(result).to.be.an('array');
	})
})

describe('validating addListener function', () => {
	it('should add an eventlistener on the given element', () => {
		const dom = new JSDOM('<!DOCTYPE html><body></body>');
		const button = dom.window.document.createElement('button');
		addListener(button, "click", executeFunction);

		button.click();

		let works = false;

		function executeFunction() {
			works = true;

			expect(works).to.equal(true);
		}
	})
})

describe('validating throttle function', () => {
	it('function should only execute once', () => {
		const dom = new JSDOM('<!DOCTYPE html><body></body>');
		let counter = 0;
		const button = dom.window.document.createElement('button');
		addListener(button, "click", throttle(executeFunction, 50));
		
		for(let i=0;i<=10;i++) {
			button.click();

			if(i > 8) {
				finished();
			}
		}

		function executeFunction() {
			counter += 1;
		}

		function finished() {
			expect(counter).to.be.lessThanOrEqual(1);
		}
	})
})

describe('validating findNode function', () => {
	it('function should return proper nodes', () => {
		const dom = new JSDOM('<!DOCTYPE html><body><div id="parent" data-fok="mand" class="level0"><div class="level1"><div class="level2"></div></div></div></body>');
		const div0 : HTMLElement = dom.window.document.querySelector('.level0')!;
		const div2 : HTMLElement = dom.window.document.querySelector('.level2')!;

		// /** First find single child */
		const result1 = findNode("child", div0, '.level2');
		const result2 = findNode("child", div0, 'div', true);
		const result3 = findNode("parent", div2, '#parent');
		const result4 = findNode("parent", div2, '[data-fok]', true);

		expect(result1).to.not.be.null;
		expect(result2).to.be.instanceOf(Array);
		expect(result2).to.have.length.above(0);
		expect(result1).to.not.be.null;
		expect(result4).to.be.instanceOf(Array);
		expect(result4).to.have.length.above(0);
	})
})