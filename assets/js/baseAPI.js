// 为页面上 所有基于 jq的ajax 请求发送之前，对参数对象进行处理
$.ajaxPrefilter(function (Obj) {
    Obj.url = 'http://ajax.frontend.itheima.net' + Obj.url;
})