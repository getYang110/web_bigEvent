// 入口函数
$(() => {
    // 为layui添加校验规则
    layui.form.verify({
        // 校验规则
        nickname: [/^\S{6,12}$/, '昵称必须在6到12个字符之间']
    })
    // 加载用户基本信息
    initUserInfo();

    // 重置按钮点击事件
    $('#btnReset').on('click', function () {
        initUserInfo();
    });
    // 修改按钮点击事件
    $('#userForm').on('submit', setUserForm)
})
// 初始化用户信息
function initUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success(res) {
            console.log(res.data);
            // 错误判断
            if (res.status != 0) return layui.layer.msg('获取用户信息失败');
            // 将输入装入同名的表单元素中
            layui.form.val('userForm', res.data)
        }
    })
}
function setUserForm(e) {
    e.preventDefault();
    $.ajax({
        method: 'POST',
        url: '/my/userinfo',
        data: $(this).serialize(),
        success(res) {
            console.log(res);
            // 不管成功与否 都显示消息
            layui.layer.msg(res.message);
            // 失败
            if (res.status != 0) return
            // 成功
            // 如果没有出错 则通过 window.parent 或 window.top 调用父页面的方法
            window.parent.getUserInfo();
        }
    })
}

