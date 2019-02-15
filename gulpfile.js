/*
 * @Author: mikey.zhaopeng 
 * @Date: 2019-02-15 16:36:21 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-02-15 20:43:05
 */

var gulp = require('gulp'); //载入模块
var sass = require('gulp-sass'); //编译sass
var mincss = require('gulp-clean-css'); //压缩css
var rename = require('gulp-rename'); //文件重命名
var uglify = require('gulp-uglify'); //压缩文件不支持ES6
var babel = require('gulp-babel'); //将ES6转为ES5
var htmlmin = require('gulp-htmlmin'); //压缩html
var server = require('gulp-webserver'); //开启服务
var autoprefixter = require('gulp-autoprefixer'); //自动添加浏览器前缀
var fs = require('fs'); //fs
var path = require('path'); //
var url = require('url'); //
var data = require('./src/mork/data.json'); //
//建立任务
//编译sass
gulp.task('conScss', function() {
    return gulp.src('./src/style/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest("./src/css"))
})

gulp.task('auto', function() {
    return gulp.watch('./src/style/**/*.scss', gulp.series("conScss"))
})

//压缩css
gulp.task("zipcss", function() {
        return gulp.src('./src/style/**/*.scss')
            .pipe(mincss())
            .pipe(gulp.dest("./build/css"))
    })
    //压缩js
gulp.task("zipjs", function() {
    return gulp.src('./src/js/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest("./build/js"))
})
gulp.task('srcserver', function() {
    return gulp.src('src')
        .pipe(server({
            host: "169.254.149.0",
            port: 3030,
            livereload: true,
            middleware: function(req, res, next) {
                var pathname = url.parse(req.url).pathname;
                if (pathname === "./api/list") {
                    res.end(JSON.stringify({ code: 1, msg: data }))
                } else {
                    pathname = pathname === "/" ? "index.html" : pathname;
                    var upath = path.join(__dirname, "src", pathname);
                    res.end(fs.readFileSync(upath))
                }
            }
        }))
})