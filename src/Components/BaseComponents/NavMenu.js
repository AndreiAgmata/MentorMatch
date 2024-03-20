import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/esm/Image";
import axios from "axios";
import profile from "../Images/default-profile-picture.jpeg";
import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { UnreadChatsContext } from "../../Context/UnreadChatsContext";
import { AuthContext } from "../../Context/AuthContext";
import { db } from "../../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { MessageAlertContext } from "../../Context/MessageAlertContext";

function NavMenu() {
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
    <div className="nav-items nav-items-mobile">
      {!userSignedIn ? (
        <>
          <div className="nav-item">
            <a href="#home">
              <p className="m-0 fw-bold">Home</p>
            </a>
          </div>
          <div className="nav-item">
            <a href="#features">
              <p className="m-0 fw-bold">Features</p>
            </a>
          </div>
          <div className="nav-item">
            <a href="#reviews">
              <p className="m-0 fw-bold">Reviews</p>
            </a>
          </div>
          <div className="nav-item">
            <a href="#faqs">
              <p className="m-0 fw-bold">Faqs</p>
            </a>
          </div>
          <div
            className="nav-item"
            onClick={() => {
              navigate(`/login`);
            }}
          >
            <p className="m-0 fw-bold text-secondary">Log In</p>
          </div>
          <div className="nav-item align-self-center">
            <Button
              variant="colour2"
              onClick={() => {
                navigate(`/register`);
              }}
            >
              Try Now
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="nav-item">
            {unreadChatContext > 0 ? (
              <div
                onClick={() => {
                  navigate(`/messages`);
                }}
              >
                <div className="messages">
                  <span>Messages</span>
                  <span className="count">{unreadChatContext}</span>
                </div>
              </div>
            ) : (
              <div
                onClick={() => {
                  navigate(`/messages`);
                }}
              >
                Messages
              </div>
            )}
          </div>
          {!user.isMentor && (
            <div className="nav-item">
              <div
                onClick={() => {
                  navigate(`/invitations`);
                }}
              >
                Invitations
              </div>
            </div>
          )}
          {!user.isMentor && (
            <div className="nav-item">
              <div
                onClick={() => {
                  navigate(`/spending`);
                }}
              >
                Spending
              </div>
            </div>
          )}
          {user.isMentor && (
            <div className="nav-item">
              <div
                onClick={() => {
                  navigate(`/earning`);
                }}
              >
                Earnings
              </div>
            </div>
          )}
          <div className="nav-item">
            <div
              onClick={() => {
                navigate(`/profile`);
              }}
            >
              <div className="profile-picture-container">
                <Image
                  className="profile-picture"
                  src={
                    user.profilePicture === "" ? profile : user.profilePicture
                  }
                />
              </div>
            </div>
          </div>
          <div className="nav-item">
            <Col xs="auto">
              <Button variant="colour2" onClick={signout}>
                Sign Out
              </Button>
            </Col>
          </div>
        </>
      )}
    </div>
  );
}

export default NavMenu;
