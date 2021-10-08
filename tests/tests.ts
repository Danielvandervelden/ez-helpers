import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import 'mocha';
import { finished } from 'stream';
import { toArray, addListener, throttle } from '../src/ts/index';

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

