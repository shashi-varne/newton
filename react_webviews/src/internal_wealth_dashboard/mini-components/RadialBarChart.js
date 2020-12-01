import React, { useEffect, useState } from 'react';
const DEFAULT_COLOR = '#040404';

const RadialBarChart = ({
  className,
  radius,
  progress,
  strokeWidth,
  dimension,
  color,
  secondaryColor,
}) => {
  // const { setStrokeLength } = this.state;
  useEffect(() => {
    setTimeout(() => {
      setStrokeLength((circumference / 100) * progress);
    });
  }, []);
  const circleRadius = Math.min(radius, 85);
  const circumference = 2 * 3.14 * circleRadius;
  const [strokeLength, setStrokeLength] = useState(0);

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
          r={circleRadius - 20}
        />
        <circle
          className='radial-chart-progress'
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${strokeLength},${circumference}`}
          strokeLinecap='round'
          fill='none'
          strokeOpacity={0.6}
          cx='100'
          cy='100'
          r={circleRadius - 20}
        />
      </svg>
    </div>
  );
};

export default RadialBarChart;
