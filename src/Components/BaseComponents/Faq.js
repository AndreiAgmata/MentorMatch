import React, { useRef, useState } from "react";
import { FaAngleDown } from "react-icons/fa6";
import gsap from "gsap";

function Faq({ data }) {
  let answerRef = useRef();
  let iconRef = useRef();

  const [isOpen, setIsOpen] = useState(false);

  const toggleAnswer = () => {
    const tl = new gsap.timeline();
    if (isOpen) {
      tl.to(
        answerRef,
        { height: 0, duration: 0.5, ease: "power3.out" },
        "start"
      ).to(
        iconRef,
        { rotation: 0, duration: 0.25, ease: "power3.out" },
        "start"
      );
    } else {
      tl.to(
        answerRef,
        {
          height: "auto",
          duration: 0.5,
          ease: "power3.out",
        },
        "start"
      ).to(
        iconRef,
        { rotation: 180, duration: 0.25, ease: "power3.out" },
        "start"
      );
    }
    setIsOpen(!isOpen);
  };
  return (
    <div className="faq-item bg-white py-3 px-5 w-100 rounded-3">
      <div
        className="question d-flex justify-content-between align-items-center"
        onClick={() => toggleAnswer()}
      >
        <p className="mb-0 fw-bold fs-4">{data.question}</p>
        <span className="icon" ref={(el) => (iconRef = el)}>
          <FaAngleDown color={"#7b61ff"} size={"1.5em"} />
        </span>
      </div>
      <div className="answer" ref={(el) => (answerRef = el)}>
        <p className="mb-0 py-2">{data.answer}</p>
      </div>
    </div>
  );
}

export default Faq;
