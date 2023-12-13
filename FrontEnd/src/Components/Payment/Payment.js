import { useContext, useEffect, useState } from "react";

import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "./PaymentForm";
import { loadStripe } from "@stripe/stripe-js";
import { useLocation } from "react-router-dom";
import { InvitationContext } from "../../Context/InvitationContext";

function Payment() {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const { state } = useLocation();
  const { invitationId, amount } = state;
  const [invitationContext, setInvitationContext] =
    useContext(InvitationContext);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/config`).then(async (r) => {
      const { publishableKey } = await r.json();
      setStripePromise(loadStripe(publishableKey));
    });
  }, []);

  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_BACKEND_URL}/create-payment-intent/${invitationId}/${amount}`,
      {
        method: "POST",
        body: JSON.stringify({}),
      }
    ).then(async (result) => {
      var { clientSecret } = await result.json();
      setInvitationContext(invitationId);
      setClientSecret(clientSecret);
    });
  }, [amount, invitationId, setInvitationContext]);

  return (
    <>
      {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentForm />
        </Elements>
      )}
    </>
  );
}

export default Payment;
