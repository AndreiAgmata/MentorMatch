/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { InvitationContext } from "../../Context/InvitationContext";
import { useNavigate } from "react-router-dom";
import moment from "moment";

function MentorSchedule() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [user, setUser] = useState({});
  const [invitations, setInvitations] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [students, setStudents] = useState([]);
  let [studentEmail, setStudentEmail] = useState("");
  let [totalCharges, setTotalCharges] = useState(0);
  let [description, setDescription] = useState("");
  const [validEmail, setValidEmail] = useState(true);
  const [emailRegistered, setEmailRegistered] = useState(true);
  const [validCharges, setValidCharges] = useState(true);
  const [validDate, setValidDate] = useState(true);
  const [slotAvailable, setSlotAvailable] = useState(true);
  const [isStudent, setIsStudent] = useState(false);
  let [studentID, setStudentID] = useState("");
  const [invitationContext, setInvitationContext] =
    useContext(InvitationContext);
  const navigate = useNavigate();

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
          let link = "";
          if (res.data.isMentor) {
            link = `${process.env.REACT_APP_BACKEND_URL}/mentor-invitations/${res.data._id}`;
            setIsStudent(false);
          } else {
            link = `${process.env.REACT_APP_BACKEND_URL}/invitations/${res.data._id}`;
            setIsStudent(true);
          }
          axios({
            method: "GET",
            url: link,
          })
            .then((res) => {
              setInvitations(res.data);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }

    axios({
      method: "GET",
      url: `${process.env.REACT_APP_BACKEND_URL}/students`,
    })
      .then((res) => {
        setStudents(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  function validateSenecaEmail() {
    let validEmail = studentEmail.substring(studentEmail.lastIndexOf("@"));

    if (validEmail === "@myseneca.ca") {
      setValidEmail(true);
      return true;
    } else {
      setValidEmail(false);
      return false;
    }
  }

  function validateAvailableSlot() {
    const date = new Date(selectedDate);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);
    const start = date.getTime();
    const end = endDate.getTime();
    const todaysEvents = [];
    invitations.forEach((i) => {
      let meetingDate = new Date(i.meetingTime);
      if (meetingDate.getTime() >= start && meetingDate.getTime() <= end) {
        todaysEvents.push({ i, meetingDate });
      }
    });
    let result = true;
    todaysEvents.forEach((e) => {
      if (
        e.meetingDate.getTime() <= selectedDate.getTime() &&
        selectedDate.getTime() < e.meetingDate.getTime() + 60 * 60 * 1000
      ) {
        if (e.i.status !== "failed") {
          result = false;
        }
      }
    });
    if (result) {
      setSlotAvailable(true);
      return true;
    } else {
      setSlotAvailable(false);
      return false;
    }
  }

  function validateDate() {
    let date = new Date();
    if (selectedDate.getTime() < date.getTime() - 60 * 1000) {
      setValidDate(false);
      return false;
    } else {
      setValidDate(true);
      return true;
    }
  }

  function registeredEmail() {
    let result = false;
    students.forEach((s) => {
      if (s.email === studentEmail) {
        result = true;
        studentID = s._id;
      }
    });
    if (result) {
      setEmailRegistered(true);
    } else {
      setEmailRegistered(false);
    }
    return result;
  }

  function validateCharges() {
    if (totalCharges >= 0) {
      setValidCharges(true);
      return true;
    } else {
      setValidCharges(false);
      return false;
    }
  }

  function openLinkInNewTab(link) {
    // Check if the link parameter is provided
    if (!link) {
      console.error("No link provided.");
      return;
    }

    // Open the link in a new tab
    const newTab = window.open(link, "_blank");
    newTab.focus();
  }

  const getDays = (currentDate) => {
    let d = new Date(currentDate);
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentDay = d.getDay();
    const diff = currentDay - 0;
    d.setDate(d.getDate() - diff);
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);
    const daysAndDates = [];
    const firstAndLast = [];
    for (let i = 0; i < 7; i++) {
      const day = days[d.getDay()];
      const date = d.getDate();
      if (i === 0 || i === 6) {
        const month = months[d.getMonth()];
        firstAndLast.push({ month, date });
      }
      const fullDate = new Date(d);
      daysAndDates.push({ day, date, fullDate });
      d.setDate(d.getDate() + 1);
    }
    return { daysAndDates, firstAndLast };
  };
  const daysAndMonths = getDays(currentDate);

  function Events(props) {
    const endDate = new Date(props.date);
    endDate.setDate(endDate.getDate() + 1);
    const start = props.date.getTime();
    const end = endDate.getTime();
    const todaysEvents = [];
    invitations.forEach((i) => {
      let meetingDate = new Date(i.meetingTime);
      if (meetingDate.getTime() >= start && meetingDate.getTime() <= end) {
        let status = "";
        let color = "White";
        switch (i.status) {
          case "inProgress":
            status = "In Progress";
            color = "Yellow";
            break;
          case "success":
            status = "Success";
            color = "Green";
            break;
          case "failed":
            status = "Failed";
            color = "Red";
            break;
          default:
        }
        let currentDate = new Date();
        let showDecision = true;
        if (
          meetingDate.getTime() < currentDate.getTime() - 60 * 1000 ||
          i.status === "failed"
        ) {
          showDecision = false;
        }
        todaysEvents.push({ i, meetingDate, status, color, showDecision });
      }
    });
    if (todaysEvents.length !== 0) {
      return (
        <>
          {todaysEvents.map((e, index) => (
            <Row key={index}>
              <Card className="appt-card">
                <Card.Header>
                  {e.i.studentName}
                  <Card.Subtitle>
                    {moment(e.i.meetingTime).format("MMMM Do YYYY, h:mm a")}
                  </Card.Subtitle>
                </Card.Header>
                <Card.Body style={{ backgroundColor: e.color }}>
                  {e.status}
                </Card.Body>
                <Card.Footer className="event-footer">
                  <Button
                    variant="outline-secondary"
                    onClick={() => {
                      // setInvitationContext(e.i._id);
                      navigate("/edit-invitation", { state: e.i });
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    style={{ marginLeft: "10px" }}
                    variant="outline-primary"
                    onClick={() => {
                      // setInvitationContext(e.i._id);
                      openLinkInNewTab(e.i.meetingLink);
                    }}
                  >
                    Meet
                  </Button>
                </Card.Footer>
                {isStudent && e.showDecision && (
                  <Card.Footer>
                    <Button
                      onClick={() => {
                        let invitationId = e.i._id;
                        let status = "success";
                        axios
                          .post(
                            `${process.env.REACT_APP_BACKEND_URL}/update-invitation-status`,
                            { invitationId, status }
                          )
                          .then((res) => {
                            window.location.reload();
                          })
                          .catch((err) => {
                            console.log(err);
                          });
                      }}
                    >
                      Accept
                    </Button>
                    <Button
                      onClick={() => {
                        let invitationId = e.i._id;
                        let status = "failed";
                        axios
                          .post(
                            `${process.env.REACT_APP_BACKEND_URL}/update-invitation-status`,
                            { invitationId, status }
                          )
                          .then((res) => {
                            window.location.reload();
                          })
                          .catch((err) => {
                            console.log(err);
                          });
                      }}
                    >
                      Decline
                    </Button>
                  </Card.Footer>
                )}
              </Card>
            </Row>
          ))}
        </>
      );
    } else {
      return <></>;
    }
  }

  function Day(props) {
    return (
      <Col className={props.name} style={{ margin: 0, padding: 0 }}>
        <Card style={{ height: "80vh" }}>
          <Card.Header>
            {props.name} | <strong>{props.date}</strong>
          </Card.Header>
          <Card.Body>
            <Events date={props.fullDate} />
          </Card.Body>
        </Card>
      </Col>
    );
  }

  function Meeting() {
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add a Meeting</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="studentEmail">
                <Form.Label>Student Email</Form.Label>
                <Form.Control
                  required
                  type="email"
                  placeholder="Student Email"
                  onChange={(e) => {
                    studentEmail = e.target.value;
                  }}
                />
              </Form.Group>
              <p hidden={validEmail}>Seneca Email Required</p>
              <p hidden={emailRegistered}>
                Email is not registered at MentorMatch
              </p>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="totalCharges">
                <Form.Label>Total Charges</Form.Label>
                <Form.Control
                  required
                  type="number"
                  placeholder="Enter Charges Here"
                  onChange={(e) => {
                    totalCharges = e.target.value;
                  }}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="dateAndTime">
                <Form.Label>Date and Time</Form.Label>
                <DatePicker
                  id="date"
                  selected={selectedDate}
                  onChange={(date) => {
                    selectedDate.setDate(date.getDate());
                    selectedDate.setTime(date.getTime());
                  }}
                  showTimeSelect
                  dateFormat="Pp"
                />
              </Form.Group>
              <p hidden={validCharges}>Total Charge cannot be less than 0</p>
              <p hidden={validDate}>You can only add meeting for the future</p>
              <p hidden={slotAvailable}>
                There is already a meeting scheduled for the given time slot
              </p>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Enter the description here"
                  onChange={(e) => {
                    description = e.target.value;
                  }}
                />
              </Form.Group>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={async () => {
              if (
                validateCharges() &&
                registeredEmail() &&
                validateSenecaEmail() &&
                validateDate() &&
                validateAvailableSlot()
              ) {
                const meetingTime = selectedDate.toISOString();
                await axios
                  .post(
                    `${process.env.REACT_APP_BACKEND_URL}/send-invitation/${user._id}/${studentID}`,
                    { description, meetingTime, totalCharges }
                  )
                  .then((res) => {
                    setDescription("");
                    setStudentEmail("");
                    setSelectedDate(new Date());
                    setTotalCharges(0);
                    setEmailRegistered(true);
                    setValidCharges(true);
                    setValidEmail(true);
                    setValidDate(true);
                    setSlotAvailable(true);
                    window.location.reload();
                  })
                  .catch((err) => {
                    console.log(err);
                  });
                handleClose();
              }
            }}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    <Container className="weekly-schedule-container">
      <div className="header">
        <div>
          {daysAndMonths.firstAndLast[0].month ===
          daysAndMonths.firstAndLast[1].month ? (
            <h1>
              {daysAndMonths.firstAndLast[0].month}{" "}
              {daysAndMonths.firstAndLast[0].date} -{" "}
              {daysAndMonths.firstAndLast[1].date}
            </h1>
          ) : (
            <h1>
              {daysAndMonths.firstAndLast[0].month}{" "}
              {daysAndMonths.firstAndLast[0].date} -{" "}
              {daysAndMonths.firstAndLast[1].month}{" "}
              {daysAndMonths.firstAndLast[1].date}
            </h1>
          )}
        </div>
        <div className="buttons">
          <Button
            variant="outline-secondary"
            onClick={() => {
              setCurrentDate(
                new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000)
              );
            }}
          >
            Previous Week
          </Button>
          <Button
            variant="colour2"
            onClick={() => {
              setCurrentDate(
                new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000)
              );
            }}
          >
            Next Week
          </Button>
        </div>
      </div>
      <Row className="week-days" style={{ display: "flex" }}>
        {daysAndMonths.daysAndDates.map((day, index) => (
          <Day
            key={index}
            name={day.day}
            date={day.date}
            fullDate={day.fullDate}
          />
        ))}
      </Row>
    </Container>
  );
}

export default MentorSchedule;
