import React, { Component } from 'react';
const DEFAULT_COLOR = '#040404';

class RadialBarChart extends Component {
  state = {}
  componentDidMount() {
    // For initial animation
    setTimeout(() => {
      this.setState({ setStrokeLength: true });
    });
  }
  render() {
    const { setStrokeLength } = this.state;
    const {
      className,
      radius,
      progress,
      strokeWidth,
      dimension,
      color,
      secondaryColor
    } = this.props;

    const circleRadius = Math.min(radius, 85);
    const circumference = 2 * 3.14 * circleRadius;
    const strokeLength = setStrokeLength ? circumference / 100 * progress : 0;
    return (
      <div
        className={`radial-chart ${
          strokeLength === 0 ? 'no-progress' : ''
        }`}
      >
        <svg viewBox="0 0 200 200" width={dimension} height={dimension}>
          <circle
            className="radial-chart-total"
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            cx="100"
            cy="100"
            r={circleRadius}
          />
          <circle
            className="radial-chart-progress"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${strokeLength},${circumference}`}
            strokeLinecap="round"
            fill="none"
            cx="100"
            cy="100"
            r={circleRadius}
          />
          <circle
            className="radial-chart-total"
            stroke={secondaryColor}
            strokeWidth={strokeWidth}
            fill="none"
            cx="100"
            cy="100"
            r={circleRadius-20}
          />
          <circle
            className="radial-chart-progress"
            stroke={secondaryColor}
            strokeWidth={strokeWidth}
            strokeDasharray={`${strokeLength},${circumference}`}
            strokeLinecap="round"
            fill="none"
            cx="100"
            cy="100"
            r={circleRadius-20}
          />
        </svg>
      </div>
    );
  }
}

export default RadialBarChart;