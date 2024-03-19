import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import axios from "axios";
import dummyProfile from "../Images/default-profile-picture.jpeg";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";

function StudentDashboard() {
  const [mentors, setMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [searchField, setSearchField] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_BACKEND_URL}/dashboard`,
    })
      .then((res) => {
        setMentors(res.data);
        setFilteredMentors(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_BACKEND_URL}/suggestions`,
    })
      .then((res) => {
        const data = res.data.map((d) => {
          return d.query;
        });
        setSuggestions(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    setSearchField(e.target.value);
    if (e.target.value === "") {
      setFilteredMentors(mentors);
    }
  };

  const handleSearch = (e) => {
    if (searchField !== "") {
      const searchWords = searchField.split(" ");
      let tempMentors;
      let query;
      let searchedMentors = [];
      searchWords.forEach((word) => {
        word = word.trim();
        if (word !== "") {
          let found = false;
          word = word.toLowerCase();
          if (word.length < 7) {
            tempMentors = mentors.filter((mentor) =>
              mentor.courses.find(
                (course) => course.toLowerCase().includes(word) === true
              )
            );
            if (tempMentors.length > 0) {
              found = true;
            }
          }
          if (!found) {
            tempMentors = mentors.filter(
              (mentor) =>
                mentor.firstName.toLowerCase().includes(word) ||
                mentor.lastName.toLowerCase().includes(word)
            );
          }
          tempMentors.forEach((temp) => {
            if (!searchedMentors.includes(temp)) {
              searchedMentors.push(temp);
              query = word;
              axios
                .post(`${process.env.REACT_APP_BACKEND_URL}/search`, { query })
                .catch((err) => {
                  console.error(err);
                });
            }
          });
        }
      });
      setFilteredMentors(searchedMentors);
    } else {
      setFilteredMentors(mentors);
    }
  };

  function calculateRating(id) {
    const currentMentor = mentors.find((x) => x._id === id);
    let ratingTotal = 0;

    currentMentor.comments.forEach((element) => {
      ratingTotal += element.rating;
    });

    if (ratingTotal !== 0) {
      ratingTotal = ratingTotal / currentMentor.comments.length;
    }
    return ratingTotal;
  }

  function DisplayMentors() {
    if (filteredMentors.length !== 0) {
      return filteredMentors.map((mentor) => (
        <Card
          className="mentor-card"
          style={{ width: "26rem", height: "20rem" }}
          key={mentor._id}
        >
          <Card.Body className="body">
            <div className="picture-name-rate-course-container">
              <div className="profile-picture-container">
                <Image
                  src={
                    mentor.profilePicture !== ""
                      ? mentor.profilePicture
                      : dummyProfile
                  }
                  alt="Profile Picture"
                  className="profile-picture"
                ></Image>
              </div>

              <div className="name-rate-course-section">
                <h2>
                  {mentor.firstName} {mentor.lastName}
                </h2>
                <div className="courses-section">
                  <div className="courses">
                    {mentor.courses.map((course) => (
                      <div className="course" key={course}>
                        {course}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rating">
                  <Rating
                    style={{ maxWidth: 150 }}
                    value={calculateRating(mentor._id)}
                    readOnly={true}
                    transition="zoom"
                  />
                </div>
              </div>
            </div>
          </Card.Body>
          <Card.Footer className="footer">
            <div className="info-buttons-container">
              <div className="info-section">{mentor.userDesc}</div>

              <Button
                variant="colour2"
                onClick={() => navigate(`/mentors/${mentor._id}`)}
              >
                View
              </Button>
            </div>
          </Card.Footer>
        </Card>
      ));
    } else {
      return <h2>No mentors found!</h2>;
    }
  }

  return (
    <Container className="container-student-dashboard">
      <div className="searchRow mb-3">
        <Form className="searchForm">
          <Dropdown show={showSuggestions} className="fullWidth">
            <Form.Control
              type="text"
              value={searchField}
              onChange={handleChange}
              onClick={() => {
                setShowSuggestions(true);
              }}
              onBlur={() => {
                setTimeout(() => {
                  setShowSuggestions(false);
                }, 250);
              }}
              placeholder="Enter course codes or Mentor name separated by space"
              autoComplete="On"
            />
            <Dropdown.Menu className="fullWidth">
              {suggestions.map((suggestion) => (
                <Dropdown.Item
                  key={suggestion}
                  onClick={() => {
                    setSearchField(searchField + suggestion);
                  }}
                >
                  {suggestion}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Button variant="colour2" onClick={handleSearch}>
            Search
          </Button>
        </Form>
      </div>
      <div className="mentor-list">
        <DisplayMentors />
      </div>
    </Container>
  );
}

export default StudentDashboard;
