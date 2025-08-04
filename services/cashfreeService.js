const { Cashfree, CFEnvironment } = require("cashfree-pg");


const cashfree = new Cashfree(
  CFEnvironment.SANDBOX,
  process.env.CASHFREE_APPID,
  process.env.CASHFREE_SECRET_KEY
);

exports.createOrder = async (
  orderId,
  orderAmount,
  user
) => {
  try {
    const expiryDate = new Date(Date.now() + 60 * 60 * 1000); //1hr from now
    const formattedExpiryDate = expiryDate.toISOString();

    const request = {
      order_id: orderId,
      order_amount: "500",
      order_currency: "INR",

      customer_details: {
        customer_id: String(user.id),
        customer_email: user.email,
        customer_phone: user.phone || "9999999999",
      },

      order_meta: {
        return_url: `http://localhost:5000/api/payment/status/${orderId}`,
        //notify_url: "https://www.cashfree.com/view/payment-success.html?orderId=${orderId}devstudio/preview/pg/webhooks/46631095",
        //return_url: `http://localhost:5000/view/payment-success.html?orderId=${orderId}`,

        payment_methods: "ccc, upi, nb",
      },

      order_expiry_time: formattedExpiryDate, //set valid expiry date
    };

    const response = await cashfree.PGCreateOrder(request);
    // Return the payment_session_id from the response
    return response.data.payment_session_id;
  } catch (error) {
    console.log("Cashfree error:", error.response?.data || error.message);
    throw error;
  }
};

exports.getPaymentStatusFromCashfree = async (orderId) => {
  try {
    const response = await cashfree.PGOrderFetchPayments(orderId);

    let getOrderResponse = response.data;
    let orderStatus;

    if (
      getOrderResponse.filter(
        (transaction) => transaction.payment_status === "SUCCESS"
      ).length > 0
    ) {
      orderStatus = "success";
    } else if (
      getOrderResponse.filter(
        (transaction) => transaction.payment_status === "PENDING"
      ).length > 0
    ) {
      orderStatus = "pending";
    } else {
      orderStatus = "failed";
    }
    return orderStatus;
  } catch (error) {
    console.error("Error fetching order status:", error.message);
  }
};

