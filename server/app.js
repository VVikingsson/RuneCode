const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const history = require('connect-history-api-fallback');
const routes = require("./routes");


function connectToDB(mongoURI) {
    mongoose.connect(mongoURI).catch(function(err) {
        console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`);
        console.error(err.stack);
        process.exit(1);
    }).then(function() {
        console.log(`Connected to MongoDB with URI: ${mongoURI}`); // mistake when forward porting
    });
}

function createExpressApp() {
    var app = express();
    // Parse requests of content-type 'application/json'
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    // HTTP request logger
    app.use(morgan('dev'));
    // Enable cross-origin resource sharing for frontend must be registered before api
    app.options('*', cors());
    app.use(cors());

    return app;
}

function setupRoutes(app) {
    // Import routes
    app.get('/api', (req, res) => {
        res.json({'message': 'Welcome to our API. Try getting the top scorer at /api/example/topScorer'});
    });
    // These are all of our custom endpoints. They must all be prefixed with /api.
    app.use("/api", routes)
    // Catch all non-error handler for api (i.e., 404 Not Found)
    app.use('/api/*', (req, res) => {
        res.status(404).json({ 'message': 'Not Found' });
    });
}

function setupFrontend(app) {
    // Configuration for serving frontend in production mode
    // Support Vuejs HTML 5 history mode
    app.use(history());
    // Serve static assets
    var root = path.normalize(__dirname + '/..');
    var client = path.join(root, 'client', 'dist');
    app.use(express.static(client));
}

function setupErrorHandler(app) {
    // Error handler (i.e., when exception is thrown) must be registered last
    const env = app.get('env');
    // eslint-disable-next-line no-unused-vars
    app.use((err, req, res, next) => {
        console.error(err.stack);
        var err_res = {
            'message': err.message,
            'error': {}
        };
        if (env === 'development') {
            // Return sensitive stack trace only in dev mode
            err_res['error'] = err.stack;
        }
        res.status(err.status || 500);
        res.json(err_res);
    });
}

function startServer(app, port) {
    const env = app.get('env');
    app.listen(port, (err) => {
        if (err) throw err;
        console.log(`Express server listening on port ${port}, in ${env} mode`);
        console.log(`Backend: http://localhost:${port}/api/`);
        console.log(`Frontend (production): http://localhost:${port}/`);
    });
}

function main() {
    // Variables
    var mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/exampleDB';
    var port = process.env.PORT || 3000;
    
    connectToDB(mongoURI);
    var app = createExpressApp();
    setupRoutes(app);
    setupFrontend(app);
    setupErrorHandler(app);
    startServer(app, port);

    module.exports = app;
}

main();