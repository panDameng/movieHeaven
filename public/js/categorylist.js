$(function(){
	$('.del').click(function(e) {
		/* Act on the event */
		var target = $(e.target);
		var id = target.data('id');
		var tr = $('.item-id-' + id);

		//ajax异步请求删除
		$.ajax({
			url: '/admin/category/list?id='+ id,
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
	$("#headerForm").attr("action", "/admin/category/list/results");
	$("#headerForm").find('input').val("请输入分类名");
})