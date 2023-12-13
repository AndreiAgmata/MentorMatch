import { Button } from "react-bootstrap";
import { React, useContext, useState } from "react";
import { ChatContext } from "../../Context/ChatContext";
import { doc, getDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function SendInvitation() {
  const { data } = useContext(ChatContext);
  const [user, setUser] = useState();
  const [userName, setUserName] = useState();
  const [userEmail, setUserEmail] = useState();

  const navigate = useNavigate();

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

  const handleSend = async () => {
    const docRef = doc(db, "users", data.user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await setUserName(docSnap.data().displayName);
      await setUserEmail(docSnap.data().email);
      console.log(userName);
      //   navigate("/invitation-details", {
      //     state: { userName: userName, userEmail: userEmail },
      //   });
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  return (
    <>
      <Button
        variant="colour2"
        onClick={() => {
          navigate("/invitation-details", {
            state: { userId: data.user.uid },
          });
        }}
      >
        Send Invitation
      </Button>
    </>
  );
}

export default SendInvitation;
