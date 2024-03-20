import React from "react";
import Lottie from "lottie-react";
import feature1 from "../Animations/feature1.json";
import feature2 from "../Animations/feature2.json";
import feature3 from "../Animations/feature3.json";
import feature4 from "../Animations/feature4.json";
import feature5 from "../Animations/feature5.json";
import feature6 from "../Animations/feature6.json";

function Features() {
  return (
    <div className="features-section" id="features">
      <div className="container w-100 d-flex flex-column justify-content-center align-items-center">
        <h3 className="feature-title fw-bold text-dark text-center">
          MentorMatch is Here to Help!
        </h3>
        <div className="features row w-100 gx-lg-5 gy-4 gy-sm-4 gy-lg-5">
          <div className="col-12 col-sm-6 col-lg-4   d-flex justify-content-center align-items-center">
            <div className="feature-card d-flex flex-column justify-content-between align-items-center">
              <div className="feature-card-header d-flex flex-column justify-content-center align-items-center">
                <div className="animation h-auto">
                  <Lottie animationData={feature1} loop={true} />
                </div>
                <p className="fs-5 fw-semibold mt-3 text-center">
                  Your satisfaction is guaranteed
                </p>
              </div>
              <div className="feature-card-body ">
                <p className="text-center">
                  Guaranteed satisfaction and risk free transactions between
                  tutors and students
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-4 d-flex">
            <div className="feature-card d-flex flex-column justify-content-between align-items-center">
              <div className="feature-card-header d-flex flex-column justify-content-center align-items-center">
                <div className="animation  h-auto">
                  <Lottie animationData={feature2} loop={true} />
                </div>
                <p className="fs-5 fw-semibold mt-3 text-center">
                  Connect instantly from any device
                </p>
              </div>
              <div className="feature-card-body">
                <p className="text-center">
                  Use your smartphone, tablet, or computer to meet with your
                  tutor when you need to.
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-4 d-flex">
            <div className="feature-card d-flex flex-column justify-content-between align-items-center">
              <div className="feature-card-header d-flex flex-column justify-content-center align-items-center">
                <div className="animation  h-auto">
                  <Lottie animationData={feature3} loop={true} />
                </div>
                <p className="fs-5 fw-semibold mt-3 text-center">
                  Get help in your specific subject
                </p>
              </div>
              <div className="feature-card-body">
                <p className="text-center">
                  Connect with tutors who are able to help with your specific
                  question.
                </p>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-4  d-flex">
            <div className="feature-card d-flex flex-column justify-content-between align-items-center">
              <div className="feature-card-header d-flex flex-column justify-content-center align-items-center">
                <div className="animation  h-auto">
                  <Lottie animationData={feature4} loop={true} />
                </div>
                <p className="fs-5 fw-semibold mt-3 text-center">
                  Select from a wide pool of tutors
                </p>
              </div>
              <div className="feature-card-body">
                <p className="text-center">
                  Select your preferred tutor. Each tutor may specialize in a
                  particular course.
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-4  d-flex">
            <div className="feature-card d-flex flex-column justify-content-between align-items-center">
              <div className="feature-card-header d-flex flex-column justify-content-center align-items-center">
                <div className="animation  h-auto">
                  <Lottie animationData={feature5} loop={true} />
                </div>
                <p className="fs-5 fw-semibold mt-3 text-center">
                  Negotiate fees before paying
                </p>
              </div>
              <div className="feature-card-body">
                <p className="text-center">
                  Each tutor has the ability to adjust their fees depending on
                  what you agree on
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-4  d-flex">
            <div className="feature-card d-flex flex-column justify-content-between align-items-center">
              <div className="feature-card-header d-flex flex-column justify-content-center align-items-center">
                <div className="animation  h-auto">
                  <Lottie animationData={feature6} loop={true} />
                </div>
                <p className="fs-5 fw-semibold mt-3 text-center">
                  No Service and Platform Fees
                </p>
              </div>
              <div className="feature-card-body">
                <p className="text-center">
                  MentorMatch does not deduct service fees for using the
                  platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Features;
