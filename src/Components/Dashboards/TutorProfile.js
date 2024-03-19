import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import profile from "../Images/default-profile-picture.jpeg";
import Container from "react-bootstrap/esm/Container";
import Alert from "react-bootstrap/Alert";

import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";

function TutorProfile(props) {
  const navigate = useNavigate();
  let { id } = useParams();
  const [mentor, setMentor] = useState({});
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState({
    name: "",
    review: "",
    rating: 0,
  });
  const [rating, setRating] = useState(0);
  const [errFuture, setErrFuture] = useState(false);
  const [errNoInv, setErrNoInv] = useState(false);

  function CoursesDisplayed() {
    return mentor.courses.map((course) => (
      <Card style={{ width: "7rem", height: "3.5rem" }} key={course}>
        <Card.Body className="course-card">
          <h6 className="course-label">{course}</h6>
        </Card.Body>
      </Card>
    ));
  }

  function DisplayComments() {
    if (comments?.length !== 0) {
      return comments.map((comment) => (
        <Card className="comment-card" key={comment.review}>
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

  const submit = (e) => {
    e.preventDefault();

    let newComment = { name: "", review: comment.review, rating: rating };

    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BACKEND_URL}/comment/${id}`,
      data: newComment,
      headers: {
        "X-ACCESS-TOKEN": localStorage.getItem("token"),
      },
    })
      .then((res) => {
        setComment({ review: "" });
        setRating(0);
      })
      .catch((err) => {
        if (
          err.response.data.message ===
          "You can only comment on successful invitations."
        ) {
          setErrFuture(!errFuture);
        } else if (
          err.response.data.message ===
          "You have already commented on all successful invitations from this mentor."
        ) {
          setErrNoInv(!errNoInv);
        }
      });
  };

  useEffect(() => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_BACKEND_URL}/mentor/${id}`,
    })
      .then((res) => {
        setMentor(res.data);
        setComments(res.data.comments);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id, comments]);

  if (!loading) {
    return (
      <>
        <Container className="tutor-profile">
          <div className="tutor-details-container">
            <div className="profile-picture-container">
              <Image
                src={
                  mentor.profilePicture === "" ? profile : mentor.profilePicture
                }
                className="profile-picture"
              ></Image>
            </div>
            <Card style={{ width: "40rem" }}>
              <Card.Header className="header">
                <h1>
                  {mentor.firstName} {mentor.lastName}
                </h1>
                <h4>{mentor.email}</h4>
              </Card.Header>
              <Card.Body className="body">
                <h6>{mentor.userDesc}</h6>
                <div className="courses">
                  <h5>Courses Offered:</h5>
                  <div className="course-container">
                    <CoursesDisplayed />
                  </div>
                </div>
              </Card.Body>
              <Card.Footer className="footer"></Card.Footer>
            </Card>
          </div>

          <div className="comments-container">
            <Card className="comments-card">
              <Card.Header className="header">
                <h1>Comments</h1>
              </Card.Header>
              <Card.Body className="body">
                <DisplayComments />
              </Card.Body>
              <Card.Footer className="footer">
                <Form onSubmit={submit}>
                  <Form.Group className="mb-3" controlId="comment">
                    <Form.Label>Add a comment</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={comment.review}
                      onChange={(evt) => {
                        setComment({
                          ...comment,
                          review: evt.target.value,
                        });
                      }}
                    />
                  </Form.Group>
                  <Rating
                    style={{ maxWidth: 150 }}
                    value={rating}
                    onChange={setRating}
                    transition="zoom"
                  />
                  <Alert
                    style={{
                      marginTop: 10,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    variant="danger"
                    hidden={!errFuture}
                  >
                    Your appointment with this Mentor has not yet been
                    completed.
                  </Alert>
                  <Alert
                    style={{
                      marginTop: 10,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    variant="danger"
                    hidden={!errNoInv}
                  >
                    You have not completed a session with this tutor.
                  </Alert>
                  <div className="comment-button-container">
                    <Button variant="colour2" type="submit">
                      Comment
                    </Button>
                  </div>
                </Form>
              </Card.Footer>
            </Card>
          </div>
        </Container>
      </>
    );
  }
}

export default TutorProfile;
