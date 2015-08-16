module.exports = function(grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        copy: {
            main: {
                cwd: 'src/',
                expand: true,
                src: ['index.html', 'lib/**', 'css/**', 'img/**'],
                dest: 'dist/'
            },
            copyvendor: {
                cwd: 'src/lib',
                expand: true,
                src: ['three.js'],
                dest: '.grunt/grunt-contrib-jasmine/src/lib'
            }
        },
        coveralls: {
            options: {
                // LCOV coverage file relevant to every target
                src: 'coverage/lcov.info',

                // When true, grunt-coveralls will only print a warning rather than
                // an error, to prevent CI builds from failing unnecessarily (e.g. if
                // coveralls.io is down). Optional, defaults to false.
                force: true
            }
        },
        jasmine: {
            coverage: {
                src: ['src/js/*.js'],
                vendor: ['src/lib/three.js'],
                options: {
                    specs: 'spec/**/*.js',
                    template: require('grunt-template-jasmine-istanbul'),

                    templateOptions: {
                        coverage: 'coverage/coverage.json',
                        report: [{
                            type: 'html',
                            options: {
                                dir: 'coverage'
                            }
                        }, {
                            type: 'text-summary'
                        }, {
                            type: 'lcov',
                            options: {
                                dir: 'coverage'
                            }
                        }],
                        template: require('grunt-template-jasmine-requirejs'),
                        templateOptions: {
                            requireConfig: {
                                baseUrl: '.grunt/grunt-contrib-jasmine/'
                            }
                        }
                    },
                    keepRunner: true
                }
            }
        },
        jshint: {
            all: [
                'Gruntfile.js',
                'src/js/**/*.js',
                '!src/js/three.js',
                'src/main.',
                'spec/**/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: ".",
                    name: "src/main.js",
                    out: "dist/main.js"
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-coveralls');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.registerTask('test', ['copy:copyvendor', 'jshint', 'jasmine']);
    grunt.registerTask('default', ['test']);

};
