import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/esm/Image";
import logo from "../Images/logo.png";
import axios from "axios";
import profile from "../Images/default-profile-picture.jpeg";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { UnreadChatsContext } from "../../Context/UnreadChatsContext";
import { AuthContext } from "../../Context/AuthContext";
import { db } from "../../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { Alert } from "react-bootstrap";
import { MessageAlertContext } from "../../Context/MessageAlertContext";

function NavigationBar() {
  const navigate = useNavigate();
  const userSignedIn = localStorage.getItem("token");

  const [user, setUser] = useState({});
  const [unreadChatContext, setUnreadChatContext] =
    useContext(UnreadChatsContext);
  const { currentUser } = useContext(AuthContext);
  const [messageAlertContext, setMessageAlertContext] =
    useContext(MessageAlertContext);

  const [chats, setChats] = useState([]);
  const userID = userSignedIn ? currentUser.uid : null;

  const signout = () => {
    localStorage.removeItem("token");
    signOut(auth);
    setUser({});
    setMessageAlertContext({ show: false });
    navigate("/");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios({
        method: "GET",
        url: `${process.env.REACT_APP_BACKEND_URL}/profile`,
        headers: {
          "X-ACCESS-TOKEN": localStorage.getItem("token"),
        },
      })
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [localStorage.getItem("token")]);

  useEffect(() => {
    if (userSignedIn) {
      const getChats = () => {
        const unsub = onSnapshot(
          doc(db, "userChats", currentUser.uid),
          (doc) => {
            setChats(doc.data());
            setUnreadChats(doc.data());
          }
        );

        return () => {
          unsub();
        };
      };

      currentUser.uid && getChats();
    }
  }, [userID]);

  ///////////

  const setUnreadChats = (chats) => {
    let count = 0;
    Object.entries(chats).forEach(([key, value]) => {
      if (!value.isRead && value.sender !== currentUser.uid) {
        count += 1;
      }
    });
    setUnreadChatContext(count);
  };

  ///////////

  return (
    <div className="App">
      <Navbar className="sticky-nav">
        <Container>
          <Navbar.Brand
            onClick={() => {
              !userSignedIn
                ? navigate("/")
                : user.isMentor
                ? navigate("/schedule")
                : navigate("/dashboard");
            }}
            className="d-flex flex-row align-items-center justify-content-center gap-2"
          >
            <img
              src={logo}
              width="42"
              className="d-inline-block align-top h-auto"
              alt="mentor match logo"
            />
            <p className="m-0 fw-bolder fs-5 text-dark">MentorMatch</p>
          </Navbar.Brand>

          <Nav>
            {!userSignedIn ? (
              <>
                <Nav.Item className="ml-auto">
                  <Row>
                    <Col xs="auto">
                      <Nav.Link
                        onClick={() => {
                          navigate(`/login`);
                        }}
                      >
                        <p className="m-0 fw-bold">Log In</p>
                      </Nav.Link>
                    </Col>
                    <Col xs="auto">
                      <Button
                        variant="colour2"
                        onClick={() => {
                          navigate(`/register`);
                        }}
                      >
                        Try Now
                      </Button>
                    </Col>
                  </Row>
                </Nav.Item>
              </>
            ) : (
              <>
                <Nav.Item className="ml-auto">
                  {unreadChatContext > 0 ? (
                    <Nav.Link
                      onClick={() => {
                        navigate(`/messages`);
                      }}
                    >
                      <div className="messages">
                        <span>Messages</span>
                        <span className="count">{unreadChatContext}</span>
                      </div>
                    </Nav.Link>
                  ) : (
                    <Nav.Link
                      onClick={() => {
                        navigate(`/messages`);
                      }}
                    >
                      Messages
                    </Nav.Link>
                  )}
                </Nav.Item>
                {!user.isMentor && (
                  <Nav.Item className="ml-auto">
                    <Nav.Link
                      onClick={() => {
                        navigate(`/invitations`);
                      }}
                    >
                      Invitations
                    </Nav.Link>
                  </Nav.Item>
                )}
                {!user.isMentor && (
                  <Nav.Item className="ml-auto">
                    <Nav.Link
                      onClick={() => {
                        navigate(`/spending`);
                      }}
                    >
                      Spending
                    </Nav.Link>
                  </Nav.Item>
                )}
                {user.isMentor && (
                  <Nav.Item className="ml-auto">
                    <Nav.Link
                      onClick={() => {
                        navigate(`/earning`);
                      }}
                    >
                      Earnings
                    </Nav.Link>
                  </Nav.Item>
                )}
                <Nav.Item className="ml-auto">
                  <Nav.Link
                    onClick={() => {
                      navigate(`/profile`);
                    }}
                  >
                    <div className="profile-picture-container">
                      <Image
                        className="profile-picture"
                        src={
                          user.profilePicture === ""
                            ? profile
                            : user.profilePicture
                        }
                      ></Image>
                    </div>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className="ml-auto">
                  <Col xs="auto">
                    <Button variant="colour2" onClick={signout}>
                      Sign Out
                    </Button>
                  </Col>
                </Nav.Item>
              </>
            )}
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
}

export default NavigationBar;
