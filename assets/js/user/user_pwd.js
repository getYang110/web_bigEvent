$(() => {

    layui.form.verify({

        pwd: [/^\S{6,12}$/, '密码必须6位到12位,且不能出现空格'],

        samepwd: function (value) {
            // 判断原密码与新密码是否一致
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能一样';
            }
        },
        // 确认密码判断
        confirmpwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '确认密码和新密码输入不一样';
            }
        }
    });
    // 获取表单提交事件
    $('.layui-form').on('submit', getForm);
})

// 提交表单函数
function getForm(e) {
    e.preventDefault()
    $.ajax({
        method: 'POST',
        url: '/my/updatepwd',
        data: $(this).serialize(),
        success(res) {
            // 如果不成功 return 退出函数
            if (res.status != 0) return layui.layer.msg(res.message), { icon: 1, time: 1500 };
            layui.layer.msg(res.message, {
                icon: 1,
                time: 1500
            }, function () {
                // 如果成功 则清空token 并 跳转到login.html
                localStorage.removeItem('token');
                window.parent.location.href = '/login.html'
            });
        }
    })
}