import React from 'react';
import { ResponsivePie } from '@nivo/pie';

export default function PieChart (props) {
  const { width, height, ...otherProps } = props;
  return (
    // Require a container div since ResponsivePieChart fit to size of its contianer
    <div style={{ width: `${width}px`, height: `${height}px` }}>
      <ResponsivePie
        data={props.data}
        // height={height}
        // width={width}
        innerRadius={0.6}
        sortByValue={true}
        enableRadialLabels={false}
        enableSlicesLabels={false}
        animate={true}
        tooltip={customTooltip}
        colors={['#856cc1', '#7458b9', '#512ea7']}
        theme={{
          tooltip: {
            container: {
              background: 'none',
              boxShadow: 'none',
              padding: '0',
            },
          }
        }}
        {...otherProps}
      />
    </div>
  );
}

function customTooltip({ label, color }) {
  console.log(label, color);
  return (
    <div className="wr-pie-tooltip">
      <div
        className="wr-pt-color-bubble"
        style={{ backgroundColor: color }}>
      </div>
      <span className="wr-pt-label">{label}</span>
    </div>
  );
}