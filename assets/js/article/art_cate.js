$(() => {
    getArticleList();

    // 绑定新增按钮点击事件
    $('#btnNews').on('click', openWindow);

    // 事件委托 获取form表单的提交事件
    $('body').on('submit', '#form-add', doAdd);

    // 事件委托 绑定删除按钮点击事件
    $('#strbody').on('click', '#outCate', deleteCate);

    // 事件委托 绑定编辑按钮点击事件
    $('#strbody').on('click', '#btn-edit', openEdit)
})
// 弹出层索引
let indexAdd = null;

// 渲染分类列表
function getArticleList() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success(res) {
            console.log(res);
            let strData = template('tp-cate', res);
            $('#strbody').empty().html(strData)
        }
    });
}

// 显示弹出层
function openWindow() {

    indexAdd = layui.layer.open({
        type: 1,
        area: ['500px', '250px'],
        title: '添加文章分类'
        , content: $('#tpl-window').html()
    });

}

function doAdd(e) {
    e.preventDefault();
    // 获取 弹出层 标题
    let title = $('.layui-layer-title').text().trim();
    if (title == '添加文章分类') {
        // 获取数据
        let strHtml = $('#form-add').serialize();
        // 将数组字符串中的  id=& 替换成空字符串
        strHtml = strHtml.replace('Id=&', '');
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: strHtml,
            success(res) {
                // 无论成功与否都渲染页面
                layui.layer.msg(res.message);
                // 判断是否获取数据成功
                if (res.status != 0) return
                // 成功后执行
                // 重新渲染页面
                getArticleList();
                // 关闭弹出层
                layui.layer.close(indexAdd);
            }
        })
    }
    else {
        // 编辑操作------
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success(res) {
                console.log(res);
                layui.layer.msg(res.message);
                if (res.status != 0) return;
                // 重新获取分类列表
                getArticleList();
                // 关闭弹出窗口
                layui.layer.close(indexAdd)
            }
        })
    }
}

// 删除功能--事件函数-----
function deleteCate() {
    let indexId = $(this).attr('data-id');
    layui.layer.confirm('您确定要删除吗？?', { icon: 3, title: '提示' }, function (index) {
        $.ajax({
            method: 'GET',
            url: '/my/article/deletecate/' + indexId,
            success(res) {
                // 无论删除成功与否都提示消息
                layui.layer.msg(res.message)
                // 判断是否删除成功
                if (res.status != 0) return
                // 渲染页面
                getArticleList();
            }
        })
        layer.close(index);
    });

}


// 显示编辑弹出层
function openEdit() {
    indexAdd = layui.layer.open({
        type: 1,
        area: ['500px', '250px'],
        title: '编辑文章分类'
        , content: $('#tpl-window').html()
    });
    // 获取 id
    let indexId = $(this).attr('data-id')
    $.ajax({
        method: 'GET',
        url: '/my/article/cates/' + indexId,
        success(res) {
            layui.layer.msg(res.message);
            if (res.status != 0) return
            // 将获取的文章分类数据 自动填充到 表单元素中
            layui.form.val('formData', res.data);
        }
    })
}