module.exports = function(grunt) {
    grunt.initConfig({
        sources: ['src/**/*.js', 'test/**/*.js'],
        jshint: {
            all: '<%= sources %>',
            options: {
                jshintrc: '.jshintrc'
            }
        },
        jscs: {
            all: '<%= sources %>',
            options: {
                config: '.jscsrc'
            }
        },
        mocha_istanbul: {
            coverage: {
                src: 'test/**/*.js',
                options: {
                    mochaOptions: ['--ui=tdd'],
                    istanbulOptions: ['--include-all-sources'],
                    root: './src',
                    check: {
                        lines: 90,
                        branches: 90,
                        statements: 90,
                        functions: 90
                    },
                    reportFormats: ['html', 'lcov'],
                    coverageFolder: './coverage'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks("grunt-jscs");
    grunt.loadNpmTasks('grunt-mocha-istanbul');

    grunt.registerTask('codeCheck', ['jscs', 'jshint']);

    grunt.registerTask('build', ['codeCheck', 'mocha_istanbul']);
};
