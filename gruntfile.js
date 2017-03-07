module.exports = function(grunt){

	grunt.initConfig({
		//获取package.json的信息
		// pkg:grunt.file.readJSON('package.json'),

		watch:{
			jade:{
				files:['views/**'],//监听文件的所在地
				options:{
					livereload:true//文件改动时重启服务
				}
			},
			js:{
				files:['public/js/**', 'models/**/*.js', 'schemas/**/*.js'],
				//tasks:['jshint'],
				options:{
					livereload:true
				}
			}
		},

		jshint: {
		    options: {
		        jshintrc: '.jshintrc',//依赖文件放置在根目录下
		        ignores: ['public/libs/**/*.js']//忽略检查
		    },
		    all: ['public/js/*.js', 'test/**/*.js', 'app/**/*.js']//需要检查
		},

		less: {
	      	development: {
	        	options: {
	          		compress: true,
	          		yuicompress: true,
	          		optimization: 2
	        	},
	        files: {
	          	'public/build/index.css': 'public/less/index.less'
	        	}
	      	}
	    },

    uglify: {
	    development: {
	        files: {
		        'public/build/admin.min.js': 'public/js/admin.js',
		        'public/build/detail.min.js': [
		          	'public/js/detail.js'
		        ]
	        }
	    }
    },

		nodemon:{
			dev:{
				options:{
					file:'app.js',//监听入口文件
					args:[],
					ignoredFiles:['README.md', 'node_modules/**', '.DS_Store'],
					watchedExtensions:['js'],
					watchedFolders:['./'],
					debug:true,
					delayTime:1,
					env:{
						PORT:3000
					},
					cwd:__dirname
				}
			}
		},

		mochaTest:{
			options:{
				reporter:'spec'
			},
			src:['test/**/*.js']//测试test下的所有js文件
		},

		concurrent:{
			tasks:['nodemon', 'watch', 'jshint', 'less', 'uglify'],//在这里面在去转而找到nodemon和watch任务
			options:{
				logConcurrentOutput:true
			}
		}
	})

	//加载任务所需插件
	grunt.loadNpmTasks('grunt-contrib-watch');//文件有添加、修改、删除时，会重新执行再其注册好的任务
	grunt.loadNpmTasks('grunt-nodemon');//实时监听入口文件，即app.js,,入口文件改动时自动重启
	grunt.loadNpmTasks('grunt-concurrent');//针对慢任务开发（less）等的编译，优化构建时间，同时可以用来跑多个任务
	grunt.loadNpmTasks('grunt-mocha-test');//单元测试
	grunt.loadNpmTasks('grunt-contrib-less');//less编译
	grunt.loadNpmTasks('grunt-contrib-uglify');//js压缩
	grunt.loadNpmTasks('grunt-contrib-jshint');//js语法检查

	grunt.option('force', true);//不会因为语法等错误中断grunt的整个服务

	//注册任务，告诉grunt当我们在终端输入grunt时需要做些什么（注意先后顺序）
	grunt.registerTask('default', ['concurrent']);//找到配置中的concurrent
	grunt.registerTask('test', ['mochaTest']);
}