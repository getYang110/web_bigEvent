// 为页面上 所有基于 jq的ajax 请求发送之前，对参数对象进行处理
$.ajaxPrefilter(function (Obj) {
    Obj.url = 'http://ajax.frontend.itheima.net' + Obj.url;

    // 统一为有权限的接口，设置 headers 请求头
    if (Obj.url.indexOf('/my/') > -1) {
        Obj.headers = {
            Authorization: localStorage.getItem('token')
        }
    }
    // 全局统一挂在 complete 回调函数
    Obj.complete = function (res) {
        console.log(res);
        // console.log(res.responseJSON);
        if (res.responseJSON.status == 1 && res.responseJSON.message == '身份认证失败！') {
            // 没有登录 则
            // 显示需要重新登录 的消息
            layui.layer.msg(res.responseJSON.message, {
                icon: 1,
                time: 1500
            }, function () {
                // 清空 token
                localStorage.removeItem('token')
                // 跳转到 login.html
                location.href = '/login.html'
            });
            // 清空 token
            localStorage.removeItem('token');

        }
    }
})