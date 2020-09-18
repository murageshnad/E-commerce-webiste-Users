
$(document).ready(function () {

    $('.add').on('click', function (responseTxt, statusTxt, xhr) {
        event.preventDefault();
        console.log('clicked');
        let id = $(this).attr('data-type');
        let count = $(this).attr('id-data');
        console.log("type", id);
        addingProduct(id, count);

    });
    function addingProduct(id, count) {
        console.log('inside', id);
        //var totalQty;
        $.ajax({
            type: 'post',
            url: '/home/add-to-cart/' + id,
            data: { "productId": id },
            success: function (response) {
                if (response) {

                    //$("#count").append(response);
                    //console.log("success", response.items.length);
                    //totalQty = response.totalQty;
                    // console.log("totalQty----", response.totalQty);
                    $("#qty").html(response.totalQty);

                    $.notify({
                        // Options
                        icon: 'fa fa-check-circle',
                        message: 'Product has been successfully added',

                    },
                        {
                            // settings
                            type: 'success',
                            offset: {
                                x: 10,
                                y: 60
                            },
                            animate: {
                                enter: 'animated fadeInDown',
                                exit: 'animated fadeOutUp'
                            }
                        }
                    );
                    $("#count").remove();
                }
            },
            error: function (error) {
                console.log('something went wrong !!...');
                console.log('error = ', error);
            },

        });
    }



    $('.adding').on('click', function (responseTxt, statusTxt, xhr) {
        event.preventDefault();
        console.log('clicked');
        let id = $(this).attr('data-type');
        console.log("type", id);
        IncreaseProduct(id);

    });
    function IncreaseProduct(id) {
        console.log('inside', id);
        var productId = id;
        let obj = {};
        $.ajax({
            type: 'post',
            url: '/home/add-cart/' + id,
            data: { "productId": id },
            success: function (response) {
                if (response) {

                    //$("#count").append(response);
                    //console.log("success", response);
                    // console.log("length", typeof response.items);
                    $.each(response.items, function (key, val) {
                        if (key == productId) {
                            console.log(val.qty);
                            obj.qty = val.qty;
                        }
                        //console.log('key', productId);

                    });
                    $("#plus").html(obj.qty);
                    console.log('qty:', obj.qty);

                }
            },
            error: function (error) {
                console.log('something went wrong !!...');
                console.log('error = ', error);
            },

        });
    }






});// close main function

