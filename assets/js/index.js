// 入口函数
$(() => {
    getUserInfo();
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