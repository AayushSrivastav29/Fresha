const SibApiV3Sdk = require("sib-api-v3-sdk");
const sendEmail =async (email, subject, htmlContent)=>{
  try {
    var defaultClient = SibApiV3Sdk.ApiClient.instance;
    var apiKey = defaultClient.authentications["api-key"];
    apiKey.apiKey = process.env.MAILING_API_KEY;

    const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

    const sender = {
      email: process.env.MY_EMAIL,
      name: "Fresha",
    };

    const receivers = [{ email }];

    const response = await tranEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject: subject,
      htmlContent: htmlContent,
    });

    console.log("Email sent:", response);
  } catch (err) {
    console.log("Failed to send email:", err.message);
  }
}

module.exports=sendEmail;