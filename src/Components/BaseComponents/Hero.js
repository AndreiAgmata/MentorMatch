import React from "react";
import heroAnimation from "../Images/hero-animation.json";
import Lottie from "lottie-react";

function Hero() {
  return (
    <div className="hero-section">
      <div className="container">
        <div className="hero row">
          <div className="col-12 col-lg-5 text-col mt-5 pt-5 d-flex flex-column justify-content-center align-items-center d-lg-block">
            <h1 className="fw-bold tag-line text-center text-lg-start">
              Navigate Your Coding Journey With A Mentor
            </h1>
            <p className="fw-medium fs-5 text-secondary-subtle mt-4 text-center text-lg-start">
              Find the right help and get the answers to your programming
              questions in an instant.
            </p>
            <button type="button" className="btn btn-2">
              Get Started
            </button>
          </div>
          <div className="col">
            <div className="lottie-wrapper w-100">
              <Lottie animationData={heroAnimation} loop={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
