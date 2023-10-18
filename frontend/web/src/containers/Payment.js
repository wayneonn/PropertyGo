import React from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

import API from "../services/API";

function Payment() {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    const response = await API.post(
      `http://localhost:3000/admin/payments/createPayment`,
      {
        amount: 900000,
        currency: "sgd",
        description: "test",
      }
    );

    console.log(response.data.message.client_secret);

    const result = await stripe.confirmCardPayment(
      response.data.message.client_secret,
      {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      }
    );

    if (result.error) {
      console.error(result.error.message);
    } else if (result.paymentIntent.status === "succeeded") {
      console.log("Payment succeeded");
      console.log(result);
      const refundResponse = await API.post(
        `http://localhost:3000/admin/payments/refundPayment`,
        {
          id: response.data.message.id,
        }
      );
      console.log(refundResponse);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#0000000D",
        width: "calc(100% - 180px)",
        top: "60px",
        right: "0",
        bottom: "0",
        position: "fixed",
        overflowY: "auto",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: "400px", margin: "0 auto" }}
      >
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="card-element">Card details</label>
          <CardElement
            id="card-element"
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
          />
        </div>

        <button type="submit" disabled={!stripe} style={{ width: "100%" }}>
          Pay
        </button>
      </form>
    </div>
  );
}

export default Payment;

// const Payment = () => {
//   return (
//     <div>
//       <p>Payment</p>
//     </div>
//   );
// };

// export default Payment;
