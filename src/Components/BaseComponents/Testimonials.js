import React from "react";
import user1 from "../Images/user-1.jpg";
import user2 from "../Images/user-2.jpg";
import user3 from "../Images/user-3.jpg";
import user4 from "../Images/user-4.jpg";

function Testimonials() {
  return (
    <div className="testimonials-section">
      <div className="container d-flex flex-column justify-content-center align-items-center">
        <h3 className="testimonials-title fw-bold text-dark text-center">
          What students say about MentorMatch
        </h3>
        <div className="items row gy-4">
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="item-card ">
              <p className="comment text-start">
                Amet minim mollit non deserunt ullamco est sit aliqua consequat
                Amet minim mollit non deserunt ullamco est Amet minim mollit non
                deserunt ullamco est non deserunt ullamco est non deser
              </p>
              <div className="user-details d-flex flex-row gap-3">
                <div className="image">
                  <img
                    src={user1}
                    alt="profile"
                    className="profile-picture rounded-circle"
                  />
                </div>
                <div className="text">
                  <p className="fs-4 fw-bold mb-0">Sarah Smith</p>
                  <p>Seneca CPA Student</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="item-card ">
              <p className="comment text-start">
                Amet minim mollit non deserunt ullamco est sit aliqua consequat
                Amet minim mollit non deserunt ullamco est Amet minim mollit non
                deserunt ullamco est non deserunt ullamco est non deser
              </p>
              <div className="user-details d-flex flex-row gap-3">
                <div className="image">
                  <img
                    src={user2}
                    alt="profile"
                    className="profile-picture rounded-circle"
                  />
                </div>
                <div className="text">
                  <p className="fs-4 fw-bold mb-0">Alex Johnson</p>
                  <p>Seneca CPA Student</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="item-card ">
              <p className="comment text-start">
                Amet minim mollit non deserunt ullamco est sit aliqua consequat
                Amet minim mollit non deserunt ullamco est Amet minim mollit non
                deserunt ullamco est non deserunt ullamco est non deser
              </p>
              <div className="user-details d-flex flex-row gap-3">
                <div className="image">
                  <img
                    src={user3}
                    alt="profile"
                    className="profile-picture rounded-circle"
                  />
                </div>
                <div className="text">
                  <p className="fs-4 fw-bold mb-0">Emily Giveon</p>
                  <p>Seneca CPA Student</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="item-card ">
              <p className="comment text-start">
                Amet minim mollit non deserunt ullamco est sit aliqua consequat
                Amet minim mollit non deserunt ullamco est Amet minim mollit non
                deserunt ullamco est non deserunt ullamco est non deser
              </p>
              <div className="user-details d-flex flex-row gap-3">
                <div className="image">
                  <img
                    src={user4}
                    alt="profile"
                    className="profile-picture rounded-circle"
                  />
                </div>
                <div className="text">
                  <p className="fs-4 fw-bold mb-0">Alex James</p>
                  <p>Seneca CPA Student</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Testimonials;
