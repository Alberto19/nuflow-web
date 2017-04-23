// CORE
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
// CSS
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
// JAVASCRIPT
var uglify = require('gulp-uglify');
var pump = require('pump');
// HTMLmin
var htmlmin = require('gulp-htmlmin');
//Bower
var lib  = require('bower-files')();

// TASK - CSS
gulp.task('css', function() {
    return gulp.src('public/css/scss/style.scss')

        // MAP
        .pipe(sourcemaps.init())

        // SASS
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))

        // AUTOPREFIXER
        .pipe(autoprefixer({
            // BROWSERS - SUPPORT
            browsers: [
                'Chrome >= 35',
                'Firefox >= 31',
                'Edge >= 12',
                'Explorer >= 9',
                'iOS >= 8',
                'Safari >= 8',
                'Android 2.3',
                'Android >= 4',
                'Opera >= 12'
            ],
            cascade: false
        }))

        // MAP OUTPUT
        .pipe(sourcemaps.write('.'))

        .pipe(gulp.dest('public/css/dist'));
});

gulp.task('css:watch', function() {
    gulp.watch('public/css/scss/**/*.scss', ['css']);
});

// TASK - JAVASCRIPT
gulp.task('js', function(cb) {
    pump([
        gulp.src([
            'public/app.js',
            'public/app.routes.js',
            'public/config/*.js',
            'public/services/*.js',
            'public/components/js/*.js',
            'public/controllers/**/*.js'
        ]),
        concat('script.js'),
        sourcemaps.init(),
        // uglify(),
        sourcemaps.write('.'),
        gulp.dest('public/js')
    ],
        cb
    );
});

gulp.task('js:watch', function() {
    gulp.watch(
        [
            'public/app.js',
            'public/app.routes.js',
            'public/config/*.js',
            'public/services/*.js',
            'public/components/js/*.js',
            'public/controllers/**/*.js'
        ], ['js']
    );
});

//TASK  - HTML
gulp.task('minify-html', function() {
    return gulp.src('./public/**/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('public/js'))
});

/*mover librerias de bower al proyecto*/
gulp.task('bower-js', function() {
    gulp.src(lib.ext('js').files)
    .pipe(gulp.dest('public/libs/js'));
});
/*Mover Librerias de bower al proyecto*/
gulp.task('bower-css', function() {
    gulp.src(lib.ext('css').files)
    .pipe(gulp.dest('public/libs/css'));
});
/*copy Roboto fonts*/
gulp.task('copyfonts', function() {
  gulp.src('./bower_components/materialize/fonts/**/*.{ttf,woff,woff2,eot,eof,svg}').pipe(gulp.dest('public/css/dist/fonts'));
});

//build DEV
gulp.task('DEV', ['bower-js','bower-css','copyfonts','css', 'js']);

// TASK - DEFAULT
gulp.task('default', ['DEV','css:watch', 'js:watch'], function() { });


// TASKs Producao
gulp.task('cssPrd', function() {
    return gulp.src('public/css/scss/style.scss')

        // MAP
        .pipe(sourcemaps.init())

        // SASS
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))

        // AUTOPREFIXER
        .pipe(autoprefixer({
            // BROWSERS - SUPPORT
            browsers: [
                'Chrome >= 35',
                'Firefox >= 31',
                'Edge >= 12',
                'Explorer >= 9',
                'iOS >= 8',
                'Safari >= 8',
                'Android 2.3',
                'Android >= 4',
                'Opera >= 12'
            ],
            cascade: false
        }))

        // MAP OUTPUT
        .pipe(sourcemaps.write('.'))

        .pipe(gulp.dest('public/dist/css'));
});

// TASK - JAVASCRIPT
gulp.task('jsPrd', function(cb) {
    pump([
        gulp.src([
            'public/app.js',
            'public/app.routes.js',
            'public/config/*.js',
            'public/services/*.js',
            'public/components/js/*.js',
            'public/controllers/**/*.js'
        ]),
        concat('script.js'),
        sourcemaps.init(),
        // uglify(),
        sourcemaps.write('.'),
        gulp.dest('public/dist')
    ],
        cb
    );
});

//build PRD
gulp.task('Prd', ['cssPrd', 'jsPrd','minify-html']);