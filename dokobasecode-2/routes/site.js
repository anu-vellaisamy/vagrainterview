"use strict";

module.exports = (app) => {
    try {

        // controller files
        const product = require('../controller/site/product.js')();        

        app.post('/site/generateproduct', product.generateProduct);
        app.post('/site/getproduct', product.getList);
        app.post('/site/clearcache', product.clearCache);
        app.post('/site/getcache', product.getCache);
        

    } catch (e) {
        console.log(e);
    }
};