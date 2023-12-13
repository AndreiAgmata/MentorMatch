import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { ChatContext } from "../../Context/ChatContext";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  //VISIBLE STUFF//
  // const containerRef = useRef(null);
  // const [isVisible, setIsVisible] = useState(false);

  // const callBackFunction = (entries) => {
  //   const [entry] = entries;
  //   setIsVisible(entry.isIntersecting);
  // };

  // const options = {
  //   root: null,
  //   rootMargin: "0px",
  //   threshold: 1.0,
  // };

  // useEffect(() => {
  //   const observer = new IntersectionObserver(callBackFunction, options);
  //   if (containerRef.current) observer.observe(containerRef.current);

  //   return () => {
  //     if (containerRef.current) observer.unobserve(containerRef.current);
  //   };
  // }, [containerRef, options]);

  // useEffect(() => {
  //   if (isVisible) {
  //     console.log("visible");
  //   } else {
  //     console.log("notVisible");
  //   }
  // }, [isVisible]);

  //VISIBLE STUFF

  return (
    <div
      ref={ref}
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      <div className="message-info">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
              ? data.user.photoURL
              : "https://firebasestorage.googleapis.com/v0/b/mentormatch-f67c3.appspot.com/o/default-profile-picture.jpeg?alt=media&token=31e83293-2bbc-467b-ab99-4d2aeda63d7c"
          }
          alt=""
        />
      </div>
      <div className="content">
        <p>{message.text}</p>
        {message.img && <img src={message.img} alt="" />}
      </div>
    </div>
  );
};

export default Message;
