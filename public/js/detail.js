$(function(){
	$('.comment').click(function(e) {
		/* Act on the event */
		var target = $(this);
		var toId = target.data('tid');//获取detail.jade a标签中的tid和cid
		var commentId = target.data('cid');
		if($('#toId').length > 0){//对于多次不同位置点击情况进行判断，如果多次点击则视为回复最后点击者
			$('#toId').val(toId);
		}
		
		else{
			$('<input>').attr({//为detail.jade,添加隐藏输入框，在提交时同步提交tid值
				type:'hidden',
				id:'toId',
				name:'comment[tid]',
				value:toId,
			}).appendTo('#commentForm');
		}

		if($('#commentId').length > 0){//对于多次不同位置点击情况进行判断，如果多次点击则视为回复最后点击者
			$('#commentId').val(commentId);
		}
		else{
			$('<input>').attr({//为detail.jade,添加隐藏输入框，在提交时同步提交cid值
				type:'hidden',
				id:'commentId',
				name:'comment[cid]',
				value:commentId,
			}).appendTo('#commentForm');
		}
	});

	// $("#submitComment").click(function() {
	// 	alert(3444);
	// 	var comment = {};
	// 	comment.tid = $('input[name="comment[tid]"]').val();
	// 	comment.cid = $("input[name='comment[cid]']").val();
	// 	comment.movie = $("input[name='comment[movie]']").val();
	// 	comment.from = $("input[name='comment[from]']").val();
	// 	comment.content = $("#commentTextarea").val(); 
	// 	alert(4555);
	// 	alert(comment.content);
	// 	$.ajax({
	// 		url: '/user/comment',
	// 		type: 'post',
	// 		dataType: 'json',
	// 		data: {'comment':{
	// 			'tid':comment.tid ,
	// 			'cid':comment.cid ,
	// 			'movie':comment.movie,
	// 			'from':comment.from,
	// 			'content':comment.content,
	// 		}},
	// 		success:function(data){
	// 			alert(2333);
	// 			console.log(data);
	// 		},
	// 		error:function() {
	// 			alert("error");
	// 		}

	// 	})
	// });
})