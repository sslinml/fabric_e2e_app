
(function(global,$){
    $("#blockquery").click(function() {
        $.ajax({
            url: "block",
            dataType: "json",
            async: true,
            data: {
                "numberID": $('#numberID').val(),
            },
            type: "POST",
            beforeSend: function () {
            },
            success: function (response){
                if(response){
                    console.log("ajax blockquery success!");
                }
                
            },
           
            complete: function () {

            }
        })
    })
}
)(window,jQuery)