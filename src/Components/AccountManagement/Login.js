import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

function Login() {
  const navigate = useNavigate();

  const [validPass, setValidPass] = useState(true);
  const [validEmail, setValidEmail] = useState(true);

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const signInFireBaseUser = async () => {
    const email = user.email;
    const password = `${process.env.REACT_APP_FIREBASE_PASS_KEY}`;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setUser({
        email: "",
        password: "",
      });
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const submit = async (e) => {
    e.preventDefault();

    setValidEmail(true);
    setValidPass(true);

    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/login`, user)
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        signInFireBaseUser();
      })
      .catch((err) => {
        if (
          err.response.data.message ===
          "Incorrect password for user " + user.email
        ) {
          setValidPass(false);
        } else if (err.response.data.message === "User not found") {
          setValidEmail(false);
        } else {
          console.log(err);
        }
      });
  };

  return (
    <>
      <div className="register-login-card-container">
        <Card style={{ width: "40rem" }}>
          <Card.Header className="header">
            <h2>Log In</h2>
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
                <p hidden={validEmail}>Unable to find a user with the email.</p>
              </Row>

              <Row className="mb-3">
                <Form.Group controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    required
                    type="password"
                    placeholder="Password"
                    onChange={(evt) => {
                      setUser({
                        ...user,
                        password: evt.target.value,
                      });
                    }}
                  />
                  <p hidden={validPass}>Incorrect password or email.</p>
                </Form.Group>
              </Row>

              <div className="btn-container">
                <p
                  className="link"
                  onClick={() => {
                    navigate("/forgot-password");
                  }}
                >
                  Forgot Password?
                </p>
                <Button variant="colour2" type="submit">
                  Sign In
                </Button>
              </div>
            </Form>
          </Card.Body>
          <Card.Footer className="footer">
            <p
              onClick={() => {
                navigate("/register");
              }}
            >
              Don't have an account yet? Sign Up
            </p>
          </Card.Footer>
        </Card>
      </div>
    </>
  );
}

export default Login;
