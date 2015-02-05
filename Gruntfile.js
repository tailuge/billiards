module.exports = function(grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        copy: {
            main: {
                src: 'index.html',
                dest: 'dist/index.html',
                options: {
                    process: function(content, srcpath) {
                        return content.replace(/specific thing/g, "_");
                    },
                },
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
                src: 'src/**/*.js',
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
                                baseUrl: ''
                            }
                        },
                        requireConfig: {
                            baseUrl: ''
                        }
                    },
                    keepRunner: true
                }
            }
        },
        jshint: {
            all: [
                'Gruntfile.js',
                'src/**/*.js',
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
                    // mainConfigFile: "path/to/config.js",
                    name: "main/main.js",
                    out: "dist/js/optimized.js"
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-coveralls');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('test', ['jshint', 'jasmine']);
    grunt.registerTask('default', ['test']);

};
