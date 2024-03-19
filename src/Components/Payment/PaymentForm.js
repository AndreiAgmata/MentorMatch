import { PaymentElement } from "@stripe/react-stripe-js";
import { useContext, useEffect, useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { InvitationContext } from "../../Context/InvitationContext";

import Card from "react-bootstrap/Card";

export default function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [invitationContext, setInvitationContext] =
    useContext(InvitationContext);
  const [invitation, setInvitation] = useState({
    invitationId: "",
    invitationStatus: "",
  });

  // setUser({
  //   ...user,
  //   userDesc: evt.target.value,
  // });

  const setStatus = async (status) => {
    await axios({
      method: "POST",
      url: `${process.env.REACT_APP_BACKEND_URL}/update-invitation-status/${invitationContext}/${status}`,

      headers: {
        "X-ACCESS-TOKEN": localStorage.getItem("token"),
      },
    })
      .then()
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.setItem("invitationId", invitationContext);
    // setStatus("success");

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `https://cyan-wild-mussel.cyclic.app/auth/google`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setStatus("failed");
      setMessage(error.message);
    } else {
      setStatus("failed");
      setMessage("An unexpected error occured.");
    }

    setIsProcessing(false);
  };

  return (
    <div className="payment-form-container">
      <Card className="payment-form-card">
        <Card.Header className="header">
          <h2>Payment</h2>
        </Card.Header>
        <form id="payment-form" onSubmit={handleSubmit}>
          <Card.Body className="body">
            <PaymentElement id="payment-element" />
            <div className="btn-container">
              <button
                className="pay-btn"
                disabled={isProcessing || !stripe || !elements}
                id="submit"
              >
                <span id="button-text">
                  {isProcessing ? "Processing ... " : "Pay now"}
                </span>
              </button>
            </div>
          </Card.Body>

          <Card.Footer className="footer">
            {message && <div id="payment-message">{message}</div>}
          </Card.Footer>
        </form>
      </Card>
    </div>
  );
}
