'use strict';

import http from 'http';
import path from 'path';
import express from 'express';
import exphbs from 'express-handlebars';
import PathConfig from './server-dist/models/path-config.js';
import compression from 'compression';

let app = express();
app.use(compression());

let viewsDir = './server-dist/views';
let pathConfig = new PathConfig(`/../../src`);

// setup express to use handlebars as the templating engine
let hbs = exphbs.create({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, `${viewsDir}/layouts`),
    partialsDir: path.join(__dirname, `${viewsDir}/partials`)
});
app.set('views', path.join(__dirname, `${viewsDir}`));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// setup server for static assets
app.use('/', express.static(path.join(__dirname, '/src'), { maxAge: 604800000 }));

let port = process.env.port || 3000;

// setup server urls
app.get('/*', function(req, res) {
    // extract the path from the url
    let urlSections = req.path.split('/');
    urlSections = urlSections.filter(function(sectionString) {
        return sectionString.length > 0;
    });

    let urlPath = null;
    if (urlSections.length === 0) {
        urlPath = '/';
    } else {
        urlPath = '/' + urlSections[1];
    }

    // retrieve the path data
    let pathConfigData = pathConfig.getConfig(urlPath);
    if (!pathConfigData) {
        res.status(404).send();
        return;
    }
    // render the response
    res.render(pathConfigData.data.view, pathConfigData);
});

// only create two servers if running on localhost
http.createServer(app).listen(port, () => {
    return console.log(`Running Example on localhost:${port}`);
});

module.exports = app;
