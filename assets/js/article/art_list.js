// 【全局变量】分页查询参数对象
let q = {
    pagenum: 1, //当前页码
    pagesize: 2,  //页容量
    cate_id: '', // 分类筛选id
    state: '' // 发布状态
}
// 入口函数
$(() => {

    // 模板引擎 过滤器--时间
    template.defaults.imports.dataFormat = function (time) {
        let date = new Date(time);
        // 获取 年 月 日
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        month = month < 10 ? '0' + month : month
        let dates = date.getDate();
        dates = dates < 10 ? '0' + dates : dates

        // 获取 时 分 秒
        let h = date.getHours();
        h = h < 10 ? '0' + h : h
        let m = date.getMinutes();
        m = m < 10 ? '0' + m : m
        let s = date.getSeconds();
        s = s < 10 ? '0' + s : s

        return `${year}-${month}-${dates} ${h}:${m}:${s}`
    }

    // 渲染页面
    initTable();

    // 绑定form表单的提交事件
    $('#form-search').on('submit', getFormStr)

    // 事件委托 绑定删除按钮点击事件
    $('#strbody').on('click', '#outCate', outCate)
})

// 获取文章列表数据--函数--
function initTable() {
    $.ajax({
        method: 'GET',
        url: '/my/article/list',
        data: q,
        success(res) {
            console.log(res);
            let strData = template('tpl-Table', res);
            $('#strbody').empty().html(strData);
            // 渲染分类下拉框
            initCate();
            // 调用 生成页码
            renderPage(res.total);
        }
    })
}

// 初始化文章分类--函数----
function initCate() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success(res) {
            // 生成 下拉框  html代码
            let strData = template('tpl-cate', res)
            // 将 html代码 添加到 分类下拉框中
            $('#newCate').html(strData);
            // 通知 layui 重新渲染 下拉框 和 其他表单元素
            layui.form.render()
        }
    })
}

// 查询事件--处理函数----
function getFormStr(e) {
    // 阻止默认行为
    e.preventDefault();
    // 逐一获取查询表单下拉框数据 
    q.cate_id = $('select[name=cate_id]').val();
    q.state = $('select[name=state]').val();
    // 设置给分页查询参数对象
    // 重新渲染页面
    initTable();
}
// 生成页码条-------------------
// 注意： laypage中的 jump 函数触发机
// 生成页码--函数----
function renderPage(total) {
    layui.laypage.render({
        elem: 'pageBar',    // 页码容器
        count: total,       // 总行数
        curr: q.pagenum,    //获取起始页
        limit: q.pagesize,   //页容量
        layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], //页码条功能
        limits: [2, 5, 8, 10, 12], // 页容量选项
        //  分页发生切换时候 触发jump行数
        jump(obj, first) {
            // 把最新的页码值， 赋值到q这个查询参数
            console.log('当点击页码时：', obj.curr);

            q.pagenum = obj.curr;  // 获取当前页码 设置给分页查询参数

            q.pagesize = obj.limit; // 获取下拉框中 选中的页容量 设置给分页查询参数
            // 当首次点击页码时
            if (!first) {
                initTable()
            }
        }
    });
}

// 删除功能--事件函数----
function outCate() {
    let indexId = $(this).attr('data-id');
    // 获取页面上  剩余的行
    let btn = $('tbody #outCate').length;
    layui.layer.confirm('你确定要删除吗？', function (index) {
        $.ajax({
            method: 'GET',
            url: '/my/article/delete/' + indexId,
            success(res) {
                layui.layer.msg(res.message)
                if (res.status != 0) return;
                // 如果删除成功 需要判断是否已经没有行了 如果没有则 页码减1
                if (btn <= 1) {
                    q.pagenum = q.pagenum == 1 ? 1 : --q.pagenum;
                }
                // 如果删除成功 重新渲染页面
                initTable();
            }
        })
        // 关闭 当前 确认框
        layui.layer.close(index);
    })
}