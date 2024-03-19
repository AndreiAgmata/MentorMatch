import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import profile from "../Images/default-profile-picture.jpeg";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { InvitationContext } from "../../Context/InvitationContext";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";

function Profile() {
  const [isAuth, setIsAuth] = useState(null);
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({});
  const [comments, setComments] = useState([]);

  const navigate = useNavigate();

  function CoursesDisplayed() {
    if (user.courses?.length !== 0) {
      return user.courses?.map((course) => (
        <Card style={{ width: "7rem", height: "3.5rem" }} key={course}>
          <Card.Body className="course-card">
            <h6 className="course-label">{course}</h6>
          </Card.Body>
        </Card>
      ));
    } else {
      return (
        <>
          <h2>No courses</h2>
        </>
      );
    }
  }

  useEffect(() => {
    const user = localStorage.getItem("token");

    if (user) {
      setIsAuth(user);

      axios({
        method: "GET",
        url: `${process.env.REACT_APP_BACKEND_URL}/profile`,
        headers: {
          "X-ACCESS-TOKEN": localStorage.getItem("token"),
        },
      })
        .then((res) => {
          setUser(res.data);
          setComments(res.data.comments);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  function DisplayComments() {
    if (comments?.length !== 0) {
      return comments.map((comment) => (
        <Card className="profile-comment-card" key={comment.review}>
          <Card.Body>
            <h6>{comment.name}</h6>
            <p>{comment.review}</p>
            <Rating
              style={{ maxWidth: 150 }}
              value={comment.rating}
              readOnly={true}
              transition="zoom"
            />
          </Card.Body>
        </Card>
      ));
    } else {
      return <p>No comments for this tutor yet.</p>;
    }
  }

  if (!loading) {
    return isAuth ? (
      user.isMentor ? (
        <>
          <div className="profileWithComment">
            <div className="profile-card-container">
              <div className="profile-picture-container">
                <Image
                  src={
                    user.profilePicture === "" ? profile : user.profilePicture
                  }
                  className="profile-picture"
                ></Image>
              </div>
              <Card style={{ width: "40rem" }}>
                <Card.Header className="header">
                  <h1>
                    {user.firstName} {user.lastName}
                  </h1>
                  <h4>{user.email}</h4>
                </Card.Header>
                <Card.Body className="body">
                  <h6>{user.userDesc}</h6>
                  <div className="courses">
                    <h5>Courses:</h5>
                    <div className="course-container">
                      <CoursesDisplayed />
                    </div>
                  </div>
                </Card.Body>
                <Card.Footer className="footer">
                  <Button
                    variant="edit"
                    onClick={() => {
                      navigate("/edit-profile", { state: user });
                    }}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    className="change-btn"
                    variant="edit"
                    onClick={() => {
                      navigate("/change-password");
                    }}
                  >
                    Change Password
                  </Button>
                </Card.Footer>
              </Card>
            </div>
            <div className="comment-card-container">
              <Card className="comment-card">
                <Card.Header className="reviews-card-header">
                  Reviews
                </Card.Header>
                <Card.Body>
                  <DisplayComments />
                </Card.Body>
              </Card>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="profile-card-container">
            <div className="profile-picture-container">
              <Image
                src={user.profilePicture === "" ? profile : user.profilePicture}
                className="profile-picture"
              ></Image>
            </div>
            <Card style={{ width: "40rem" }}>
              <Card.Header className="header">
                <h1>
                  {user.firstName} {user.lastName}
                </h1>
                <h4>{user.email}</h4>
              </Card.Header>
              <Card.Body className="body">
                <h6>{user.userDesc}</h6>
                <div className="courses">
                  <h5>Courses:</h5>
                  <div className="course-container">
                    <CoursesDisplayed />
                  </div>
                </div>
              </Card.Body>
              <Card.Footer className="footer">
                <Button
                  variant="edit"
                  onClick={() => {
                    navigate("/edit-profile", { state: user });
                  }}
                >
                  Edit Profile
                </Button>
                <Button
                  className="change-btn"
                  variant="edit"
                  onClick={() => {
                    navigate("/change-password");
                  }}
                >
                  Change Password
                </Button>
              </Card.Footer>
            </Card>
          </div>
        </>
      )
    ) : (
      <>
        <h1>You are not signed in</h1>
      </>
    );
  } else {
    return (
      <>
        <h2>Loading</h2>
      </>
    );
  }
}

export default Profile;
