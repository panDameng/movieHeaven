$(function(){
	$("#alterHeadButton").click(function(event) {
		if($("#alterHead").val() != undefined){//判断input是否有值
			//$("#alterHeadButton").attr('disable', flase);
			var formData = new FormData();
			formData.append('formData', $('#alterHead')[0].files[0]);//获取input上的第一个上传文件
			$.ajax({
				url: '/user/alterHead',
				type: 'post',
				cache: false,//上传文件不需要缓存。
			    data: formData,
			    processData: false,//data值是FormData对象，不需要对数据做处理。
			    contentType: false//是FormData对象，且已经声明了属性enctype="multipart/form-data"，所以这里设置为false。
			})
			.done(function(data) {
				console.log(data);
				$("#showHead").attr('src',"/upload/head-portrait/" + data); 
			})
			.fail(function() {
				console.log("error");
			})
			.always(function() {
				console.log("complete");
			});
		}
	});

	$("#alterPwdButton").click(function(){//显示隐藏修改密码的表单
		$("#passwordForm").toggle();
	});

	$('#newPassword2').blur(function() {//光标离开密码1
		if($('#newPassword1').val() != $('#newPassword2').val()){
			$('#matchpsd_2').html('两次密码不匹配');
			$("#submitPassword").attr('disabled', true);
			$('#matchpsd_2').show();
		}else{
			$('#matchpsd_2').html('');
			$('#matchpsd_2').hide();
		}
	})

	$('#oldPassword').blur(function(){
		if($('#matchpsd_2').html() == '' && $('#oldPassword').val() != ''){
			$("#submitPassword").attr('disabled', false);
		} 
	});
})