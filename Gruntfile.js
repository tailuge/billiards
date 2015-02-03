module.exports = function(grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        jasmine: {
            src: 'src/**/*.js',
            options: {
                specs: 'spec/**/*.js',
                template: require('grunt-template-jasmine-requirejs'),
                templateOptions: {
                    requireConfig: {
                        baseUrl: ''
                    }
                },
                keepRunner: true
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

    grunt.registerTask('test', ['jshint', 'jasmine']);

    grunt.registerTask('default', ['test']);

};
