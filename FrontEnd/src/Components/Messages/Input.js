import React, { useContext, useState } from "react";
import Form from "react-bootstrap/Form";
import Img from "../Images/img.png";
import Attach from "../Images/attach.png";
import { AuthContext } from "../../Context/AuthContext";
import { ChatContext } from "../../Context/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const [imageHidden, setImageHidden] = useState(true);

  const handleFileChange = async ({ target }) => {
    const file = target.files[0];
    setImg(file);
  };

  const handleSend = async () => {
    if (img) {
      setImageHidden(!imageHidden);
      const storageRef = ref(storage, uuid());

      const uploadTask = await uploadBytesResumable(storageRef, img);

      getDownloadURL(storageRef).then(async (downloadURL) => {
        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text,
            senderId: currentUser.uid,
            date: Timestamp.now(),
            img: downloadURL,
          }),
        });
      });
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
      [data.chatId + ".isRead"]: false,
      [data.chatId + ".sender"]: currentUser.uid,
      [data.chatId + ".shownAlert"]: false,
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
      [data.chatId + ".isRead"]: false,
      [data.chatId + ".sender"]: currentUser.uid,
      [data.chatId + ".shownAlert"]: false,
    });

    setText("");
    setImg(null);
  };
  return (
    <div className="input">
      <div className="image-input" hidden={imageHidden}>
        <Form>
          <Form.Group controlId="profilePicture">
            <div className="picture-upload">
              <Form.Control type="file" onChange={handleFileChange} />
            </div>
          </Form.Group>
        </Form>
        <div className="send">
          <img src={Img} alt="" onClick={() => setImageHidden(!imageHidden)} />

          <button onClick={handleSend}>Send</button>
        </div>
      </div>
      <div className="main-input" hidden={!imageHidden}>
        <input
          type="text"
          placeholder="Type something..."
          onChange={(e) => setText(e.target.value)}
          value={text}
        />

        <div className="send">
          <img src={Img} alt="" onClick={() => setImageHidden(!imageHidden)} />

          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Input;
