import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { ChatContext } from "../../Context/ChatContext";
// import { db } from "../../firebase";

import { updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { UnreadChatsContext } from "../../Context/UnreadChatsContext";
import { MessageAlertContext } from "../../Context/MessageAlertContext";

const Chats = () => {
  const [chats, setChats] = useState([]);

  const [messageAlertContext, setMessageAlertContext] =
    useContext(MessageAlertContext);

  const [unreadChatContext, setUnreadChatContext] =
    useContext(UnreadChatsContext);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
        setUnreadChats(doc.data());
      });

      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };

  ///////////

  const setUnreadChats = (chats) => {
    let count = 0;
    // Convert 'chats' object to an array of entries
    const chatEntries = Object.entries(chats);

    // Sort the array based on the 'date' property in descending order (latest first)
    chatEntries.sort(([, chatA], [, chatB]) => {
      const dateA = new Date(chatA.date);
      const dateB = new Date(chatB.date);
      return dateB - dateA;
    });

    // Iterate through the sorted array
    chatEntries.forEach(([key, value]) => {
      if (
        !value.isRead &&
        value.sender !== currentUser.uid &&
        value.lastMessage
      ) {
        if (count === 0 && !value.shownAlert) {
          const content = {
            show: true,
            displayName: value.userInfo.displayName,
            text: value.lastMessage.text ? value.lastMessage.text : "",
          };
          setSentAlert(key);
          setMessageAlertContext(content);
        }
        count += 1;
      }
    });
    setUnreadChatContext(count);
  };

  const setSentAlert = async (chatId) => {
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [chatId + ".shownAlert"]: true,
    });
  };

  ///////////

  const handleRead = async (u) => {
    if (!u[1].isRead) {
      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [u[0] + ".isRead"]: true,
      });
      setUnreadChatContext(unreadChatContext - 1);
    }
  };

  const handleClick = (u) => {
    handleSelect(u[1].userInfo);
    handleRead(u);
  };

  return (
    <div className="chats">
      {Object.entries(chats)
        ?.sort((a, b) => b[1].date - a[1].date)
        .map((chat) => (
          <div
            className="user-chat"
            key={chat[0]}
            onClick={() => handleClick(chat)}
          >
            <img
              src={
                chat[1].userInfo.photoURL
                  ? chat[1].userInfo.photoURL
                  : "https://firebasestorage.googleapis.com/v0/b/mentormatch-f67c3.appspot.com/o/default-profile-picture.jpeg?alt=media&token=31e83293-2bbc-467b-ab99-4d2aeda63d7c"
              }
              alt=""
            />
            <div className="info">
              <span>{chat[1].userInfo.displayName}</span>
              {!chat[1].isRead && currentUser.uid !== chat[1].sender ? (
                <p
                  style={{
                    fontFamily: "tommyBold",
                    color: "rgba(211, 211, 211, 1)",
                  }}
                >
                  {chat[1].lastMessage?.text}
                </p>
              ) : (
                <p>{chat[1].lastMessage?.text}</p>
              )}
            </div>
          </div>
        ))}
    </div>
  );
};

export default Chats;
