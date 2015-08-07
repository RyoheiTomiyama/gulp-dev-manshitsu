'use strict'
var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var $ = gulpLoadPlugins();
var pngquant = require('imagemin-pngquant');
var jpegtran = require('imagemin-jpegtran');

var config = {
	jade: {
		src: ['./public/**/*.jade','!./public/bower_components/**'],
		dst: './public/'
	},

	typescript: {
		src: [
			'./**/*.ts',       // プロジェクトのルート以下すべてのディレクトリの.tsファイルを対象とする
			'!./node_modules/**', // node_modulesは対象外
			'!./public/bower_components/**' // bower_componentsは対象外
		],
		dst: './',  //コンパイルファイルと同じ場所に出力
		options: { target: 'ES5', module: 'commonjs' }
	},

	less: {
		src: ['./public/stylesheets/**/*.less'],
		dst: './public/stylesheets/'
	},

	autoprefixer: {
		options: {browsers: ['last 3 version','ie >= 8']}
	},

	imagemin: {
		src: ['./public/images/**/*'],
		dst: './public/images/',
		options: {progressive: true, use: [pngquant(),jpegtran()]}
	}
};


//jadeタスク
gulp.task('jade', function() {
	gulp.src(config.jade.src)
		.pipe($.plumber())
		.pipe($.jade())
		.pipe(gulp.dest(config.jade.dst));
});

//typescriptタスク
gulp.task('typescript', function () {
	gulp.src(config.typescript.src)
		.pipe($.plumber())
		.pipe($.typescript(config.typescript.options))
		.js
		.pipe(gulp.dest(config.typescript.dst));
});

//lessタスク
gulp.task('less', function () {
	gulp.src(config.less.src)
		.pipe($.plumber())
		.pipe($.sourcemaps.init())
		.pipe($.less())
		.pipe($.autoprefixer(config.autoprefixer.options))
		.pipe($.sourcemaps.write('./maps'))
		.pipe(gulp.dest(config.less.dst));
});


//imageminタスク
gulp.task('imagemin',function(){
	gulp.src(config.imagemin.src)
		.pipe($.plumber())
		.pipe($.imagemin(config.imagemin.options))
		.pipe(gulp.dest(config.imagemin.dst));
});


gulp.task('watch',function(){
	gulp.watch(config.jade.src,['jade']);
	gulp.watch(config.typescript.src,['typescript']);
	gulp.watch(config.less.src,['less']);
	gulp.watch(config.imagemin.src,['imagemin']);
});


gulp.task('default',['watch']);