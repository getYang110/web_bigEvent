// 入口函数
$(() => {
    getUserInfo();

    // 绑定退出按钮点击事件
    $('#btnLogin').on('click', logout)
})

// 获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: 'http://ajax.frontend.itheima.net/my/userinfo',
        headers: {
            Authorization: localStorage.getItem('token')
        },
        success(res) {
            // 判断是否获取用户信息成功
            if (res.status != 0) return layui.layer.msg('获取用户信息失败')
            // 调用 renderAvatar 渲染用户头像
            renderAvatar(res.data);
        }
    })
}
// 渲染用户信息函数
function renderAvatar(userData) {
    // 先获取 用户名 (昵称/用户名)
    let username = userData.nickname || userData.username;
    // 设置给 welcom span标签
    $('#welcome').html(username)
    // 按需渲染用户的头像
    if (userData.user_pic !== null) {
        //  有图片头像
        $('.layui-nav-img').attr('src', userData.user_pic).show();
        // 隐藏文字头像
        $('.text-avatar').hide();
    } else {
        // 没有图片头像，使用文本头像
        $('.layui-nav-img').hide(); //隐藏图片头像
        let firstChar = username[0].toUpperCase(); //获取名字首字
        $('.text-avatar').text(firstChar).show(); //设置文字并显示
    }
}
// 退出按钮
function logout() {
    // 弹出确认框
    layui.layer.confirm('您确定要退出吗?', { icon: 3, title: '提示' }, function (index) {
        // 删除 localStorage 中的 token值
        localStorage.removeItem('token');
        // 跳转到登录页面
        location = '/login.html';
        layer.close(index);
    });
}