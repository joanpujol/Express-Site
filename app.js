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
    // Based on the parameter passed, gets a project
    let project = data.projects[req.params.id];
    const context = Object.assign({
        project
    }, common);
    
    res.render("project", context);
});

// Every other page
app.use((req, res, next) => {
    // Creates an error with status 404 if the page wasn't found
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

// Error handling middleware
app.use((error, req, res, next) => {
    const context = Object.assign({
        error
    }, common);
    res.render("error", context);
});

// Run npm start to serve the app on port 3000
app.listen(3000);
