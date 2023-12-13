import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();

  const [emailSent, setEmailSent] = useState(true);

  const [user, setUser] = useState({
    email: "",
  });

  const submit = async (e) => {
    e.preventDefault();

    axios.post(`${process.env.REACT_APP_BACKEND_URL}/forgot-password`, user).then((res) => {
      setEmailSent(!emailSent);
    });
  };

  return (
    <>
      <div className="register-login-card-container">
        <Card style={{ width: "40rem" }}>
          <Card.Header className="header">
            <h2>Forgot Password</h2>
          </Card.Header>
          <Card.Body className="body">
            <Form onSubmit={submit}>
              <Row className="mb-3">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="name@example.com"
                    required
                    onChange={(evt) => {
                      setUser({
                        ...user,
                        email: evt.target.value,
                      });
                    }}
                  />
                </Form.Group>
              </Row>
              <div className="btn-container">
                <Button variant="colour2" type="submit">
                  Reset
                </Button>
              </div>
            </Form>
          </Card.Body>
          <Card.Footer className="footer">
            <h6 hidden={emailSent}>
              A temporary password has been sent to {user.email}.
            </h6>
          </Card.Footer>
        </Card>
      </div>
    </>
  );
}

export default ForgotPassword;
