'use strict';

import http from 'http';
import path from 'path';
import express from 'express';
import exphbs from 'express-handlebars';
import PathConfig from './server-dist/models/path-config';
import bodyParser from 'body-parser';
import compression from 'compression';
import Form from './server-dist/models/form';
import session from 'express-session';

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

// Setup body parser for parsing POST request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// setup session middleware
app.use(session({
    secret: 'shhhhhh',
    cookie: { maxAge: 20 * 60 * 1000 }, // 20 * 60 seconds * 1000ms
    unset: 'destroy',
    resave: true,
    saveUninitialized: false,
    sameSite: true
}));

let port = process.env.port || 3000;

// POST route for form submission
app.post('/', (req, res) => {
    // validate the model
    let form = new Form();
    form.validate(req.body).then((errors, values) => {
        if (!errors) {
            res.redirect('/success');
        } else {
            // store errors in session
            req.session.validationErrors = errors;
            req.session.formValues = values;
            res.redirect('/');
        }
    });
});

// setup server urls
app.get('/*', function(req, res) {
    // extract the path from the url
    let urlSections = req.path.split('/');
    urlSections = urlSections.filter((sectionString) => {
        return sectionString.length > 0;
    });

    let urlPath = null;
    if (urlSections.length === 0) {
        if (urlSections[0] === '') {}
        urlPath = '/';
    } else {
        urlPath = '/' + urlSections.join('/');
    }

    // retrieve the path data
    let pathConfigData = pathConfig.getConfig(urlPath);
    if (!pathConfigData) {
        res.status(404).send();
        return;
    }

    // load the validation errors in the view data
    pathConfigData.validationErrors = req.session.validationErrors;
    pathConfigData.formValues = req.session.formValues;
    // clear the validation errors from the session as they have already been shown
    req.session.validationErrors = [];
    req.session.formValues = [];

    // render the response
    res.render(pathConfigData.data.view, pathConfigData);
});

// only create two servers if running on localhost
http.createServer(app).listen(port, () => {
    return console.log(`Running Example on localhost:${port}`);
});

module.exports = app;
