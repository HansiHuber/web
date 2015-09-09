module.exports = function (grunt) {
    var getTimestamp = function () {
        var now = new Date();
        var date = [now.getFullYear(), now.getMonth(), now.getDay()];
        var time = [now.getHours(), now.getMinutes(), now.getSeconds()];
        for (var i = 0; i < 3; i++) {
            if (time[i] < 10) time[i] = '0' + time[i];
            if (date[i] < 10) date[i] = '0' + date[i];
        }
        var sDate = date.join('-');
        var sTime = time.join(':');
        return sDate + ' ' + sTime;
    };
    var config = {
        cssdir: 'app/styles',
        jsdir: 'app/scripts',
        jquerydir: 'app/scripts/jquery',
        getTimestamp: getTimestamp
    };
    grunt.initConfig({
        config: config,
        less: {
            dev: {
                files: {
                    '<%=config.cssdir%>/main.css': '<%=config.cssdir%>/main.less'
                }
            },
            prod: {
                options: {
                    compress: true
                },
                files: {
                    '<%=config.cssdir%>/main.css': '<%=config.cssdir%>/main.less'
                }
            }
        },
        eslint: {
            target: [
               'Gruntfile.js',
               '<%=config.jsdir%>/*.js'
            ]
        },

        watch: {
            options: {
                    atBegin: true,
                    dateFormat: function (time) {
                        grunt.log.writeln('Finished in ' + time + 'ms at ' + config.getTimestamp());
                        grunt.log.writeln('--------------> ' + 'Waiting for more changes...'.cyan);
                    }
            },
            scripts: {
                files: ['<%=config.jsdir%>/*.js',
                    'Gruntfile.js',
                    'node_modules/grunt-eslint/node_modules/eslint/conf/eslint.json'],
                tasks: ['eslint']
            },
            all: {
                files: ['<%=config.jsdir%>/*.js', 'Gruntfile.js', 'app/*.html', '<%=config.cssdir%>/*.less'],
                options: {
                    livereload: true
                },
                tasks: ['eslint', 'less:dev']
            }
        },

        express: { //this is our WebServer
            all: {
                options: {
                    bases: ['app'],
                    port: 8080,
                    hostname: '0.0.0.0',
                    livereload: true
                }
            }
        },

        open: { // grunt-open will open your browser at the project's URL
            all: {
                path: 'http://localhost:8080/index.html'
            }
        }

    });

    //grunt.loadNpmTasks('grunt-contrib-less');
    //grunt.loadNpmTasks('grunt-eslint');
    //grunt.loadNpmTasks('grunt-contrib-watch');
    //grunt.loadNpmTasks('grunt-express');
    //grunt.loadNpmTasks('grunt-open');
    Object.keys(require('./package.json').devDependencies).forEach(function (dep) {
        if (dep.substring(0, 6) === 'grunt-') grunt.loadNpmTasks(dep);
    });

    grunt.registerTask('build', [
       'eslint', 'less:prod'
    ]);
    grunt.registerTask('default', [
        'express',
        'open',
        'watch:all'
    ]);
};

