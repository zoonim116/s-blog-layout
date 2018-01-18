//npm i --save-dev gulp gulp-pug gulp-notify gulp-clean-css gulp-autoprefixer gulp-rename gulp-sass gulp-connect gulp-livereload gulp-uglify
var	gulp = require('gulp'),
	pug = require('gulp-pug'),
	notify = require('gulp-notify'),
	cleancss = require('gulp-clean-css'),
	autoprefixer = require('gulp-autoprefixer'),
	rename = require('gulp-rename'),
	sass = require('gulp-sass'),
	connect = require('gulp-connect'),
	livereload = require('gulp-livereload'),
	uglify = require('gulp-uglify');

var site = 'public',
	inputCss = 'source/stylesheets/sass/*.{sass,scss}',
	outputCss = 'source/stylesheets/css',
	outputMinCss = 'public/assets/css',
	inputJs = 'source/javascripts/*.js',
	outputMinJs = 'public/assets/js',
	inputSass = 'source/stylesheets/sass/**/*.{sass,scss}',
	inputPug = 'source/views/pages/*.pug';

gulp.task('connect', function() {
	connect.server({
		root: site,
		livereload: true
	});
});

gulp.task('views', function buildHTML() {
	return gulp.src(inputPug)
	.pipe(pug({
		pretty: true
	}))
	.on('error', notify.onError(function (error) {
		return 'An error occurred while compiling Pug.\nLook in the console for details.\n' + error;
	}))
	.pipe(gulp.dest(site));
});

gulp.task('html', function(){
	gulp.src(site+'/*.html')
	.pipe(connect.reload());
});

gulp.task('styles', function() {
	gulp.src(inputCss)
	.pipe(sass({
		outputStyle: 'expanded'
	}))
	.on('error', function(err) {
        notify().write(err);
        this.emit('end');
    })
	.pipe(autoprefixer('last 99 version'))
	.pipe(gulp.dest(outputCss));
});

gulp.task('cssmin', function() {
	return gulp.src(outputCss+'/*.css')
	.pipe(rename({suffix: '.min'}))
	.pipe(cleancss())
	.pipe(gulp.dest(outputMinCss))
	.pipe(connect.reload());
});

gulp.task('js', function() {
	return gulp.src(inputJs)
	.pipe(uglify())
	.on('error', notify.onError(function (error) {
		return 'Javascript minification error.\nLook in the console for details.\n' + error;
	}))
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest(outputMinJs))
	.pipe(connect.reload());
});

gulp.task('watch', function() {
	gulp.watch(inputJs, ['js']);
	gulp.watch(outputCss+'/*.css', ['cssmin']);
	gulp.watch(inputCss, ['styles']);
	gulp.watch(inputSass, ['styles']);
	gulp.watch('source/views/**/*.pug', ['views']);
	gulp.watch(site+'/*.html', ['html']);
});

gulp.task('default', ['connect', 'views', 'html', 'styles', 'cssmin', 'js', 'watch'], function() {

});