/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import axios from "axios";
import { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

function Earning() {
  const [user, setUser] = useState({});
  const [earnings, setEarnings] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios({
        method: "GET",
        url: `${process.env.REACT_APP_BACKEND_URL}/profile`,
        headers: {
          "X-ACCESS-TOKEN": localStorage.getItem("token"),
        },
      })
        .then((res) => {
          setUser(res.data);
          axios({
            method: "GET",
            url: `${process.env.REACT_APP_BACKEND_URL}/mentor/${res.data._id}/earnings`,
          }).then((res) => {
            setEarnings(res.data);
            console.log(res.data);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);
  return (
    <div className="transactionTotals">
      <Card className="transactionCard">
        <Card.Header className="transac-header">Total Earnings:</Card.Header>
        <Card.Body className="transac-body">
          <h2 className="money">${earnings.overallCharges}</h2>
        </Card.Body>
      </Card>
      <Card className="transactionCard">
        <Card.Header className="transac-header">
          Current Month Earnings:
        </Card.Header>
        <Card.Body className="transac-body">
          <h2 className="money">${earnings.monthCharges}</h2>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Earning;
