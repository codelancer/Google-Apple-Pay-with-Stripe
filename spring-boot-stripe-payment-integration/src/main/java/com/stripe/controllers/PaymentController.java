package com.stripe.controllers;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.stripe.service.StripeService;
import com.stripe.utils.Response;
import com.stripe.Stripe;

import java.util.HashMap;

@Controller
public class PaymentController {

	@Value("${stripe.key.public}")
	private String API_PUBLIC_KEY;

	@Value("${pay.amount}")
	private String PAY_AMOUNT;

	@Value("${sand.id}")
	private String SAND_ID;

	private StripeService stripeService;

	public PaymentController(StripeService stripeService) {
		this.stripeService = stripeService;
	}

	@GetMapping("/")
	public String homepage(Model model) {
		model.addAttribute("payAmount", PAY_AMOUNT);
		model.addAttribute("sandID", SAND_ID);
		return "homepage";
	}

	@GetMapping("/charge")
	public String chargePage(Model model) {
		model.addAttribute("stripePublicKey", API_PUBLIC_KEY);
		model.addAttribute("payAmount", PAY_AMOUNT);
		return "charge";
	}

	@PostMapping("/create-charge")
	public @ResponseBody Response createCharge(String email, String token, Integer amount) {

		if (token == null) {
			return new Response(false, "Stripe payment token is missing. please try again later.");
		}

		String chargeId = stripeService.createCharge(email, token, amount);// 9.99 usd

		if (chargeId == null) {
			return new Response(false, "An error accurred while trying to charge.");
		}

		// You may want to store charge id along with order information

		return new Response(true, "Success your charge id is " + chargeId);
	}

	@PostMapping("/create-payment-intent")
	public @ResponseBody Response paymentIntent(String currency, String paymentMethodType){
		System.out.println("controller " + API_PUBLIC_KEY + " " + currency);
//		Stripe.apiKey = "sk_test_51MZNPLGoRM0TczD7ikQZrrvZRUBr1dfkxEJtboKWPBaSFuGjRhEszqOjhvlwdD5JNRtdfP59s9Q9n2m8HbmaZB5B00aa8CCsPj";
		Stripe.apiKey = API_PUBLIC_KEY;
		long amount = Long.valueOf(PAY_AMOUNT);
		Stripe.setAppInfo(
				"stripe-samples/accept-a-payment/custom-payment-flow",
				"0.0.1",
				"https://github.com/stripe-samples"
		);
		PaymentIntentCreateParams.Builder paramsBuilder = new PaymentIntentCreateParams
				.Builder()
				.addPaymentMethodType(paymentMethodType)
				.setCurrency(currency)
				.setAmount(amount);
		System.out.println(paymentMethodType);
		if(paymentMethodType.equals("acss_debit")) {
			paramsBuilder.setPaymentMethodOptions(
					PaymentIntentCreateParams.PaymentMethodOptions
							.builder()
							.setAcssDebit(PaymentIntentCreateParams
									.PaymentMethodOptions
									.AcssDebit
									.builder()
									.setMandateOptions(PaymentIntentCreateParams
											.PaymentMethodOptions
											.AcssDebit
											.MandateOptions
											.builder()
											.setPaymentSchedule(PaymentIntentCreateParams.PaymentMethodOptions.AcssDebit.MandateOptions.PaymentSchedule.SPORADIC)
											.setTransactionType(PaymentIntentCreateParams.PaymentMethodOptions.AcssDebit.MandateOptions.TransactionType.PERSONAL)
											.build())
									.build())
							.build());
		}

		PaymentIntentCreateParams createParams = paramsBuilder.build();

		try {
			// Create a PaymentIntent with the order amount and currency
			PaymentIntent intent = PaymentIntent.create(createParams);
			return new Response(true, intent.getClientSecret());
		} catch(StripeException e) {
			return new Response(false, e.getMessage());
		} catch(Exception e) {
			return new Response(false, "failed");
		}
	}
}
