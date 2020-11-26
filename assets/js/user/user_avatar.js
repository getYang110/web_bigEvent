// 1.1 获取裁剪区域的 DOM 元素
let $image = $('#image')
// 1.2 配置选项
const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
}

$(() => {
    initCropper();

    // 上传按钮绑定点击事件
    $('#btnChooseImage').on('click', setChooseImage)

    // 为文件选择框绑定change事件
    $('#file').on('change', fileChange)

    //为确定按钮绑定点击事件
    $('#btnUpload').on('click', imgUpload)
})

// 初始化 裁剪插件------
function initCropper() {
    // 1.3 创建裁剪区域
    $image.cropper(options)
}

// 上传功能事件函数------
function setChooseImage() {
    $('#file').click();
}

// 选中文件-------
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

    console.log(fileList);
}

// 上传功能--事件函数-----
function imgUpload() {
    let dataURL = $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 100,
            height: 100
        })
        .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

    // 发送ajax 请求 上传数据
    $.ajax({
        method: 'POST',
        url: '/my/update/avatar',
        data: {
            avatar: dataURL
        },
        success(res) {
            console.log(dataURL);
            console.log(res);
            if (res.status != 0) return layui.layer.msg('头像上传失败')
            window.parent.getUserInfo();
        }
    })
}