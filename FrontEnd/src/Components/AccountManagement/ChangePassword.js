import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import axios from "axios";

import { useState } from "react";

function ChangePassword() {
  const [user, setUser] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [changed, setChanged] = useState(true);

  const submit = async (e) => {
    try {
      await axios({
        method: "PUT",
        url: `${process.env.REACT_APP_BACKEND_URL}/change-password`,
        data: user,
        headers: {
          "X-ACCESS-TOKEN": localStorage.getItem("token"),
        },
      })
        .then((res) => {
          setChanged(false);
          setUser({
            currentPassword: "",
            newPassword: "",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="edit-profile-card-container">
      <Card style={{ width: "40rem" }}>
        <Card.Header className="header">
          <h2>Change Password</h2>
        </Card.Header>
        <Card.Body className="body">
          <Form onSubmit={submit}>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="current">
                <Form.Label>Current Password:</Form.Label>
                <Form.Control
                  type="password"
                  value={user.currentPassword}
                  onChange={(evt) => {
                    setUser({
                      ...user,
                      currentPassword: evt.target.value,
                    });
                  }}
                ></Form.Control>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="new">
                <Form.Label>New Password:</Form.Label>
                <Form.Control
                  type="password"
                  value={user.newPassword}
                  onChange={(evt) => {
                    setUser({
                      ...user,
                      newPassword: evt.target.value,
                    });
                  }}
                ></Form.Control>
              </Form.Group>
            </Row>

            <div className="btn-container">
              <Button variant="colour2" type="submit">
                Save
              </Button>
            </div>
          </Form>
        </Card.Body>
        <Card.Footer className="footer">
          <h4 hidden={changed}>Password Changed</h4>
        </Card.Footer>
      </Card>
    </div>
  );
}

export default ChangePassword;
