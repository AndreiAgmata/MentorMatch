import React from "react";

function Stats() {
  return (
    <div className="stats-section">
      <div className="container d-flex flex-column justify-content-center align-items-center">
        <h3 className="stats-title fw-bold text-dark text-center">
          Get the help you need. Having a tutor pays off.
        </h3>
        <div className="stats row w-100 mt-5">
          <div className="stat col-12 col-md-6 col-lg-4 d-flex flex-column justify-content-center align-items-center">
            <p className="stat-value">115%+</p>
            <p className="stat-desc">Average grade improvement</p>
          </div>
          <div className="stat col-12 col-md-6 col-lg-4 d-flex flex-column justify-content-center align-items-center">
            <p className="stat-value">190%+</p>
            <p className="stat-desc">Boost in confidence</p>
          </div>
          <div className="stat col-12 col-lg-4 d-flex flex-column justify-content-center align-items-center">
            <p className="stat-value">400%+</p>
            <p className="stat-desc">Increase in graduation rate</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stats;
