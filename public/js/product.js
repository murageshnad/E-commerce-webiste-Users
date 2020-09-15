
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
                    console.log("success", response);
                    //totalQty = response.totalQty;
                    //console.log("totalQty----", totalQty);
                    $("#count").append(response.totalQty);

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






});// close main function

