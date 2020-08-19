import React from 'react';
import { ResponsivePie } from '@nivo/pie';

const preProcessData = (data) => (
  data.map(dataObj => {
    dataObj.value = parseInt(dataObj.value, 10);
    return dataObj;
  })
);

export default function PieChart (props) {
  const { width = 0, height = 0, colors = [], ...otherProps } = props;
  let data = preProcessData(props.data);
  
  return (
    // Require a container div since ResponsivePieChart fit to size of its contianer
    <div style={{ width: `${width}px`, height: `${height}px` }}>
      <ResponsivePie
        data={data}
        // height={height}
        // width={width}
        innerRadius={0.6}
        sortByValue={true}
        enableRadialLabels={false}
        enableSlicesLabels={false}
        animate={true}
        tooltip={customTooltip}
        colors={colors}
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