module.exports = function(grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        copy: {
            main: {
                cwd: 'src/',
                expand: true,
                src: ['index.html', 'lib/**', 'css/**', 'img/**'],
                dest: 'dist/',

            },
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
                src: 'src/js/**/*.js',
                vendor: 'src/lib/three.js',
                excludes: ['lib/*.js', 'src/lib/*.js', '**/*three.js', '*three.js'],
                exclude: ['lib/*.js', 'src/lib/*.js', '**/*three.js', '*three.js'],
                options: {
                    specs: 'spec/**/*.js',
                    template: require('grunt-template-jasmine-istanbul'),

                    templateOptions: {
                        coverage: 'coverage/coverage.json',
                        report: [{
                            type: 'html',
                            options: {
                                excludes: ['lib/*.js', 'src/lib/*.js', '**/*three.js', '*three.js'],
                                exclude: ['lib/*.js', 'src/lib/*.js', '**/*three.js', '*three.js'],
                                dir: 'coverage'
                            }
                        }, {
                            type: 'text-summary',
                            options: {
                                excludes: ['lib/*.js', 'src/lib/*.js', '**/*three.js', '*three.js'],
                                exclude: ['lib/*.js', 'src/lib/*.js', '**/*three.js', '*three.js'],
                            }
                        }, {
                            type: 'lcov',
                            options: {
                                excludes: ['lib/*.js', 'src/lib/*.js', '**/*three.js', '*three.js'],
                                exclude: ['lib/*.js', 'src/lib/*.js', '**/*three.js', '*three.js'],
                                dir: 'coverage'
                            }
                        }],
                        template: require('grunt-template-jasmine-requirejs'),
                        templateOptions: {
                            requireConfig: {
                                baseUrl: '.grunt/grunt-contrib-jasmine/'
                            },
                            excludes: ['lib/*.js', 'src/lib/*.js', '**/*three.js', '*three.js'],
                            exclude: ['lib/*.js', 'src/lib/*.js', '**/*three.js', '*three.js'],

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
        },
        bower: {

            install: {
                options: {
                    targetDir: './lib',
                    layout: 'byType',
                    verbose: true
                }
                //just run 'grunt bower:install'
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-coveralls');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.registerTask('test', ['jshint', 'jasmine']);
    grunt.registerTask('default', ['test']);

};
