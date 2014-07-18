'use strict'
# generated on <%= (new Date).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %>

gulp = require 'gulp'
# load plugins
$ = require('gulp-load-plugins')()
spawn = require('child_process').spawn
node = null

# Compile jobs
path =
  server: 'server/**/*.coffee'
  test: 'test/**/*.coffee'
  <% if (includeClient) { %>
  scripts: 'app/scripts/**/*.coffee'
  styles: 'app/styles/**/*.css'
  bower: 'app/components'
  html: 'app/html/**/*.html'
  assets: 'app/assets/*'
  <% } %>

<% if (includeClient) { %>
gulp.task 'scripts', () ->
  gulp.src(path.scripts)
    .pipe($.coffee({bare: true}).on 'error', $.util.log)
    .pipe($.concat 'app.min.js')
    .pipe($.size())
    .pipe(gulp.dest '_public/js')

gulp.task 'uglyscripts', () ->
  gulp.src(path.scripts)
    .pipe($.coffee({bare: true}).on 'error', $.util.log)
    .pipe($.concat 'app.min.js')
    .pipe($.size())
    .pipe(gulp.dest '_public/js')

gulp.task 'styles', () ->
  gulp.src(path.styles)
    .pipe($.concat 'app.min.css')
    .pipe($.size())
    .pipe(gulp.dest '_public/css')

gulp.task 'jquery', () ->
  gulp.src('app/components/jquery/jquery.min.js')
    .pipe($.size())
    .pipe(gulp.dest('_public/js'))

gulp.task 'bowerjs', () ->
  gulp.src('app/components/**/*.min.js', !'app/components/jquery/jquery.min.js')
    .pipe($.flatten())
    .pipe($.concat 'vendor.min.js')
    .pipe($.size())
    .pipe(gulp.dest('_public/js'))

gulp.task 'bowercss', () ->
  gulp.src('app/components/**/*.min.css')
    .pipe($.flatten())
    .pipe($.concat 'vendor.min.css')
    .pipe($.size())
    .pipe(gulp.dest('_public/css'))

gulp.task 'html', () ->
  gulp.src(path.html)
    .pipe($.size())
    .pipe(gulp.dest '_public')

gulp.task 'assets', () ->
  gulp.src(path.assets)
    .pipe($.imagemin({optimizationLevel: 5}))
    .pipe($.size())
    .pipe(gulp.dest '_public/assets')

gulp.task 'ngroute', () ->
  gulp.src('app/components/angular-route/angular-route.min.js')
  .pipe($.flatten())
  .pipe($.concat 'ngroute.min.js')
  .pipe($.size())
  .pipe(gulp.dest('_public/js'))

gulp.task 'clean', () ->
  gulp.src('_public', { read: false })
    .pipe(clean())

gulp.task 'compile', ['scripts', 'styles', 'bowerjs', 'html', 'assets']

gulp.task 'watch', () ->
  gulp.watch path.scripts, ['scripts']
  gulp.watch path.styles, ['styles']
  gulp.watch path.bower, ['bowerjs']
  gulp.watch path.html, ['html']
  gulp.watch path.assets, ['assets']
<% } %>

# Main jobs
gulp.task('test', ->
  gulp.src(['server/**', 'test/**'], { read: false })
    .pipe($.watch({ emit: 'all' }, (files) ->
      files
        .pipe($.grepStream('**/*.mocha.coffee'))
        .pipe($.mocha({ reporter: 'spec' }))
        .on('error', -> console.log(err.stack) if (!/tests? failed/.test(err.stack)))
    ))
)

start = ->
  if node? then node.kill()
  node = spawn('coffee', ['server/app.coffee'], {stdio: 'inherit'})
  node.on('close', ->
    console.log arguments
  )

gulp.task('start', ->
  start()
  gulp.watch(path.server, start)
)

<% if (includeClient) { %>
gulp.task('default', ['watch', 'start'])
<% } else { %>
gulp.task('default', ['start'])
<% } %>

process.on('exit', ->
  if node? then node.kill()
)

