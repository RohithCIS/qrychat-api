const {
    series
} = require('gulp');
const nodemon = require('nodemon');

function startingDevAPI(cb) {
    nodemon({
        script: 'app.js',
        env: {
            'NODE_ENV': 'staging'
        },
        watch: ['./*']
    })
    cb();
};

exports.startingDevServer = series(startingDevAPI);