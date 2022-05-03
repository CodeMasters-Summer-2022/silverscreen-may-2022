# parcel-scss-boilerplate

This is a boilerplate for web apps built using HTML, CSS/Scss and JavaScript and uses parcel bundler

## How to setup the boilerplate?

1. After downloading the contents of the Github repository or forking it, open the `parcel-scss-boilerplate` folder in VSCode, then run the following command to install all required node dependencies (parcel & sass):

```npm
npm install
```

2. Next, install the VSCode extension `DartJS Sass Compiler and Sass Watcher`.
3. After completing step 2 successfully, lookup `DartJS Sass Compiler and Sass Watcher` in the list of extensions, right click on the extension and then click on `Extension Settings`.
4. Scroll down to find the setting `Dartsass: Sass Bin Path` and set the path to `node_modules\sass\sass.js`.
5. Set the `Dartsass: Target Directory` path to `./src/css`.
6. Now, right click on the `src/scss` folder and click on the `DartSass: Sass Watch`.

## How to launch the application

To launch the web app, open the terminal and run the command `npm start`.
