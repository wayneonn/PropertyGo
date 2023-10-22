const stripe = require('stripe')('sk_test_51O28syIn7f8SMRLwmGxTTVYCyJQ9ABufghnmPqD09MClZWsvNaG8hvleFoVSkxCg52N1UUhg4R9UvKqlv52mDVWC00kQX7cXVk');

async function paymentSheet(req, res) {
    console.log("paymentSheet req.body: ", req.body);
    const {
        stripeCustomerId,
        amount,
        currency,
        email,
        name,
        description,
        isAService,
    } = req.body;

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

        // Create the tax rate
        const taxRate = await stripe.taxRates.create({
            display_name: 'GST',
            inclusive: false,
            percentage: 8,
            country: 'SG',
            description: 'Goods and Services Tax',
        });


        // Create the invoice item with the tax rate
        const invoiceItemCreateParams = {
            customer: customer.id,
            amount: amount, // Calculate the total amount
            currency: currency,
            description: description,
        };

        if (isAService) {
            invoiceItemCreateParams.tax_rates = [taxRate.id];
        }

        const invoiceItem = await stripe.invoiceItems.create(invoiceItemCreateParams);

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
            invoiceItemId: invoiceItem.id, // Return the created invoice item ID
            publishableKey: 'pk_test_51O28syIn7f8SMRLwcw29qbwrE1K3EwJUAC1uXgqnWO8sYsri8EdL4WI8prHJ5y6kzvre0yFDgVdja2hPlOr32kRz00gMpVYlqW',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while processing the payment.' });
    }
}

// Function to handle refunds
async function refundPayment(req, res) {
    try {
        // Extract refund details from the request body
        const { paymentIntentId, amountToRefund } = req.body;

        // Create a refund
        const refund = await stripe.refunds.create({
            payment_intent: paymentIntentId,
            reason: 'requested_by_customer',
        });

        res.json({ refund });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while processing the refund.' });
    }
}


module.exports = {
    paymentSheet,
    refundPayment,

};
