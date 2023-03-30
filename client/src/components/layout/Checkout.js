import React from 'react';
import { useDispatch } from 'react-redux';
import StripeCheckout from 'react-stripe-checkout';
import { placeOrder } from '../../../redux/actions/orderActions';

/**
 * Create stripe checkout button
 * @param {*} subtotal the total price of order items
 * @returns button component packed with ability to initialize checkout process
 */
const Checkout = ({ subtotal }) => {
  const dispatch = useDispatch();
  const handleToken = (token) => {
    dispatch(placeOrder(token, subtotal));
  };
  return (
    <div>
      <StripeCheckout
        amount={subtotal}
        shippingAddress
        token={handleToken}
        stripeKey='pk_test_...'>
        <button className='btn btn-primary'>CHECKOUT</button>
      </StripeCheckout>
    </div>
  );
};

export default Checkout;
