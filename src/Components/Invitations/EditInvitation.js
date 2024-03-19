import React, { useContext, useEffect, useState } from "react";
import { InvitationContext } from "../../Context/InvitationContext";
import axios from "axios";
import { Button } from "react-bootstrap";
import { ChatContext } from "../../Context/ChatContext";
import { doc, getDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

function EditInvitation() {
  const { state } = useLocation();
  const [invitation, setInvitation] = useState(state);
  const [value, setValue] = React.useState(dayjs(invitation.meetingTime));
  const navigate = useNavigate();

  const setTime = (newVal) => {
    setValue(newVal);
    setInvitation({
      ...invitation,
      meetingTime: newVal.toDate(),
    });
  };

  const submit = (e) => {
    e.preventDefault();

    axios({
      method: "PUT",
      url: `${process.env.REACT_APP_BACKEND_URL}/update-invitation/${invitation._id}`,
      data: invitation,
      headers: {
        "X-ACCESS-TOKEN": localStorage.getItem("token"),
      },
    })
      .then(navigate("/schedule"))

      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className="edit-profile-card-container">
        <Card style={{ width: "40rem" }}>
          <Card.Header className="header">
            <h2>Edit Invitation for {invitation.studentName}</h2>
          </Card.Header>
          <Card.Body className="body">
            <Form onSubmit={submit}>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="briefInfo">
                  <Form.Label>Meeting Details:</Form.Label>
                  <Form.Control
                    as="textarea"
                    defaultValue={invitation.description}
                    onChange={(evt) => {
                      setInvitation({
                        ...invitation,
                        description: evt.target.value,
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
                        defaultValue={value}
                        onChange={(newValue) => setTime(newValue)}
                        className="datePicker"
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Form.Group>
              </Row>

              <div className="btn-container">
                <Button variant="colour2" type="submit">
                  Save
                </Button>
              </div>
            </Form>
          </Card.Body>
          {/* <Card.Footer className="footer">
            <h4 hidden={!sent}>Invitation Sent</h4>
          </Card.Footer> */}
        </Card>
      </div>
    </>
  );
}

export default EditInvitation;
