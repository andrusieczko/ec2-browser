var gulp = require('gulp');
var source = require('vinyl-source-stream'); // Used to stream bundle for further handling
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify'); 
var concat = require('gulp-concat');
 
gulp.task('browserify', function() {
    var bundler = browserify({
        entries: ['./src/js/main.js'], // Only need initial file, browserify finds the deps
        debug: true, // Gives us sourcemapping
        cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify
    })
    .transform("babelify", {
        presets: ["es2015", "react"],
        moduleRoot: "./src/js/",
        resolveModuleSource: function(source, filename) {
            return filename.slice(0, filename.indexOf('src/js')) + 'src/js/' + source;;
        }
    })
    .transform(reactify);

    var watcher  = watchify(bundler);

    return watcher
    .on('update', function () { // When any files update
        var updateStart = Date.now();
        console.log('Updating!');
        watcher.bundle() // Create new bundle that uses the cache for high performance
        .on('error', function(err) {
            console.log(err);
        })
        .pipe(source('app.js'))
    // This is where you add uglifying etc.
        .pipe(gulp.dest('./build/'));
        console.log('Updated!', (Date.now() - updateStart) + 'ms');
    })
    .bundle() // Create the initial bundle when starting the task
    .pipe(source('app.js'))
    .pipe(gulp.dest('build/'));
});

// I added this so that you see how to run two watch tasks
gulp.task('css', function () {
    gulp.watch('styles/**/*.css', function () {
        return gulp.src('styles/**/*.css')
        .pipe(concat('main.css'))
        .pipe(gulp.dest('build/'));
    });
});

// Just running the two tasks
gulp.task('default', ['browserify', 'css']);