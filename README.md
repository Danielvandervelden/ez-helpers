# How to work with this setup
This repository is a template of <a title="Daniel van der Velden's NPM package template" href="https://github.com/Danielvandervelden/npm-package-template">this repository</a>.

## Workflow
If you need to do DOM manipulation and testing, you can run a simple http server. You'll find the index.html file in the `/view/` directory. Simply type `npm run server` to start it up. The `index.js` and `styles.css` inside the `/build/` folder are already linked.

JS development is done in Typescript. Everything thats created in the `/src/ts` directory will be transpiled down to ES5 code in the `/build/js` directory. 

To start compiling and watching your Typescript run `npm run watch-ts`.

CSS development is done in SCSS. Everything that's created in the `/src/scss` directory will be transpiled to simple css code in the `/build/css` directory.

To start compiling and watching your SCSS run `npm run watch-scss`.

Testing is done with `mocha` and `chai`. You can import your functionality in `tests/index.ts`. When you type `npm run test`, your code will be tested. This test command will grab any `*.ts` file in `/tests/` and run them. 

## Publishing
Once you're ready to publish run either of the following commands to increment your version in `package.json`:
- `npm version patch` => small bugfixes.
- `npm version minor` => adding small functionality without breaking existing code.
- `npm version major` => breaking changes that are **not** backwards compatible.

Before publishing all the Typescript code will be tested and traspiled down to ES5 (unless otherwise specified in `tsconfig.json`). All your generated `*.css` files will be run through `postcss` and `autoprefixer`.

That happens when you run `npm run pub` which, once again, tests, transpiles and prefixes your code and then publishes your package under the name and version you've given in `package.json`.