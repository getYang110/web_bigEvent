let $image = null;
let options = null;

// 文章状态
let state = '';

// 入口函数
$(() => {
    // 图片封面样式
    initEditor();

    // 1. 初始化图片裁剪器
    $image = $('#image')
    // 2. 裁剪选项
    options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 渲染下拉框选项列表
    initCateList()

    // 选择封面按钮绑定点击事件
    $('#btnFile').on('click', () => {
        // 模拟文件选择框被点击
        $('#coverFile').click();
    })

    // 绑定封面选择框change事件
    $('#coverFile').on('change', fileChange);

    // 绑定草稿按钮点击事件
    $('#btnDraft').on('click', Draft)
    // 绑定发布按钮点击事件
    $('#btnPublish').on('click', Draft)

    // form表单绑定提交事件
    $('#pubForm').on('submit', doSubmit)
})
// 下拉框选项数据--函数----
function initCateList() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success(res) {
            layui.layer.msg(res.message)
            if (res.status != 0) return
            let strHtml = template('tpl-select', res)
            $('[name=cate_id]').html(strHtml)
            layui.form.render();
        }
    })
}

// 封面选择框功能--函数-----
function fileChange(e) {
    let fileList = e.target.files;
    if (fileList.length == 0) return layui.layer.msg('请选择文件')
    // 获取选中的 第一个文件 信息对象
    let file = e.target.files[0];

    // 根据选择的文件，创建一个对应的 URL 地址：
    let newImgURL = URL.createObjectURL(file)

    // 调用 裁剪组件，销毁之前的图片 设置新的 虚拟路径给他 并重新创建裁剪区
    $image
        .cropper('destroy')      // 销毁旧的裁剪区域
        .attr('src', newImgURL)  // 重新设置图片路径
        .cropper(options)        // 重新初始化裁剪区域
}

// 发布点击事件--处理函数------
function publish() {
    state = '已发布'
}
// 草稿点击事件--处理函数----
function Draft() {
    state = '草稿'
}

// form表单提交--事件函数------
function doSubmit(e) {
    // 阻断表单默认行为
    e.preventDefault()
    // 获取 表单数据 装入 formData对象(有文件要上传)
    let fd = new FormData(this);
    // 为formdata 追加state(文章状态)
    fd.append('state', state);
    // 将封面裁剪过后的图片输出为文件对象
    $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
        .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
            fd.append('cover_img', blob);
            // 提交到接口
            $.ajax({
                method: 'POST',
                url: '/my/article/add',
                data: fd,
                processData: false,
                contentType: false,
                success(res) {
                    // 判断你是否发表成功
                    if (res.status != 0) return layui.layer.msg(res.message)
                    // 如果成功。 则跳转到 列表页面
                    window.parent.location = '/article/art_list.html'
                }
            })
        })
}

