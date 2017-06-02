module.exports = function(grunt) {
    var pkg = grunt.file.readJSON('package.json');
    var bannerTemplate = '/**\n' +
        ' * <%= pkg.title %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * <%= pkg.homepage %>\n' +
        ' *\n' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %>;\n' +
        ' * Licensed GPLv2+\n' +
        ' */\n';

    var compactBannerTemplate = '/**\n' +
        ' * <%= pkg.title %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> | <%= pkg.homepage %> | Copyright (c) <%= grunt.template.today("yyyy") %>; | Licensed GPLv2+\n' +
        ' */\n';

    // Project configuration
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        concat: {
            options: {
                stripBanners: true,
                banner: bannerTemplate
            },
            { %= js_safe_name %
            }: {
                src: [
                    'assets/js/src/{%= wpfilename %}.js'
                ],
                dest: 'assets/js/{%= wpfilename %}.js'
            }
        },

        jshint: {
            all: [
                'Gruntfile.js',
                'assets/js/src/**/*.js',
                'assets/js/test/**/*.js'
            ],
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                unused: true,
                undef: true,
                boss: true,
                eqnull: true,
                globals: {
                    exports: true,
                    module: false
                },
                predef: ['document', 'window']
            }
        },

        uglify: {
            all: {
                files: {
                    'assets/js/{%= wpfilename %}.min.js': ['assets/js/{%= wpfilename %}.js']
                },
                options: {
                    banner: compactBannerTemplate,
                    mangle: {
                        except: ['jQuery']
                    }
                }
            }
        },

        test: {
            files: ['assets/js/test/**/*.js']
        },

        { %
            if ('sass' === css_type) { %
            }
            sass: {
                all: {
                    files: {
                        'assets/css/{%= wpfilename %}.css': 'assets/css/sass/{%= wpfilename %}.scss'
                    }
                }
            },

            { %
            }
            else
            if ('less' === css_type) { %
            }
            less: {
                all: {
                    files: {
                        'assets/css/{%= wpfilename %}.css': 'assets/css/less/{%= wpfilename %}.less'
                    }
                }
            },

            { %
            } %
        }
        cssmin: {
            options: {
                banner: bannerTemplate
            },
            minify: {
                expand: true,
                { %
                    if ('sass' === css_type || 'less' === css_type) { %
                    }
                    cwd: 'assets/css/',
                    src: ['{%= wpfilename %}.css'],
                    { %
                    }
                    else { %
                    }
                    cwd: 'assets/css/src/',
                    src: ['{%= wpfilename %}.css'],
                    { %
                    } %
                }
                dest: 'assets/css/',
                ext: '.min.css'
            }
        },

        watch: {
            { %
                if ('sass' === css_type) { %
                }
                sass: {
                    files: ['assets/css/sass/*.scss'],
                    tasks: ['sass', 'cssmin'],
                    options: {
                        debounceDelay: 500
                    }
                }, { %
                }
                else
                if ('less' === css_type) { %
                }
                less: {
                    files: ['assets/css/less/*.less'],
                    tasks: ['less', 'cssmin'],
                    options: {
                        debounceDelay: 500
                    }
                }, { %
                }
                else { %
                }
                styles: {
                        files: ['assets/css/src/*.css'],
                        tasks: ['cssmin'],
                        options: {
                            debounceDelay: 500
                        }
                    }, { %
                    } %
            }
            scripts: {
                files: ['assets/js/src/**/*.js', 'assets/js/vendor/**/*.js'],
                tasks: ['jshint', 'concat', 'uglify'],
                options: {
                    debounceDelay: 500
                }
            }
        }

        /**
         * check WP Coding standards
         * https://github.com/WordPress-Coding-Standards/WordPress-Coding-Standards
         */
        phpcs: {
            application: {
                dir: [
                    '**/*.php',
                    '!**/node_modules/**'
                ]
            },
            options: {
                bin: '~/phpcs/scripts/phpcs',
                standard: 'WordPress'
            }
        },

        // Generate POT files.
        makepot: {
            target: {
                options: {
                    exclude: ['build/.*', 'node_modules/*', 'assets/*'],
                    domainPath: '/i18n/languages/', // Where to save the POT file.
                    potFilename: '{%= wpfilename %}.pot', // Name of the POT file.
                    type: 'wp-plugin', // Type of project (wp-plugin or wp-theme).
                    potHeaders: {
                        'report-msgid-bugs-to': 'http://pluginever.com/support/',
                        'language-team': 'LANGUAGE <support@pluginever.com>'
                    }
                }
            }
        },
        // Clean up build directory
        clean: {
            main: ['build/']
        },

        // Copy the plugin into the build directory
        copy: {
            main: {
                src: [
                    '**',
                    '!node_modules/**',
                    '!.codekit-cache/**',
                    '!.idea/**',
                    '!build/**',
                    '!bin/**',
                    '!.git/**',
                    '!Gruntfile.js',
                    '!package.json',
                    '!composer.json',
                    '!composer.lock',
                    '!debug.log',
                    '!phpunit.xml',
                    '!.gitignore',
                    '!.gitmodules',
                    '!npm-debug.log',
                    '!plugin-deploy.sh',
                    '!export.sh',
                    '!config.codekit',
                    '!nbproject/*',
                    '!tests/**',
                    '!README.md',
                    '!CONTRIBUTING.md',
                    '!**/*~',
                    '!.csscomb.json',
                    '!.editorconfig',
                    '!.jshintrc',
                    '!.tmp',
                    '!assets/src/**',
                ],
                dest: 'build/'
            }
        },

        //Compress build directory into <name>.zip and <name>-<version>.zip
        compress: {
            main: {
                options: {
                    mode: 'zip',
                    archive: './build/{%= name %}' + pkg.version + '.zip'
                },
                expand: true,
                cwd: 'build/',
                src: ['**/*'],
                dest: '{%= name %}'
            }
        },

    });

    // Load other tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-wp-i18n');

    { %
        if ('sass' === css_type) { %
        }
        grunt.loadNpmTasks('grunt-contrib-sass'); { %
        } else
        if ('less' === css_type) { %
        }
        grunt.loadNpmTasks('grunt-contrib-less'); { %
        } %
    }
    grunt.loadNpmTasks('grunt-contrib-watch'); { %
        if (wpcs) { %
        }
        grunt.loadNpmTasks('grunt-phpcs'); { %
        } %
    }

    // Default task.
    { %
        if ('sass' === css_type) { %
        }
        grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'sass', 'cssmin']); { %
        } else
        if ('less' === css_type) { %
        }
        grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'less', 'cssmin']); { %
        } else { %
        }
        grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'cssmin']); { %
        } %
    }

    grunt.registerTask('release', ['makepot']);

    grunt.registerTask('zip', ['clean', 'copy', 'compress']);

    grunt.util.linefeed = '\n';
};