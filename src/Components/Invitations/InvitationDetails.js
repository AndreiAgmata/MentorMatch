import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import axios from "axios";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

function InvitationDetails() {
  const { state } = useLocation();
  const { userId } = state;
  const [userName, setUserName] = useState();
  const [userEmail, setUserEmail] = useState();
  const [invitation, setInvitation] = useState({
    studentEmail: "",
    details: "",
    meetingTime: "",
    totalCharges: 0,
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(true);

  const [value, setValue] = React.useState(dayjs(Date.now()));

  const firebaseConfig = {
    apiKey: "AIzaSyB13bXTzUAT5fGuvvwfjUGk_ogRye_0jIY",
    authDomain: "mentormatch-f67c3.firebaseapp.com",
    projectId: "mentormatch-f67c3",
    storageBucket: "mentormatch-f67c3.appspot.com",
    messagingSenderId: "269271824920",
    appId: "1:269271824920:web:20baffa383f3b334e6616d",
    measurementId: "G-RW4HKNWQNZ",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setInvitation({
      ...invitation,
      studentEmail: userEmail,
    });

    await axios({
      method: "POST",
      url: `${process.env.REACT_APP_BACKEND_URL}/send-invitation`,
      data: invitation,
      headers: {
        "X-ACCESS-TOKEN": localStorage.getItem("token"),
      },
    })
      .then(setSent(true))
      .catch((err) => {
        console.log(err);
      });
  };

  const setTime = (newVal) => {
    setValue(newVal);
    setInvitation({
      ...invitation,
      meetingTime: newVal.toDate(),
    });
  };

  useEffect(() => {
    const setDetails = async () => {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserName(docSnap.data().displayName);
        setUserEmail(docSnap.data().email);
        setInvitation({
          ...invitation,
          studentEmail: userEmail,
        });
        setLoading(false);
      } else {
        console.log("No such document!");
      }
    };

    setDetails();
  }, [userEmail]);

  return (
    <>
      <div className="edit-profile-card-container">
        <Card style={{ width: "40rem" }}>
          <Card.Header className="header">
            <h2>Meeting Invitation for {userName}</h2>
          </Card.Header>
          <Card.Body className="body">
            <Form onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="briefInfo">
                  <Form.Label>Meeting Details:</Form.Label>
                  <Form.Control
                    as="textarea"
                    value={invitation.details}
                    onChange={(evt) => {
                      setInvitation({
                        ...invitation,
                        details: evt.target.value,
                      });
                    }}
                  ></Form.Control>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="time">
                  <Form.Label>Time</Form.Label>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer
                      components={["DateTimePicker", "DateTimePicker"]}
                    >
                      <DateTimePicker
                        value={value}
                        onChange={(newValue) => setTime(newValue)}
                        className="datePicker"
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Form.Group>
              </Row>
              <Form.Label>Total Charge</Form.Label>
              <Row className="mb-3">
                <InputGroup className="mb-3">
                  <InputGroup.Text>$</InputGroup.Text>
                  <Form.Control
                    aria-label="Amount (to the nearest dollar)"
                    //value={invitation.totalCharges}
                    onChange={(evt) => {
                      setInvitation({
                        ...invitation,
                        totalCharges: Number(evt.target.value),
                      });
                    }}
                  />
                  <InputGroup.Text>.00</InputGroup.Text>
                </InputGroup>
              </Row>

              <div className="btn-container">
                <Button variant="colour2" type="submit">
                  Send
                </Button>
              </div>
            </Form>
          </Card.Body>
          <Card.Footer className="footer">
            <h4 hidden={!sent}>Invitation Sent</h4>
          </Card.Footer>
        </Card>
      </div>
    </>
  );
}

export default InvitationDetails;
