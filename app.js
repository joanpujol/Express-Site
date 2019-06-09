const express = require("express");

// Data contains all the information to be passed to the templates
const data = require("./data");

const app = express();

app.set("view engine", "pug");
app.use('/static', express.static('public'));

// This information must be included in every template
const common = {
    common: data.common,
}

// Home page
app.get('/', function (req, res) {
    const context = Object.assign({
        index: data.index,
        projects: data.projects
    }, common);
    
    res.render("index", context);
});

// About page
app.get('/about', function (req, res, next) {
    const context = Object.assign({
        about: data.about
    }, common);

    res.render("about", context);
});

// Project page
app.get('/project/:id', function (req, res, next) {
    const id = parseInt(req.params.id);

    // Added validation to check if requested project exists
    const projectIds = getProjectIds(data.projects);
    if(!projectIds.includes(id)) {
        raiseNotFoundError(next);
    } else {
        // Based on the parameter passed, gets a project
        let project = data.projects[id];
        const context = Object.assign({
            project
        }, common);

        res.render("project", context);
    }
});


// The following middleware is to prevent GET /favicon.ico
// Credit to Blair Anderson - (https://stackoverflow.com/questions/35408729/express-js-prevent-get-favicon-ico/35408810)
app.use((req, res, next) => {
    if (req.originalUrl === '/favicon.ico') {
        res.status(204).json({nope: true});
    } else {
        next();
    }
});

// Every other page
app.use((req, res, next) => {
    raiseNotFoundError(next);
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error(`The following page has not been found: ${req.url}`);
    const context = Object.assign({
        error
    }, common);
    res.render("error", context);
});

// * * * Helper functions * * *
const getProjectIds = (projects) => {
    // Credit to Flavio (flaviocopes.com) for the following gem:
    return [...new Set(projects.map(project => project.id))]
}

const raiseNotFoundError = (nextFunc) => {
    // Creates an error with status 404 if the page wasn't found
    const error = new Error("Not found");
    error.status = 404;
    nextFunc(error);
}

// Run npm start to serve the app on port 3000
app.listen(3000);
