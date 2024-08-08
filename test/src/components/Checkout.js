/* global qeen */
import React, { useState } from 'react';
import '../styles/Checkout.css';

function Checkout() {
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleButtonClick = () => {
    setTimeout(() => {
      qeen.sendCheckoutEvent('USD', 1_234.56);
      setPaymentSuccess(true);
    }, 1000);
  };

  return (
    <div className='container'>
      <p className='content'>Checkout Amount: <span className='amount'>$1,234.56</span></p>
      <button className='button' id="checkout" onClick={handleButtonClick}>Pay Now</button>
      {paymentSuccess && <p className='successMessage'>Payment successful!</p>}
    </div>
  );
}

export default Checkout;