$(function(){
	$('#signinPassword2').blur(function() {//光标离开密码1
		$("#verifyUserName").hide();
		console.log($('#signinPassword1').val());
		console.log($('#signinPassword2').val());
		if($('#signinPassword1').val() != $('#signinPassword2').val()){
			$('#matchpsd').show();
			$("#subSignUp").attr('disabled', true);
		}else{
			$('#matchpsd').hide();
			if($("#verifyUserName").html() == '用户名尚未被注册'){//满足条件才能点击提交
				$("#subSignUp").attr('disabled', false);
			 }
		}
	});

	$('#signupName').blur(function(){

		if($('#signupName').val() == ''){//注册名填写为空判断
			$("#subSignUp").attr('disabled', true);
			$("#verifyUserName").css('color','red');
			$("#verifyUserName").html('用户名不能为空');
			$("#verifyUserName").show();
		}else{
			var name = $('#signupName').val();//不为空的注册名进行ajax后台验证
			$("#verifyUserName").hide();
			$.ajax({
				url:'user/verifyUserName',
				type:'post',
				dataType:'json',
				data:{'data':name},
				success:function(data){
					if(data == 0){
						$("#verifyUserName").css('color','red');
						$("#verifyUserName").html('用户名已存在');
						$("#verifyUserName").show();
						$("#subSignUp").attr('disabled', true);
					}else if(data == 1){
						$("#verifyUserName").css('color','skyblue');
						$("#verifyUserName").html('用户名尚未被注册');
						$("#verifyUserName").show();
					}
				}
			})
		}
	})



	$('#signinPassword2_1').blur(function() {//光标离开密码1
		$("#verifyUserName_1").hide();
		console.log($('#signinPassword1_1').val());
		console.log($('#signinPassword2_1').val());
		if($('#signinPassword1_1').val() != $('#signinPassword2_1').val()){
			$('#matchpsd_1').show();
			$("#subSignUp_1").attr('disabled', true);
		}else{
			$('#matchpsd_1').hide();
			if($("#verifyUserName_1").html() == '用户名尚未被注册'){//满足条件才能点击提交
				$("#subSignUp_1").attr('disabled', false);
			 }
		}
	});

	$('#signupName_1').blur(function(){
		if($('#signupName_1').val() == ''){//注册名填写为空判断
			$("#subSignUp_1").attr('disabled', true);
			$("#verifyUserName_1").css('color','red');
			$("#verifyUserName_1").html('用户名不能为空');
			$("#verifyUserName_1").show();
		}else{
			var name = $('#signupName_1').val();//不为空的注册名进行ajax后台验证
			$("#verifyUserName_1").hide();
			$.ajax({
				url:'user/verifyUserName',
				type:'post',
				dataType:'json',
				data:{'data':name},
				success:function(data){
					if(data == 0){
						$("#verifyUserName_1").css('color','red');
						$("#verifyUserName_1").html('用户名已存在');
						$("#verifyUserName_1").show();
						$("#subSignUp_1").attr('disabled', true);
					}else if(data == 1){
						$("#verifyUserName_1").css('color','skyblue');
						$("#verifyUserName_1").html('用户名尚未被注册');
						$("#verifyUserName_1").show();
					}
				}
			})
		}
	})

	//修改密码进入时的弹窗显示
	if($("#alertDecide").html() == 1){
		swal({//使用sweetalert美化弹窗
			title:"修改成功",
			text:"请重新登录",
			type:"success"
		});
		$("#errorRemind").hide();
	}
})