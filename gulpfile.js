'use strict';

// ソース元の対象ファイル
var source_dir = './src/js/**/*.js';

// 変換作業用ディレクトリ
var tmp_dir = './tmp/';

// 出力ディレクトリ
var dist_dir = './public/js/';

// アプリファイル
var appjs = 'app.js';

// minify後のアプリ名ファイル
var appminjs = 'app.min.js';

var mocha      = require('gulp-mocha');
var watch      = require('gulp-watch');
var browserify = require('browserify');
var gulp       = require('gulp');
var source     = require('vinyl-source-stream');
var uglify     = require("gulp-uglify");
var msx        = require("gulp-msx");
var rename     = require('gulp-rename');
var plumber    = require('gulp-plumber');
var runSequence= require('run-sequence');

gulp.task('msx', function() {
	return gulp.src(source_dir)
	.pipe(plumber())
	.pipe(msx()) 
	.pipe(gulp.dest(tmp_dir));
});

gulp.task('browserify', function() {
	return browserify(tmp_dir + appjs)
		.bundle()
		.on('error', function(err){   //ここからエラーだった時の記述
			console.log(err.message);
			console.log(err.stack);
			this.emit('end');
		})
		//Pass desired output filename to vinyl-source-stream
		.pipe(source(appjs))
		// Start piping stream to tasks!
		.pipe(gulp.dest(dist_dir));
});

gulp.task('minify', function() {
	return gulp.src(dist_dir + appjs)
		.pipe(uglify())
		.pipe(rename(appminjs))
		.pipe(gulp.dest(dist_dir));
});


gulp.task('build', function(callback) {
	return runSequence(
		'msx',
		'browserify',
		'minify',
		callback
	);
});

gulp.task('watch', function() {
	gulp.watch('src/js/**/*.js', ['build']);
});

gulp.task('test', function() {
	return gulp.src(['tmp/test/**/*.js'], { read: false })
	.pipe(mocha({ reporter: 'list'}));
});
