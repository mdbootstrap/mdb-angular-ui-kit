var gulp = require('gulp');
var del = require('del');
var rename = require('gulp-rename');
var run = require('gulp-run');

gulp.task("generateCSS", function() {
  return run('node-sass scss/mdb.scss css/pro/mdb.css && node-sass scss/mdb-free.scss css/free/mdb.css').exec();
});

// npm free
gulp.task('npmFree', function() {
   del(['./paczki/npm/*']).then(paths => {
    console.log('Deleted files:\n', paths.join('\n'));
    
    gulp.src('./dist/angular-bootstrap-md/free/**/*')
      .pipe(gulp.dest('./paczki/npm/'));

    gulp.src('./font/**/*')
      .pipe(gulp.dest('./paczki/npm/font/'));

    gulp.src('./img/**/*')
      .pipe(gulp.dest('./paczki/npm/img/'));

    gulp.src('./scss/mdb/free/**/*')
      .pipe(gulp.dest('./paczki/npm/scss/mdb/free/'))
    gulp.src('./scss/angular/free/**/*')
      .pipe(gulp.dest('./paczki/npm/scss/angular/free/'));

    gulp.src('./scss/mdb-free.scss')
      .pipe(rename({basename: "mdb"}))
      .pipe(gulp.dest('./paczki/npm/scss/'));
    gulp.src('./scss/angular/mdb-angular-free.scss')
      .pipe(rename({basename: "mdb-angular"}))
      .pipe(gulp.dest('./paczki/npm/scss/angular'));

    gulp.src('./css/free/mdb.css')
      .pipe(gulp.dest('./paczki/npm/css/')); 

    gulp.src('./scss/bootstrap/**/*')
      .pipe(gulp.dest('./paczki/npm/scss/bootstrap/'));
  });
});

// pro upgrade
gulp.task('only-pro', function() {
   del(['./paczki/only-pro/*']).then(paths => {
  });
});

// quickstart free
gulp.task("startFree", function() {

  del(['./paczki/angular-bootstrap-md-free/src/app/typescripts/*']).then(paths => {
    console.log('Deleted files:\n', paths.join('\n'));

    gulp.src('./src/app/typescripts/free/**/*')
      .pipe(gulp.dest('./paczki/angular-bootstrap-md-free/src/app/typescripts/free/'));
  });

  del(['./paczki/angular-bootstrap-md-free/scss/*']).then(paths => {
    console.log('Deleted files:\n', paths.join('\n'));

    gulp.src('./scss/bootstrap/**/*')
      .pipe(gulp.dest('./paczki/angular-bootstrap-md-free/scss/bootstrap/'));

    gulp.src('./scss/mdb/free/**/*')
      .pipe(gulp.dest('./paczki/angular-bootstrap-md-free/scss/mdb/free/'));
    gulp.src('./scss/angular/free/*')
      .pipe(gulp.dest('./paczki/angular-bootstrap-md-free/scss/angular/free/'));

    gulp.src('./scss/mdb-free.scss')
      .pipe(rename({basename: 'mdb'}))
      .pipe(gulp.dest('./paczki/angular-bootstrap-md-free/scss/'));
    gulp.src('./scss/angular/mdb-angular-free.scss')
      .pipe(rename({basename: 'mdb-angular'}))
      .pipe(gulp.dest('./paczki/angular-bootstrap-md-free/scss/angular'));
  });

  del(['./paczki/angular-bootstrap-md-free/font/*', './paczki/angular-bootstrap-md-free/img/*']).then(paths => {
    console.log('Deleted files:\n', paths.join('\n'));

    gulp.src('./img/**/*')
      .pipe(gulp.dest('./paczki/angular-bootstrap-md-free/img/'));

    gulp.src('./font/**/*')
      .pipe(gulp.dest('./paczki/angular-bootstrap-md-free/font/'));
  });

   gulp.src('./css/free/mdb.css')
      .pipe(gulp.dest('./paczki/npm/css/'));
});

// quickstart pro
gulp.task("startPro", function() {
  del(['./paczki/angular-bootstrap-md-pro/src/app/angular-bootstrap-md/*']).then(paths => {
    console.log('Deleted files:\n', paths.join('\n'));

    // gulp.src('./dist/angular-bootstrap-md/pro/**/*')
    //   .pipe(gulp.dest('./paczki/angular-bootstrap-md-pro/src/app/angular-bootstrap-md/pro/'));
  });

  del(['./paczki/angular-bootstrap-md-pro/src/app/typescripts/*']).then(paths => {
    console.log('Deleted files:\n', paths.join('\n'));

    gulp.src('./src/app/typescripts/free/**/*')
      .pipe(gulp.dest('./paczki/angular-bootstrap-md-pro/src/app/typescripts/free/'));

    gulp.src('./src/app/typescripts/pro/**/*')
      .pipe(gulp.dest('./paczki/angular-bootstrap-md-pro/src/app/typescripts/pro/'));
  });

  del(['./paczki/angular-bootstrap-md-pro/scss/*']).then(paths => {
    console.log('Deleted files:\n', paths.join('\n'));

    gulp.src('./scss/bootstrap/**/*')
      .pipe(gulp.dest('./paczki/angular-bootstrap-md-pro/scss/bootstrap/'));

    gulp.src('./scss/mdb/**/*')
      .pipe(gulp.dest('./paczki/angular-bootstrap-md-pro/scss/mdb/'));

    gulp.src('./scss/angular/**/*')
      .pipe(gulp.dest('./paczki/angular-bootstrap-md-pro/scss/angular/'));

     gulp.src('./css/pro/mdb.css')
      .pipe(gulp.dest('./paczki/angular-bootstrap-md-pro/css/'));

    gulp.src('./scss/mdb.scss')
      .pipe(gulp.dest('./paczki/angular-bootstrap-md-pro/scss/')); 
  });

  del(['./paczki/angular-bootstrap-md-pro/font/*', './paczki/angular-bootstrap-md-pro/img/*']).then(paths => {
    console.log('Deleted files:\n', paths.join('\n'));

    gulp.src('./img/**/*')
      .pipe(gulp.dest('./paczki/angular-bootstrap-md-pro/img/'));

    gulp.src('./font/**/*')
      .pipe(gulp.dest('./paczki/angular-bootstrap-md-pro/font/'));
  });
});

// only free
gulp.task("onlyFree", function() {
  del(['./paczki/only-free/*']).then(paths => {
  });
});
