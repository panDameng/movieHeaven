$(function(){
	$('.del').click(function(e) {
		/* Act on the event */
		var target = $(e.target);
		var id = target.data('id');
		var tr = $('.item-id-' + id);

		//ajax异步请求删除
		$.ajax({
			url: '/admin/user/list?id='+ id,
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

	//修改header中的搜索框action，使之能实现电影的列表搜索
	$("#headerForm").attr("action", "/admin/user/list/results");
	$("#headerForm").find('input').val("请输入用户名");

	// $("#headerForm").find('input').attr("value","请输入用户名");

})