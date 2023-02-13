import React, { Component, useState } from 'react'
import { SAND_ID } from '../data/contant'
import { Link } from 'react-router-dom';
import image from '../data/image/leather-bag.jpg';

export default function Home() {
  
  const [email, setEmail] = useState('sb-l6mbr25025458@business.example.com');
  const [amount, setAmount] = useState("9.99");


  const handleSubmit = event => {
    event.preventDefault();
    window.location.href = `https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${email}&amount=${amount}`;
    // window.location.href = 'https://www.sandbox.paypal.com/cgi-bin/webscr';
  };

  return (
    <section class="py-5">
      <div class="container">
        <div class="row">
          <div class="col-lg-7 col-md-10 col-12 my-auto mx-auto text-center">
            <h1>
              Stripe Payment
            </h1>
            <div class="card mb-4">
              <div class="card-body">
                {/* <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" /> */}
                {/* <img src="%PUBLIC_URL%/leather-bag.jpg" alt="leather-bag" width="400" height="300" /> */}
                <img src={image} alt="leather-bag" width="400" height="300" />

                <p class="lead">USD 9.99</p>
              </div>
            </div>
            <p class="lead mb-4">
              What would you like to pay?
            </p>
            {/* <a class="btn btn-success" href={/charge}>Pay</a> */}
            <Link to="/charge" class="btn btn-success">Pay</Link><br />
            {/* <Link to="/sandbox" class="btn btn-success">sandbox</Link> */}
            <form onSubmit={handleSubmit}>
              <input type="hidden" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input  type="hidden" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
              <input type="hidden" id='fff' name="cmd" value="_xclick" />
              <input type="hidden" name="item_name" value="Test Item" />
              <input type="hidden" name="item_number" value="123" />
              <input type="hidden" name="currency_code" value="USD" />
              <a style={{ color: 'blue' }} id='sandbox' onClick={handleSubmit}>Sandbox</a>
            </form>
          </div>
        </div>
      </div>
    </section>

  )

}

