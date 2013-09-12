var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

var prodPath = '/wp-adv/advertisers/ajam/2013/overlay/';

module.exports = function (grunt) {
  // load all grunt tasks:
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // display build times:
  require('time-grunt')(grunt);

  grunt.initConfig({
    clean: {
      sass: ['.sass-cache'],
      dist: ['dist/**/*', 'dist/*']
    },
    useminPrepare: {
      options: {
        dest: 'dist'
      },
      html: 'index.html'
    },
    usemin: {
      options: {
        dirs: ['dist']
      },
      html: ['dist/{,*/}*.html']//,
      //css: ['dist/css/{,*/}*.css']
    },
    concat: {
      dist: {
        options: {
          process: {
            data: {
              clickTrack: '',
              clickTrackEsc: '',
              urls: {
                js: '',
                www: '',
                css: ''
              }
            }
          }
        },
        files: {
          'dist/index.html': 'index.html'
        }
      },
      dfp: {
        options: {
          process: {
            data: {
              clickTrack: '%%CLICK_URL_UNESC%%',
              clickTrackEsc: '%%CLICK_URL_ESC%%',
              urls: {
                js: 'http://js.washingtonpost.com' + prodPath,
                www: 'http://www.washingtonpost.com' + prodPath,
                css: 'http://css.wpdigital.net' + prodPath
              }
            }
          }
        },
        files: {
          'dist/dfp.html': 'index.html'
        }
      }
    },
    uglify: {
      options: {
        banner: '/* <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        report: 'gzip',
      },
      overlay: {
        files: {
          'dist/js/overlay.min.js': 'js/overlay.js'
        }
      }
    },
    cssmin: {
      //dist: {
      //  files: {
      //    'dist/css/style.min.css': 'css/style.css'
      //  }
      //}
    },
    jshint: {
      options:{
        ignores: ['js/debugBookmarklet.js']
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      src: {
        src: ['js/*.js']
      }
    },
    compass: {
      dist: {
        options: {
          config: 'config.rb'
        }
      }
    },
    copy: {
      swf: {
        files: [{
          src: ['swf/**'],
          dest: 'dist/'
        }]
      }
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'img/',
          src: ['**/*.{png,jpg,gif}'],
          dest: 'dist/img'
        }]
      },
    },
    watch: {
      options: {
        nospawn: true
      },
      gruntfile: {
        files: ['Gruntfile.js'],
        tasks: ['build']
      },
      dist: {
        files: ['js/overlay.js', 'index.html', 'sass/style.sass'],
        tasks: ['build']
      },
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          'dist/*',
          'dist/js/*',
          'dist/css/*'
        ]
      }
    },
    connect: {
      options: {
        port: 5000,
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, '.')
            ];
          }
        }
      }
    },
    open: {
      dist: {
        path: 'http://localhost:<%= connect.options.port %>/dist/'
      }
    }
  });


  //REGISTER TASKS BELOW:

  grunt.registerTask('default', [
    'build',
    'server'
  ]);

  grunt.registerTask('build', [
    'clean',
    'compass',
    'useminPrepare',
    'concat',
    'uglify',
    'copy',
    'imagemin',
    'cssmin',
    'usemin'
  ]);

  grunt.registerTask('server', [
    'connect:livereload',
    'open',
    'watch'
  ]);

};