import Chat from "./Chat";

import Sidebar from "./Sidebar";

function MainChat() {
  return (
    <div className="main-chat">
      <div className="components-container">
        <Sidebar />
        <Chat />
      </div>
    </div>
  );
}

export default MainChat;
