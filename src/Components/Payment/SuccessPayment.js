import { useContext, useEffect, useState } from "react";
import { InvitationContext } from "../../Context/InvitationContext";
import axios from "axios";

function SuccessPayment() {
  const [loading, setLoading] = useState(true);

  const setStatus = async () => {
    try {
      const response = await axios({
        method: "POST",
        url: `https://cyan-wild-mussel.cyclic.app/update-invitation-status/${localStorage.getItem(
          "invitationId"
        )}/success`,
      });

      if (response.status === 200) {
        setLoading(false);
        localStorage.removeItem("invitationId");
      }
    } catch (err) {
      if (setLoading && localStorage.getItem("invitationId") != null) {
        await setStatus();
      } else {
        console.log(err);
      }
    }
  };
  useEffect(() => {
    const invitationId = localStorage.getItem("invitationId");

    if (invitationId !== null) {
      // Item exists in localStorage
      setStatus(localStorage.getItem("invitationId"));
    } else {
      // Item does not exist in localStorage
      //REDIRECT TO 404
    }
  }, []);

  return loading ? (
    <div className="success">
      <h1>Processing Payment...</h1>
    </div>
  ) : (
    <div className="success">
      <h1>Payment Successful!</h1>
    </div>
  );
}

export default SuccessPayment;
