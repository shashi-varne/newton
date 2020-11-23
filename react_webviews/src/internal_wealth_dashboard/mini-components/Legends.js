import React from 'react';

function Legends() {
  return (
    <div className="iwd-p-scroll-child">
      <div className="iwd-card">
        <header className="iwd-card-header">
          <h2>Rating wise exposure</h2>
        </header>
        <section className="iwd-legends-container">
          <div className="iwd-chart"></div>
          <ul className="iwd-legends">
            <li className="iwd-legend">
              <header className="iwd-legend-header">
                <div className="iwd-legend-icon" style={{ opacity: 0.5 }}></div>
                <div className="iwd-legend-title">AAA</div>
              </header>
              <div className="iwd-legend-value">20</div>
            </li>
            <li className="iwd-legend">
              <header className="iwd-legend-header">
                <div
                  className="iwd-legend-icon"
                  style={{ opacity: 0.75 }}
                ></div>
                <div className="iwd-legend-title">AAA</div>
              </header>
              <div className="iwd-legend-value">20</div>
            </li>
            <li className="iwd-legend">
              <header className="iwd-legend-header">
                <div className="iwd-legend-icon" style={{ opacity: 0.7 }}></div>
                <div className="iwd-legend-title">AAA</div>
              </header>
              <div className="iwd-legend-value">20</div>
            </li>
            <li className="iwd-legend">
              <header className="iwd-legend-header">
                <div className="iwd-legend-icon" style={{ opacity: 0.5 }}></div>
                <div className="iwd-legend-title">AAA</div>
              </header>
              <div className="iwd-legend-value">20</div>
            </li>
            <li className="iwd-legend">
              <header className="iwd-legend-header">
                <div
                  className="iwd-legend-icon"
                  style={{ opacity: 0.75 }}
                ></div>
                <div className="iwd-legend-title">AAA</div>
              </header>
              <div className="iwd-legend-value">20</div>
            </li>
            <li className="iwd-legend">
              <header className="iwd-legend-header">
                <div className="iwd-legend-icon" style={{ opacity: 0.7 }}></div>
                <div className="iwd-legend-title">AAA</div>
              </header>
              <div className="iwd-legend-value">20</div>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default Legends;
