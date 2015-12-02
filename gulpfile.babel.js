/*
* Gulp Tasks.
*/
var gulp = require("gulp");
var gutil = require("gulp-util");
var babel = require("gulp-babel");
var sass = require("gulp-sass");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
// var reactify = require("reactify");
var babelify = require("babelify");
var watch = require("gulp-watch");
var concatCSS = require("gulp-concat-css");
var minifyCSS = require("gulp-minify-css");
var concat = require("gulp-concat");
var minify = require('gulp-minify');


gulp.task("babel", function (done) {
	return browserify({
		entries: "jsx/slide.jsx",
		debug: true,
		extensions: [".jsx"],
	})
	.transform("babelify", {presets: ["es2015", "react"]})
	.bundle()
	.on("error", function (err) {
		gutil.log(err.message);
		done();
	})
	.pipe(source("slide.js"))
	.pipe(gulp.dest("js"));
});

gulp.task("javascript:copy", ["babel"], function (done) {
	return gulp.src("js/slide.js").pipe(gulp.dest("dist"));
});

gulp.task("javascript:build", ["javascript:copy"], function (done) {
	return gulp.src([
			"bower_components/react/react.min.js",
			"bower_components/react/react-dom.min.js",
			"bower_components/screenfull.min/index.js",
			"bower_components/director/build/director.min.js",
		])
		.pipe(concat("adds.js"))
		.pipe(gulp.dest("dist"));
});

gulp.task("sass", function (done) {
	return gulp.src("sass/**/*.+(scss|sass)")
		.pipe(sass({

		}))
		.on("error", function (err) {
			gutil.log(err.message);
			done();
		})
		.pipe(gulp.dest("css"));
});

gulp.task("css:build", ["sass"], function (done) {
	return gulp.src([
			"css/**/*.+(css|map)",
		])
		.pipe(concatCSS("style.css"))
		// .pipe(minifyCSS({compatibility: 'ie8'}))
		.pipe(gulp.dest("dist"));
});

gulp.task("watch", ["babel", "sass"], function () {
	watch(["jsx/**/*.jsx"], function() {
		gulp.start("babel");
	})
		.on("change", function (e) {
			gutil.log(`Is changed ${e}`);
		});

	watch("sass/**/*.+(scss|sass)", function () {
		gulp.start("sass");
	})
		.on("change", function (e) {
			gutil.log(`Is changed ${e}`);
		});
});

gulp.task("default", ["watch"]);
gulp.task("build", ["css:build", "javascript:build"]);

