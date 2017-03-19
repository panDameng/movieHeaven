
	$('#signinPassword2').blur(function() {//光标离开密码1
		console.log($('#signinPassword1').val());
		console.log($('#signinPassword2').val());
		if($('#signinPassword1').val() != $('#signinPassword2').val()){
			$('#matchpsd').show();
		}else{
			$('#matchpsd').hide();
		}
	})