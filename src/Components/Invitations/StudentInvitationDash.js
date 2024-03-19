import React, { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import axios from "axios";
import moment from "moment";
import { useNavigate } from "react-router-dom";

function StudentInvitationDash() {
  const [invitations, setInvitations] = useState([]);
  const [id, setId] = useState();
  const navigate = useNavigate();

  function openLinkInNewTab(link) {
    // Check if the link parameter is provided
    if (!link) {
      console.error("No link provided.");
      return;
    }

    // Open the link in a new tab
    const newTab = window.open(link, "_blank");
    newTab.focus();
  }

  const getInvitations = () => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_BACKEND_URL}/invitations`,
      headers: {
        "X-ACCESS-TOKEN": localStorage.getItem("token"),
      },
    })
      .then((res) => {
        setInvitations(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const user = localStorage.getItem("token");

    if (user) {
      getInvitations();
    }
  }, []);

  const cancelInvitation = async (id) => {
    axios({
      method: "DELETE",
      url: `${process.env.REACT_APP_BACKEND_URL}/invitations/${id}`,
      headers: {
        "X-ACCESS-TOKEN": localStorage.getItem("token"),
      },
    })
      .then(() => {
        getInvitations();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="invitations-page">
      <Card className="invitations-card">
        <Card.Header className="header">
          <h1>Invitations</h1>
        </Card.Header>

        <Card.Body>
          <Table striped bordered hover className="invitations-table">
            <thead>
              <tr>
                <th>Tutor</th>
                <th>Meeting Time</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
                <th>Meeting Link</th>
              </tr>
            </thead>
            <tbody>
              {invitations.map((invitation) => (
                <tr key={invitation._id}>
                  <td>{invitation.mentorName}</td>
                  <td>
                    {moment(invitation.meetingTime).format(
                      "MMMM Do YYYY, h:mm a"
                    )}
                  </td>
                  <td>${invitation.totalCharges}.00</td>
                  {invitation.status === "inProgress" && (
                    <td>Payment Pending</td>
                  )}
                  {invitation.status === "success" && <td>Paid</td>}
                  {invitation.status === "failed" && <td>Payment Failed</td>}
                  <td>
                    {invitation.status === "inProgress" && (
                      <>
                        <Button
                          variant="colour2"
                          onClick={() => {
                            navigate("/payment", {
                              state: {
                                invitationId: invitation._id,
                                amount: invitation.totalCharges,
                              },
                            });
                          }}
                        >
                          Pay
                        </Button>
                        <Button
                          variant="outline-danger"
                          style={{ marginLeft: "10px" }}
                          onClick={() => {
                            cancelInvitation(invitation._id);
                          }}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                    {invitation.status === "failed" && (
                      <>
                        <Button
                          variant="colour2"
                          onClick={() => {
                            navigate("/payment", {
                              state: {
                                invitationId: invitation._id,
                                amount: invitation.totalCharges,
                              },
                            });
                          }}
                        >
                          Pay
                        </Button>
                        <Button
                          variant="outline-danger"
                          style={{ marginLeft: "10px" }}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                    {invitation.status === "success" && (
                      <Button variant="colour2" disabled={true}>
                        Pay
                      </Button>
                    )}
                  </td>
                  <td>
                    {invitation.status === "success" ? (
                      <Button
                        variant="colour2"
                        onClick={() => {
                          openLinkInNewTab(invitation.meetingLink);
                        }}
                      >
                        Meet Now
                      </Button>
                    ) : (
                      <Button variant="colour2" disabled>
                        Meet Now
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
}

export default StudentInvitationDash;
