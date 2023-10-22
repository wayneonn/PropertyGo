const stripe = require("stripe")(
  "sk_test_51O28syIn7f8SMRLwmGxTTVYCyJQ9ABufghnmPqD09MClZWsvNaG8hvleFoVSkxCg52N1UUhg4R9UvKqlv52mDVWC00kQX7cXVk"
);

const createPaymentIntent = async (req, res) => {
  const { amount, currency, description } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents
      currency: currency,
      description: description,
    });
    res.status(201).json({ message: paymentIntent });
    // const id = paymentIntent.id;

    // const result = await stripe.paymentIntents.confirm(id, {
    //   payment_method: "pm_card_visa",
    // });

    // res.status(201).json({ message: result });
  } catch (error) {
    console.error("Error creating Payment Intent:", error);
    // throw error;
  }
};

const refundPayment = async (req, res) => {
  const { id } = req.body;

  try {
    // console.log(id);
    // res.status(201).json({message: "ok"})
    const refund = await stripe.refunds.create({
      payment_intent: id,
    });
    res.status(201).json({ message: refund });
  } catch (error) {
    console.error("Error refunding:", error);
    // throw error;
  }
};

module.exports = {
  createPaymentIntent,
  refundPayment,
};
