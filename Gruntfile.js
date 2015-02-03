module.exports = function(grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
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
                    name: "main/main.js", // assumes a production build using almond
                    out: "dist/js/optimized.js"
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-coveralls');
    grunt.registerTask('test', ['jshint', 'jasmine']);

    grunt.registerTask('default', ['test']);

};
