const stripe = require('stripe')('sk_test_51O28syIn7f8SMRLwmGxTTVYCyJQ9ABufghnmPqD09MClZWsvNaG8hvleFoVSkxCg52N1UUhg4R9UvKqlv52mDVWC00kQX7cXVk');

async function paymentSheet(req, res) {
console.log("paymentSheet req.body: ", req.body);
  const { stripeCustomerId, amount, currency, email, name } = req.body;

  try {
    let customer;

    // Check if the customer ID is provided
    if (stripeCustomerId) {
      // If a customer ID is provided, try to retrieve the customer from Stripe
      customer = await stripe.customers.retrieve(stripeCustomerId);
    }

    // If the customer does not exist or if no customer ID was provided, create a new one
    if (!customer) {
      customer = await stripe.customers.create({
        email: email,
        name: name,
    });
    }

    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: '2023-10-16' }
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey: 'pk_test_51O28syIn7f8SMRLwcw29qbwrE1K3EwJUAC1uXgqnWO8sYsri8EdL4WI8prHJ5y6kzvre0yFDgVdja2hPlOr32kRz00gMpVYlqW'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing the payment.' });
  }
}

module.exports = {
  paymentSheet,
};
