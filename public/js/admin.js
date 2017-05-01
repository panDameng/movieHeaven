$(function(){
	$('.del').click(function(e) {
		/* Act on the event */
		var target = $(e.target);
		var id = target.data('id');
		var tr = $('.item-id-' + id);

		//ajax异步请求删除
		$.ajax({
			url: '/admin/movie/list?id='+ id,
			type: 'delete',
		})
		.done(function(results) {
			if(results.success === 1){
				if(tr.length > 0){
					tr.remove()
				}
			}
		});
	})

	$('#douban').blur(function(){//用于豆瓣api文档的数据同步
		var douban = $(this)
		var id = douban.val();
		console.log(id);
		if(id){
			$.ajax({
			url:'https://api.douban.com/v2/movie/subject/' + id,
			cache:true,//dataType 为 script 和 jsonp 时默认为 false。设置为 false 将不缓存此页面。
			type:'get',
			dataType:'jsonp',//jsonp用于跨域，是信息传递双方约定的方法。
			crossDomain:true,//跨域
			jsonp:'callback',//jsonp请求中回调函数名字为callback
			success:function(data){
				$('#inputTitle').val(data.title);
				$('#inputDirector').val(data.directors[0].name);
				$('#inputCountry').val(data.countries[0]);
				$('#inputLanguage').val();
				$('#inputPoster').val(data.images.large);
				$('#inputYear').val(data.year);
				$('#inputSummary').val(data.summary);
			}
		})
		}
		
	})

})