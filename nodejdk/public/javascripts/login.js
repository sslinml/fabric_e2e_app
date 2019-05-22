
(function(global,$){
    $("#login").click(function() {
        $.ajax({
            dataType: "json",
            async: true,
            data: {
                "username": $('#username').val(),
                "password": $('#password').val(),
            },
            type: "POST",
            beforeSend: function () {
            },
            success: function (response) {
                if (response) {
                    var success = response.message;
                }
                var newDom = '<p>' + success + '</p>';
                $('.add-save').after(newDom);
                setTimeout(function () {
                    location.assign("/logreg");
                }, 500)
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