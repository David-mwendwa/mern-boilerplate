import React from 'react';
// import CheckoutButton from '../components/layout/Checkout';
import CheckoutButton from '../components/layout/CheckoutButton';

const Checkout = () => {
  return (
    <>
      <h3>Click the button below to checkout</h3>
      <CheckoutButton subtotal={1233} />
    </>
  );
};

export default Checkout;
