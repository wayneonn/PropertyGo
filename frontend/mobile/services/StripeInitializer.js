// StripeInitializer.js
import React, { useEffect } from 'react';
import { useStripe } from '@stripe/stripe-react-native';

const StripeInitializer = () => {
//   const { initPaymentSheet } = useStripe();

  useEffect(() => {
    // Initialize Stripe here using initPaymentSheet if needed
    const { initPaymentSheet } = useStripe();
  }, []);

  return null;
};

export default StripeInitializer;
