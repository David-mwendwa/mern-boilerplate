import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import customFetch from '../../utils/customFetch';
import { toast } from 'react-toastify';

/**
 * Create stripe checkout button
 * @param {*} subtotal the total price of order items
 * @returns button component packed with ability to initialize checkout process
 */

export const orderAction = async (token, subtotal) => {
  const user = {};
  const cartItems = [
    {
      product: 'productId',
      name: 'item 1',
      price: 23,
      quantity: 2,
      image: 'no image',
    },
  ];

  try {
    // const stripeSecret = await customFetch.get('/stripe-secret-key');
    // console.log({ stripeSecret });
    // const config = {
    //   headers: {
    //     Authorization: `Bearer ${stripeSecret}`,
    //     'Content-Type': 'application/json',
    //   },
    // };
    await customFetch.post('/order', { token, subtotal, user, cartItems });
    toast.success('Order placed');
    return redirect('/');
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.message);
    console.log(error);
    return error;
  }
};

const CheckoutButton = ({ subtotal = 2000 }) => {
  const handleToken = (token) => {
    console.log('TOKEN', token);
    orderAction(token, subtotal);
  };
  return (
    <div>
      <StripeCheckout
        amount={subtotal}
        shippingAddress
        token={handleToken}
        stripeKey='pk_test_51Imu8iKOyrEmScQWPjLK1SnUf9PbG8rllu8jmde1hV3ACQ6Qgmah6LUbIY6ihb89T4drjJvpcopn6V5HMwKvZEef00WiY46IBc'>
        <button className='btn btn-primary'>CHECKOUT</button>
      </StripeCheckout>
    </div>
  );
};

export default CheckoutButton;
