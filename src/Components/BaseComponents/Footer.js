import React from "react";
import logo from "../Images/logo.png";

import { FaInstagramSquare } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";

function Footer() {
  return (
    <div className="footer-section">
      <div className="container d-flex flex-column justify-content-center align-items-start">
        <div className="row w-100 gx-2 gy-5">
          <div className="col-12 col-lg-3 d-flex justify-content-start align-items-start gap-2">
            <div className="logo d-flex gap-2 align-items-center">
              <img
                src={logo}
                className="footer-logo h-auto"
                alt="mentor match logo"
              />
              <p className="m-0 fw-bolder fs-5 text-dark">MentorMatch</p>
            </div>
          </div>
          <div className="col-6 col-md-3 col-lg-2 d-flex flex-column justify-content-start align-items-start">
            <p className="fw-bold fs-5">About</p>
            <p>Blog</p>
            <p>About Us</p>
            <p>Reviews</p>
          </div>
          <div className="col-6 col-md-3 col-lg-2 d-flex flex-column justify-content-start align-items-start">
            <p className="fw-bold fs-5">Help</p>
            <p>FAQs</p>
            <p>Terms & Conditions</p>
            <p>Privacy Policy</p>
            <p>Contact Us</p>
          </div>
          <div className="col-6 col-md-3 col-lg-3 d-flex flex-column justify-content-start align-items-start">
            <p className="fw-bold fs-5">Contact</p>
            <p>
              Telephone : <br />
              +1 999-999-9999
            </p>
            <p>Email : mentormatch@email.com</p>
          </div>
          <div className="col-6 col-md-3 col-lg-2 d-flex flex-column justify-content-start align-items-start">
            <p className="fw-bold fs-5">Follow Us</p>
            <div className="social-media d-flex flex-row gap-2">
              <FaInstagramSquare size={"2em"} color="black" />
              <FaFacebookF size={"1.75em"} color="black" />
              <FaTwitter size={"2em"} color="black" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
