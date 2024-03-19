import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";

import axios from "axios";
import { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db, storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

import { AuthContext } from "../../Context/AuthContext";
import { getAuth, updateProfile } from "firebase/auth";

function EditProfile() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [user, setUser] = useState(state);
  const [transcriptHidden, setTanscriptHidden] = useState(true);
  const [courseCode, setCourseCode] = useState("");
  const [deleted, setDeleted] = useState(true);
  const [profile, setProfile] = useState();
  const { currentUser } = useContext(AuthContext);

  const auth = getAuth();

  function CoursesDisplayed() {
    if (user.courses?.length !== 0) {
      return user.courses?.map((course) => (
        <Card style={{ width: "7rem", height: "3.5rem" }} key={course}>
          <Card.Body className="course-card">
            <h6 className="course-label">{course}</h6>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                removeCourse(course);
              }}
            >
              -
            </Button>
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

  function removeCourse(courseName) {
    const filtered = user.courses.filter((course) => course !== courseName);
    setUser({
      ...user,
      courses: filtered,
    });
  }

  function addCourse(course) {
    const addedCourse = user.courses.slice();
    addedCourse.push(course);
    setUser({
      ...user,
      courses: addedCourse,
    });
    setCourseCode("");
  }

  function handleDelete() {
    axios({
      method: "DELETE",
      url: `${process.env.REACT_APP_BACKEND_URL}/delete`,
      headers: {
        "X-ACCESS-TOKEN": localStorage.getItem("token"),
      },
    })
      .then((res) => {
        setDeleted(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleFileChange = async ({ target }) => {
    const file = target.files[0];
    setProfile(file);
    const base64 = await convertBase64(file);
    setUser({
      ...user,
      profilePicture: base64,
    });
  };

  const updateFireBaseProfile = async () => {
    try {
      console.log(currentUser);
      //Create a unique image name
      const date = new Date().getTime();
      const storageRef = ref(storage, `${user.email + date}`);

      await uploadBytesResumable(storageRef, profile).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            // console.log(downloadURL);
            //Update profile
            await updateProfile(auth.currentUser, {
              displayName: currentUser.displayName,
              photoURL: downloadURL,
            });

            await setDoc(doc(db, "users", currentUser.uid), {
              uid: currentUser.uid,
              displayName: currentUser.displayName,
              email: currentUser.email,
              photoURL: downloadURL,
              isMentor: user.isMentor,
            });
            navigate("/profile");
          } catch (err) {
            console.log("Error 1");
          }
        });
      });
    } catch (err) {
      console.log("Error 2");
    }
  };

  const submit = (e) => {
    e.preventDefault();

    axios({
      method: "PUT",
      url: `${process.env.REACT_APP_BACKEND_URL}/update`,
      data: user,
      headers: {
        "X-ACCESS-TOKEN": localStorage.getItem("token"),
      },
    })
      .then(updateFireBaseProfile())
      // navigate("/profile")
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="edit-profile-card-container">
      <Card style={{ width: "40rem" }}>
        <Card.Header className="header">
          <h2>Edit Profile</h2>
        </Card.Header>
        <Card.Body className="body">
          <Form onSubmit={submit}>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="name">
                <Form.Label>First Name:</Form.Label>
                <Form.Control
                  type="text"
                  value={user.firstName}
                  onChange={(evt) => {
                    setUser({
                      ...user,
                      firstName: evt.target.value,
                    });
                  }}
                ></Form.Control>
              </Form.Group>
              <Form.Group as={Col} controlId="name">
                <Form.Label>Last Name:</Form.Label>
                <Form.Control
                  type="text"
                  value={user.lastName}
                  onChange={(evt) => {
                    setUser({
                      ...user,
                      lastName: evt.target.value,
                    });
                  }}
                ></Form.Control>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="contactEmail">
                <Form.Label>Contact Email:</Form.Label>
                <Form.Control
                  type="email"
                  value={user.email}
                  onChange={(evt) => {
                    setUser({
                      ...user,
                      email: evt.target.value,
                    });
                  }}
                ></Form.Control>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="profilePicture">
                <Form.Label>Profile Picture</Form.Label>
                <div className="picture-upload">
                  <Form.Control type="file" onChange={handleFileChange} />
                </div>
              </Form.Group>

              <Form.Group
                as={Col}
                controlId="transcript"
                hidden={transcriptHidden}
              >
                <Form.Label>Transcript</Form.Label>
                <Form.Control type="file" />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="briefInfo">
                <Form.Label>Brief Info:</Form.Label>
                <Form.Control
                  as="textarea"
                  value={user.userDesc}
                  onChange={(evt) => {
                    setUser({
                      ...user,
                      userDesc: evt.target.value,
                    });
                  }}
                ></Form.Control>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="subjects">
                <Form.Label>Courses:</Form.Label>
                <div className="course-container">
                  <CoursesDisplayed />
                </div>
                <Form.Label>Add Course:</Form.Label>
                <Row>
                  <Col xs="6">
                    <Form.Control
                      type="text"
                      value={courseCode}
                      onChange={(e) => setCourseCode(e.target.value)}
                      placeholder="Course Code"
                    ></Form.Control>
                  </Col>
                  <Col>
                    <Button
                      variant="success"
                      onClick={() => {
                        addCourse(courseCode);
                      }}
                    >
                      Add course
                    </Button>
                  </Col>
                </Row>
              </Form.Group>
            </Row>
            <div className="btn-container">
              <Button variant="colour2" type="submit">
                Save
              </Button>
              <Button variant="delete" onClick={() => handleDelete()}>
                Delete Account
              </Button>
            </div>
          </Form>
        </Card.Body>
        <Card.Footer className="footer">
          <h4 hidden={deleted}>Account has been deleted</h4>
        </Card.Footer>
      </Card>
    </div>
  );
}

export default EditProfile;
