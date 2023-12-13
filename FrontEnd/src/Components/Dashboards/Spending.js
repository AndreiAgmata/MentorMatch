/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import axios from "axios";
import { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

function Spending() {
  const [user, setUser] = useState({});
  const [spending, setSpending] = useState({});

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
            url: `${process.env.REACT_APP_BACKEND_URL}/student/${res.data._id}/spending`,
          }).then((res) => {
            setSpending(res.data);
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
        <Card.Header className="transac-header">Total Spending:</Card.Header>
        <Card.Body className="transac-body">
          <h2 className="money">${spending.overallSpending}</h2>
        </Card.Body>
      </Card>
      <Card className="transactionCard">
        <Card.Header className="transac-header">
          Current Month Spending:
        </Card.Header>
        <Card.Body className="transac-body">
          <h2 className="money">${spending.monthSpending}</h2>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Spending;
