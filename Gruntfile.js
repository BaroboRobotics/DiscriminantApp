module.exports = function(grunt) {
	grunt.initConfig({
		bowercopy: {
		    options: {
		        srcPrefix: 'bower_components'
		    },
		    scripts: {
		        options: {
		            destPrefix: 'app/vendor'
		        },
		        files: {
		            'angular/angular.min.js': 'angular/angular.min.js',
		            'angular/angular.js': 'angular/angular.js',
		            'angular/angular.min.js.map': 'angular/angular.min.js.map',
		            'angular-flot/angular-flot.js': 'angular-flot/angular-flot.js',
		            'angular-route/angular-route.js': 'angular-route/angular-route.js',
		            'angular-route/angular-route.min.js': 'angular-route/angular-route.min.js',
		            'angular-route/angular-route.min.js.map': 'angular-route/angular-route.min.js.map',
		            'bootstrap/css/bootstrap.min.css': 'bootstrap/dist/css/bootstrap.min.css',
		            'bootstrap/css/bootstrap.css.map': 'bootstrap/dist/css/bootstrap.css.map',
		            'bootstrap/css/bootstrap.css': 'bootstrap/dist/css/bootstrap.css',
		            'bootstrap/css/bootstrap-theme.min.css': 'bootstrap/dist/css/bootstrap-theme.min.css',
		            'bootstrap/css/bootstrap-theme.css.map': 'bootstrap/dist/css/bootstrap-theme.css.map',
		            'bootstrap/css/bootstrap-theme.css': 'bootstrap/dist/css/bootstrap-theme.css',
		            'bootstrap/fonts/glyphicons-halflings-regular.eot': 'bootstrap/dist/fonts/glyphicons-halflings-regular.eot',
		            'bootstrap/fonts/glyphicons-halflings-regular.svg': 'bootstrap/dist/fonts/glyphicons-halflings-regular.svg',
		            'bootstrap/fonts/glyphicons-halflings-regular.ttf': 'bootstrap/dist/fonts/glyphicons-halflings-regular.ttf',
		            'bootstrap/fonts/glyphicons-halflings-regular.woff': 'bootstrap/dist/fonts/glyphicons-halflings-regular.woff',
		            'bootstrap/js/bootstrap.min.js': 'bootstrap/dist/js/bootstrap.min.js',
		            'jquery/jquery.min.js': 'jquery/dist/jquery.min.js',
		            'jquery/jquery.min.map': 'jquery/dist/jquery.min.map',
		            'linkbotjs/linkbot.js': 'linkbotjs/dist/linkbot.js',
		            'linkbotjs/linkbot.css': 'linkbotjs/dist/linkbot.css'
		        }
		    }
		},
		copy: {
			main: {
				files: [
					{expand: true, cwd: 'src/', src:['**'], dest: 'app/'},
					{expand: true, cwd: 'vendor/flot', src: ['*.min.js'], dest: 'app/vendor/flot'}

				]
			}
		},
		clean: ["app"]
	});

	grunt.loadNpmTasks('grunt-bowercopy');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask('default', ['bowercopy', 'copy']);
};