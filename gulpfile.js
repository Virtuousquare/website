// ---- Gulp -------------------------------------------------------------------------------------- //
// Définition des plugin gulp
// ------------------------------------------------------------------------------------------------ //
var gulp            = require('gulp');
var browserSync     = require('browser-sync').create();
var minifyCSS       = require('gulp-clean-css');
var sass            = require('gulp-sass')(require('sass'));
var webp            = require('gulp-webp');
var imagemin        = require('gulp-imagemin');
var concat 		    = require('gulp-concat');
var minify 		    = require('gulp-minifier');
var del             = require('del');


/* Chemin css et js */
var paths = {
    styles: {
      src: 'app/scss/style.scss',
      dest: 'assets/css/'
    },
    stylesCV: {
      src: 'cv/cv.scss',
      dest: 'cv/'
    },
    scripts: {
      src: 'app/js/app.js',
      dest: 'assets/js/'
    }
};


// ---- CLEAN ALL ---------------------------------------------------------------------------------- //
// Suppression du dossier assets
// ------------------------------------------------------------------------------------------------- //
function cleanALL() {
    return del([ 'assets/css','assets/js' ]);
}


// ---- SASS -------------------------------------------------------------------------------------- //
// Compilation et compression du fichier style.scss en style.css
// ------------------------------------------------------------------------------------------------ //
function styles() {
    return gulp.src(paths.styles.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(minifyCSS())
        .pipe(gulp.dest(paths.styles.dest))
		.pipe(browserSync.stream());
}
function stylesCV() {
    return gulp.src(paths.stylesCV.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(minifyCSS())
        .pipe(gulp.dest(paths.stylesCV.dest))
		.pipe(browserSync.stream());
}


// ---- Script JS ---------------------------------------------------------------------------------- //
// Concatenation et compression des script JS
// ------------------------------------------------------------------------------------------------- //
var orderJS = [
    // 'app/js/plugin/noConflict.js',
    // 'app/js/plugin/player.js',
    'app/js/plugin/animation.js',
    //'app/js/plugin/slick.min.js',
    // 'app/js/plugin/tiny-slider.js',
    'app/js/plugin/browsers.js', //Webp
    'app/js/app.js'
];
async function scripts() {
    var app = gulp.src(orderJS)
        .pipe(concat({ path: 'app.js', stat: { mode: 0666 }}))
        .pipe(minify({
            minify: true,
            collapseWhitespace: true,
            conservativeCollapse: true,
            minifyJS: true,
            minifyCSS: true,
            getKeptComment: function (content, filePath) {
                var m = content.match(/\/\*![\s\S]*?\*\//img);
                return m && m.join('\n') + '\n' || '';
            }
        }))
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browserSync.stream());
    return app;
}


// ---- Images ------------------------------------------------------------------------------------- //
// Compression des images + dupplication en webp pour les jpg et png
// ------------------------------------------------------------------------------------------------- //
var stateCompressImg = 0,
compressImg = function() {
    gulp.src('app/img/**/*')
    .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.mozjpeg({quality: 80, progressive: true}),
        imagemin.optipng({optimizationLevel: 8})
    ], {
        verbose: true
    }))
    .pipe(gulp.dest('assets/img'));
    stateCompressImg = 0;
}
async function webpFunc(){
    gulp.src('app/img/**/*.{jpg,png}')
        .pipe(webp({
            quality: 85
        }))
        .pipe(gulp.dest('assets/img/'));
}
async function img() {
    if(stateCompressImg!=1){
        stateCompressImg = 1;
        setTimeout(compressImg, 500);
    }
}

// Fonction de génération des images après lancement GULP -> gulp gulpImg
async function gulpImg() {
    img();
    webpFunc();
}


// ---- BrowserSync -------------------------------------------------------------------------------- //
// Initialisation de browserSync + Observateur de commande
// ------------------------------------------------------------------------------------------------- //
function browserSyncFunc() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });  
    watch();
}

function watch() {
    gulp.watch("app/scss/**/*.scss", styles);
    gulp.watch("cv/*.scss", stylesCV);
    gulp.watch("app/js/**/*").on('change', scripts);
    gulp.watch("*.html").on('change', browserSync.reload);
}


// ---- Gulp -------------------------------------------------------------------------------------- //
// Définition des tâches de Gulp
// ------------------------------------------------------------------------------------------------ //
var build = gulp.series(cleanALL, styles, stylesCV, scripts, browserSyncFunc);

exports.cleanALL    = cleanALL;
exports.styles      = styles;
exports.styles      = stylesCV;
exports.build       = build;
exports.img         = img;
exports.webpFunc    = webpFunc;
exports.scripts     = scripts
exports.default     = build;
exports.gulpImg     = gulpImg;





// ---- Gulp -------------------------------------------------------------------------------------- //
// Regénération des images -> gulp gulpImg
// ------------------------------------------------------------------------------------------------ //
gulp.task('gulpImg');