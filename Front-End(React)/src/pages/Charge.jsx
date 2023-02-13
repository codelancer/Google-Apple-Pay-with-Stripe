import React, { useEffect, useState, useMemo, FC } from "react";
import { Link } from "react-router-dom";
import {
  useStripe,
  useElements,
  PaymentRequestButtonElement,
  CardElement
} from "@stripe/react-stripe-js";
import axios from "axios";

// import { API_URL } from "@/constants";
// import { useStore } from "@/store";

export default function Charge() {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [email, setEmail] = useState("")

  // const subscriptionPlan = useStore((state) => state.subscriptionPlan);
  const amount = 100;
  const PRICE = amount / 100;
  const CARD_OPTIONS = {
    iconStyle: "solid",
    style: {
      base: {
        iconColor: "#c4f0ff",
        color: "black",
        fontWeight: 500,
        fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
        fontSize: "16px",
        fontSmoothing: "antialiased",
        ":-webkit-autofill": { color: "black" },
        "::placeholder": { color: "black" }
      },
      invalid: {
        iconColor: "#ffc7ee",
        color: "black"
      }
    }
  }
  // if (!elements || !stripe) return <div>Loading...</div>;

  useEffect(() => {

    if (stripe) {
      const pr = stripe.paymentRequest({
        country: "US",
        currency: "usd",
        total: {
          label: "Membership",
          amount: PRICE,
        },
        requestPayerName: true,
        requestPayerEmail: true,
        disableWallets: ["googlePay", "browserCard"],
      });

      pr.canMakePayment().then((result) => {
        if (result) {
          setPaymentRequest(pr);
        }
      });
    }
  }, [stripe]);

  const onPaymentSubmit = () => {
    paymentRequest.on("paymentmethod", handlePaymentRequest);
  };

  const handlePaymentRequest = async (event) => {
    const email = event.payerEmail;
    const name = event.payerName;

    const result = await axios.post(`/checkout`, {
      price: 100,
      paymentMethodType: "card",
      currency: "usd",
      email,
      name,
    });

    const { success } = result.data;

    if (!success) {
      event.complete("fail");
    }

    const { clientSecret } = result.data;

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: event.paymentMethod.id,
      },
      {
        handleActions: false,
      }
    );

    if (error) {
      event.complete("fail");
    }

    if (paymentIntent.status === "requires_action") {
      stripe.confirmCardPayment(clientSecret);
    }

    event.complete("success");
  };
  const handleSubmit = async (e) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    const result = await stripe.createToken(elements.getElement(CardElement));

    if (result.error) {
      // Inform the user if there was an error.
      console.log(result.error)
    } else {
      // Send the token to your server.
      var token = result.token.id;
      var amount = 200;
      const res = await axios.post(
        "http://5.161.101.175:8080/create-charge",
        { email: email, token: token, amount: amount },
        function (data) {
          alert(data.details);
        }, 'json');
      console.log(res)
    }
    // const { error: backendError, clientSecret } = await fetch(
    //   'http://5.161.101.175:8080/create-payment-intent',
    //   {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Access-Control-Allow-Origin': '*',
    //       'Access-Control-Allow-Methods': 'POST,PATCH,OPTIONS'
    //     },
    //     body: JSON.stringify({
    //       paymentMethodType: 'card',
    //       currency: 'usd',
    //     }),
    //   }
    // ).then((r) => {
    //   console.log(r.json())
    // });

    // if (backendError) {
    //   return;
    // }


    // const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
    //   clientSecret,
    //   {
    //     payment_method: {
    //       card: elements.getElement(CardElement),
    //       billing_details: {
    //         name: 'Jenny Rosen',
    //       },
    //     },
    //   }
    // );

    // if (stripeError) {
    //   return;
    // }
  };
  return (
    <div className="h-100 d-flex flex-column flex-md-row align-items-center justify-content-between checkout-page">
      <div className="w-50 h-100 d-none d-md-block left-column">
        <div className="h-100 banner" />
      </div>
      <div className="w-50 h-100 px-0 px-md-5 d-flex flex-column justify-content-center right-column">
        {/* <form className="checkout-form"> */}
        <h1 className="mb-4 font-weight-light fs-4">React Secure Checkout</h1>

        {paymentRequest && (
          <div className="mt-4">
            <PaymentRequestButtonElement
              options={{ paymentRequest }}
              onClick={onPaymentSubmit}
            />
          </div>
        )}

        <form id="payment-form" onSubmit={handleSubmit}>
          <label htmlFor="card">Card</label>
          <CardElement id="card" />
          <div className="form-group">
            <input className="form-control" id="email" name="email" onChange={(e) => setEmail(e.value)}
              placeholder="Email Address" type="email" required />
          </div>

          <button className="btn btn-primary btn-block" id="submitButton" type="submit">
            Pay With Your Card
          </button>
        </form>
        {/* </form> */}
      </div>
    </div >
  );
};
