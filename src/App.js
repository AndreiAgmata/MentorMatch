import "bootstrap/dist/css/bootstrap.min.css";
import NavigationBar from "./Components/BaseComponents/NavigationBar";
import LandingPage from "./Components/BaseComponents/LandingPage";
import Register from "./Components/AccountManagement/Register";
import Login from "./Components/AccountManagement/Login";
import ForgotPassword from "./Components/AccountManagement/ForgotPassword";
import ChangePassword from "./Components/AccountManagement/ChangePassword";
import Profile from "./Components/ProfileManagement/Profile";
import StudentDashboard from "./Components/Dashboards/StudentDashboard";
import MentorSchedule from "./Components/Dashboards/MentorSchedule";
import TutorProfile from "./Components/Dashboards/TutorProfile";
import Payment from "./Components/Payment/Payment";
import SuccessPayment from "./Components/Payment/SuccessPayment";
import EditProfile from "./Components/ProfileManagement/EditProfile";
import InvitationDetails from "./Components/Invitations/InvitationDetails";
import StudentInvitationDash from "./Components/Invitations/StudentInvitationDash";
import EditInvitation from "./Components/Invitations/EditInvitation";
import Spending from "./Components/Dashboards/Spending";
import Earning from "./Components/Dashboards/Earning";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./Styles/App.scss";
import MainChat from "./Components/Messages/MainChat";
import { InvitationContext } from "./Context/InvitationContext";
import { useState } from "react";
import ForceChangePassword from "./Components/AccountManagement/ForceChangePassword";
import { UnreadChatsContext } from "./Context/UnreadChatsContext";
import MessageAlert from "./Components/BaseComponents/MessageAlert";
import { MessageAlertContext } from "./Context/MessageAlertContext";

function App() {
  const [invitationContext, setInvitationContext] = useState("");
  const [unreadChatContext, setUnreadChatContext] = useState(0);
  const [messageAlertContext, setMessageAlertContext] = useState({});
  return (
    <UnreadChatsContext.Provider
      value={[unreadChatContext, setUnreadChatContext]}
    >
      <InvitationContext.Provider
        value={[invitationContext, setInvitationContext]}
      >
        <MessageAlertContext.Provider
          value={[messageAlertContext, setMessageAlertContext]}
        >
          <Router>
            <div className="App">
              <NavigationBar />
              <div className="content">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/edit-profile" element={<EditProfile />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/change-password" element={<ChangePassword />} />
                  <Route
                    path="/update-password"
                    element={<ForceChangePassword />}
                  />
                  <Route path="/dashboard" element={<StudentDashboard />} />
                  <Route path="/schedule" element={<MentorSchedule />} />
                  <Route path="/mentors/:id" element={<TutorProfile />} />
                  <Route path="/payment" element={<Payment />} />
                  <Route path="/success-payment" element={<SuccessPayment />} />
                  <Route
                    path="/invitation-details"
                    element={<InvitationDetails />}
                  />
                  <Route
                    path="/invitations"
                    element={<StudentInvitationDash />}
                  />
                  <Route path="/spending" element={<Spending/>}/>
                  <Route path="/earning" element={<Earning/>} />
                  <Route path="/messages" element={<MainChat />} />
                  <Route path="/edit-invitation" element={<EditInvitation />} />
                </Routes>
                <MessageAlert />
              </div>
            </div>
          </Router>
        </MessageAlertContext.Provider>
      </InvitationContext.Provider>
    </UnreadChatsContext.Provider>
  );
}

export default App;
