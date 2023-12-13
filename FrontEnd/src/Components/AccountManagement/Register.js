import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import ReCAPTCHA from "react-google-recaptcha";

import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";

function Register() {
  const navigate = useNavigate();

  const [token, setToken] = useState("");
  const reCaptcha = useRef();

  const [emailHidden, setEmailHidden] = useState(true);
  const [validEmail, setValidEmail] = useState(true);
  const [passHidden, setPassHidden] = useState(true);
  const [passLengthValid, setPasslengthValid] = useState(true);
  const [transcriptHidden, setTanscriptHidden] = useState(false);
  const [captcha, setCaptcha] = useState(true);

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    password2: "",
    isMentor: false,
  });

  function validatePasswordMatch() {
    if (user.password === user.password2) {
      setPassHidden(true);
      return true;
    } else {
      setPassHidden(false);
      return false;
    }
  }

  function validatePasswordLength() {
    if (user.password.length > 7) {
      setPasslengthValid(true);
      return true;
    } else {
      setPasslengthValid(false);
      return false;
    }
  }

  function validateSenecaEmail() {
    let email = user.email;
    let validEmail = email.substring(email.lastIndexOf("@"));

    if (validEmail === "@myseneca.ca") {
      setValidEmail(true);
      return true;
    } else {
      setValidEmail(false);
      return false;
    }
  }

  const createFireBaseUser = async () => {
    const displayName = `${user.firstName} ${user.lastName}`;
    const email = user.email;
    const password = `${process.env.REACT_APP_FIREBASE_PASS_KEY}`;
    const isMentor = user.isMentor;

    try {
      //Create user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      //Create a unique image name
      try {
        //Update profile
        await updateProfile(res.user, {
          displayName,
        });
        //create user on firestore
        await setDoc(doc(db, "users", res.user.uid), {
          uid: res.user.uid,
          displayName,
          email,
          photoUrl: "",
          isMentor,
        });

        //create empty user chats on firestore
        await setDoc(doc(db, "userChats", res.user.uid), {});

        reCaptcha.current.reset();
        setUser({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          password2: "",
          isMentor: false,
        });
        setToken("");
        navigate("/");
      } catch (err) {
        console.log("error 1");
      }
    } catch (err) {
      console.log("error 2");
    }
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!token) {
      setCaptcha(false);
    } else {
      setCaptcha(true);

      setPassHidden(true);
      setEmailHidden(true);
      setPasslengthValid(true);

      if (
        validateSenecaEmail() &&
        validatePasswordLength() &&
        validatePasswordMatch()
      ) {
        await axios
          .post(`${process.env.REACT_APP_BACKEND_URL}/register`, { token, user })
          .then((res) => {
            // reCaptcha.current.reset();
            // setUser({
            //   firstName: "",
            //   lastName: "",
            //   email: "",
            //   password: "",
            //   password2: "",
            //   isMentor: false,
            // });
            // setToken("");
            // navigate("/");
            createFireBaseUser();
          })
          .catch((err) => {
            setEmailHidden(false);
          });
      }
    }
  };

  return (
    <>
      <div className="register-login-card-container">
        <Card style={{ width: "40rem" }}>
          <Card.Header className="header">
            <h2>Register </h2>
          </Card.Header>
          <Card.Body className="body">
            <Form onSubmit={submit}>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="firstName">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="First Name"
                    onChange={(evt) => {
                      setUser({
                        ...user,
                        firstName: evt.target.value,
                      });
                    }}
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="lastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Last Name"
                    onChange={(evt) => {
                      setUser({
                        ...user,
                        lastName: evt.target.value,
                      });
                    }}
                  />
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    required
                    type="email"
                    placeholder="Email"
                    onChange={(evt) => {
                      setUser({
                        ...user,
                        email: evt.target.value,
                      });
                    }}
                  />
                </Form.Group>
                <p hidden={emailHidden}>
                  A user with this email address already exists.
                </p>
                <p hidden={validEmail}>Seneca email required.</p>
              </Row>

              <Row className="mb-3">
                <Form.Group>
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
                </Form.Group>
                <p hidden={passLengthValid}>
                  Password should be more than 8 characters.
                </p>
              </Row>

              <Row className="mb-3">
                <Form.Group>
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    required
                    type="password"
                    placeholder="Confirm Password"
                    onChange={(evt) => {
                      setUser({
                        ...user,
                        password2: evt.target.value,
                      });
                    }}
                  />
                </Form.Group>
                <p hidden={passHidden}>Passwords don't match.</p>
              </Row>

              {/* <Row className="mb-3">
                <Form.Group as={Col} controlId="profilePicture">
                  <Form.Label>Profile Picture</Form.Label>
                  <Form.Control type="file" />
                </Form.Group>

                <Form.Group
                  as={Col}
                  controlId="transcript"
                  hidden={transcriptHidden}
                >
                  <Form.Label>Transcript</Form.Label>
                  <Form.Control type="file" />
                </Form.Group>
              </Row> */}

              <Form.Group>
                <div className="checkbox-container">
                  <Form.Check
                    inline
                    label="Register as a Tutor"
                    onChange={(evt) => {
                      if (evt.target.value === "on") {
                        setUser({
                          ...user,
                          isMentor: true,
                        });
                        setTanscriptHidden(true);
                      } else {
                        setTanscriptHidden(false);
                      }
                    }}
                  />
                </div>
              </Form.Group>
              <div className="btn-container">
                <ReCAPTCHA
                  sitekey={process.env.REACT_APP_SITE_KEY}
                  onChange={(token) => setToken(token)}
                  onExpired={(e) => setToken("")}
                  ref={reCaptcha}
                />
                <h4 hidden={captcha}>Please Complete the Captcha Form</h4>
                <Button variant="colour2" type="submit">
                  Sign Up
                </Button>
              </div>
            </Form>
          </Card.Body>
          <Card.Footer className="footer">
            <p
              onClick={() => {
                navigate("/login");
              }}
            >
              Already have an account? Sign In
            </p>
          </Card.Footer>
        </Card>
      </div>
    </>
  );
}

export default Register;
