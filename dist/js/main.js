var money = $('#payInput').val()

$('#surePay').on('click', function (event) {
    event.preventDefault();
    submitOrder(money);
})

var payCount = 0;
var isPaying = false;
function submitOrder(money) {
    if (isPaying) {
        console.error('已经提交');
        return;
    }
    isPaying = true;
    setTimeout(function () {
        isPaying = false;
    }, 5000);

    money = parseInt(money);

    $.ajax({
        url: baseUrl + '/pay/BBWxPay',
        type: 'POST',
        dataType: 'json',
        data: {gameid: gameid, money: money},
        success: function (data) {
            if (data.status == "ok") {
                payCount = 0;
                var payData = JSON.parse(data.msg)
                jsApiCall(payData, data.order_id);
            } else {
                if (payCount > 5) {
                    return;
                }
                console.error('第一次没能获取数据，发起第二次');
                isPaying = false;
                payCount++;
                setTimeout(function () {
                    submitOrder(money)
                }, 500);

            }
        }
    });
}
function jsApiCall(data,orderId){
    WeixinJSBridge.invoke(
        'getBrandWCPayRequest',
        data,
        function(res){
            if (res.err_msg == "get_brand_wcpay_request:ok") {
                confirmOrder(orderId);
            } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                alert("订单已取消，但依然感谢您!");
            } else {
                alert(res.err_msg);
            }
        }
    );
}
