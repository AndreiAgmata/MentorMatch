import { useContext, useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import { MessageAlertContext } from "../../Context/MessageAlertContext";

function MessageAlert() {
  const [alert, setAlert] = useState({});
  const [show, setShow] = useState(false);
  const [messageAlertContext, setMessageAlertContext] =
    useContext(MessageAlertContext);

  const emptyAlert = {
    show: false,
    displayName: "",
    text: "",
  };

  const alertStyle = {
    position: "fixed",
    bottom: "20px", // Adjust this value to suit your needs
    right: "20px", // Adjust this value to suit your needs
    zIndex: "9999",
    width: "30rem", // Change the width as needed
    paddingRight: "30px",
  };

  const close = () => {
    setShow(false);
    setMessageAlertContext(emptyAlert);
  };

  useEffect(() => {
    if (localStorage.getItem("token") && messageAlertContext.show === true) {
      setShow(true);
      setAlert(messageAlertContext);
    } else {
      setShow(false);
    }
  }, [messageAlertContext]);

  if (show) {
    return (
      <div style={alertStyle}>
        <Alert
          variant="message"
          onClose={() => {
            close();
          }}
          dismissible
        >
          <Alert.Heading>New message from {alert.displayName}</Alert.Heading>
          <p>{alert.text}</p>
          {/* This empty function in onClose prop prevents the alert from being dismissed */}
          {/* You can replace the content above with your actual alert content */}
        </Alert>
      </div>
    );
  }
}

export default MessageAlert;
