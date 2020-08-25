import React from 'react';
import { ResponsivePie } from '@nivo/pie';

const preProcessData = (data, colors = []) => (
  data.map((dataObj, idx) => {
    dataObj.value = parseInt(dataObj.value, 10);
    dataObj.color = colors[idx];
    return dataObj;
  })
);

export default function PieChart (props) {
  const { width = 0, height = 0, colors = [], ...otherProps } = props;
  let data = preProcessData(props.data, colors);
  
  return (
    // Require a container div since ResponsivePieChart fit to size of its contianer
    <div style={{ width: `${width}px`, height: `${height}px` }}>
      <ResponsivePie
        data={data}
        // height={height}
        // width={width}
        innerRadius={0.6}
        enableRadialLabels={false}
        enableSlicesLabels={false}
        animate={true}
        tooltip={customTooltip}
        colors={item => item.color}
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