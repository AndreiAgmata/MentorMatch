import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import vector from "../Images/landing-page-vector.svg";
import bgGraphic from "../Images/red-bg.png";

function LandingPage() {
  return (
    <div className="bg">
      <Container>
        <Row className="landing-page">
          <Col>
            <div className="text">
              <h2>Find the best mentor for your programming needs with</h2>
              <div className="title">
                <h2 className="mentor">Mentor</h2>
                <h2 className="match">Match</h2>
              </div>
              {/* <div>
                <Button variant="colour2" size="lg">
                  Get Started
                </Button>
              </div> */}
            </div>
          </Col>
          <Col>
            <img
              alt="programmer graphic"
              src={vector}
              width="600
            "
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default LandingPage;
