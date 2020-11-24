// 从 layui中获取form对象
let form = layui.form;
let layer = layui.layer;
// 入口函数
$(() => {
    // 绑定去注册按钮点击事件
    $('#link-res').on('click', () => {
        $('.login-box').hide();
        $('.reg-box').show();
    })
    // 绑定去登录按钮点击事件
    $('#link-login').on('click', () => {
        $('.login-box').show();
        $('.reg-box').hide();
    })



    // 通过form.verify() 函数自定义校验规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'],
        repwd: function (value) {
            let pwd = $('.reg-box [name=password]').val();
            if (pwd != value) return '两次密码输入不一致，请重新输入';
        }
    })

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', subMitData);

    // 监听登录表单的提交事件
    $('#from_box').on('submit', subMitBox)
})
// 注册函数-------
function subMitData(e) {
    e.preventDefault();  //阻断表单的默认行为
    // 获取 表单数据
    let dataStr = $(this).serialize();
    //发送 ajax异步请求
    $.ajax({
        method: 'POST',
        url: '/api/reguser',
        data: dataStr,
        success(res) {
            layer.msg(res.message);
            // 判断是否注册成功
            if (res.status != 0) return
            // 注册成功
            // 将用户名 密码 自动填充到 登录表单中
            $('.login-box [name=username]').val($('.reg-box [name=username]').val().trim())
            $('.login-box [name=password]').val($('.reg-box [name=password]').val().trim())
            // 清空注册表单
            $('#form_reg')[0].reset();
            // 注册成功跳转登录页面
            $('#link-login').click();
        }
    })
}
// 登录函数-------
function subMitBox(e) {
    e.preventDefault()  // 阻止表单默认行为
    let strData = $(this).serialize();
    $.ajax({
        method: 'POST',
        url: '/api/login',
        data: strData,
        success(res) {
            // 登录失败
            if (res.status != 0) return layer.msg(res.message);
            // 登录成功
            // 弹出提示消息
            layer.msg(res.message, {
                icon: 6,
                time: 1500 //2秒关闭（如果不配置，默认是3秒）
            }, function () {
                // 保存 token值到 localstorage
                localStorage.setItem('token', res.token);
                // 跳转到主页
                location = '/index.html'
            });
        }
    })
}
