import React, { useRef } from "react";
import faqsData from "../Data/faqs.json";

import gsap from "gsap";
import Faq from "./Faq";

function Faqs() {
  

  return (
    <div className="faqs-section py-5">
      <div className="container d-flex flex-column justify-content-center align-items-center">
        <h1 className="faqs-title fw-bold mb-5">Frequently Asked Questions</h1>
        <div className="faq-items d-flex flex-column justify-content-center align-items-start w-100 gap-3">
          {faqsData.map((faq, index) => (
            <Faq key={index} data={faq} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Faqs;
