
(function(global,$){
    $("#invoke").click(function() {
        $.ajax({
            dataType: "json",
            async: true,
            data: {
                "zhuanzhang": $('#zhuanzhang').val(),
                "shoukuan": $('#shoukuan').val(),
                "money": $('#money').val(),
            },
            type: "POST",
            beforeSend: function () {
            },
            success: function (response) {
                if (response) {
                    var success1 = response.message;
                    //location.href('invoke');跳转页面
                }
                var newDom = '<p> <span style="color:red;">'+ success1 +'</span> </p>';
                $('.add-save').after(newDom);
                setTimeout(function () {
                    location.assign("/invoke");
                }, 1000)
            },
            error: function () {
                layer.alert("请求失败", {
                    skin: 'layui-layer-molv',
                    closeBtn: 0,
                    shift: 2
                });
            },
            complete: function () {

            }
        })
    })
}
)(window,jQuery)