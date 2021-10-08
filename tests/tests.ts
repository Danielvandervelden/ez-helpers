import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import 'mocha';
import { toArray } from '../src/ts/index';

describe('validating toArray function', () => {
		it('should return an array, while passing in a nodelist', () => {
			const dom = new JSDOM('<!DOCTYPE html><body><div class="container"><div class="container"><div class="container"></div></body>');
			
			const nodelist = dom.window.document.querySelectorAll('.container');
			const result = toArray(nodelist);
			expect(result).to.be.an('array');
		})
	})