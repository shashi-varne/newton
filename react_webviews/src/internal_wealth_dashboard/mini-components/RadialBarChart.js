import React, { useEffect, useState } from 'react';

const RadialBarChart = ({
  className,
  radius = 85,
  progress,
  strokeWidth,
  dimension,
  color,
}) => {
  // const { setStrokeLength } = this.state;
  useEffect(() => {
    setTimeout(() => {
      setStrokeLength((circumference / 100) * progress);
      setStrokeLengthInner((circumferenceInner / 100) * (100 - progress));
    });
  }, []);
  const circleRadius = Math.min(radius, 85);
  const circleRadiusInner = circleRadius - 20;
  const circumference = 2 * 3.14 * circleRadius;
  const circumferenceInner = 2 * 3.14 * circleRadiusInner;
  const [strokeLength, setStrokeLength] = useState(0);
  const [strokeLengthInner, setStrokeLengthInner] = useState(0);

  return (
    <div className={`radial-chart`}>
      <svg viewBox='0 0 200 200' width={dimension} height={dimension}>
        <circle
          className='radial-chart-total'
          stroke={color}
          strokeWidth={strokeWidth}
          fill='none'
          cx='100'
          cy='100'
          r={circleRadius}
        />
        <circle
          className='radial-chart-progress'
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${strokeLength},${circumference}`}
          strokeLinecap='round'
          fill='none'
          cx='100'
          cy='100'
          r={circleRadius}
        />
        <circle
          className='radial-chart-total'
          stroke={color}
          strokeWidth={strokeWidth}
          fill='none'
          cx='100'
          cy='100'
          r={circleRadiusInner}
        />
        <circle
          className='radial-chart-progress'
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${strokeLengthInner},${circumferenceInner}`}
          strokeLinecap='round'
          fill='none'
          strokeOpacity={0.6}
          cx='100'
          cy='100'
          r={circleRadiusInner}
        />
      </svg>
    </div>
  );
};

export default RadialBarChart;
