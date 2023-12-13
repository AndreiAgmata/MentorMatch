import React, { useContext, useEffect, useState } from "react";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../../Context/ChatContext";
import SendInvitation from "../Invitations/SendInvitation";
import { AuthContext } from "../../Context/AuthContext";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";

function Chat() {
  const { data } = useContext(ChatContext);
  const { currentUser } = useContext(AuthContext);
  const [isMentor, setIsMentor] = useState(false);

  // TODO: Replace the following with your app's Firebase project configuration
  // See: https://support.google.com/firebase/answer/7015592
  const firebaseConfig = {
    apiKey: "AIzaSyB13bXTzUAT5fGuvvwfjUGk_ogRye_0jIY",
    authDomain: "mentormatch-f67c3.firebaseapp.com",
    projectId: "mentormatch-f67c3",
    storageBucket: "mentormatch-f67c3.appspot.com",
    messagingSenderId: "269271824920",
    appId: "1:269271824920:web:20baffa383f3b334e6616d",
    measurementId: "G-RW4HKNWQNZ",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

  useEffect(() => {
    const getUser = async () => {
      try {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setIsMentor(docSnap.data().isMentor);
        } else {
          console.log("No such document!");
        }
      } catch (err) {}
    };

    getUser();
  });

  return (
    <div className="chat">
      <div className="info">
        <span>{data.user.displayName}</span>
        {isMentor && <SendInvitation />}
      </div>
      <Messages />
      <Input />
    </div>
  );
}

export default Chat;
